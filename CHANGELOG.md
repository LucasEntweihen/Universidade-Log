# Changelog — Universidade Log

Histórico de criação, atualização e desenvolvimento da plataforma. Cada versão documenta o que foi entregue, decisões tomadas e problemas encontrados (e corrigidos) no processo.

---

## [v7.6] — Redesign B2C, Menu Off-Canvas "Duolingo", Animações Globais e Auditoria .env

Uma sessão focada puramente em elevar o "Fit and Finish" (polimento final) e a experiência em dispositivos móveis, trazendo paradigmas reais de Web Apps modernos para o site.

### Redesign e Modernização (B2C Moderno)

- **Página de Cursos (`cursos.html`)**: Os pesados "cards" de duas colunas (que geravam excesso de elementos no DOM e causavam lentidão/bugs ao renderizar no meio da animação de fundo) foram substituídos por uma **lista horizontal elegante** (`.course-list` e `.course-item`). A nova estrutura removeu o excesso de textos e concentrou a visão no mascote, título, tema e botões de ação ("Entrar no curso" e "Glossário"). O resultado é uma renderização instantânea e um visual profissional e otimizado.
- **Header Global (Pílula Flutuante)**: A antiga barra superior pegava de ponta a ponta. Foi reescrita usando **CSS Grid (`1fr auto 1fr`)** para garantir um alinhamento perfeitamente centralizado. Ela agora é descolada do topo (`top: 16px`), possui bordas super arredondadas (`border-radius: 100px`) e um forte efeito de desfoque (_Glassmorphism_ avançado com `inset box-shadow`), seguindo as últimas tendências de produtos B2C.
- **Reordenação Inteligente**: A ordem dos links do menu principal foi refeita de forma estratégica: **Cursos → Sobre → Paleta → Equipe**, colocando o produto principal ("Cursos") logo no início da navegação e deixando a equipe depois da paleta, conforme solicitado.
- **Botões de Nav Elegantes**: As bordas duras antigas dos links do menu foram retiradas. O hover agora usa `color-mix` sutil, tornando-os parecidos com componentes nativos e leves.

### Responsividade Mobile (O Paradigma Duolingo)

- **Menu Hambúrguer (Mobile-First)**: Adicionado a TODAS as 15 páginas do ecossistema de cursos (incluindo as páginas de conteúdo, materiais, projeto e referências). Em telas menores de `860px`, os botões de navegação desaparecem dando lugar a um ícone clássico de "3 linhas" totalmente animado e funcional.
- **Subpáginas (`.topbar`)**: Ao clicar no hambúrguer, o menu desliza para baixo de forma "bonitinha" (animada) empurrando o conteúdo com uma transição elástica, organizando os botões em coluna, amigável para dedos.
- **Páginas de Curso (A Gaveta Lateral)**: Nas 4 páginas de curso imersivo (onde a barra lateral `<aside>` tem o progresso, as bolinhas de módulo e a gamificação), implementamos uma experiência idêntica à do **Duolingo**. A barra `<aside>` não é mais "empurrada" desajeitadamente para o topo do celular; ela é ocultada por padrão (`left: -120%`). Quando o aluno clica no menu, ela desliza da esquerda para a direita cobrindo 85% da tela como uma autêntica **Sidebar Drawer** (gaveta lateral off-canvas) nativa de celular.
- **Auto-close Inteligente**: Injetado script inteligente nos cursos: ao abrir a "Sidebar de Módulos" no mobile e clicar numa bolinha de aula (`.path-node`), a gaveta de módulos **se fecha sozinha**, revelando instantaneamente o conteúdo da aula selecionada, exatamente como os maiores apps do mercado operam.
- **Correção no Curso de Android**: O mockup do "Celular" em `android.html` possuía uma barra inferir (`phone-chrome-bottom`). O botão central de "Módulos" foi recabeado de forma cirúrgica para **acionar essa mesma gaveta lateral moderna**, preservando a imersão.

### Animações Globais ("Simples e Básicas")

- **Fade-in de Página (`pageFadeIn`)**: O corpo (`body`) do site ganhou uma animação sutil global no carregamento. Ao abrir qualquer página, o conteúdo tem uma entrada suave flutuando `6px` de baixo para cima enquanto a opacidade vai a 1.
- **Respiração em Botões (`softPulse`)**: A classe `.primary` de botões ganhou uma animação contínua (e não-intrusiva) de respiração (_Pulse_). A sombra (box-shadow) da cor primária expande suavemente chamando a atenção do usuário para as principais Call To Actions do sistema (o botão pulsa de forma intermitente pedindo o clique).
- Todo o pacote de animações globais foi configurado para **respeitar instantaneamente** o media-query `prefers-reduced-motion: reduce`, desligando para quem tem restrições de movimento no SO.

### Upgrade Visual (Tela de Carregamento)

- **Novo Loader App-like (`.lp-loader`)**: A tela de carregamento que antes era apenas o mascote solto numa tela sólida foi totalmente reprojetada. O mascote (Byte) agora habita um **Card Glassmorphism** centralizado (`.lp-loader-content`), com bordas arredondadas e sombra de profundidade. Adicionado um texto pulsante ("INICIANDO O SISTEMA...") e uma nova barra de carregamento com _gradient_ e brilho (glow), oferecendo um feedback visual de nível AAA logo no primeiro milissegundo de acesso ao site.

### Auditoria de Arquitetura e Segurança (`.env`)

- **Verificação Profunda de Variáveis de Ambiente**: Conduzida uma auditoria rigorosa vasculhando todo o repositório por conexões de banco de dados, chaves de API ocultas (OpenAI, Stripe, Firebase) ou dependências de Backend Node/Python.
- **Veredito Oficial**: NENHUM arquivo precisa ir para um `.env`. O projeto é confirmado como arquitetura **100% Client-Side** estática, salvando o progresso diretamente no `localStorage` do navegador e sem qualquer tráfego para APIs privadas. A estrutura nativa de pastas (`cursos/`, `glossario/`, `assets/`) e os componentes em raiz mostraram-se ideais para hospedagens estáticas (como Netlify ou Vercel). O _Fallback_ legado dos ícones na raiz (`favicon.ico` e `apple-touch-icon.png`) foram mantidos pois servem a um bom propósito arquitetônico já documentado em versões passadas. O projeto não requer reorganização de arquivos.

### Revisão Profunda de Lógica e Responsividade (Subagentes)

- **Lógica JS (`engine.js` & `games.js`)**: Realizada uma auditoria profunda do código JavaScript. Corrigido um _edge case_ onde carregar um índice inválido ou inexistente via `localStorage` (ex: `NaN`) na função `switchTab()` gerava um estado sem abas visíveis (tela em branco). Adicionado tratamento preventivo de `null` em callbacks de `checkQuiz()`. No jogo "Caça-Palavras" (`games.js`), corrigida uma falha de estado onde a mesma letra podia ser clicada múltiplas vezes (adicionado `disabled = true` após o uso da letra).
- **Refinamento Responsivo (Overlaps de Z-Index)**: Corrigido conflito de z-index no mobile onde elementos nativos da página de Android (`.phone-chrome-top/bottom`) se sobrepunham indesejadamente à nova barra responsiva e às ilustrações. Eles agora convivem em perfeita hierarquia. Adaptamos o tamanho das gavetas para compatibilidade com a UI de navegadores mobile.
- **Fechamento Inteligente do Menu (Anchor Links)**: No `index.html` e no `cursos.html`, clicar em um link interno (como "Sobre" ou "Equipe") rolava a página, mas o menu dropdown do mobile continuava aberto cobrindo a tela. Adicionado um comportamento dinâmico nativo onde clicar no link retira instantaneamente a classe `.open` do painel.
- **Limpeza de HTML e Acessibilidade (`cursos.html`)**: Identificada e preenchida a ausência do container base `<div id="cvd-overlay-container">`, garantindo que os filtros de daltonismo funcionem integralmente também na página do catálogo de cursos. Removidas também funções antigas de _Scrollspy_ e _Carousel_ que ficaram inoperantes no arquivo `cursos.html` após o desacoplamento da Landing Page, aliviando o processamento do DOM.

---

## [v7.5] — Animações por tema, SEO/publicação completos, segurança documentada, acessibilidade estrutural

### Animações — parallax por tema (substituindo o parallax genérico)

- **Causa raiz resolvida de verdade, não só sintoma**: a mesma lógica de scroll existia duplicada em `engine.js` (`setupParallax()`) e `assets/js/mini-parallax.js`, e as duas aplicavam sempre o mesmo deslocamento vertical, não importa o curso. Unificado num único `assets/js/theme-fx.js` + `assets/css/theme-fx.css`; `mini-parallax.js` removido, `engine.js` não tem mais essa função.
- **IA**: já existia um campo de estrelas estático em `body.course-ia::before` (decisão documentada de design: "o céu fica quieto"). Em vez de substituir, somamos 2 camadas novas por cima dele, com velocidades diferentes ao rolar — a camada original vira, na prática, a mais distante (velocidade zero). Ícones de foguete/satélite/nuvem ganham um flutuar contínuo via CSS puro (`@keyframes fx-float`), independente de scroll.
- **DevOps**: 3 camadas de onda em SVG com velocidades diferentes — a curva reaproveita exatamente a mesma forma já usada no divisor `.wire` do site, só ampliada, em vez de inventar uma curva nova. Ícones de navio/baleia/âncora balançam via CSS puro (`@keyframes fx-sway`), sem depender de scroll.
- **Trigomante**: parede de fundo com parallax mais lento que o conteúdo (sensação de profundidade 2.5D) + tochas tremeluzindo via CSS puro.
- **Android**: o parallax vertical padrão foi substituído por deslocamento **horizontal** nas fotos de hero/módulo — um "swipe" no lugar de um scroll, reforçando o tema de celular que a página já tem com o `phone-chrome-top/bottom`.
- Todas as camadas decorativas são `aria-hidden="true"` e `pointer-events:none`; nenhuma entra no DOM quando `prefers-reduced-motion: reduce` está ativo (checado em JS antes de criar qualquer elemento, não só escondido depois via CSS).
- **Imagens maiores**, pra dar espaço de verdade ao parallax: `.hero-photo-wrap` foi de 420–460px pra 500–560px (desktop) com breakpoints tablet/mobile proporcionais; `.mod-photo-wrap` (usado nas 3 páginas `*-material.html`) foi de 320px pra 420px.

### SEO / arquivos de publicação

- **Meta description, Open Graph, Twitter Card e `<link rel="canonical">`** adicionados em 25 páginas de conteúdo que não tinham (só `index.html` tinha o pacote completo antes) — cada curso com sua própria imagem de compartilhamento (Byte no Android, o Capitão no DevOps, Fly na IA, o Mago na Trigomante) em vez de uma imagem genérica repetida.
- `privacidade.html`/`termos.html` tinham description e canonical, mas nada de Open Graph/Twitter — completado.
- `humans.txt` atualizado (13 temas, não 12; data; componentes novos).
- `LICENSE.md` criado — copyright simples, com nota explícita de que decisão de licença aberta é do Lucas, não algo que eu deveria escolher sozinho.
- `sitemap.xml` conferido contra as páginas reais do site: já estava completo e correto (25 URLs de conteúdo, erro 404/403/500/offline corretamente de fora) — nenhuma mudança necessária, verificado antes de mexer.
- `.well-known/security.txt` continua com e-mail placeholder — não preenchido porque exigiria inventar um contato; fica marcado pro Lucas preencher.

### Segurança — `SECURITY.md` novo, documentando o real

- CSP (`<meta>` em toda página) reforçada com `object-src 'none'`, `frame-ancestors 'none'` e `upgrade-insecure-requests` — mudança aditiva, sem risco de quebrar nada existente.
- **Pesquisado antes de mexer**: nem `netlify.toml` nem `vercel.json` ganharam `Strict-Transport-Security` manual — os dois hosts já injetam esse cabeçalho automaticamente pra domínio próprio, e declarar de novo gera cabeçalho HTTP duplicado (inválido pela RFC 7230; documentado como bug real da comunidade Netlify que impede entrar na lista de preload do HSTS).
- `SECURITY.md` documenta com honestidade os dois limites técnicos reais que não têm solução: (1) não existe forma de esconder código-fonte de site estático — só dificultar a leitura, já feito via minificação; (2) Subresource Integrity não funciona com Google Fonts (confirmado: o CSS retornado varia por user-agent, hash fixo quebraria fontes pra parte dos usuários — é limitação documentada do próprio Google, não falta de configuração).
- Registrado como dívida técnica, não corrigido agora por ser mudança grande demais pra fazer junto de outras coisas: a CSP ainda permite `'unsafe-inline'` em `script-src`, necessário enquanto o site usar `onclick=""` inline; removê-lo exigiria migrar todos os handlers pra JS externo.
- Confirmado por busca no projeto inteiro: nenhum segredo/chave/token versionado (as únicas ocorrências das palavras são conteúdo educacional sobre segurança, não credenciais reais).

### Acessibilidade estrutural

- **Skip-link** adicionado nas 29 páginas: primeiro elemento focável, fica fora da tela até receber foco por teclado, pula direto pro `<main id="main-content">`.
- **Landmark `<main>` estava faltando por completo em 10 páginas** (`index.html`, `cursos.html`, os 4 glossários e mais 4 páginas utilitárias) e presente mas sem `id` em outras 19 — corrigido nas 29. Sem isso, navegação por landmark (leitor de tela, `Ctrl+F6` em alguns navegadores) não tinha como pular pro conteúdo principal.
- **Achado incidental, investigado e confirmado antes de "corrigir"**: 97 ocorrências de `viewbox` (minúsculo, tecnicamente inválido) em 10 arquivos, pré-existentes desde antes desta sessão. Pesquisei o comportamento real do parser HTML5: navegadores corrigem isso automaticamente ao interpretar HTML (confirmado com teste de `DOMParser` real) — **não é um bug visível**, mas ficou inconsistente e frágil (quebraria se algum ícone fosse reaproveitado fora de um navegador, ex. num sprite SVG via XML). Corrigido mesmo assim, sem risco, por ser second-order dívida técnica barata de resolver.
- `:focus-visible` e o catch-all de `prefers-reduced-motion` em `theme.css` já cobriam bem o site — conferido antes de adicionar qualquer coisa, pra não duplicar proteção que já existia.

Pedido original: uma revisão estrutural completa (ícones, arquitetura modular, sidebar/acessibilidade/paleta "quebrados", páginas de erro, otimização de bundle JS). Antes de reescrever qualquer coisa, fiz uma auditoria file-por-file com evidência (grep, contagem de ocorrências, parser de HTML/CSS) em vez de assumir onde os problemas estavam — várias coisas que pareciam prováveis suspeitas (ex.: sidebar dos cursos, `.topbar` sem `display:flex`) na prática não eram o bug real, e o processo de investigação está registrado aqui com a mesma transparência de sempre, inclusive os casos em que a hipótese inicial estava errada.

### Corrigido — o bug real de acessibilidade/paleta

- **Causa raiz encontrada**: o seletor de tema e o painel de acessibilidade nunca foram um componente único — cada página tinha sua própria cópia colada do HTML. Com o tempo as cópias divergiram e pelo menos 3 versões diferentes passaram a coexistir:
  - **Sem painel de acessibilidade nenhum**: `cursos/android.html`, `cursos/devops.html`, `cursos/ia.html`, `cursos/devops-diario.html`, `cursos/devops-projeto.html`, `cursos/devops-referencias.html`, `cursos/trigomante-grimorio.html` — 7 páginas, incluindo as 3 páginas-sede de curso mais visitadas do site.
  - **Seletor de tema incompleto**: as mesmas 7 páginas tinham só 7 das 13 opções de tema (sem as variantes escuras de azul/verde/roxo/âmbar/rosa, sem o tema espacial). `cursos/devops-material.html` estava ainda pior: só 2 das 13 opções (família "Neutro" isolada).
  - **`cursos/android-projeto.html`**, o caso mais grave: tinha uma cópia inteira do widget (13 swatches) colada por engano **dentro de uma tag `<style>`** (portanto, morta — nenhum navegador executa HTML dentro de CSS) e, além disso, uma segunda cópia real no `<body>`, incompleta (só a família "Neutro") e com IDs duplicados (`#a11yCvd` duplicado invalida o HTML e faz o segundo seletor de daltonismo parar de responder). A causa dessa segunda cópia era um `<div class="topbar">` cujo fechamento se perdeu no meio da inserção do painel de acessibilidade, deixando `.topbar`, `.topnav` e `.theme-popover` sem fechar pelo resto do documento.
  - **`index.html`**: os 12 swatches tinham `aria-label` em inglês (o resto do site inteiro está em pt-BR) e nenhum `data-theme` no HTML — como `theme-picker.js` decide qual swatch marcar como "ativo" lendo `data-theme`, o círculo do tema selecionado nunca aparecia marcado nessa página especificamente (o clique funcionava, só o feedback visual de seleção que não existia).

- **Correção**: criado `assets/js/chrome-widgets.js` — fonte única com o HTML completo e correto dos dois widgets (13 temas, painel de acessibilidade com os 3 grupos de controle). Toda página passou a ter só `<div data-chrome-widget="theme"></div>` e `<div data-chrome-widget="a11y"></div>`, injetados em runtime antes de `theme-picker.js`/`accessibility.js` rodarem. Isso foi aplicado nas 21 páginas que usam esses widgets — não só nas 9 confirmadamente quebradas, porque as outras 12 continuavam sendo 12 cópias manuais do mesmo HTML (o problema de fundo, não só o sintoma visível). Editar qualquer um dos dois agora é editar 1 arquivo, não até 21.
- Adicionado breakpoint de mobile (`max-width:480px`) pro painel de acessibilidade em `icons.css` — só o seletor de tema tinha essa correção antes, o painel de acessibilidade não, e por isso furava a lateral da tela em telas pequenas.
- Adicionado suporte pros dois popovers dentro da sidebar de 272px das páginas-sede de curso (`.theme-toggle .theme-popover-panel/.a11y-popover-panel{width:224px}`) — antes o painel de acessibilidade nem existia ali, então esse caso nunca tinha sido tratado.
- `.theme-toggle` (cabeçalho da sidebar) trocado de `flex-direction:column` pra `row` com `flex-wrap` — com 2 botões-gatilho em vez de 1, ficar em coluna desperdiçava espaço vertical sem necessidade.

### Removido — código morto confirmado

- `.topbar{justify-content:center !important;gap:40px !important}` em `site.css`: investigado e confirmado como código morto — nenhuma página que carrega `site.css` tem elemento `.topbar` (as páginas com `<aside>` usam outra estrutura) e nenhuma das 11 páginas com `.topbar` de verdade carrega `site.css` (cada uma define a própria versão num `<style>` inline, já correta, com `display:flex` e sem `!important`). A regra nunca alcançou elemento nenhum.
- Um bloco `.topnav{display:flex;...}` inteiro estava colado, por engano, **dentro** de `.brand{}` em `site.css` (`.brand{ .topnav{...} border-bottom:...; }`) — seletor dentro de seletor não é CSS válido; confirmado com o parser do `clean-css` (`Unexpected '}'`, `Invalid property name`). Isso fazia o navegador descartar o bloco malformado, deixando `.brand` (cabeçalho da sidebar dos 4 cursos) sem a borda inferior planejada. Separado em `.brand{border-bottom:1px solid var(--line);}` válido; a parte `.topnav` foi removida por ser, ela também, código morto (nenhuma página que carrega `site.css` usa `.topnav`).

### Ícones

- `ship.svg` e `whale.svg` (usados inline em tamanho pequeno) redesenhados: de ilustrações estilo OpenMoji com dezenas de paths multi-tom para 3-5 paths e 2 cores cada — 10.541 bytes somados viraram 1.234. Mantido o mesmo `viewBox="0 0 72 72"`, então nenhuma referência existente quebra.
- Investigação de `assets/icons/ui/` (19 arquivos): confirmado que **nenhum é referenciado em nenhuma página** — o ícone funcional dominante do site (315 ocorrências) é `<svg fill="currentColor">` colado inline, path repetido manualmente cada vez em vez de referenciar um arquivo. A pasta não foi apagada nem "corrigida" isoladamente (corrigir o estilo de arquivos usados por ninguém não move a agulha); documentado como a base pronta pra virar biblioteca de verdade quando alguém migrar os usos inline pra referências reais — ver `ICON-GUIDELINES.md`.
- Criado `ICON-GUIDELINES.md`: documenta as duas famílias reais do projeto (`.om` decorativo estilo OpenMoji vs. `.ic-mono` funcional, majoritariamente sólido com sombreamento via `opacity`), a exceção intencional dos 3 ícones de traço do mockup de celular Android (imitam navegação real do Android, não é inconsistência), e os novos tokens `--icon-primary/secondary/muted/accent` em `icons.css` (opt-in via `.ic-mono.ic-muted`/`.ic-accent`/`.ic-secondary` — de propósito **sem** aplicar cor no `.ic-mono` base, porque isso quebraria a herança de `currentColor` que os 315 usos existentes dependem hoje).

### Adicionado — páginas de erro

- `404.html`, `403.html`, `500.html`, `offline.html`, com o mesmo design system (`theme.css`, `icons.css`) e uma folha nova e enxuta (`assets/css/error-page.css`, ~2,6KB minificado) em vez de carregar `landing.css` inteiro só por causa de um botão. Cada uma com os dois widgets de chrome (tema/acessibilidade), botão "Voltar" (`history.back()`) e "Ir para o início".
- `404.html` mostra dinamicamente o caminho que o usuário tentou acessar (`location.pathname`).
- Documentado em `netlify.toml`/`vercel.json` (com fonte oficial: `vercel.com/kb/guide/custom-404-page`) que `404.html` na raiz já é suficiente — Netlify e Vercel detectam automaticamente esse nome de arquivo em sites estáticos, sem configuração extra. `403.html`/`500.html` ficam como modelo pronto pro dia em que existir backend de verdade (Assessor.IA, curso de Banco de Dados) — hoje, sendo site 100% estático, nada do servidor gera esses códigos sozinho.

### Build de produção (novo, opcional)

- Adicionado `package.json` + `build.js` (`npm install && npm run build`): gera `dist/` com CSS/JS/HTML minificados (esbuild, clean-css, html-minifier-terser), sem trocar nome de nenhum arquivo e sem remover funcionalidade — só espaços/comentários. Medido: CSS+JS+HTML combinados **1123,4 KB → 989,1 KB (-12,0%)**; JS sozinho **-44,1%**; CSS **-20,7%**. O site continua funcionando normalmente sem rodar isso — é só uma opção pra quem publicar em produção quiser economizar banda. `dist/` e `node_modules/` adicionados ao novo `.gitignore`.
- Validação: sintaxe de todo `.js` minificado checada com `node -c`; todo `.css` original revalidado com `clean-css` (achou os dois bugs de sintaxe reais documentados acima); balanceamento de `<div>` verificado nas 29 páginas HTML antes e depois de cada mudança.

### Documentação

- Criado `README.md` (não existia): como rodar localmente, estrutura de pastas, como usar o build opcional.
- Criado `ICON-GUIDELINES.md` (ver acima).

### Dívida técnica conhecida — não corrigida nesta rodada (registrando com transparência)

- 🟡 **Migração dos ícones inline pra biblioteca**: as ~315 ocorrências de ícones `.ic-mono` colados inline (path repetido manualmente) poderiam referenciar `assets/icons/ui/` em vez de duplicar HTML — trabalho grande, espalhado por 25 páginas, arriscado demais pra fazer no mesmo momento de uma correção de bug. `ICON-GUIDELINES.md` documenta o caminho.
- 🟡 **~140 ícones `.om` restantes** em `assets/icons/content/` não foram revisados individualmente — só `ship.svg`/`whale.svg` (os citados como exemplo) foram redesenhados. A regra de simplicidade está documentada em `ICON-GUIDELINES.md` pra aplicar aos demais quando fizer sentido.
- 🔵 **Divs não fechados pré-existentes** (não introduzidos nesta rodada, confirmado comparando com o zip original): `cursos/android-material.html`, `cursos/android-referencias.html`, `cursos/android.html` e `cursos/ia.html` têm 1-2 `<div>` sem fechamento correspondente em algum lugar do documento. Não chega a quebrar visualmente (os navegadores toleram isso bem), mas é HTML inválido — vale uma sessão dedicada a achar exatamente onde, já que a essa altura pode estar em qualquer um dos milhares de `<div>` de cada arquivo.
- 🔵 **Modularização de sidebar**: a sidebar de cada curso (trilha de módulos, XP, mascote) continua sendo HTML hardcoded por página — arquitetura razoável hoje (cada curso tem número/rótulo de módulo diferente), mas se o objetivo for eliminar toda duplicação de verdade, o próximo passo seria um `gerarSidebar(cursoConfig)` data-driven em vez de HTML fixo. Maior e mais arriscado que o que coube com segurança nesta rodada.

---

## [v7.3] — Sidebar DevOps, restrição do tema Espaço e expansão da equipe

### Adicionado

- **Equipe completa (Landing Page)**: Adicionados os 5 personagens restantes (Kira, Rex, Grilo, Prof. Cogno, Datacent) ao carrossel da equipe, totalizando 20 personagens mapeados a partir de `description.json`.

### Melhorado

- **Sidebar DevOps (Reconstrução)**: Sidebar de `devops.html` reescrita do zero — eliminada a duplicação de `div` que quebrava o layout, e implementada estrutura completa com 11 módulos, painel de gamificação, tracker e links para subpáginas.
- **Sincronização (DevOps)**: Topbars em `devops-material`, `devops-referencias`, `devops-projeto` e `devops-diario` atualizadas com a estrutura de navegação consolidada e o novo seletor de tema (`theme-popover`).
- **Temas em Diários**: Integração total de `devops-diario.html` e `trigomante-grimorio.html` ao seletor de temas global (`theme-picker.js`), com restauração automática da preferência salva (`localStorage`) e uso de variáveis CSS para backgrounds e componentes.

### Corrigido

- **Escopo do tema "Espaço"**: O tema espacial foi removido do menu de seleção de todos os cursos, exceto IA, via restrição CSS (`.tp-family-space { display: none !important; }` com exceção para `.course-ia`).

## [v7.2] — Atualização do ícone de acessibilidade

### Melhorado

- **Ícone de Acessibilidade**: Substituído o ícone SVG de acessibilidade (antigo símbolo) pelo ícone de cadeirante universal (`.a11y-trigger`), padronizando a representação visual em todas as páginas e garantindo maior clareza. A substituição foi realizada em todos os arquivos HTML e arquivos de referência de componentes.

Atualização grande, feita em uma leva só a partir de um pedido com várias frentes independentes: dois bugs visuais reportados por print, troca completa de identidade visual, extração da seção de cursos pra uma página própria, uma aba inteira nova de acessibilidade, ícones revisados, carrossel de personagens, FAQ maior, crédito no rodapé e — o item tratado com mais peso nesta versão — um décimo terceiro tema visual inteiramente novo, de temática espacial, com efeitos próprios. Cada mudança foi testada com Playwright (renderização real em Chromium headless) antes de entrar aqui; nada foi documentado sem ter sido visto rodando.

## [v7.1] — Melhorias na responsividade da landing page

### Melhorado — Acessibilidade para daltonismo

- **Substituído o filtro de contraste por paleta dedicada**: O modo daltonismo agora alterna variáveis CSS para um tema de alto contraste (cores primárias como amarelo, ciano e magenta sobre fundo preto), eliminando o uso de filtros CSS que estragavam o layout e não atendiam às necessidades de acessibilidade de forma eficiente.

  - **Expansão dos filtros de daltonismo**: Adicionados filtros específicos para Protanomalia, Deuteranomalia, Tritanomalia e Acromatopsia, permitindo diagnósticos mais precisos através de um menu expandido.

### Corrigido

- **Layout e acessibilidade**: O sistema de filtros para daltonismo (usando SVG) estava quebrando elementos de layout (`position: fixed`/`sticky`) ao ser aplicado diretamente no `body`. O código foi refatorado para envolver apenas o conteúdo principal em um `.content-wrapper`, preservando a estrutura de navegação e fundo fixo.

### Corrigido

- **Botão de tamanho da fonte**: Corrigida a lógica de detecção de valores no script de acessibilidade, que impedia o funcionamento da alteração de fonte.

### Melhorado

- **Painel de Acessibilidade**: Adicionada estilização ao menu de seleção de tipo de daltonismo para melhorar a usabilidade e estética.

### Melhorado

- **Responsividade da landing page**:
  - Ajustado o padding das seções (.lp-section) para melhor uso do espaço em telas pequenas.
  - Atualizado o grid de recursos (.feat-grid) para usar `auto-fit` com `minmax`, permitindo que os cards se adaptem melhor a diferentes tamanhos de tela sem depender apenas de media queries fixas.

---

### Corrigido — bugs reportados por print

- **Header não ficava fixo ao rolar a página.** Causa raiz: `overflow-x:hidden` em `html`/`body` (adicionado numa versão anterior pra resolver um overflow horizontal residual de ~104px) tem um efeito colateral pouco conhecido — qualquer valor de `overflow` diferente de `visible`, mesmo só no eixo X, transforma o elemento num "contêiner de rolagem" aos olhos do navegador, e isso quebra `position:sticky` dos elementos dentro dele. Troquei `overflow-x:hidden` por `overflow-x:clip` em `assets/css/theme.css` (`html` e `body`) — `clip` corta o conteúdo do mesmo jeito, mas não cria esse contêiner de rolagem, então não quebra `sticky`. Testado com Playwright: `.lp-topbar` mantém `top:0` antes e depois de rolar 1200px (antes, subia junto com o conteúdo e sumia). Como bônus, isso também destrava o `.faq-aside` (o card fixo ao lado do FAQ), que tinha o mesmo problema sem ninguém ter reportado ainda.
- **A luz amarela do fundo não cobria a largura toda e nascia embaixo, não em cima.** Causa raiz: o fundo usa `radial-gradient(...at X% Y%...)`, e posição em `%` num `background` com `background-attachment` padrão (`scroll`) é calculada em cima da altura **da página inteira**, não da tela visível. Numa landing page com ~7300px de altura, "10%" vertical não fica perto do topo visível — fica a ~730px de distância, ou seja, perto do fim da dobra inicial (exatamente o efeito visto no print: luz nascendo mais embaixo, sem cobrir o topo). Corrigido com `background-attachment:fixed` em `assets/css/landing.css` (bloco `body{}`, usado por `index.html`, `privacidade.html`, `termos.html`) e também em `assets/css/theme.css` (bloco `body{}` genérico, usado como base pelas demais páginas) — isso faz o `%` passar a ser calculado em cima da tela visível, não do documento inteiro. Testado visualmente antes/depois no tema `amber-dark` (o mesmo do print) e no `purple-dark`: a luz agora começa nos dois cantos superiores e se estende visivelmente mais.
- **Link quebrado descoberto durante a extração da página de cursos**: um script de ajuste em lote deixou o link "A equipe" do rodapé de `cursos.html` sem `href` nenhum (`<a >`). Bug meu, cometido e corrigido nesta mesma sessão — documentando com transparência porque é assim que esse changelog funciona.

### Rebranding — novas logos

- Trocado o ícone antigo (capelo de formatura verde) pelas duas logos novas fornecidas: `assets/icons/brand/logo-mark.svg` (símbolo: capelo + prompt de terminal `>`, em roxo) e `assets/icons/brand/logo-lockup.svg` (a pílula roxa com "UNIVERSIDADE.LOG").
- `assets/icons/brand/favicon.svg` passou a conter a logo-mark nova — como é o arquivo que já era referenciado em favicon e em vários lugares do site, isso propagou a marca nova automaticamente pra qualquer lugar que já apontava pra ele.
- Regerados **todos** os tamanhos de favicon a partir do novo SVG (16/32/64/192/256/512px + `favicon.ico` multi-resolução + `apple-touch-icon.png`), renderizados via Chromium headless a partir do vetor original (não é um redimensionamento de bitmap — cada tamanho foi desenhado a partir do SVG, então fica nítido em qualquer resolução).
- Header de `index.html`, `privacidade.html`, `termos.html` e `cursos.html`: o antigo ícone+texto virou um único `<img>` com a logo-lockup completa, agora um link de verdade pra home (`<a class="lp-logo" href="index.html" aria-label="Universidade Log — página inicial">` — antes era uma `<div>` sem link nenhum).
- `manifest.json` e `<meta name="theme-color">` (nas 24 páginas) atualizados de verde (`#3FA34D`) pro roxo da marca nova (`#9D25FF`).

### Nova página: `/cursos.html`

- A seção inteira de cursos (169 linhas, os 4 cards completos) saiu de dentro da landing page e virou uma página HTML própria, com seu próprio `<title>`, `<meta description>`, `canonical`, Open Graph e Twitter Card específicos pra catálogo de cursos (antes, esses metadados eram só os da homepage).
- O botão "cursos" do menu (presente em todas as páginas) e o botão "Ver todos os cursos" da hero agora apontam pra `cursos.html` em vez de rolar até uma âncora `#cursos`.
- A landing page ganhou uma versão resumida no lugar: 4 cartões pequenos (personagem + nome do curso + uma linha) com link individual pra cada curso, mais um botão grande "Ver os 4 cursos completos, com tudo que cada um ensina →" levando pra `cursos.html`. Não sumiu — ficou mais curto, com a versão completa a um clique.
- Como `cursos.html` não é mais a homepage, os links do menu e do rodapé pra `#sobre`, `#paleta` e `#equipe` (seções que só existem em `index.html`) foram ajustados pra `index.html#sobre` etc. — sem isso, clicar neles em `cursos.html` não faria nada (procurariam uma seção inexistente na própria página).
- SEO técnico: o `<h2>Escolha sua trilha</h2>` da seção original virou `<h1>` em `cursos.html` (toda página deve ter exatamente um `h1`; na landing, esse papel já é do título da hero).

### Acessibilidade — aba nova, com três recursos reais

Adicionado um botão "acessibilidade" no menu (mesmo padrão visual do seletor de temas: botão + painel), presente em `index.html`, `cursos.html` e nas 17 páginas de curso/glossário que já tinham o seletor de temas. Arquivo novo: `assets/js/accessibility.js` (bem comentado no próprio código, explicando o que cada recurso faz — e principalmente o que **não** faz, pra não prometer mais do que existe):

1. **Tamanho da fonte** (A / A+ / A++): escala o `font-size` da raiz do documento (118% e 135%). Como o CSS do site inteiro usa `rem`, isso aumenta texto, espaçamentos e ícones proporcionalmente em tudo — testado até 135%, o layout responsivo absorve bem o aumento.
2. **Reforço de contraste (daltonismo)**: aqui fui deliberadamente conservador. Filtros de "correção" de daltonismo por tipo (protanopia/deuteranopia/tritanopia) dependem de matrizes de cor complexas — implementar isso errado, sem conseguir verificar a matemática com segurança, pode piorar a legibilidade em vez de ajudar. Em vez de arriscar isso, o modo aplica um reforço de contraste e saturação gerais (`filter:contrast(1.08) saturate(1.3)`), uma técnica simples e segura que ajuda a diferenciar tons próximos. **E, independente do modo estar ligado ou não**, encontrei e corrigi um problema de verdade nos minijogos: certo/errado (`.right`/`.wrong` em `assets/css/games.css`) dependiam só da cor (verde/vermelho — a pior combinação possível pra quem tem daltonismo vermelho-verde). Agora todo feedback ganha um ✓ ou ✗ escrito, sempre, em qualquer tema — essa parte não é opcional nem depende do toggle, porque ninguém deveria precisar ativar uma configuração pra saber se acertou a pergunta.
3. **Leitura em voz alta**: usa a Web Speech API (`speechSynthesis`) do navegador. Sendo honesto sobre o que isso é: **não é** o leitor de tela do sistema operacional (NVDA, JAWS, VoiceOver) — uma página web não tem permissão de ativar isso, e prometer isso seria enganoso. É uma leitura embutida no próprio site: ao ligar, lê o título e a introdução da página, e depois qualquer título ou parágrafo clicado é lido em voz alta (com um destaque visual temporário no trecho). Quem já usa um leitor de tela de verdade continua tendo a marcação semântica e os `aria-label` do site funcionando normalmente, ligado ou não.
4. **Todas as imagens têm `alt`**: auditei as 24 páginas do site (não só as tocadas nesta versão) procurando `<img>` sem atributo `alt` — nenhuma encontrada. Já estava correto; ficou confirmado, não só assumido.

Preferências (tamanho de fonte e modo daltonismo) ficam salvas no navegador (`localStorage`), do mesmo jeito que o tema de cor. Leitura em voz alta nunca começa ligada sozinha entre sessões — ninguém quer que o navegador comece a falar sozinho ao abrir uma aba nova.

### Paleta de temas — visual novo + TEMA ESPACIAL (13º tema)

**O seletor de temas estava um grid plano de 12 bolinhas sem nome nenhum visível.** Redesenhado: agora é um painel organizado por família (Neutro, Azul, Verde, Roxo, Âmbar, Rosa — cada uma com sua etiqueta), com animação de entrada suave. Aplicado nas mesmas 18 páginas que já tinham o seletor.

**O tema espacial, com atenção especial — é o item mais trabalhado desta versão:**

- **Paleta própria**, criada do zero em `assets/css/theme.css` (`[data-theme="space"]`): fundo `#0A0B1E` (azul-marinho quase preto), painel `#12132E`, acento primário roxo `#7B6CFF`, acento secundário dourado `#FFD166`, terciário rosa-nebulosa `#FF6EC7`. Diferente dos outros 12 temas, não tem par claro/escuro — espaço sideral já nasce escuro por natureza, então é um tema único.
- **Arquivo novo dedicado**: `assets/css/space-theme.css` (~15KB, fartamente comentado — o próprio arquivo explica cada efeito, por que existe e como testar). Carregado nas 24 páginas do site; custo zero quando o tema não está ativo, porque tudo dentro dele vive atrás do seletor `[data-theme="space"]`.
- **Campo de estrelas**: 45 pontos brancos com posição, tamanho e opacidade gerados uma vez (seed fixa, não é aleatório a cada carregamento) e "cravados" como camadas de `radial-gradient` em `body::before` — sem nenhum elemento novo no HTML, sem custo de JavaScript. Um pulso leve de opacidade dá sensação de cintilar.
- **Planetas**: só nas páginas de curso (`body[class^="course-"]`), pra não competir com o conteúdo mais denso da landing — dois planetas desenhados com `radial-gradient` (um roxo com "atmosfera" no canto superior direito, um âmbar com brilho no canto inferior esquerdo), fixos, desfocados, atrás do conteúdo (`pointer-events:none`).
- **Foto real da Unsplash**: um elemento `.space-planet-photo` (inserido no HTML de todas as 17 páginas de curso/glossário, logo depois da tag `<body>`) mostra uma fotografia real de galáxia flutuando como se fosse uma lua, com uma leve animação de deriva vertical. As 3 imagens usadas (licença Unsplash — uso livre, sem exigência de crédito, mas documentado aqui por transparência):
  - **Distant Galaxy**, por Javier Miranda ([@nuvaproductions](https://unsplash.com/@nuvaproductions)) — usada como a "lua" flutuante — [unsplash.com/photos/3yQY9GPM8Mg](https://unsplash.com/photos/3yQY9GPM8Mg)
  - **Nebula in galaxy** ("Natures fireworks"), por Alexander Andrews ([@alex_andrews](https://unsplash.com/@alex_andrews)) — [unsplash.com/photos/eNoeWZkO7Zc](https://unsplash.com/photos/eNoeWZkO7Zc)
  - **Earth Planet**, por Javier Miranda — [unsplash.com/photos/Jn2EaLLYZfY](https://unsplash.com/photos/Jn2EaLLYZfY)

  Carregadas direto do CDN da Unsplash (`images.unsplash.com`), domínio que já estava liberado no `Content-Security-Policy` de cada página desde antes desta versão (`img-src ... https://images.unsplash.com`) — não precisei abrir nenhuma permissão nova.

- **Estrela cadente periódica**: uma risca de luz cruza a tela a cada ~7 segundos (`body::after`, `@keyframes space-shooting-star`), puramente decorativa.
- **Foguete contextual — não é um enfeite solto.** A pedido explícito de ligar o foguete ao contexto: `confettiBurst()` (função já existente em `assets/js/engine.js`, disparada nas comemorações reais do site — sequência de respostas certas, módulo concluído) foi atualizada pra, quando o tema espacial está ativo, (a) trocar a cor do confete pra tons cósmicos (roxo/dourado/rosa/branco) e (b) soltar um foguete (🚀) que decola do rodapé da tela até sumir no topo. Na landing page, um foguete pequeno também flutua ao lado do botão "Começar por DevOps →" — o gatilho de começar a jornada, contexto perfeito pra "decolar". Nenhum dos dois aparece em nenhum outro tema.
- **Respeita `prefers-reduced-motion`**: todo o pacote (cintilar, estrela cadente, deriva da foto, decolagem do foguete) para de se mexer pra quem pediu menos movimento no sistema — os elementos continuam visíveis, só param de animar.
- Testado visualmente numa página de curso real (`cursos/android.html`) com o tema ativo: estrelas, os dois planetas e o círculo da foto (com anel de brilho) aparecem corretamente posicionados; testado também disparar `confettiBurst()` manualmente e confirmado que o elemento do foguete é criado no DOM.

### Equipe: "tripulação" virou "equipe", e agora é um carrossel

- Renomeado em todo lugar relevante: `id="tripulacao"` → `id="equipe"`, link do menu, `data-section`, link do rodapé, título da seção (`<h2>A tripulação</h2>` → `<h2>A equipe</h2>`). Deixei de fora a menção solta em textos de marketing (ex.: "uma tripulação inteira torcendo por você" no parágrafo da hero) — é vocabulário do tema náutico do site, não o nome formal da seção, então manter não gera inconsistência.
- As 4 faixas estáticas empilhadas (uma por grupo, sempre quebrando linha) viraram **um carrossel horizontal único** com scroll-snap: setas de navegação, 5 botões de filtro (Todos / Piratas DevOps / Mobile & IA / Trigomante / Corpo docente — cada um rola suavemente até o primeiro card do grupo), navegável por teclado (setas ← → com o carrossel focado). Cada card mantém uma barra colorida no topo indicando o grupo (as mesmas cores que já existiam antes, só que agora aplicadas a mais elementos: borda + etiqueta de texto, não só o título da faixa).
- JavaScript novo, inline em `index.html`: sem dependência externa, ~35 linhas.

### FAQ mais detalhado

- De 5 para 9 perguntas. Novas: acessibilidade (linkando pra aba nova), se os temas afetam mais que estética, onde reportar bug/sugestão (linkando pro GitHub), por que não existe certificado. Duas respostas antigas (progresso salvo, "é gratuito mesmo") ganharam mais uma frase de detalhe cada, sem inflar demais.

### Ícones

- Auditoria visual dos ícones do menu e rodapé em tamanho real revelou uma inconsistência: a maioria dos ícones (OpenMoji, já usados no projeto) é colorida, mas `anchor.svg` e `people.svg` especificamente renderizam quase em cinza puro — não é um arquivo errado (é fiel ao emoji real: âncora é metal, pessoas sem tom de pele definido são cinza por convenção), mas destoa visualmente ao lado dos ícones coloridos vizinhos, principalmente no menu.
- Troquei os dois, nos lugares onde representam "equipe"/"navegação" (menu e rodapé de `index.html` e `cursos.html` — 4 ocorrências): `anchor.svg` → `ship.svg` (navio colorido, e tematicamente mais preciso pro site inteiro girar em torno de "navio.log"), `people.svg` → `handshake.svg` (aperto de mão colorido, contexto de equipe/colaboração). Os outros usos de `anchor.svg` (nas páginas de DevOps, contexto diferente — infraestrutura, não navegação) ficaram como estavam, por serem um significado diferente.
- **Sendo honesto sobre o que não deu pra fazer nesta versão**: não tive como baixar ou desenhar um conjunto novo de ícones "colored lineart" personalizado — não tenho acesso a um serviço de ícones de dentro deste ambiente. O que foi feito foi uma auditoria real (não estética só) trocando os ícones genuinamente destoantes por alternativas mais coerentes já disponíveis no acervo do projeto (107 ícones). Se você tiver um pacote de ícones específico em mente (ou quiser que eu gere um conjunto customizado depois), me avisa numa próxima rodada.

### Rodapé

- Adicionado link pro GitHub do criador (`github.com/LucasEntweihen`) na barra inferior do rodapé de `index.html` e `cursos.html`, com ícone e `aria-label` descritivo, abrindo em nova aba.

### Validado

- Playwright headless em 12 páginas representativas (`index.html`, `cursos.html`, `privacidade.html`, `termos.html`, páginas de curso principais e secundárias, glossário, e as 4 páginas "avulsas" sem o seletor de tema): zero erros de JavaScript em todas.
- Header fixo: `.lp-topbar` mantém `top:0` depois de rolar 1200px (antes: `-521px`, ou seja, tinha sumido de vista).
- Sem overflow horizontal reintroduzido: `document.documentElement.scrollWidth === clientWidth` depois da troca de `hidden` pra `clip`.
- Carrossel de equipe: testado clique em seta (rola ~1,5 card) e clique em filtro (pula exatamente pro primeiro card do grupo "Trigomante", card do "Mago").
- Painel de acessibilidade: testado abrir o popover, aplicar A++ (confirma `document.documentElement.style.fontSize === "135%"`), disparar `confettiBurst()` no tema espacial e confirmar a criação do elemento `.space-rocket-launch` no DOM.
- `cursos.html`: título, meta description, `<h1>` único, link de "voltar pra home", e todos os 4 cards de curso renderizando com o conteúdo completo (o mesmo que estava na landing, sem perder nada no recorte).

---

## [v6.3] — Identidade da marca no header/footer, e infraestrutura de produção

Correção de dois bugs visuais reportados (bolinha genérica no lugar da logo; footer sem largura total) e uma auditoria completa de arquivos de infraestrutura web — segurança, SEO, PWA e padronização de repositório — cobrindo os 27 itens de uma lista de referência trazida para avaliação. Cada item foi avaliado individualmente pelo que agrega (ou não) a um site estático, sem conta, sem backend e sem app nativo; itens sem aplicação real foram descartados em vez de criados como enfeite.

### Corrigido

- **Bolinha ao lado de "Universidade Log" → logo real**: o `<span class="dot">` (uma bolinha verde genérica, só decorativa) foi substituído por `<img class="brand-mark" src="assets/icons/brand/favicon.svg">` — a logo de capelo de formatura que já é o favicon do site — em **4 lugares**: menu superior de `index.html`, `privacidade.html` e `termos.html`, e o bloco de marca do rodapé em `index.html`. Regras `.lp-logo .dot` / `.lf-logo .dot` removidas de `assets/css/landing.css` e substituídas por `.lp-logo .brand-mark` (26×26px) / `.lf-logo .brand-mark` (20×20px).
- **Link morto no rodapé**: `index.html` e `termos.html` linkavam para `/.well-known/security.txt`, mas o arquivo nunca existia no projeto — qualquer pesquisador de segurança que clicasse caía num 404. Arquivo criado (ver "Adicionado").
- **`sitemap.xml` incompleto**: 4 páginas reais do site nunca tinham sido adicionadas — `cursos/android-apps.html`, `cursos/devops-diario.html`, `cursos/ia-nucleo.html`, `cursos/trigomante-grimorio.html`. Adicionadas com `priority 0.5`, no mesmo padrão das páginas de material/projeto de cada curso. Total de URLs no sitemap: 20 → 24.
- **As mesmas 4 páginas acima também tinham o `<head>` incompleto** em relação a todas as outras 20 páginas do site: faltava o favicon PNG de fallback (`favicon-32.png`), o `apple-touch-icon` e o `<meta name="referrer">`. Os três foram adicionados, no mesmo padrão já usado no resto do site. **Obs.:** essas 4 páginas também não restauram o tema de cor salvo (`studyhub_theme_v1`) como as demais — mas isso não foi alterado aqui, porque as 4 usam paleta própria fixa (mockup de celular, diário, "núcleo" e grimório, cada uma com fundo hard-coded, não `var(--bg)`), o que parece intencional — é uma decisão de design, não um bug de infraestrutura. Fica registrado caso você queira revisar.

### Investigado

- **Footer não ocupando 100% de largura, com espaço sobrando embaixo**: renderizei `index.html` via Chromium headless (Playwright) em várias larguras (375px a 2560px) e com o tema `purple-dark` — o mesmo do print, confirmado batendo pixel a pixel com as cores `--panel-2:#2B1C42` do tema. Em todos os testes, `.lp-footer` calculou `width` = 100% do viewport e `height` batendo exatamente com o fim do `<body>`, sem gap. Ou seja: **no código deste zip, o bug não se reproduz** — o mais provável é uma versão em cache do navegador (ou do site publicado) desatualizada em relação a este pacote. Mesmo assim, adicionei `width:100%` explícito em `.lp-footer` (`assets/css/landing.css`) como reforço defensivo, sem custo nenhum. Recomendo um hard-refresh (Ctrl/Cmd+Shift+R) pra confirmar antes de investigar mais.

### Adicionado

- **`.well-known/security.txt`** (RFC 9116): canal de contato e política de relato de vulnerabilidades. **Importante:** o campo `Contact` foi deixado como placeholder (`SUBSTITUA-PELO-SEU-EMAIL-DE-CONTATO@...`) de propósito — não existia nenhum e-mail de contato documentado no projeto, e publicar um endereço inventado seria pior do que não ter o arquivo (um pesquisador de segurança escreveria pra um lugar que não existe). Troque pelo e-mail real antes de publicar.
- **`humans.txt`**: crédito ao criador do projeto e um resumo da stack, no formato humanstxt.org.
- **`manifest.json`** (PWA): nome, descrição (reaproveitada do rodapé), ícones, `theme_color` (`#3FA34D`, o verde-menta padrão do tema claro) e `background_color`. Permite "adicionar à tela de início" em Android/iOS/desktop.
- **Ícones novos**, gerados a partir do `favicon.svg` já existente (não inventados — renderizados do vetor original via headless Chromium, pra garantir nitidez): `favicon-192.png`, `favicon-512.png` (tamanhos que o `manifest.json` pede) e `favicon.ico` multi-resolução (16/32/48/64/128/256, via Pillow, a partir do `favicon-256.png` existente). `favicon.ico` e `apple-touch-icon.png` também copiados pra raiz do projeto, porque navegadores antigos e alguns crawlers pedem esses caminhos diretamente, ignorando as tags `<link>` do `<head>`.
- **`<link rel="manifest">` e `<meta name="theme-color" content="#3FA34D">`** adicionados nas 24 páginas HTML do site (script único, respeitando o prefixo relativo certo pra raiz vs. `cursos/`/`glossario/`).
- **`.editorconfig`**: replica o padrão já usado no projeto (UTF-8, LF, indentação de 2 espaços, sem tabs — confirmado varrendo os arquivos `.js`/`.css`/`.html` existentes antes de escrever, não chutado), com trim de espaço em branco no fim da linha, exceto `.md` (pra não mexer em `CHANGELOG.md`).
- **`.gitattributes`**: normaliza fim de linha pra LF em todo o repositório e marca binários reais (`.png`, `.ico`) como `binary`, sem diff/normalização de texto. SVGs ficam como texto (são XML, não binário).
- **`netlify.toml`** e **`vercel.json`**: headers de segurança (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) pros dois provedores estáticos mais comuns pra esse tipo de projeto. Cada um só tem efeito se você hospedar ali — pode apagar o que não usar. **De propósito, nenhum dos dois define:** CSP a nível de servidor (já existe via `<meta>` em cada página; duplicar criaria duas políticas que podem divergir com o tempo) nem `Cache-Control` agressivo pra `assets/` (como os arquivos CSS/JS não têm hash no nome, cache longo esconderia suas próprias atualizações futuras dos visitantes).

### Avaliado e descartado

Os demais itens da lista de 27 arquivos de infraestrutura foram considerados e **não** adicionados, por não terem aplicação real neste projeto hoje — nenhum foi criado só pra parecer mais completo:

- `ads.txt` / `app-ads.txt` — o site é explicitamente sem anúncios ("sem anúncio" já é parte da proposta declarada no rodapé).
- `carbon.txt` — exigiria dados verificáveis sobre o provedor de hospedagem (energia renovável etc.) que eu não tenho; inventar seria uma declaração falsa.
- `pgp-key.txt` — não existe chave PGP real pra publicar.
- `browserconfig.xml` — específico de Windows 8/IE11 (tiles do menu Iniciar), tecnologia já obsoleta.
- `opensearch.xml` — pressupõe uma busca interna funcional (`?q=`) que o site não tem.
- `sitemap-images.xml` — mapear todas as imagens de personagens/heróis das 24 páginas é um esforço grande pra um ganho de SEO pequeno nesse estágio; posso montar se fizer sentido depois.
- `assetlinks.json` / `apple-app-site-association` — servem pra provar propriedade de domínio pra um app nativo Android/iOS, que não existe (o projeto é sobre desenvolvimento Android, não é um app Android).
- `.htaccess` / `nginx.conf` — exigem saber se a hospedagem é Apache ou Nginx; sem essa informação, um arquivo desses fica morto ou, pior, pode nem ser lido.
- `.dockerignore` / `Procfile` — não há Docker nem processo de servidor (é HTML/CSS/JS estático, sem build).
- `.env.example` — não existe nenhuma variável de ambiente no projeto (sem backend, sem chave de API no cliente).
- `.nvmrc` — não há Node.js/`package.json` no fluxo atual do projeto.
- `CODEOWNERS` — só faz sentido com outras pessoas revisando PRs; é um projeto solo por enquanto.
- `.prettierignore` — não há Prettier (nem outro formatador) configurado no projeto hoje.

### Validado

- Playwright headless: `.lp-footer` com `width` = 100% do viewport em 375px/768px/1024px/1440px/1908px/2560px, temas `light`, `dark` e `purple-dark`.
- Conferido visualmente (screenshot): logo nova nítida e nas cores certas no menu e no rodapé, depois de confirmar que o esmaecimento inicial era só a tela de carregamento (`#lp-loader`) ainda em transição.
- `sitemap.xml` validado como XML bem-formado, 24 URLs.
- `manifest.json` e `vercel.json` validados como JSON bem-formado.
- Zero ocorrências restantes de `.lp-logo .dot` / `.lf-logo .dot` no CSS; os `<span class="dot">` que sobraram em `cursos/ia-nucleo.html` são um elemento decorativo totalmente diferente (marcador de seção, com estilo próprio isolado naquela página) e não foram tocados.

---

## [v6.2] — Módulo de Funções no trigomante.log, com cálculos interativos

Reforço de conteúdo pedido a partir de duas listas de exercícios de funções trigonométricas (período, equações e inequações) e do material teórico correspondente: um módulo inteiramente novo, inserido antes da revisão final, cobrindo o conceito de função (domínio/contradomínio/imagem), transformações de gráfico (amplitude/período/fase) e resolução de equações e inequações trigonométricas.

### Adicionado

- **Módulo 06 · "O Reino das Funções"** (`cursos/trigomante.html`): Uruk retorna como personagem para um desafio de lógica final, antes do Salão do Arquimago. O antigo Módulo 06 (Salão) foi renumerado para Módulo 07 — nav, `data-mod`, `id` de seção, eyebrows e autoavaliação final todos atualizados de forma consistente.
- **Calculadora de Período e Amplitude**: widget interativo (`calcPeriodo()`) — o usuário ajusta a, b, c, d e o tipo de função (sen/cos/tg) e recebe período, amplitude e imagem calculados na hora via `Math`, sem depender de tabela fixa.
- **Oráculo das Equações**: segundo widget interativo (`calcOraculo()`) — resolve numericamente sen x = k, cos x = k ou tg x = k usando `Math.asin/acos/atan`, mostrando as soluções dentro de uma volta e a fórmula da solução geral (+k·360° ou +k·180°). Valida domínio (k entre -1 e 1 para seno/cosseno) antes de calcular.
- 3 quizzes novos (`q7a`, `bug7`, `q7b`) ligados ao `checkQuiz()` existente, cobrindo período de `3cos(x/2)`, o erro comum de achar que somar uma constante muda o período, e a menor solução positiva de `tg(3x)=1`.
- 4 itens de checklist novos (`chk-21` a `chk-24`) e 1 item extra na autoavaliação final (`chk-25`), extraídos diretamente das listas de exercícios fornecidas.
- Nova conquista de módulo: "Guardião das Funções" (substituindo o antigo `module6_master`, que virou `module7_master` mantendo o texto original "Revisão Completa"). Total de conquistas: 18 → 19. `totalQuizzes`: 14 → 17.
- **10 termos novos no Grimório de Termos** (`glossario/trigomante.html`): Amplitude, Contradomínio, Domínio, Equação Trigonométrica, Fase, Função, Identidade Trigonométrica, Imagem, Inequação Trigonométrica, Período — inseridos em ordem alfabética, marcados como `mód. 06`. Total: 44 → 54 termos.

### Mudado

- `#sec-6` adicionado ao seletor de fonte `Playfair Display` (escopo local da página).
- Rodapé de créditos do curso passou a citar as listas de exercícios de funções trigonométricas, além da síntese teórica original.

### Validado

- Playwright headless em ambas as páginas editadas: zero erros de JS/console no carregamento.
- Testado programaticamente: os dois widgets de cálculo (período/amplitude e oráculo de equações) com múltiplos casos, incluindo bordas (b=0, k fora de [-1,1]); os 3 quizzes novos; desbloqueio de nó/badge ao completar o checklist do Módulo 06; navegação "módulo anterior/próximo" atravessando o módulo novo corretamente.

---

## [v6.1] — Byte como protagonista, footer estrutural, profundidade controlada e loading screen

Refinamento de UI/UX focado em identidade e acabamento: revisão crítica da landing page como um designer revisaria — "isso parece feito por um time de produto ou gerado automaticamente?"

### Mudado

- **Herói**: a arte trocou de "navio com a tripulação inteira" para **Byte sozinho**, grande, sem corte (sem `object-fit:cover` em nenhum momento — a imagem preserva a proporção original inteira), com uma sombra de chão sutil pra dar peso a ele. Byte agora é claramente o personagem principal da experiência; os outros (Fly, Capitão Baba Grogue, Mago) seguem como personagens secundários, cada um no seu próprio card de curso.
- **Footer reconstruído**: largura útil aumentada (1180px → 1360px) pra não parecer preso numa faixa estreita, hierarquia dos títulos de coluna reforçada (uppercase + espaçamento). **Nenhum personagem no footer** — a imagem do Capitão Baba Grogue foi removida; o footer agora é uma área puramente estrutural/informativa.
- Texto "é de graça, sem cadastro :)" removido do herói, sem substituição.

### Adicionado

- **Camada de luz atmosférica única** (`.lp-glow`): um só foco de luz suave, na cor do tema ativo (herda `var(--mint)`, muda com os 12 temas), com deriva muito lenta (46s) — profundidade sem repetir o clichê dos "3 blobs neon" de site gerado por IA.
- **Tela de carregamento inicial**: Byte com leve balanço + barra de progresso indeterminada, tema-aware. Some assim que a página termina de carregar ou depois de no máximo ~1.2s (rede de segurança caso algum recurso trave) — nunca prende a navegação. Respeita `prefers-reduced-motion` (sem animação, barra cheia direto).

### Investigado

- Revisitada a dependência de `overflow-x:hidden` (adicionada na v6.0) à luz da recomendação de sempre corrigir a causa raiz de overflow em vez de escondê-la. Investigação aprofundada de um overflow residual de ~104px em páginas de curso: confirmado, via varredura exaustiva de todos os elementos da página, que nenhum elemento visível ultrapassa os limites da tela — o comportamento só aparece quando duas seções grandes (topbar + conteúdo principal) coexistem numa página muito alta, e testes de `flex-wrap`, `justify-content` e `vw` vs. largura de scrollbar não reproduziram nem corrigiram o efeito isoladamente. Tudo aponta pra uma particularidade de cálculo de `scrollWidth` do próprio Chromium em páginas muito altas, não um erro de CSS do projeto. Decisão: manter `overflow-x:hidden` em `html`/`body` como proteção documentada (não como remendo de um problema não investigado).

### Validado

- Playwright em 20 páginas × 7 combinações de tela (320px celular até 1920px monitor, incluindo celular em paisagem): zero rolagem horizontal real, zero erros de JS.
- Conferido visualmente: Byte sem corte em mobile/desktop, footer sem personagens, tela de carregamento em modo normal e com `prefers-reduced-motion`, tema escuro.

---

## [v6.0] — Identidade visual autoral, cursos reimaginados, SEO e privacidade

Reforma de "cara de produto": a landing page deixou de seguir os padrões visuais mais comuns em sites gerados por IA (blob gradiente animado, grid de 3 cards idêntico, tipografia genérica) em favor de uma identidade própria ligada ao motivo já existente do site (`android.log`, `navio.log`...): um diário de bordo.

### Adicionado

- **Sistema tipográfico de 3 fontes**, propagado pelas 21 páginas do site: `Comic Relief` (títulos e texto corrido, substituindo Fredoka/Nunito), `Playwrite US Modern` (citações e anotações "escritas à mão") e `Lilex` (código, comandos e carimbos, substituindo JetBrains Mono).
- **Fundo da landing page reconstruído**: removidos os 3 blobs de gradiente animado (`lp-blob-1/2/3`) — o padrão visual mais reconhecível de site gerado por IA — substituídos por uma carta náutica quadriculada (`.lp-chart-grid`) e um grão de papel sutil (`.lp-grain`), mantendo as bolhas subindo (coerente com o tema náutico).
- **Motivo visual de assinatura**: "anotações de diário de bordo" (`.lp-note`, fonte Playwrite) e carimbos tracejados numerados (`.lp-stamp` / `Diário Nº 0X`), reaproveitados na seção hero, nos cards de curso e nos cabeçalhos de seção.
- **Hero reconstruído**: grid assimétrico (1.28fr/.72fr em vez de quase-simétrico), selo tipo carimbo de cera sobre a arte do navio, nota de bordo ao lado do CTA.
- **Grid de 3 cards "sobre" quebrado de propósito**: cards com leve rotação/deslocamento alternado em vez de grid perfeitamente simétrico (o segundo padrão mais reconhecível de layout gerado automaticamente).
- **Seção de cursos totalmente reimaginada**: cada card agora traz nº de entrada do diário, ~4 bullets de "o que você vai aprender" (extraídos dos módulos reais de cada curso), uma citação do mascote na fonte de bordo, chips de módulos/quizzes/tempo estimado, e integração com o `localStorage` existente pra trocar o CTA de "Entrar no curso" pra "Continuar estudando →" quando já existe progresso salvo.
- **Seção de FAQ nova** (`<details>` nativo, sem JS extra): dúvidas reais sobre conta, armazenamento local, gratuidade, celular e reset de progresso.
- **Revelação suave ao rolar a página** (`IntersectionObserver`, respeitando `prefers-reduced-motion`) nas seções principais e nos cards, mais microinterações de hover/press em botões, cards e mascotes.
- **SEO**: meta description reescrita, `keywords`, Open Graph, Twitter Card, `canonical`, `hreflang` e dados estruturados JSON-LD (`EducationalOrganization` + um `Course` por curso) no `index.html`.
- **Segurança/regulamentação**:
  - `Content-Security-Policy` e `Referrer-Policy` via `<meta>` em todas as 20 páginas HTML (verificado antes: o site não carrega nenhum analytics, pixel ou script de terceiro além de Google Fonts e imagens do Unsplash).
  - `/.well-known/security.txt` (RFC 9116).
  - `robots.txt` e `sitemap.xml` (20 URLs) na raiz.
  - Páginas novas **`privacidade.html`** (política de privacidade com linguagem LGPD) e **`termos.html`** (termos de uso), linkadas no rodapé.
  - Faixa de confiança na landing page ("sem coleta de dados", "progresso 100% local", "sem rastreadores", link pra política de privacidade).

### Corrigido

- A diretiva `frame-ancestors` foi incluída por engano na primeira versão da CSP via `<meta>` — o navegador ignora essa diretiva fora de um header HTTP e acusa um warning no console. Removida de todas as páginas após validação com Playwright.

### Validado

- Todas as páginas alteradas recarregadas com Playwright/Chromium (servidor estático local): zero erros de JS/CSS, zero warnings de CSP. Os únicos itens sinalizados foram requisições de rede pra domínios externos bloqueados pelo sandbox de desenvolvimento (Google Fonts, Unsplash) — esperado nesse ambiente, sem relação com bug real.

---

## [v5.0] — Rebranding, sistema de ícones, navegação simplificada e minigames de diálogo

Reforma completa de identidade visual e navegação, mais uso profundo do elenco de personagens (via `description.json`) em quatro novos minigames narrativos.

### Adicionado

- **Rebranding completo**: "Study Hub" → **Universidade Log** em todo o site (títulos, cabeçalhos, rodapés, meta tags). A chave de `localStorage` foi mantida intacta de propósito, para não zerar o progresso salvo de quem já usava o site.
- **Favicon novo**: ícone próprio (capelo + prompt de terminal `>_log`) em SVG + PNGs (16/32/64/256px) + apple-touch-icon, referenciado em todas as 21 páginas.
- **Sistema de ícones unificado**, substituindo 100% dos emojis do site (mais de 570 ocorrências, ~110 emojis únicos):
  - 107 ícones ilustrados coloridos (estilo OpenMoji, mesmo padrão visual que os ícones que já existiam em `assets/icons/`), salvos em `assets/icons/content/`.
  - 19 ícones monocromáticos desenhados à mão (`fill="currentColor"`), que se adaptam automaticamente aos 12 temas de cor: cadeado, chama de sequência, casa, livro, livro aberto, elo, foguete, balão de quiz, etc.
  - Novo `assets/css/icons.css`, incluído em todas as páginas, com as classes de tamanho (`.om`, `.om-sm/md/lg/xl`, `.ic-mono`).
  - Padronização de ícones que antes variavam por curso sem motivo (ex: cada curso usava um emoji diferente pro prefixo "Quiz rápido" e pro link "projeto prático"; agora usam o mesmo ícone em todos os lugares).
- **Seletor de tema compacto**: as nove grades de 12 bolinhas de cor sempre visíveis (na página inicial, nos 4 cursos principais e nos 4 glossários) viraram um botão único "Tema ▾" que abre um popover compacto. Mesma função, muito menos poluição visual.
- **Quatro minigames de diálogo novos** (`initDialogueGame` em `games.js`), um por curso, com falas escritas especialmente pros personagens de cada um, usando fielmente idade/origem/personalidade de `assets/characters/description.json`:
  - **Android**: Chud (aluno) vs. Gnomo (professor) — ciclo de vida da Activity, ViewBinding, RecyclerView, MVVM.
  - **DevOps**: Capitão Baba Grogue vs. Octocat — commit vs. push, imagem vs. container, Pod vs. Node, Infraestrutura como Código.
  - **IA**: Byte vs. Fly — temperature, top-k vs. top-p, memória/contexto, definição de alucinação.
  - **Trigomante**: Byte Morto vs. Uruk — fórmulas de tangente, identidade fundamental (sen²+cos²=1), sinais por quadrante, razão áurea e o pentagrama pitagórico.

  Cada rodada mostra os dois personagens discordando, o jogador escolhe quem está certo, recebe uma reação em personagem e uma explicação técnica curta. Ao final, desbloqueia a nova conquista **"Bate-papo Concluído"** (`dialogue_master`), integrada ao sistema de badges/toast/confete já existente em `engine.js` — extensão puramente aditiva, sem alterar a lógica de XP ou conquistas já existentes.

- **Seção "A tripulação" da landing page reconstruída**: saiu de 10 personagens (só nome + papel) pra **15 personagens**, organizados em 4 grupos temáticos (Piratas DevOps, Universidade de Log, Terra Fantaccia, Corpo Docente), cada um com uma bio curta baseada fielmente nos traços reais de `description.json` (idade, origem, personalidade).

### Corrigido (bugs pré-existentes, não relacionados ao emoji/rebranding)

- `engine.js` apontava pra `assets/icons/...` sem `../`, quebrando silenciosamente o ícone do toast e os botões de módulo anterior/próximo em todas as páginas de curso.
- O minigame de sequência do DevOps (`seqGameDevops`) estava com o HTML incompleto (faltava `.seq-answer`, cabeçalho e mensagem de vitória), quebrando o JavaScript ao carregar a página.
- `cursos/devops.html` estava sem as tags de fechamento `</body></html>`.
- O glossário de IA (`glossario/ia.html`) tinha um apóstrofo cru dentro do atributo `data-pairs`, colidindo com o delimitador HTML e corrompendo o JSON do jogo da memória (`Unterminated string in JSON`).

### Decisões de design

- Ícones **coloridos** (estilo OpenMoji) foram usados para conteúdo decorativo: cabeçalhos de card, badges, seção de paleta, celebração. Ícones **monocromáticos** foram usados só onde a cor precisa acompanhar o tema ativo: navegação, cadeado, chama de sequência, prefixo de quiz.
- Os minigames de diálogo não concedem XP diretamente (assim como os jogos de memória/sequência já existentes não concediam), pra não desequilibrar a economia de XP já calibrada por checklist/quiz/foco. A recompensa é a conquista dedicada + celebração visual.
- Toda a extensão de `engine.js` foi feita de forma aditiva (novo `id` de conquista, duas novas variáveis globais expostas) — nenhuma lógica existente de XP, streak ou módulo foi alterada.

---

## [v4.0] — Curso de Trigomante: fantasia medieval + Razão Áurea

Quarto curso completo, com temática própria (RPG de fantasia medieval) construído em cima do conteúdo real de trigonometria e proporção áurea fornecido pelo usuário, reaproveitando 100% da engine compartilhada.

### Adicionado

- **Curso completo "Trigomante: A Jornada do Círculo"** (`cursos/trigomante.html`), com 6 módulos temáticos:
  1. O Bosque dos Ângulos (razão, proporção, conversão grau/radiano, ângulos notáveis)
  2. O Círculo de Invocação (circunferência trigonométrica, quadrantes, relação fundamental, arcos côngruos)
  3. A Ordem dos Construtores (Razão Áurea, Fibonacci, retângulo/espiral/pentágono áureos, arquitetura, Sala São Paulo)
  4. O Enigma dos Guardiões do Tempo (movimento periódico/oscilatório, senoide, ângulo dos ponteiros do relógio)
  5. As Batalhas Práticas (Torre de Pisa, teodolito, balão atmosférico, partilha de herança, caçamba basculante)
  6. Salão do Arquimago (revisão geral, minijogos, missão final, conquistas)

  14 quizzes, 6 desafios "encontre a falha no feitiço" (reaproveitando o padrão visual de bug-hunt), 20 itens de checklist, jogo da memória ("Grimório de Termos"), jogo de sequência ("Ritual dos Passos") e **17 conquistas desbloqueáveis**.

- **Sistema de conquistas por sequência de Fibonacci**: novo suporte genérico e opcional em `engine.js` (`window.COURSE.fibStreak`), que desbloqueia selos ao usuário voltar em dias consecutivos seguindo a cadência 1, 2, 3, 5, 8 e 13 dias. Implementado como extensão aditiva: cursos que não definem `fibStreak` continuam funcionando exatamente como antes.
- **Cinco personagens novos**, a partir das imagens reais enviadas pelo usuário: **Mago da Matemática** (guia geral), **Bispo da Trigonometria** (ângulos e círculo), **Lisete** (professora rigorosa), **Uruk, o Titã da Lógica** (antagonista/desafio) e **Byte Morto** (esqueleto de lontra, escudeiro de Uruk — uma versão sombria do Byte do curso de Android). Imagens redimensionadas e otimizadas, salvas em `assets/characters/`.
- **Glossário em formato de grimório** (`glossario/trigomante.html`): mesmo motor de flipbook dos outros 3 cursos, com capa em tom de couro/bronze (para não repetir as cores já usadas por Android/IA/DevOps), **44 termos** catalogados, e jogo da memória próprio com 6 termos espalhados pelo alfabeto.
- **Landing page atualizada**: 4º card de curso, 6 novos chips na seção "tripulação", contadores do topo atualizados (4 cursos, 35 módulos, 4 glossários), grid de cursos ajustado de 3 para 2 colunas (2×2), links cruzados no rodapé e no `localStorage` de nível salvo.
- **Navegação cruzada**: os três cursos existentes (Android, IA, DevOps) ganharam um link "Trocar pro curso de Trigomante" na barra lateral, e o Trigomante linka de volta pra todos eles.

### Decisões de design

- Nenhuma cor de tema global foi alterada: a identidade "medieval" vem do conteúdo, dos personagens e de um pequeno `<style>` local (fonte serifada nos títulos, cartão de "boss reveal" reutilizável) escopado só à página do curso, sem vazar pro resto do site.
- Fotos de ambientação (`hero-photo`) reaproveitam o mesmo banco de imagens Unsplash já usado nos outros 3 cursos (sem link novo, sem risco de imagem quebrada), remapeadas por tema: floresta para o Bosque, lago/reflexo para o Círculo, colinas douradas para a Ordem dos Construtores, céu estrelado para os Guardiões do Tempo.

---

## [v3.0] — Polimento visual e correção de bugs

### Adicionado

- **Header com destaque de seção ativa**: os links de navegação da landing (`sobre`, `cursos`, `paleta`, `tripulação`) agora ganham ícone, hover suave e um efeito de brilho (glow + sheen animado) quando a seção correspondente está visível na tela, via `IntersectionObserver`.
- **Jogos integrados ao glossário**: as 3 páginas de glossário (`glossario/devops.html`, `glossario/android.html`, `glossario/ia.html`) ganharam um jogo da memória logo abaixo do livro, usando 6 termos reais do próprio glossário (selecionados de forma espalhada pelo alfabeto).
- **Footer redesenhado**: onda decorativa no topo, coluna de marca com o mascote Capitão Baba Grogue flutuando (animação sutil), colunas de navegação com ícones, e barra inferior de créditos.
- **Animação de fundo na landing page**: três blobs coloridos (verde, roxo, âmbar) com deriva lenta atrás do conteúdo, mais bolhas subindo em looping, tudo em `position:fixed`, sem prejudicar performance, e respeitando `prefers-reduced-motion`.

### Corrigido

- **Bug crítico de corrupção de texto**: a primeira tentativa de remover travessões (`—`) usou uma expressão regular que não estava limitada a uma única linha, e acabou juntando travessões de partes completamente diferentes do arquivo (ex.: o título "Git" ficou colado com um pedaço de outro módulo, virando `"Git) Controle de Versão..."`). Todos os arquivos-fonte do gerador (`content.py`, `quizdata.py`, `glossary_data.py`, `assemble.py` e os três parciais de `devops-material/projeto/referencias`) precisaram ser restaurados do zero e a correção reaplicada com uma versão seg ura do script, estritamente linha a linha.
- **Segundo bug, mesma tentativa**: a etapa de "limpar espaços duplicados" do script de correção colapsava também a indentação do Python e dos blocos de código YAML/Dockerfile mostrados nas aulas, quebrando a sintaxe. Regra removida do script; a correção final mexe apenas nos espaços colados ao próprio travessão.
- **Jogo da memória do módulo de revisão (DevOps)**: estava usando o formato de dados errado (array de arrays em vez de array de objetos `{term, def}`), o que faria os cards exibirem "undefined". Corrigido para o formato correto, junto com melhorias visuais (contador de tentativas, mensagem de vitória).
- **Travessões residuais em `<title>`**: um padrão comum (`Página — nome.log`) tinha ficado de fora da primeira passada por estar fora da tag `<main>`. Corrigido em todas as páginas do site.
- **Bug pré-existente no site original**: o `<title>` de `ia-material.html` ainda dizia "Aprofundamento — android.log" (nome de curso errado, herdado de cópia anterior). Corrigido para "agente.log" de passagem.

### Alterado

- Todos os travessões (`—`) do site inteiro foram removidos e substituídos por pontuação mais natural (dois-pontos, parênteses ou reescrita da frase), a pedido explícito do usuário. Validado com contagem final de **zero ocorrências** em qualquer HTML, CSS ou JS do projeto.
- Paleta de 12 temas propagada consistentemente para o novo seletor do header da landing page.

---

## [v2.0] — Curso de DevOps, reestruturação e glossários-livro

Sessão de maior volume de trabalho do projeto: pedido para adicionar um curso completo de DevOps, reorganizar a estrutura de arquivos, expandir a paleta de cores, e criar glossários com efeito de livro físico (flipbook).

### Adicionado

- **Curso completo de DevOps** (`cursos/devops.html` + material/projeto/referências), com 11 módulos:
  1. Cultura DevOps & o Framework CAMS
  2. Git — Controle de Versão Distribuído
  3. GitHub — Colaboração & Pull Requests
  4. Infraestrutura como Código (IaC)
  5. Docker — Imagens & Containers
  6. Dockerfile na Prática & Docker Compose
  7. Kubernetes — Pods, ReplicaSets & Deployments
  8. Kubernetes na Prática — kubectl
  9. AWS — Fundamentos de Computação em Nuvem
  10. CI/CD & Projeto Prático
  11. Revisão Geral

  Conteúdo baseado nas fontes reais fornecidas (síntese técnica sobre DevOps, lab de Kubernetes da escola, slides de aula), com 18 quizzes, 8 desafios "encontre o bug", checklist de autoavaliação por módulo, jogo da memória, jogo de sequência (ordenar pipeline de CI/CD), e 16 conquistas desbloqueáveis. Reaproveita 100% a engine de gamificação (XP, níveis, streak, sessão de foco) já existente no site.

- **Landing page nova** (`index.html`): hero com o navio-tripulação como ilustração principal, seção "sobre" explicando a proposta da plataforma, cards dos 3 cursos com nível salvo automaticamente via `localStorage`, vitrine interativa da paleta de cores, e seção da tripulação de personagens.
- **Três mascotes novos**, usando as imagens reais enviadas pelo usuário (com fundo removido):
  - **Capitão Baba Grogue** — guia principal do curso de DevOps.
  - **Octocat** — mascote dos módulos de Git e GitHub.
  - **Ama-zz-on** — mascote do módulo de AWS.
  - A imagem do navio completo (`navio-tripulacao.png`) virou a ilustração hero da landing page.

  _(Nota: numa tentativa anterior, essas imagens não persistiram no upload e o assistente chegou a criar substitutos em SVG vetorial; assim que os PNGs reais chegaram, os SVGs foram removidos e as imagens originais integradas em todos os lugares.)_

- **Glossários em formato de livro** (`glossario/devops.html`, `glossario/android.html`, `glossario/ia.html`): motor de flipbook construído do zero (`assets/css/flipbook.css` + `assets/js/flipbook.js`), com:
  - Capa clicável com o mascote do curso.
  - Duas páginas abertas lado a lado, com sombra de lombada central.
  - Efeito de virada de página em 3D (CSS `rotateY`).
  - Papel com textura sutil, tipografia serifada (Playfair Display para títulos, Lora para definições).
  - Sumário navegável por letra (índice tipo dicionário físico).
  - Busca de termo por texto.
  - Termos extraídos dos cursos reais: **50 termos** de DevOps, **30** de Android, **21** de IA Generativa — nenhum termo inventado.
- **Paleta de cores expandida**: de 5 para **12 temas**, organizados em 6 famílias (neutro, azul, verde, roxo, âmbar, rosa), cada uma com par claro/escuro. Tokens definidos em `theme.css`; seletor atualizado em todas as páginas do site (principal e secundárias).
- **Reestruturação de pastas**: migração de uma estrutura plana para:
  ```
  site/
    index.html
    cursos/       (12 páginas: 3 cursos × 4 páginas cada)
    glossario/    (3 páginas)
    assets/
      css/ js/ characters/ icons/
  ```
  Todos os links internos e caminhos de asset corrigidos e validados (checagem automatizada de 249+ referências locais, zero quebradas).

### Corrigido

- Todos os links cruzados entre as páginas antigas (Android, IA) foram atualizados para os novos nomes de arquivo e caminhos relativos após a reestruturação.
- Contador `totalQuizzes` do curso de DevOps ajustado de 19 para 18 após validação automatizada da contagem real de quizzes no HTML gerado.

---

## [v1.0] — Estado inicial (herdado)

Ponto de partida: site já existente, enviado pelo usuário em formato `.zip`, contendo:

- Dois cursos: **Android** (Kotlin, Jetpack Compose, MVVM) e **IA Generativa Aplicada** (prompt engineering, LangGraph, agentes, guardrails).
- Engine de gamificação compartilhada (`engine.js`): XP, níveis, sistema de conquistas, streak de estudo, sessão de foco (pomodoro), tema claro/escuro/colorido (5 temas).
- Estrutura de trilha visual em zigue-zague (`path-nav`) com módulos numerados.
- Minijogos: jogo da memória e jogo de sequência (`games.js`).
- 7 personagens mascotes originais (Byte, Chud, Fly, Gnome, Jade, Laura, Moss).
- Estrutura de arquivos plana (sem pasta `cursos/`, `glossario/` ou landing page dedicada — `index.html` era diretamente o curso de Android).

---

## Notas de processo

- Duas rodadas de upload de imagem foram necessárias: a primeira tentativa de anexar as imagens dos personagens (Baba Grogue, Octocat, Ama-zz-on, navio) e os arquivos-fonte do site (`.zip`, `AGAWS.md`) não persistiu no sistema de arquivos do assistente; o usuário reenviou os arquivos e o trabalho prosseguiu normalmente a partir daí.
- Todo o conteúdo técnico do curso de DevOps foi extraído e sintetizado a partir de fontes reais fornecidas pelo usuário (documento de síntese técnica sobre DevOps/Git/Docker, PDF de laboratório de Kubernetes, slides de aula) — nenhum comando, conceito ou definição técnica foi inventado.
- Este arquivo é mantido manualmente a cada rodada de mudanças relevantes no projeto.

### Fixed
- **UI:** Tela de carregamento totalmente reformulada para ocupar exatamente 100% da tela (sem bordas extras) e com trava explícita de rolagem (scroll) para evitar quebras visuais em telas menores ou dispositivos móveis.
