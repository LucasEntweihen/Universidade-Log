/* ============================================================
   engine.js - shared gamification engine for every course.
   Reads per-course settings from window.COURSE, defined inline
   in each HTML page BEFORE this script is loaded. See any course
   page's <head> for an example COURSE object.
   ============================================================ */

(function(){
  const C = window.COURSE || {};
  const PREFIX = C.prefix || 'course';

  /* ================= theme (5 themes) ================= */
  const THEME_KEY = 'studyhub_theme_v1'; // shared across every course
  const THEMES = ['light','dark','blue','blue-dark','green','green-dark','purple','purple-dark','amber','amber-dark','rose','rose-dark'];

  function applyTheme(theme){
    if(theme && theme !== 'light'){
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
      theme = 'light';
    }
    document.querySelectorAll('.theme-swatch').forEach(el=>{
      el.classList.toggle('active', el.dataset.theme === theme);
    });
  }
  function setTheme(theme){
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }
  window.setTheme = setTheme;

  /* ================= keys & constants ================= */
  const CHECK_KEY = PREFIX+'_progress_v1';
  const TAB_KEY = PREFIX+'_tab_v1';
  const QUIZ_KEY = PREFIX+'_quiz_v1';
  const ACH_KEY = PREFIX+'_ach_v1';
  const STREAK_KEY = PREFIX+'_streak_v1';
  const FOCUS_KEY = PREFIX+'_focus_v1';
  const LEVEL_KEY = PREFIX+'_level_v1';
  const HEARTS_KEY = PREFIX+'_hearts_v1';
  const MAX_HEARTS = 5;
  let hearts = MAX_HEARTS;

  const LEVEL_STEP = 90;
  const LEVEL_TITLES = C.levelTitles || ['Iniciante','Aprendiz','Praticante','Competente','Avançado','Especialista','Mestre'];
  const ICO = '../assets/icons/content/';
  const GROWTH_STAGES = ['chestnut','seedling','herb','clover','potted-plant','blossom','tree']
    .map(s => `<img class="om om-md" src="${ICO}${s}.svg" alt="">`);
  const TOTAL_QUIZZES = C.totalQuizzes || 0;
  const TOTAL_MODULES = C.totalModules || 1;
  const NODE_ORDER = C.nodeOrder || Array.from({length:TOTAL_MODULES},(_,i)=>i+1);
  const MASCOT_TIPS = C.mascotTips || ['Sem pressa - cada tarefa marcada já é progresso.'];
  const ACH_MODULES = C.achModules || NODE_ORDER.map((m,i)=>({mod:m, id:'module'+m+'_master', name:'Módulo '+(i+1), icon:`<img class="om om-sm" src="${ICO}checkered-flag.svg" alt="">`}));
  const FIB_ACH = C.fibStreak || []; // optional: [{days, id, name, icon}] - streak badges on a Fibonacci-day cadence
  const BADGE_TOTAL = ACH_MODULES.length + FIB_ACH.length + 4; // + first_step, quiz_perfect, streak_3, focus_1... completionist added separately

  let quizState = {};
  let unlockedAch = {};
  let focusSessions = 0;
  let lastKnownLevel = 1;
  let focusInterval = null;
  let focusRemaining = 25*60;
  let focusRunning = false;
  let activeTabIndex = 0;

  const ACHIEVEMENTS = [
    {id:'first_step', cond:()=> anyChecked()},
    ...ACH_MODULES.map(a => ({id:a.id, cond:()=> moduleDone(a.mod)})),
    {id:'quiz_perfect', cond:()=> Object.keys(quizState).length >= TOTAL_QUIZZES},
    {id:'streak_3', cond:()=> getStreak().count >= 3},
    ...FIB_ACH.map(f => ({id:f.id, cond:()=> getStreak().count >= f.days})),
    {id:'focus_1', cond:()=> focusSessions >= 1},
    {id:'dialogue_master', cond:()=> localStorage.getItem(PREFIX+'_dialogue_v1') === 'done'},
    {id:'completionist', cond:()=> allChecked()}
  ];
  const ACH_NAMES = { first_step:'Primeiro Passo', quiz_perfect:'Quiz Perfeito', streak_3:'Maratonista', focus_1:'Foco Total', dialogue_master: C.dialogueAchName || 'Bate-papo Concluído', completionist: C.completionistName || 'Mestre do Curso' };
  const ACH_ICON = {
    first_step: `<img class="om om-sm" src="${ICO}seedling.svg" alt="">`,
    quiz_perfect: `<img class="om om-sm" src="${ICO}target.svg" alt="">`,
    streak_3: `<img class="om om-sm" src="${ICO}flame.svg" alt="">`,
    dialogue_master: `<img class="om om-sm" src="${ICO}speech-bubble.svg" alt="">`,
    focus_1: `<img class="om om-sm" src="${ICO}hourglass.svg" alt="">`,
    completionist: `<img class="om om-sm" src="${ICO}crown.svg" alt="">`
  };
  ACH_MODULES.forEach(a=>{ ACH_NAMES[a.id]=a.name; ACH_ICON[a.id]=a.icon; });
  FIB_ACH.forEach(f=>{ ACH_NAMES[f.id]=f.name; ACH_ICON[f.id]=f.icon; });

  /* ================= tab navigation ================= */
  function switchTab(index){
    activeTabIndex = index;
    document.querySelectorAll('.path-node').forEach((el,i)=>el.classList.toggle('is-current', i===index));
    document.querySelectorAll('.content-section').forEach((el,i)=>el.classList.toggle('active', i===index));
    localStorage.setItem(TAB_KEY, index);
    window.scrollTo({top:0, behavior:'instant'});
    updatePathNodes();
  }
  window.switchTab = switchTab;

  /* ================= checklist ================= */
  function onCheck(el){
    if(el){ el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    saveProgress();
    updateProgress();
    updateGamification();
  }
  window.onCheck = onCheck;

  function saveProgress(){
    const data = {};
    document.querySelectorAll('.c-item input[type=checkbox]').forEach(chk=>{ data[chk.id] = chk.checked; });
    localStorage.setItem(CHECK_KEY, JSON.stringify(data));
  }
  function loadProgress(){
    const raw = localStorage.getItem(CHECK_KEY);
    if(!raw) return;
    try{
      const data = JSON.parse(raw);
      Object.keys(data).forEach(id=>{ const el = document.getElementById(id); if(el) el.checked = data[id]; });
    }catch(e){}
  }
  function anyChecked(){ return Array.from(document.querySelectorAll('.c-item input[type=checkbox]')).some(c=>c.checked); }
  function allChecked(){
    const all = document.querySelectorAll('.c-item input[type=checkbox]');
    return all.length>0 && Array.from(all).every(c=>c.checked);
  }
  function moduleDone(m){
    const items = document.querySelectorAll('.c-item input[data-mod="'+m+'"]');
    return items.length>0 && Array.from(items).every(c=>c.checked);
  }
  function modulesDoneCount(){
    let n=0; NODE_ORDER.forEach(m=>{ if(moduleDone(m)) n++; }); return n;
  }
  function anyCheckedForModule(m){
    return Array.from(document.querySelectorAll('.c-item input[data-mod="'+m+'"]')).some(c=>c.checked);
  }

  function updateProgress(){
    const all = document.querySelectorAll('.c-item input[type=checkbox]');
    const checked = Array.from(all).filter(c=>c.checked).length;
    const pct = all.length ? Math.round((checked/all.length)*100) : 0;
    const pctEl = document.getElementById('pct'); if(pctEl) pctEl.innerText = pct + '%';
    const fillEl = document.getElementById('fill'); if(fillEl) fillEl.style.width = pct + '%';
    updatePathNodes();
  }

  function updatePathNodes(){
    const nodes = document.querySelectorAll('.path-node');
    NODE_ORDER.forEach((mod, i)=>{
      const node = nodes[i];
      const circle = document.getElementById('node-'+mod);
      if(!node || !circle) return;
      const done = moduleDone(mod);
      const started = anyCheckedForModule(mod);
      const prevMod = i>0 ? NODE_ORDER[i-1] : null;
      const prevDone = prevMod ? moduleDone(prevMod) : true;
      const locked = !done && !started && !prevDone;
      node.classList.toggle('is-done', done);
      node.classList.toggle('is-locked', locked);
    });
  }

  function resetProgress(){
    if(!confirm('Isso vai zerar checklist, XP, conquistas, vidas e sessões salvas - sua plantinha volta a ser semente. Confirma?')) return;
    [CHECK_KEY,QUIZ_KEY,ACH_KEY,FOCUS_KEY,LEVEL_KEY,HEARTS_KEY].forEach(k=>localStorage.removeItem(k));
    document.querySelectorAll('.c-item input[type=checkbox]').forEach(c=>c.checked=false);
    quizState = {}; unlockedAch = {}; focusSessions = 0; lastKnownLevel = 1;
    document.querySelectorAll('.quiz-fb').forEach(f=>{f.className='quiz-fb';f.innerText='';});
    document.querySelectorAll('input[type=radio]').forEach(r=>r.checked=false);
    document.querySelectorAll('.badge-tile').forEach(b=>b.classList.remove('unlocked'));
    loadHearts();
    renderHearts();
    updateProgress();
    updateGamification();
  }
  window.resetProgress = resetProgress;

  /* ================= quiz ================= */
  function saveQuiz(){ localStorage.setItem(QUIZ_KEY, JSON.stringify(quizState)); }
  function loadQuiz(){
    const raw = localStorage.getItem(QUIZ_KEY);
    if(raw){ try{ quizState = JSON.parse(raw); }catch(e){ quizState = {}; } }
  }

  function checkQuiz(name, correct, fbId){
    const sel = document.querySelector('input[name="'+name+'"]:checked');
    const fb = document.getElementById(fbId);
    if(!fb) return;
    if(!sel){
      fb.className = 'quiz-fb no';
      fb.innerText = 'Selecione uma alternativa antes de verificar.';
      return;
    }
    if(sel.value === correct){
      fb.className = 'quiz-fb ok';
      fb.innerText = '✓ Certinho! Manda ver no próximo.';
      if(!quizState[name]){
        quizState[name] = true;
        saveQuiz();
        mascotBounce('Boa! +15 XP no bolso.');
        toast('+15 XP', 'Resposta certa!');
      }
      updateGamification();
    } else {
      fb.className = 'quiz-fb no';
      fb.innerText = '✗ Quase. Dá uma revisada no card acima e tenta de novo.';
      loseHeart();
    }
  }
  window.checkQuiz = checkQuiz;

  /* ================= hearts (lives) ================= */
  function loadHearts(){
    const today = new Date().toDateString();
    let h;
    try{ h = JSON.parse(localStorage.getItem(HEARTS_KEY)); }catch(e){ h = null; }
    if(!h || h.last !== today){
      h = {count: MAX_HEARTS, last: today};
      localStorage.setItem(HEARTS_KEY, JSON.stringify(h));
    }
    hearts = h.count;
  }
  function saveHearts(){
    localStorage.setItem(HEARTS_KEY, JSON.stringify({count: hearts, last: new Date().toDateString()}));
  }
  const HEART_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3Z"></path></svg>';
  function renderHearts(){
    const row = document.getElementById('heartsRow');
    if(!row) return;
    let html = '';
    for(let i=0;i<MAX_HEARTS;i++){
      html += '<span class="heart-icon'+(i<hearts?'':' lost')+'" id="heart-'+i+'">'+HEART_SVG+'</span>';
    }
    row.innerHTML = html;
  }
  function loseHeart(){
    if(hearts > 0){
      hearts--;
      saveHearts();
      renderHearts();
      const el = document.getElementById('heart-'+hearts);
      if(el){ el.classList.add('breaking'); setTimeout(()=>el.classList.remove('breaking'), 500); }
      if(hearts === 0){
        mascotShake('Sem vidas por hoje - mas você pode continuar estudando sem pressa. Elas voltam amanhã.');
        toast('<img class="om om-sm" src="'+ICO+'broken-heart.svg" alt=""> Vidas esgotadas', 'Sem problema - continue estudando à vontade, sem perder mais vidas hoje.');
      } else {
        mascotShake('Foi por pouco! Vamos revisar juntos?');
      }
    } else {
      mascotShake('Tudo bem, sem mais vidas hoje não tem problema nenhum em continuar aprendendo.');
    }
  }

  /* ================= streak ================= */
  function getStreak(){
    const raw = localStorage.getItem(STREAK_KEY);
    if(!raw) return {count:0,last:null};
    try{ return JSON.parse(raw); }catch(e){ return {count:0,last:null}; }
  }
  function computeStreak(){
    const today = new Date().toDateString();
    let s = getStreak();
    if(s.last === today){ /* already counted today */ }
    else{
      const yesterday = new Date(Date.now()-86400000).toDateString();
      s.count = (s.last === yesterday) ? (s.count+1) : 1;
      s.last = today;
      localStorage.setItem(STREAK_KEY, JSON.stringify(s));
    }
    return s;
  }
  function updateStreakDisplay(){
    const s = getStreak();
    const el = document.getElementById('streakText');
    if(el) el.innerText = s.count + (s.count===1 ? ' dia de estudo seguido' : ' dias de estudo seguidos');
  }

  /* ================= focus timer ================= */
  function fmt(sec){
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = (sec%60).toString().padStart(2,'0');
    return m+':'+s;
  }
  function renderFocus(){
    const d = document.getElementById('focusDisplay');
    if(!d) return;
    d.innerText = fmt(focusRemaining);
    d.classList.toggle('running', focusRunning);
    const btn = document.getElementById('focusStartBtn');
    if(btn) btn.innerText = focusRunning ? 'Pausar' : 'Iniciar';
  }
  function toggleFocus(){
    if(focusRunning){ clearInterval(focusInterval); focusRunning=false; renderFocus(); return; }
    focusRunning = true; renderFocus();
    focusInterval = setInterval(()=>{
      focusRemaining--;
      if(focusRemaining<=0){
        clearInterval(focusInterval); focusRunning=false; focusRemaining=0; renderFocus();
        focusSessions++;
        localStorage.setItem(FOCUS_KEY, focusSessions);
        toast('<img class="om om-sm" src="'+ICO+'stopwatch.svg" alt=""> Sessão concluída!', '+20 XP de bônus por foco');
        mascotBounce('Sessão de foco concluída! Você merece um café.');
        confettiBurst(36);
        updateGamification();
        setTimeout(resetFocus, 1800);
      } else { renderFocus(); }
    },1000);
  }
  function resetFocus(){
    clearInterval(focusInterval); focusRunning=false; focusRemaining=25*60; renderFocus();
  }
  window.toggleFocus = toggleFocus;
  window.resetFocus = resetFocus;

  /* ================= XP / level ================= */
  function computeXP(){
    const checked = document.querySelectorAll('.c-item input[type=checkbox]:checked').length;
    const quizXp = Object.keys(quizState).length;
    const modBonus = modulesDoneCount();
    return checked*10 + quizXp*15 + modBonus*50 + focusSessions*20;
  }
  function levelFromXP(xp){ return Math.floor(xp/LEVEL_STEP)+1; }
  function titleForLevel(lv){
    const base = LEVEL_TITLES[Math.min(lv-1, LEVEL_TITLES.length-1)];
    return lv > LEVEL_TITLES.length ? base+' ★'+(lv-LEVEL_TITLES.length) : base;
  }

  function updateGamification(){
    const xp = computeXP();
    const lv = levelFromXP(xp);
    const xpIntoLevel = xp - (lv-1)*LEVEL_STEP;

    const lb = document.getElementById('levelBadge'); if(lb) lb.innerText = lv;
    const lt = document.getElementById('levelTitle'); if(lt) lt.innerText = titleForLevel(lv);
    const lx = document.getElementById('levelXp'); if(lx) lx.innerText = xpIntoLevel + ' / ' + LEVEL_STEP + ' XP';
    const xf = document.getElementById('xpFill'); if(xf) xf.style.width = Math.min(100,(xpIntoLevel/LEVEL_STEP)*100) + '%';

    const stageEl = document.getElementById('mascotStageEmoji');
    if(stageEl) stageEl.innerHTML = GROWTH_STAGES[Math.min(lv-1, GROWTH_STAGES.length-1)];

    if(lv > lastKnownLevel){
      lastKnownLevel = lv;
      localStorage.setItem(LEVEL_KEY, lv);
      showLevelUp(lv);
      confettiBurst(50);
    }
    checkAchievements();
    updateStreakDisplay();
  }

  function showLevelUp(lv){
    const num = document.getElementById('levelupNum'); if(num) num.innerText = 'Nv. ' + lv;
    const ti = document.getElementById('levelupTitle'); if(ti) ti.innerText = titleForLevel(lv);
    const ov = document.getElementById('levelupOverlay'); if(ov) ov.classList.add('show');
  }
  function closeLevelUp(){
    const ov = document.getElementById('levelupOverlay'); if(ov) ov.classList.remove('show');
  }
  window.closeLevelUp = closeLevelUp;

  /* ================= achievements ================= */
  function saveAch(){ localStorage.setItem(ACH_KEY, JSON.stringify(unlockedAch)); }
  function loadAch(){
    const raw = localStorage.getItem(ACH_KEY);
    if(raw){ try{ unlockedAch = JSON.parse(raw); }catch(e){ unlockedAch = {}; } }
  }
  function checkAchievements(silent){
    ACHIEVEMENTS.forEach(a=>{
      if(!unlockedAch[a.id] && a.cond()){
        unlockedAch[a.id] = true;
        saveAch();
        const tile = document.querySelector('.badge-tile[data-badge="'+a.id+'"]');
        if(tile) tile.classList.add('unlocked');
        if(!silent){
          toast(ACH_ICON[a.id]+' Conquista desbloqueada!', ACH_NAMES[a.id], 'badge');
          confettiBurst(28);
        }
      }
    });
    const count = Object.keys(unlockedAch).length;
    const bc = document.getElementById('badgeCount');
    if(bc) bc.innerText = count + '/' + ACHIEVEMENTS.length;
  }
  window.checkAchievements = checkAchievements;
  window.STUDYHUB_PREFIX = PREFIX;
  function renderBadgesInitial(){
    document.querySelectorAll('.badge-tile').forEach(tile=>{
      if(unlockedAch[tile.dataset.badge]) tile.classList.add('unlocked');
    });
    const bc = document.getElementById('badgeCount');
    if(bc) bc.innerText = Object.keys(unlockedAch).length + '/' + ACHIEVEMENTS.length;
  }

  /* ================= mascot ================= */
  let mascotTimer = null;
  function mascotTip(force){
    const bubble = document.getElementById('mascotBubble');
    if(!bubble) return;
    // innerHTML (não innerText): algumas dicas trazem um <img class="om om-sm">
    // embutido (ex. devops/android/ia/trigomante mascotTips); com innerText
    // essa marcação aparecia como texto cru pro usuário em vez de virar ícone.
    bubble.innerHTML = MASCOT_TIPS[Math.floor(Math.random()*MASCOT_TIPS.length)];
    bubble.classList.add('show');
    clearTimeout(mascotTimer);
    mascotTimer = setTimeout(()=>bubble.classList.remove('show'), force ? 4500 : 5000);
  }
  function mascotBounce(msg){
    const bot = document.getElementById('mascotBot');
    if(!bot) return;
    bot.classList.remove('bounce'); void bot.offsetWidth; bot.classList.add('bounce');
    const bubble = document.getElementById('mascotBubble');
    bubble.innerHTML = msg;
    bubble.classList.add('show');
    clearTimeout(mascotTimer);
    mascotTimer = setTimeout(()=>bubble.classList.remove('show'), 4200);
  }
  function mascotShake(msg){
    const bot = document.getElementById('mascotBot');
    if(!bot) return;
    bot.classList.remove('shake'); void bot.offsetWidth; bot.classList.add('shake');
    const bubble = document.getElementById('mascotBubble');
    bubble.innerHTML = msg;
    bubble.classList.add('show');
    clearTimeout(mascotTimer);
    mascotTimer = setTimeout(()=>bubble.classList.remove('show'), 4200);
  }
  window.mascotTip = mascotTip;
  window.mascotBounce = mascotBounce;
  window.mascotShake = mascotShake;

  /* ================= toasts ================= */
  function toast(title, body, cls){
    const container = document.getElementById('toastContainer');
    if(!container) return;
    const el = document.createElement('div');
    el.className = 'toast' + (cls==='badge' ? ' badge-toast' : '');
    el.innerHTML = '<div class="t-title"><img class="om om-sm" src="../assets/icons/speaker.svg" alt="">'+title+'</div><div class="t-body">'+body+'</div>';
    container.appendChild(el);
    setTimeout(()=>{
      el.classList.add('out');
      setTimeout(()=>el.remove(), 320);
    }, 3800);
  }
  window.toast = toast;

  /* ================= falling leaves (celebration) ================= */
  function confettiBurst(count){
    const isSpace = document.documentElement.getAttribute('data-theme') === 'space';
    const colors = isSpace
      ? ['#7B6CFF','#FFD166','#FF6EC7','#B9B6FF','#FFFFFF']
      : ['#4FCB5C','#FFA916','#3FA34D','#E9C46A','#7CC9A0'];
    const total = Math.round(count/1.6);
    for(let i=0;i<total;i++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      const size = 6 + Math.random()*7;
      p.style.width = size+'px';
      p.style.height = size+'px';
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      p.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
      p.style.left = Math.random()*100+'vw';
      p.style.animationDuration = (3.2 + Math.random()*2.2)+'s';
      p.style.animationDelay = (Math.random()*0.5)+'s';
      p.style.opacity = 0.9;
      document.body.appendChild(p);
      setTimeout(()=>p.remove(), 6200);
    }
    // Tema espacial: além do confete recolorido, uma comemoração de
    // verdade (não decoração solta) ganha um foguete que decola do
    // rodapé da tela. Ver assets/css/space-theme.css (.space-rocket-launch).
    if(isSpace){
      const rocket = document.createElement('div');
      rocket.className = 'space-rocket-launch';
      rocket.setAttribute('aria-hidden', 'true');
      rocket.textContent = '🚀';
      rocket.style.left = (38 + Math.random()*24) + 'vw';
      document.body.appendChild(rocket);
      setTimeout(()=>rocket.remove(), 1900);
    }
  }
  window.confettiBurst = confettiBurst;

  /* ================= prev/next module nav ================= */
  function injectModuleNav(){
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((sec, i) => {
      if(sec.querySelector('.module-nav')) return;
      const nav = document.createElement('div');
      nav.className = 'module-nav';
      let html = '<div>';
      if(i>0){
        html += `<button class="module-nav-btn prev" onclick="switchTab(${i-1})"><img class="om om-sm" src="../assets/icons/page-move.svg" alt="">Módulo anterior</button>`;
      }
      html += '</div><div>';
      if(i<sections.length-1){
        html += `<button class="module-nav-btn next" onclick="switchTab(${i+1})">Próximo módulo<img class="om om-sm" src="../assets/icons/page-move.svg" alt="" style="transform:scaleX(-1);"></button>`;
      }
      html += '</div>';
      nav.innerHTML = html;
      sec.appendChild(nav);
    });
  }

  /* ================= parallax hero photos =================
     Removido: essa função inteira era uma cópia duplicada da mesma
     lógica de assets/js/mini-parallax.js (usada nas subpáginas), e
     as duas aplicavam sempre o mesmo deslocamento vertical, sem
     diferenciar por curso. Substituída por assets/js/theme-fx.js —
     fonte única, que também aplica o efeito certo por tema (estrelas
     na IA, ondas na DevOps, masmorra na Trigomante, swipe horizontal
     no Android). Ver CHANGELOG.md. */

  /* ================= Desafio Relâmpago (random pop-in challenges) ================= */
  const LIGHTNING_KEY = PREFIX+'_lightning_v1';
  function lightningAnsweredIds(){
    try{ return JSON.parse(localStorage.getItem(LIGHTNING_KEY) || '[]'); }catch(e){ return []; }
  }
  function markLightningAnswered(id){
    const done = lightningAnsweredIds();
    if(!done.includes(id)){ done.push(id); localStorage.setItem(LIGHTNING_KEY, JSON.stringify(done)); }
  }
  function boltSvg(){
    return '<svg class="lightning-bolt" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 11-14h-7l0-6Z"/></svg>';
  }
  function buildLightningCard(item, uid){
    const card = document.createElement('div');
    card.className = 'lightning-card';
    card.dataset.lid = uid;
    const optsHtml = item.options.map((opt,i)=>`<button class="lightning-opt" onclick="answerLightning('${uid}',${i})">${opt}</button>`).join('');
    card.innerHTML = `
      <div class="lightning-head">${boltSvg()} Desafio Relâmpago</div>
      <div class="lightning-q">${item.q}</div>
      <div class="lightning-opts">${optsHtml}</div>
      <div class="lightning-fb"></div>
    `;
    return card;
  }
  const _lightningData = {};
  function answerLightning(uid, idx){
    const card = document.querySelector('.lightning-card[data-lid="'+uid+'"]');
    const item = _lightningData[uid];
    if(!card || !item) return;
    const opts = card.querySelectorAll('.lightning-opt');
    opts.forEach(b=>b.disabled = true);
    const correct = idx === item.correct;
    opts[idx].classList.add(correct ? 'right' : 'wrong');
    if(!correct) opts[item.correct].classList.add('right');
    const fb = card.querySelector('.lightning-fb');
    fb.classList.add('show');
    fb.innerText = correct ? 'Na mosca! +XP relâmpago.' : (item.explain || 'Quase! Vale revisar esse ponto.');
    markLightningAnswered(item.id);
    if(correct){
      if(typeof confettiBurst === 'function') confettiBurst(16);
      if(typeof toast === 'function') toast(boltSvg()+' Desafio Relâmpago!', 'Resposta certa na hora.', 'badge');
      if(typeof mascotBounce === 'function') mascotBounce('Reflexo bom! Continua assim.');
    }
  }
  window.answerLightning = answerLightning;

  function setupLightningChallenges(){
    const source = C.lightningChallenges || [];
    if(!source.length) return;
    const answered = lightningAnsweredIds();
    let pool = source.filter(q => !answered.includes(q.id));
    if(!pool.length) pool = source.slice();
    // shuffle
    for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
    let qi = 0;
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec=>{
      if(qi >= pool.length) return;
      const blocks = Array.from(sec.children).filter(el =>
        el.matches('.card,.callout,table,.flip-grid,.char-wrap,.game-card')
      );
      if(blocks.length < 2) return;
      const perSection = blocks.length > 5 ? 2 : 1;
      const used = new Set();
      for(let n=0; n<perSection && qi<pool.length; n++){
        let idx, attempts=0;
        do { idx = 1 + Math.floor(Math.random()*(blocks.length-1)); attempts++; } while(used.has(idx) && attempts<8);
        used.add(idx);
        const item = pool[qi];
        const uid = 'lc_'+sec.id+'_'+qi;
        _lightningData[uid] = item;
        const card = buildLightningCard(item, uid);
        const anchor = blocks[idx];
        anchor.parentNode.insertBefore(card, anchor.nextSibling);
        qi++;
      }
    });
    const cards = document.querySelectorAll('.lightning-card');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.2});
    cards.forEach(c=>io.observe(c));
  }

  /* ================= scroll reveal ================= */
  function setupReveal(){
    const targets = document.querySelectorAll('.card,.checklist,.quiz,table,.flip-grid,.project-card,.badges-grid,.steps,.game-card');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    targets.forEach(t=>{ t.classList.add('reveal'); io.observe(t); });
  }

  /* ================= boot ================= */
  window.addEventListener('DOMContentLoaded', function(){
    applyTheme(localStorage.getItem(THEME_KEY) || 'light');
    loadProgress();
    loadQuiz();
    loadAch();
    focusSessions = parseInt(localStorage.getItem(FOCUS_KEY) || '0', 10);
    lastKnownLevel = parseInt(localStorage.getItem(LEVEL_KEY) || '1', 10);
    computeStreak();
    loadHearts();
    renderHearts();

    updateProgress();
    renderBadgesInitial();
    checkAchievements(true);
    updateGamification();
    renderFocus();
    setupReveal();
    injectModuleNav();
    setupLightningChallenges();
    // setupParallax() removida daqui — assets/js/theme-fx.js cuida disso agora, de forma independente

    let savedTab = localStorage.getItem(TAB_KEY);
    let idx = savedTab ? parseInt(savedTab, 10) : 0;
    if (isNaN(idx) || idx < 0) idx = 0;
    const maxTab = document.querySelectorAll('.content-section').length - 1;
    if (idx > maxTab && maxTab >= 0) idx = maxTab;
    switchTab(idx);

    setTimeout(()=>mascotTip(), 1200);
    setInterval(()=>{ const b=document.getElementById('mascotBubble'); if(b && !b.classList.contains('show')) mascotTip(); }, 22000);
  });
})();
