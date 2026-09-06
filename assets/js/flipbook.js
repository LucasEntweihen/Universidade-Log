/* ============================================================
   flipbook.js - motor do glossário em formato de livro.
   Espera window.GLOSSARY = {
     courseTitle, courseIcon, mascotImg, mascotName, mascotLine,
     backHref, coverA, coverB, terms: [{term, def, mod}]
   }
   ============================================================ */
(function(){
  const G = window.GLOSSARY;
  if(!G) return;

  const TERMS_PER_PAGE = 4;

  // 1) ordena alfabeticamente
  const sorted = [...G.terms].sort((a,b)=> a.term.localeCompare(b.term,'pt-BR'));

  // 2) agrupa por letra
  const letters = [];
  const byLetter = {};
  sorted.forEach(t=>{
    const L = t.term.charAt(0).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(!byLetter[L]){ byLetter[L] = []; letters.push(L); }
    byLetter[L].push(t);
  });

  // 3) pagina respeitando quebras de letra (cada página cabe TERMS_PER_PAGE termos,
  //    mas nunca corta o cabeçalho da letra do meio sem motivo - permite continuar)
  const pages = []; // cada page = {letterHeader:boolean, letter, items:[...]}
  let cursor = null;
  letters.forEach(L=>{
    const items = byLetter[L];
    let i = 0;
    let first = true;
    while(i < items.length){
      const chunk = items.slice(i, i+TERMS_PER_PAGE);
      pages.push({ letter: L, showHeader:first, items: chunk });
      i += TERMS_PER_PAGE;
      first = false;
    }
  });

  // página[0..] = conteúdo; adicionamos 1 página de sumário no início (index 0)
  const letterPageIndex = {}; // letra -> índice da PRIMEIRA página de conteúdo (após sumário)
  pages.forEach((p, idx)=>{ if(p.showHeader && !(p.letter in letterPageIndex)) letterPageIndex[p.letter] = idx; });

  const TOC_PAGE = -1; // marcador especial
  // array final de "folhas": [TOC, ...pages]
  const leaves = [TOC_PAGE, ...pages];
  // garante número par de folhas (pra sempre fechar em par L/R); se ímpar, adiciona página em branco
  if(leaves.length % 2 !== 0) leaves.push(null);

  let current = 0; // índice da folha à esquerda (sempre par)
  let animating = false;

  const root = document.getElementById('fbRoot');

  function renderPageHTML(leaf, side){
    if(leaf === TOC_PAGE){
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const cells = alphabet.map(L=>{
        const has = letters.includes(L);
        return `<div class="fb-toc-letter${has?'':' disabled'}" ${has?`onclick="__fbJump('${L}')"`:''}>${L} ${has?'·':''}</div>`;
      }).join('');
      return `<div class="fb-toc">
        <h3>${G.courseIcon || '<img class="om om-md" src="../assets/icons/content/notebook.svg" alt="">'} Sumário - ${G.courseTitle}</h3>
        <p style="font-size:.82rem;color:#6B5D3E;margin-bottom:14px;">${sorted.length} termos catalogados. Toque numa letra pra ir direto ao capítulo.</p>
        <div class="fb-toc-grid">${cells}</div>
      </div>`;
    }
    if(leaf === null){
      return `<div style="opacity:.4;font-family:'Playfair Display',serif;text-align:center;margin-top:40%;color:#B8A876;">&#10022; fim do glossário &#10022;</div>`;
    }
    let html = '';
    if(leaf.showHeader){
      html += `<div class="fb-letter-tab">${leaf.letter}</div>`;
    } else {
      html += `<div class="fb-page-header">${G.courseTitle} - continuação de "${leaf.letter}"</div>`;
    }
    leaf.items.forEach(t=>{
      html += `<div class="fb-term"><span class="t-name">${t.term}</span>${t.mod?`<span class="t-mod">${t.mod}</span>`:''}<div class="t-def">${t.def}</div></div>`;
    });
    return html;
  }

  function pageNumberLabel(idx){
    if(idx === 0) return 'Sumário';
    return 'Pág. ' + idx;
  }

  function render(){
    const leftLeaf = leaves[current];
    const rightLeaf = leaves[current+1];
    const leftEl = root.querySelector('.fb-page-left');
    const rightEl = root.querySelector('.fb-page-right');
    leftEl.querySelector('.fb-page-content').innerHTML = renderPageHTML(leftLeaf, 'left');
    rightEl.querySelector('.fb-page-content').innerHTML = renderPageHTML(rightLeaf, 'right');
    leftEl.querySelector('.fb-page-number').textContent = pageNumberLabel(current);
    rightEl.querySelector('.fb-page-number').textContent = pageNumberLabel(current+1);

    document.getElementById('fbPrevBtn').disabled = current <= 0;
    document.getElementById('fbNextBtn').disabled = current+2 >= leaves.length;
    document.getElementById('fbProgress').textContent = `folha ${Math.floor(current/2)+1} de ${Math.ceil(leaves.length/2)}`;

    // índice de letra ativa (destaca no mobile tab se existir)
  }

  function goNext(){
    if(animating || current+2 >= leaves.length) return;
    animating = true;
    const rightEl = root.querySelector('.fb-page-right');
    rightEl.classList.add('flip-fwd');
    setTimeout(()=>{
      current += 2;
      render();
    }, 300);
    setTimeout(()=>{
      rightEl.classList.remove('flip-fwd');
      animating = false;
    }, 640);
  }

  function goPrev(){
    if(animating || current <= 0) return;
    animating = true;
    const leftEl = root.querySelector('.fb-page-left');
    leftEl.classList.add('flip-back');
    setTimeout(()=>{
      current -= 2;
      render();
    }, 300);
    setTimeout(()=>{
      leftEl.classList.remove('flip-back');
      animating = false;
    }, 640);
  }

  function jumpToLetter(L){
    const pageIdx = letterPageIndex[L];
    if(pageIdx === undefined) return;
    // pageIdx é índice dentro de `pages` (sem contar TOC); folha real = pageIdx+1 (por causa do TOC na posição 0)
    let leafIdx = pageIdx + 1;
    if(leafIdx % 2 !== 0) leafIdx -= 1; // arredonda pro par (página esquerda) mais próximo anterior
    current = Math.max(0, Math.min(leafIdx, leaves.length-2));
    render();
  }
  window.__fbJump = jumpToLetter;

  function openBook(){
    document.getElementById('fbCover').style.display = 'none';
    document.querySelector('.fb-book-wrap').classList.add('open');
    render();
  }
  window.__fbOpen = openBook;

  function doSearch(q){
    q = q.trim().toLowerCase();
    if(!q) return;
    const hit = sorted.find(t=> t.term.toLowerCase().startsWith(q));
    if(hit){
      const L = hit.term.charAt(0).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(document.getElementById('fbCover').style.display !== 'none') openBook();
      jumpToLetter(L);
    }
  }
  window.__fbSearch = doSearch;

  // navegação por teclado quando o livro está aberto
  document.addEventListener('keydown', e=>{
    if(!document.querySelector('.fb-book-wrap').classList.contains('open')) return;
    if(e.key === 'ArrowRight') goNext();
    if(e.key === 'ArrowLeft') goPrev();
  });

  window.__fbNext = goNext;
  window.__fbPrev = goPrev;
})();
