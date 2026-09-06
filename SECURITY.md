# Segurança — Universidade Log

Este arquivo documenta o que foi feito e, tão importante quanto, **o
que não tem como ser feito** num site 100% estático. Prometo isso ao
Lucas: nenhuma "proteção" aqui é teatro — cada item é real ou está
marcado como limitação honesta.

## O que está em vigor

- **Cabeçalhos de segurança** (`netlify.toml`/`vercel.json`):
  `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  `Permissions-Policy` restritiva (sem câmera/microfone/geolocalização).
- **HSTS**: não declarado manualmente de propósito — Netlify e Vercel
  já adicionam esse cabeçalho automaticamente, e declará-lo nos dois
  gera cabeçalho duplicado (inválido, e quebra elegibilidade pra lista
  de preload do HSTS). Ver comentários em cada arquivo de config.
- **Content-Security-Policy**, aplicada via `<meta>` em toda página:
  `default-src 'self'` mais só o necessário liberado (fontes do
  Google Fonts, imagens do Unsplash), e agora também
  `object-src 'none'` (bloqueia plugins tipo Flash/Java, sem uso
  algum aqui), `frame-ancestors 'none'` (equivalente moderno do
  X-Frame-Options, impede embutir o site num iframe alheio) e
  `upgrade-insecure-requests`.
- **Nenhum segredo no repositório**: sem chave de API, token ou
  credencial versionada — confirmado por busca no projeto inteiro.
  Faz sentido: é um site estático sem backend, não há o que vazar
  desse tipo.
- **`.gitignore`** cobre `node_modules/` e `dist/` (build), evitando
  versionar artefatos gerados.
- **`LICENSE.md`**: deixa claro que o conteúdo é autoral — a proteção
  real contra "cópia" de conteúdo original é legal (direito autoral),
  não técnica.

## Limitações honestas (isso NÃO tem solução técnica real)

### "Esconder" o código-fonte

Não existe. Um navegador só consegue exibir a página porque baixou o
HTML/CSS/JS inteiro — `Ver código-fonte` sempre vai mostrar algo, em
qualquer site do mundo, não só neste. Minificação (já existe via
`npm run build`) dificulta a _leitura_, não impede o _acesso_. Se
algum dia alguém sugerir "desabilitar botão direito" ou bloquear F12:
não recomendo — é trivialmente contornável (a pessoa abre o DevTools
pelo menu, ou só digita `view-source:` na barra de endereço) e
**atrapalha gente de verdade**, incluindo quem usa leitor de tela ou
personaliza a página por acessibilidade. Isso é considerado má
prática pela comunidade de segurança, não uma proteção.

### `'unsafe-inline'` no `script-src` da CSP

A CSP atual permite scripts inline (`'unsafe-inline'`) porque o site
inteiro depende de `onclick="..."` direto no HTML (centenas de
ocorrências) e de blocos `<script>` inline no `<head>` de cada
página. Tirar `'unsafe-inline'` é a melhoria de segurança mais
significativa ainda disponível — reduziria bastante o risco de XSS —
mas exige migrar todo `onclick` pra `addEventListener` em JS externo
e trocar os `<script>` inline por nonce/hash. É uma refatoração
grande o suficiente pra não fazer no meio de outras mudanças sem
confirmar com você antes: quer que eu avalie esse trabalho
separadamente?

### Subresource Integrity (SRI) nas fontes do Google

Pesquisei antes de tentar implementar: **não dá pra usar SRI com
Google Fonts**. O Google retorna um CSS diferente pra cada
navegador (formatos de fonte distintos por user-agent), então o
conteúdo — e portanto o hash — muda de visitante pra visitante. Um
hash fixo quebraria as fontes pra parte dos usuários. Isso é uma
limitação conhecida e documentada do próprio Google Fonts (não é
falta de configuração), e por isso ferramentas de automação de SRI
excluem Google Fonts da lista por padrão.

## Dívida técnica de segurança (não crítica, registrada)

- 🔵 A CSP é repetida via `<meta>` em 29 arquivos em vez de vir de um
  lugar só — funciona, mas se precisar mudar a política um dia, é
  editar 29 arquivos (ou rodar um script, como fiz aqui pra reforçar
  a política desta vez). Centralizar isso só é possível de verdade
  via cabeçalho HTTP real do host (`netlify.toml`/`vercel.json`), não
  via `<meta>` — migrar pra lá removeria a duplicação, mas muda onde
  a política "mora" e vale confirmar com você antes.
