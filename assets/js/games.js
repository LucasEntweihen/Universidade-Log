/* ============================================================
   games.js - Jogo da Memória + Sequência Certa
   Data-driven, reusable across any course page.
   Each game reads its data from a data-* attribute on its
   .game-card container, so no page-specific JS is needed.
   ============================================================ */

/* ---------------- Memory Match ---------------- */
const _memState = {};

function initMemoryGame(id){
  const root = document.getElementById(id);
  if(!root) return;
  const pairs = JSON.parse(root.dataset.pairs);
  const grid = root.querySelector('.memory-grid');
  const winMsg = root.querySelector('.game-win-msg');
  const attemptsEl = root.querySelector('.js-mem-attempts');

  let cards = [];
  pairs.forEach((p, i) => {
    cards.push({ pairId:i, label:p.term, isTerm:true });
    cards.push({ pairId:i, label:p.def, isTerm:false });
  });
  // shuffle
  for(let i=cards.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [cards[i],cards[j]] = [cards[j],cards[i]];
  }

  _memState[id] = { cards, flipped:[], matched:0, attempts:0, lock:false };
  if(winMsg) winMsg.classList.remove('show');
  if(attemptsEl) attemptsEl.innerText = '0';

  grid.innerHTML = '';
  cards.forEach((c, idx) => {
    const el = document.createElement('div');
    el.className = 'mem-card';
    el.dataset.idx = idx;
    el.innerHTML = `
      <div class="mem-card-inner">
        <div class="mem-face mem-face-back"><img class="om om-md" src="../assets/icons/content/brain.svg" alt=""></div>
        <div class="mem-face mem-face-front">${c.label}</div>
      </div>`;
    el.onclick = () => flipMemCard(id, idx);
    grid.appendChild(el);
  });
}

function flipMemCard(id, idx){
  const state = _memState[id];
  if(!state || state.lock) return;
  const root = document.getElementById(id);
  const cardEl = root.querySelector(`.mem-card[data-idx="${idx}"]`);
  if(cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
  if(state.flipped.length >= 2) return;

  cardEl.classList.add('flipped');
  state.flipped.push(idx);

  if(state.flipped.length === 2){
    state.attempts++;
    const attemptsEl = root.querySelector('.js-mem-attempts');
    if(attemptsEl) attemptsEl.innerText = state.attempts;
    state.lock = true;
    const [a,b] = state.flipped;
    const cardA = state.cards[a], cardB = state.cards[b];
    const elA = root.querySelector(`.mem-card[data-idx="${a}"]`);
    const elB = root.querySelector(`.mem-card[data-idx="${b}"]`);

    if(cardA.pairId === cardB.pairId && cardA.isTerm !== cardB.isTerm){
      setTimeout(() => {
        elA.classList.add('matched'); elB.classList.add('matched');
        state.matched++;
        state.flipped = [];
        state.lock = false;
        if(state.matched === state.cards.length/2){
          const winMsg = root.querySelector('.game-win-msg');
          if(winMsg){ winMsg.classList.add('show'); }
          if(typeof confettiBurst === 'function') confettiBurst(30);
          if(typeof toast === 'function') toast('<img class="om om-sm" src="../assets/icons/content/confetti.svg" alt=""> Jogo completo!', 'Todos os pares encontrados em '+state.attempts+' tentativas.');
          if(typeof mascotBounce === 'function') mascotBounce('Boa! Memorizou tudo certinho.');
        }
      }, 500);
    } else {
      elA.classList.add('wrong'); elB.classList.add('wrong');
      setTimeout(() => {
        elA.classList.remove('flipped','wrong');
        elB.classList.remove('flipped','wrong');
        state.flipped = [];
        state.lock = false;
      }, 900);
    }
  }
}

/* ---------------- Sequence Game ---------------- */
const _seqState = {};

function initSequenceGame(id){
  const root = document.getElementById(id);
  if(!root) return;
  const steps = JSON.parse(root.dataset.steps);
  const pool = root.querySelector('.seq-pool');
  const answer = root.querySelector('.seq-answer');
  const statusEl = root.querySelector('.js-seq-status');
  const winMsg = root.querySelector('.game-win-msg');

  let order = steps.map((s,i)=>i);
  for(let i=order.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [order[i],order[j]] = [order[j],order[i]];
  }

  _seqState[id] = { steps, next:0, total:steps.length };
  if(winMsg) winMsg.classList.remove('show');
  answer.innerHTML = '';
  if(statusEl) statusEl.innerText = '0/'+steps.length;

  pool.innerHTML = '';
  order.forEach(origIdx => {
    const chip = document.createElement('div');
    chip.className = 'seq-chip';
    chip.dataset.orig = origIdx;
    chip.innerText = steps[origIdx];
    chip.onclick = () => clickSeqChip(id, chip, origIdx);
    pool.appendChild(chip);
  });
}

function clickSeqChip(id, chipEl, origIdx){
  const state = _seqState[id];
  if(!state) return;
  const root = document.getElementById(id);
  if(origIdx === state.next){
    const answer = root.querySelector('.seq-answer');
    const slot = document.createElement('div');
    slot.className = 'seq-slot';
    slot.innerHTML = `<span class="seq-num">${state.next+1}</span><span>${state.steps[origIdx]}</span>`;
    answer.appendChild(slot);
    chipEl.remove();
    state.next++;
    const statusEl = root.querySelector('.js-seq-status');
    if(statusEl) statusEl.innerText = state.next+'/'+state.total;
    if(state.next === state.total){
      const winMsg = root.querySelector('.game-win-msg');
      if(winMsg){ winMsg.classList.add('show'); }
      if(typeof confettiBurst === 'function') confettiBurst(30);
      if(typeof toast === 'function') toast('<img class="om om-sm" src="../assets/icons/content/confetti.svg" alt=""> Sequência perfeita!', 'Você ordenou tudo certinho.');
      if(typeof mascotBounce === 'function') mascotBounce('Ordem perfeita! Isso é entender o processo.');
    }
  } else {
    chipEl.classList.remove('wrong'); void chipEl.offsetWidth; chipEl.classList.add('wrong');
  }
}

/* ---------------- Dialogue / Debate Game ---------------- */
const _dlgState = {};

function initDialogueGame(id){
  const root = document.getElementById(id);
  if(!root) return;
  const data = JSON.parse(root.dataset.dialogue);
  const stage = root.querySelector('.dlg-stage');
  const statusEl = root.querySelector('.js-dlg-status');
  const winMsg = root.querySelector('.game-win-msg');

  _dlgState[id] = { data, round: 0, correctCount: 0 };
  if(winMsg) winMsg.classList.remove('show');
  if(statusEl) statusEl.innerText = '1/'+data.rounds.length;
  root.classList.remove('dlg-done');
  renderDlgRound(id);
}

function renderDlgRound(id){
  const root = document.getElementById(id);
  const state = _dlgState[id];
  if(!root || !state) return;
  const { data, round } = state;
  const r = data.rounds[round];
  const stage = root.querySelector('.dlg-stage');
  const statusEl = root.querySelector('.js-dlg-status');
  if(statusEl) statusEl.innerText = (round+1)+'/'+data.rounds.length;

  const setupHtml = r.setup ? `<p class="dlg-setup">${r.setup}</p>` : '';

  stage.innerHTML = `
    ${setupHtml}
    <div class="dlg-lines">
      <div class="dlg-line dlg-line-a">
        <img class="dlg-portrait" src="${data.charA.img}" alt="${data.charA.name}">
        <div class="dlg-bubble"><strong>${data.charA.name}</strong><p>${r.lineA}</p></div>
      </div>
      <div class="dlg-line dlg-line-b">
        <img class="dlg-portrait" src="${data.charB.img}" alt="${data.charB.name}">
        <div class="dlg-bubble"><strong>${data.charB.name}</strong><p>${r.lineB}</p></div>
      </div>
    </div>
    <p class="dlg-question">${r.question}</p>
    <div class="dlg-options">
      <button class="dlg-opt" data-side="A" onclick="pickDlgOption('${id}','A')">${data.charA.name}</button>
      <button class="dlg-opt" data-side="B" onclick="pickDlgOption('${id}','B')">${data.charB.name}</button>
    </div>
    <div class="dlg-feedback"></div>
  `;
}

function pickDlgOption(id, side){
  const root = document.getElementById(id);
  const state = _dlgState[id];
  if(!root || !state) return;
  const r = state.data.rounds[state.round];
  const opts = root.querySelectorAll('.dlg-opt');
  opts.forEach(b => b.disabled = true);

  const correct = side === r.correct;
  const chosenBtn = root.querySelector(`.dlg-opt[data-side="${side}"]`);
  const correctBtn = root.querySelector(`.dlg-opt[data-side="${r.correct}"]`);
  chosenBtn.classList.add(correct ? 'right' : 'wrong');
  if(!correct) correctBtn.classList.add('right');

  if(correct) state.correctCount++;

  const fb = root.querySelector('.dlg-feedback');
  const reactChar = r.correct === 'A' ? state.data.charA : state.data.charB;
  const reactionText = correct ? r.reactionCorrect : r.reactionWrong;
  const isLast = state.round === state.data.rounds.length - 1;

  fb.innerHTML = `
    <div class="dlg-reaction ${correct ? 'ok' : 'no'}">
      <img class="dlg-portrait sm" src="${reactChar.img}" alt="">
      <div class="dlg-bubble"><strong>${reactChar.name}</strong><p>${reactionText}</p></div>
    </div>
    <button class="game-reset-btn dlg-next-btn" onclick="${isLast ? `finishDlgGame('${id}')` : `advanceDlgRound('${id}')`}">
      ${isLast ? 'Ver resultado' : 'Próxima fala →'}
    </button>
  `;
}

function advanceDlgRound(id){
  const state = _dlgState[id];
  if(!state) return;
  state.round++;
  renderDlgRound(id);
}

function finishDlgGame(id){
  const root = document.getElementById(id);
  const state = _dlgState[id];
  if(!root || !state) return;
  const total = state.data.rounds.length;
  const stage = root.querySelector('.dlg-stage');
  const statusEl = root.querySelector('.js-dlg-status');
  if(statusEl) statusEl.innerText = total+'/'+total;
  root.classList.add('dlg-done');

  stage.innerHTML = `
    <div class="dlg-summary">
      <img class="om om-lg" src="../assets/icons/content/confetti.svg" alt="">
      <p><strong>${state.correctCount}/${total}</strong> certas. ${state.correctCount === total ? 'Você entendeu a treta toda.' : 'Vale reler as falas com atenção e tentar de novo.'}</p>
      <button class="game-reset-btn" onclick="initDialogueGame('${id}')">Jogar de novo</button>
    </div>
  `;

  const winMsg = root.querySelector('.game-win-msg');
  if(winMsg) winMsg.classList.add('show');
  if(typeof confettiBurst === 'function') confettiBurst(30);
  if(typeof toast === 'function') toast('<img class="om om-sm" src="../assets/icons/content/confetti.svg" alt=""> Diálogo concluído!', state.correctCount+' de '+total+' certas.');
  if(typeof mascotBounce === 'function') mascotBounce('Adorei ver vocês debatendo isso.');

  try {
    const prefix = window.STUDYHUB_PREFIX;
    if(prefix){
      localStorage.setItem(prefix+'_dialogue_v1', 'done');
      if(typeof window.checkAchievements === 'function') window.checkAchievements();
    }
  } catch(e){}
}

/* ---------------- Word Scramble (Palavra Embaralhada) ---------------- */
const _scrState = {};

function shuffleWord(word){
  const letters = word.split('');
  let scrambled;
  do {
    for(let i=letters.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [letters[i],letters[j]] = [letters[j],letters[i]];
    }
    scrambled = letters.join('');
  } while(scrambled === word && word.length > 1);
  return scrambled;
}

function initScrambleGame(id){
  const root = document.getElementById(id);
  if(!root) return;
  const words = JSON.parse(root.dataset.words);
  _scrState[id] = { words, idx:0, solved:0 };
  renderScrambleWord(id);
}

function renderScrambleWord(id){
  const root = document.getElementById(id);
  const state = _scrState[id];
  if(!root || !state) return;
  const item = state.words[state.idx];
  const word = item.word.toUpperCase();
  const scrambled = shuffleWord(word);
  const hint = root.querySelector('.scr-hint');
  const target = root.querySelector('.scr-target');
  const pool = root.querySelector('.scr-pool');
  const statusEl = root.querySelector('.scr-status');
  const winMsg = root.querySelector('.game-win-msg');
  if(winMsg) winMsg.classList.remove('show');
  if(hint) hint.innerText = item.hint;
  if(statusEl) statusEl.innerText = 'Palavra ' + (state.idx+1) + '/' + state.words.length;
  target.innerHTML = '';
  for(let i=0;i<word.length;i++){
    const slot = document.createElement('span');
    slot.className = 'scr-slot';
    slot.dataset.pos = i;
    target.appendChild(slot);
  }
  pool.innerHTML = '';
  scrambled.split('').forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.className = 'scr-letter';
    btn.type = 'button';
    btn.innerText = ch;
    btn.dataset.idx = i;
    btn.onclick = () => clickScrambleLetter(id, btn, ch);
    pool.appendChild(btn);
  });
  root.dataset.built = word;
  root.dataset.filled = '';
}

function clickScrambleLetter(id, btnEl, ch){
  const root = document.getElementById(id);
  const state = _scrState[id];
  if(!root || !state) return;
  const word = root.dataset.built;
  let filled = root.dataset.filled || '';
  const nextChar = word[filled.length];
  if(ch === nextChar){
    filled += ch;
    root.dataset.filled = filled;
    btnEl.classList.add('used');
    btnEl.disabled = true;
    const slot = root.querySelector('.scr-slot[data-pos="'+(filled.length-1)+'"]');
    if(slot){ slot.innerText = ch; slot.classList.add('filled'); }
    if(filled.length === word.length){
      state.solved++;
      const statusEl = root.querySelector('.scr-status');
      if(statusEl) statusEl.innerText = 'Resolvida! ' + (state.idx+1) + '/' + state.words.length;
      setTimeout(() => {
        if(state.idx < state.words.length - 1){
          state.idx++;
          renderScrambleWord(id);
        } else {
          const winMsg = root.querySelector('.game-win-msg');
          if(winMsg){ winMsg.classList.add('show'); }
          if(typeof confettiBurst === 'function') confettiBurst(28);
          if(typeof toast === 'function') toast('<img class="om om-sm" src="../assets/icons/content/confetti.svg" alt=""> Todas decifradas!', state.words.length+' palavras desembaralhadas.');
          if(typeof mascotBounce === 'function') mascotBounce('Vocabulário afiado! Isso é dominar os termos.');
        }
      }, 550);
    }
  } else {
    const target = root.querySelector('.scr-target');
    target.classList.remove('wrong'); void target.offsetWidth; target.classList.add('wrong');
  }
}

/* ---------------- Speed True/False (Verdadeiro ou Falso Relâmpago) ---------------- */
const _tfState = {};
const TF_SECONDS = 9;

function initSpeedTFGame(id){
  const root = document.getElementById(id);
  if(!root) return;
  const statements = JSON.parse(root.dataset.statements);
  // shuffle order each play
  for(let i=statements.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [statements[i],statements[j]]=[statements[j],statements[i]]; }
  _tfState[id] = { statements, idx:0, correct:0, timer:null };
  const winMsg = root.querySelector('.game-win-msg');
  if(winMsg) winMsg.classList.remove('show');
  renderTFRound(id);
}

function renderTFRound(id){
  const root = document.getElementById(id);
  const state = _tfState[id];
  if(!root || !state) return;
  clearTimeout(state.timer);
  const item = state.statements[state.idx];
  root.querySelector('.tf-statement').innerText = item.text;
  root.querySelector('.tf-status').innerText = (state.idx+1)+'/'+state.statements.length+' · acertos: '+state.correct;
  const bar = root.querySelector('.tf-timerfill');
  bar.classList.remove('run');
  void bar.offsetWidth;
  bar.style.animationDuration = TF_SECONDS+'s';
  bar.classList.add('run');
  const btns = root.querySelectorAll('.tf-btn');
  btns.forEach(b => { b.disabled = false; b.classList.remove('right','wrong'); });
  state.timer = setTimeout(() => resolveTF(id, null), TF_SECONDS*1000);
}

function answerSpeedTF(id, guess){
  resolveTF(id, guess);
}
window.answerSpeedTF = answerSpeedTF;

function resolveTF(id, guess){
  const root = document.getElementById(id);
  const state = _tfState[id];
  if(!root || !state) return;
  clearTimeout(state.timer);
  const item = state.statements[state.idx];
  const btns = root.querySelectorAll('.tf-btn');
  btns.forEach(b => b.disabled = true);
  root.querySelector('.tf-timerfill').classList.remove('run');
  const correct = guess === item.isTrue;
  if(correct) state.correct++;
  const trueBtn = root.querySelector('.tf-true');
  const falseBtn = root.querySelector('.tf-false');
  const rightBtn = item.isTrue ? trueBtn : falseBtn;
  rightBtn.classList.add('right');
  if(guess !== null && !correct){
    (guess ? trueBtn : falseBtn).classList.add('wrong');
  }
  setTimeout(() => {
    if(state.idx < state.statements.length - 1){
      state.idx++;
      renderTFRound(id);
    } else {
      finishSpeedTF(id);
    }
  }, 900);
}

function finishSpeedTF(id){
  const root = document.getElementById(id);
  const state = _tfState[id];
  if(!root || !state) return;
  const total = state.statements.length;
  root.querySelector('.tf-statement').innerText = state.correct+'/'+total+' certas nessa rodada relâmpago.';
  root.querySelector('.tf-status').innerText = state.correct === total ? 'Rodada perfeita!' : 'Toque em "jogar de novo" pra tentar bater esse placar.';
  root.querySelector('.tf-timerbar').style.display = 'none';
  root.querySelector('.tf-btns').style.display = 'none';
  const winMsg = root.querySelector('.game-win-msg');
  if(winMsg) winMsg.classList.add('show');
  if(state.correct === total){
    if(typeof confettiBurst === 'function') confettiBurst(26);
    if(typeof mascotBounce === 'function') mascotBounce('Reflexo total! Nenhuma pegadinha passou.');
  } else if(typeof mascotTip === 'function') mascotTip(true);
  if(typeof toast === 'function') toast('<img class="om om-sm" src="../assets/icons/content/confetti.svg" alt=""> Relâmpago concluído!', state.correct+' de '+total+' certas.');
}

function resetSpeedTF(id){
  const root = document.getElementById(id);
  if(!root) return;
  root.querySelector('.tf-timerbar').style.display = '';
  root.querySelector('.tf-btns').style.display = '';
  initSpeedTFGame(id);
}
window.resetSpeedTF = resetSpeedTF;

/* ---------------- Timed Quiz (Contra o Relógio) ---------------- */
const _tqState = {};
const TQ_SECONDS = 14;

function initTimedQuizGame(id){
  const root = document.getElementById(id);
  if(!root) return;
  const questions = JSON.parse(root.dataset.questions);
  _tqState[id] = { questions, idx:0, correct:0, timer:null };
  const winMsg = root.querySelector('.game-win-msg');
  if(winMsg) winMsg.classList.remove('show');
  renderTQRound(id);
}

function renderTQRound(id){
  const root = document.getElementById(id);
  const state = _tqState[id];
  if(!root || !state) return;
  clearTimeout(state.timer);
  const item = state.questions[state.idx];
  root.querySelector('.tq-question').innerText = item.q;
  root.querySelector('.tq-status').innerText = (state.idx+1)+'/'+state.questions.length+' · pontos: '+state.correct;
  const optsWrap = root.querySelector('.tq-opts');
  optsWrap.innerHTML = '';
  item.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'tq-opt';
    btn.type = 'button';
    btn.innerText = opt;
    btn.onclick = () => resolveTQ(id, i);
    optsWrap.appendChild(btn);
  });
  const bar = root.querySelector('.tq-timerfill');
  bar.classList.remove('run');
  void bar.offsetWidth;
  bar.style.animationDuration = TQ_SECONDS+'s';
  bar.classList.add('run');
  state.timer = setTimeout(() => resolveTQ(id, -1), TQ_SECONDS*1000);
}

function resolveTQ(id, chosenIdx){
  const root = document.getElementById(id);
  const state = _tqState[id];
  if(!root || !state) return;
  clearTimeout(state.timer);
  root.querySelector('.tq-timerfill').classList.remove('run');
  const item = state.questions[state.idx];
  const opts = root.querySelectorAll('.tq-opt');
  opts.forEach(b => b.disabled = true);
  const correct = chosenIdx === item.correct;
  if(correct) state.correct++;
  if(opts[item.correct]) opts[item.correct].classList.add('right');
  if(chosenIdx >= 0 && !correct && opts[chosenIdx]) opts[chosenIdx].classList.add('wrong');
  setTimeout(() => {
    if(state.idx < state.questions.length - 1){
      state.idx++;
      renderTQRound(id);
    } else {
      finishTQ(id);
    }
  }, 1000);
}

function finishTQ(id){
  const root = document.getElementById(id);
  const state = _tqState[id];
  if(!root || !state) return;
  const total = state.questions.length;
  root.querySelector('.tq-question').innerText = state.correct+'/'+total+' certas contra o relógio.';
  root.querySelector('.tq-opts').innerHTML = '';
  root.querySelector('.tq-timerbar').style.display = 'none';
  const winMsg = root.querySelector('.game-win-msg');
  if(winMsg) winMsg.classList.add('show');
  if(state.correct === total){
    if(typeof confettiBurst === 'function') confettiBurst(26);
    if(typeof mascotBounce === 'function') mascotBounce('Cronômetro derrotado! Pontuação perfeita.');
  }
  if(typeof toast === 'function') toast('<img class="om om-sm" src="../assets/icons/content/confetti.svg" alt=""> Contra o Relógio concluído!', state.correct+' de '+total+' certas.');
}

function resetTimedQuiz(id){
  const root = document.getElementById(id);
  if(!root) return;
  root.querySelector('.tq-timerbar').style.display = '';
  initTimedQuizGame(id);
}
window.resetTimedQuiz = resetTimedQuiz;

/* Auto-init any game present on the page once DOM is ready */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.memory-game').forEach(el => initMemoryGame(el.id));
  document.querySelectorAll('.sequence-game').forEach(el => initSequenceGame(el.id));
  document.querySelectorAll('.dialogue-game').forEach(el => initDialogueGame(el.id));
  document.querySelectorAll('.scramble-game').forEach(el => initScrambleGame(el.id));
  document.querySelectorAll('.speedtf-game').forEach(el => initSpeedTFGame(el.id));
  document.querySelectorAll('.timedquiz-game').forEach(el => initTimedQuizGame(el.id));
});
