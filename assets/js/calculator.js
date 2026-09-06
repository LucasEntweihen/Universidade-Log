/* ============================================================
   calculator.js - "Calculadora do Arquimago"
   Self-contained calculator toolkit for trigomante.log only.
   No eval()/Function() used anywhere (CSP-safe): expressions are
   parsed by hand with a small recursive-descent parser.
   ============================================================ */

(function(){
  let calcDegMode = true; // true = degrees, false = radians
  let calcExpr = '';
  let calcAns = 0;

  /* ---------------- safe expression parser ---------------- */
  function tokenize(src){
    const tokens = [];
    let i = 0;
    const isDigit = c => c >= '0' && c <= '9';
    while(i < src.length){
      const c = src[i];
      if(c === ' '){ i++; continue; }
      if(isDigit(c) || c === '.'){
        let n = c; i++;
        while(i < src.length && (isDigit(src[i]) || src[i] === '.')){ n += src[i]; i++; }
        tokens.push({t:'num', v:parseFloat(n)});
        continue;
      }
      if(/[a-zA-Zπ]/.test(c)){
        let n = c; i++;
        while(i < src.length && /[a-zA-Z]/.test(src[i])){ n += src[i]; i++; }
        tokens.push({t:'id', v:n});
        continue;
      }
      if('+-*/^()%'.includes(c)){ tokens.push({t:c}); i++; continue; }
      i++; // skip unknown char
    }
    return tokens;
  }

  function parseExpr(tokens){
    let pos = 0;
    function peek(){ return tokens[pos]; }
    function next(){ return tokens[pos++]; }

    function parseAtom(){
      const tk = peek();
      if(!tk) return 0;
      if(tk.t === 'num'){ next(); return tk.v; }
      if(tk.t === 'π'){ next(); return Math.PI; }
      if(tk.t === '('){ next(); const v = parseAddSub(); if(peek() && peek().t === ')') next(); return v; }
      if(tk.t === '-'){ next(); return -parseAtom(); }
      if(tk.t === 'id'){
        next();
        const name = tk.v.toLowerCase();
        if(name === 'pi' || name === 'π'){ return Math.PI; }
        if(name === 'ans'){ return calcAns; }
        if(name === 'phi'){ return (1+Math.sqrt(5))/2; }
        // function call: name(argument) via next atom/paren
        const arg = parseAtom();
        const rad = calcDegMode ? arg * Math.PI/180 : arg;
        switch(name){
          case 'sin': return Math.sin(rad);
          case 'cos': return Math.cos(rad);
          case 'tan': return Math.cos(rad) === 0 ? NaN : Math.tan(rad);
          case 'asin': return calcDegMode ? Math.asin(arg)*180/Math.PI : Math.asin(arg);
          case 'acos': return calcDegMode ? Math.acos(arg)*180/Math.PI : Math.acos(arg);
          case 'atan': return calcDegMode ? Math.atan(arg)*180/Math.PI : Math.atan(arg);
          case 'sqrt': return Math.sqrt(arg);
          case 'log': return Math.log10(arg);
          case 'ln': return Math.log(arg);
          default: return arg;
        }
      }
      return 0;
    }
    function parsePow(){
      let left = parseAtom();
      while(peek() && peek().t === '^'){ next(); const right = parsePow(); left = Math.pow(left, right); }
      return left;
    }
    function parsePercent(){
      let left = parsePow();
      while(peek() && peek().t === '%'){ next(); left = left/100; }
      return left;
    }
    function parseMulDiv(){
      let left = parsePercent();
      while(peek() && (peek().t === '*' || peek().t === '/')){
        const op = next().t;
        const right = parsePercent();
        left = op === '*' ? left*right : left/right;
      }
      return left;
    }
    function parseAddSub(){
      let left = parseMulDiv();
      while(peek() && (peek().t === '+' || peek().t === '-')){
        const op = next().t;
        const right = parseMulDiv();
        left = op === '+' ? left+right : left-right;
      }
      return left;
    }
    return parseAddSub();
  }

  function evalExpr(src){
    if(!src.trim()) return 0;
    try{
      const tokens = tokenize(src);
      const result = parseExpr(tokens);
      return typeof result === 'number' && isFinite(result) ? result : NaN;
    }catch(e){ return NaN; }
  }

  /* ---------------- UI wiring: scientific calc ---------------- */
  function calcDisplay(){
    const d = document.getElementById('calcDisplay');
    if(d) d.innerText = calcExpr || '0';
  }
  window.calcPress = function(val){
    calcExpr += val;
    calcDisplay();
  };
  window.calcFn = function(name){
    calcExpr += name + '(';
    calcDisplay();
  };
  window.calcClear = function(){
    calcExpr = '';
    calcDisplay();
  };
  window.calcDel = function(){
    calcExpr = calcExpr.slice(0, -1);
    calcDisplay();
  };
  window.calcEquals = function(){
    const r = evalExpr(calcExpr);
    const out = document.getElementById('calcDisplay');
    if(isNaN(r)){
      if(out) out.innerText = 'erro de feitiço';
      return;
    }
    calcAns = r;
    const rounded = Math.round(r*100000)/100000;
    calcExpr = String(rounded);
    if(out) out.innerText = calcExpr;
  };
  window.calcToggleDeg = function(btn){
    calcDegMode = !calcDegMode;
    if(btn) btn.innerText = calcDegMode ? 'DEG' : 'RAD';
  };

  /* ---------------- right-triangle solver ---------------- */
  window.calcSolveTriangle = function(){
    const mode = document.getElementById('triMode').value;
    const v1 = parseFloat(document.getElementById('triVal1').value);
    const v2 = parseFloat(document.getElementById('triVal2').value);
    const out = document.getElementById('triResult');
    if(!out) return;
    if(isNaN(v1) || isNaN(v2)){
      out.innerHTML = '<p class="quiz-fb no" style="display:block;">Preencha os dois valores pedidos pra esse modo.</p>';
      return;
    }
    let angle, oposto, adjacente, hipotenusa;
    try{
      if(mode === 'angle-hyp'){ // ângulo + hipotenusa
        angle = v1; hipotenusa = v2;
        const rad = angle*Math.PI/180;
        oposto = hipotenusa*Math.sin(rad);
        adjacente = hipotenusa*Math.cos(rad);
      } else if(mode === 'angle-opp'){ // ângulo + cateto oposto
        angle = v1; oposto = v2;
        const rad = angle*Math.PI/180;
        hipotenusa = oposto/Math.sin(rad);
        adjacente = oposto/Math.tan(rad);
      } else if(mode === 'angle-adj'){ // ângulo + cateto adjacente
        angle = v1; adjacente = v2;
        const rad = angle*Math.PI/180;
        hipotenusa = adjacente/Math.cos(rad);
        oposto = adjacente*Math.tan(rad);
      } else if(mode === 'opp-adj'){ // dois catetos
        oposto = v1; adjacente = v2;
        hipotenusa = Math.sqrt(oposto*oposto + adjacente*adjacente);
        angle = Math.atan(oposto/adjacente)*180/Math.PI;
      } else if(mode === 'hyp-opp'){ // hipotenusa + oposto
        hipotenusa = v1; oposto = v2;
        adjacente = Math.sqrt(Math.max(hipotenusa*hipotenusa - oposto*oposto, 0));
        angle = Math.asin(oposto/hipotenusa)*180/Math.PI;
      }
      const fmt = n => Math.round(n*1000)/1000;
      out.innerHTML =
        '<div class="callout" style="margin-top:14px;">'+
        '<div class="c-label">Resultado do feitiço</div>'+
        '<p><strong>Ângulo α:</strong> '+fmt(angle)+'°<br>'+
        '<strong>Cateto oposto:</strong> '+fmt(oposto)+'<br>'+
        '<strong>Cateto adjacente:</strong> '+fmt(adjacente)+'<br>'+
        '<strong>Hipotenusa:</strong> '+fmt(hipotenusa)+'</p></div>';
    }catch(e){
      out.innerHTML = '<p class="quiz-fb no" style="display:block;">Não foi possível resolver com esses valores.</p>';
    }
  };

  /* ---------------- golden ratio tool ---------------- */
  window.calcGoldenRatio = function(){
    const mode = document.getElementById('phiMode').value;
    const v = parseFloat(document.getElementById('phiVal').value);
    const out = document.getElementById('phiResult');
    if(!out) return;
    if(isNaN(v) || v <= 0){
      out.innerHTML = '<p class="quiz-fb no" style="display:block;">Digite um valor positivo.</p>';
      return;
    }
    const phi = (1+Math.sqrt(5))/2;
    let total, maior, menor;
    if(mode === 'total'){
      total = v;
      maior = total/phi;
      menor = total - maior;
    } else if(mode === 'maior'){
      maior = v;
      menor = maior/phi;
      total = maior+menor;
    } else {
      menor = v;
      maior = menor*phi;
      total = maior+menor;
    }
    const fmt = n => Math.round(n*1000)/1000;
    out.innerHTML =
      '<div class="callout" style="margin-top:14px;">'+
      '<div class="c-label">Divisão áurea (φ ≈ 1,618)</div>'+
      '<p><strong>Segmento total:</strong> '+fmt(total)+'<br>'+
      '<strong>Parte maior:</strong> '+fmt(maior)+'<br>'+
      '<strong>Parte menor:</strong> '+fmt(menor)+'<br>'+
      '<strong>Conferência (maior/menor):</strong> '+fmt(maior/menor)+'</p></div>';
  };

  /* ---------------- panel open/close/tabs ---------------- */
  window.toggleCalculator = function(){
    const overlay = document.getElementById('calcOverlay');
    if(!overlay) return;
    overlay.classList.toggle('show');
  };
  window.switchCalcTab = function(name){
    document.querySelectorAll('.calc-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('.calc-body').forEach(p => { p.hidden = p.dataset.tabPanel !== name; });
  };

  document.addEventListener('DOMContentLoaded', () => {
    calcDisplay();
    const overlay = document.getElementById('calcOverlay');
    if(overlay){
      overlay.addEventListener('click', (e) => { if(e.target === overlay) overlay.classList.remove('show'); });
    }
  });
})();
