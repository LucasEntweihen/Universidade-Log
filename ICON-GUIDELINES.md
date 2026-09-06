# Guia de ícones — Universidade Log

Este documento existe porque o pedido de "padronizar os ícones" só é
possível de cumprir de verdade depois de mapear o que já existe. O
projeto tem **duas famílias de ícone**, cada uma com seu propósito —
misturar as duas não é o problema; o problema era a família funcional
não ser consistente dentro dela mesma. É isso que este guia fixa.

## As duas famílias

### 1. `.om` — ilustrações decorativas (estilo OpenMoji)
- **72×72**, multi-path, multi-cor.
- Uso: conteúdo, texto corrido, cards de personagem, celebração de
  conquista — lugares onde a ilustração É o conteúdo, não um rótulo
  funcional de botão/ação.
- Tamanhos via classe: `.om-xs`, `.om-sm`, `.om` (padrão), `.om-lg`.
- **Regra de simplicidade**: se o ícone só aparece pequeno (dentro de
  texto, ao lado de um link), ele precisa ser reconhecível em ~20px.
  `ship.svg` e `whale.svg` foram redesenhados nesta rodada seguindo
  essa regra — de ~30-40 paths multi-tom para 3-5 paths, 2 cores. Use
  o mesmo critério ao revisar os ~140 ícones restantes desta pasta:
  se um ícone precisar de mais de 6-8 paths pra ser reconhecível, ele
  provavelmente está detalhado demais pro tamanho em que é usado.

### 2. `.ic-mono` — ícones funcionais (botões, navegação, status)
- **24×24**, `fill="currentColor"` (herda a cor do texto ao redor),
  path sólido — é o estilo dominante hoje: **315 ocorrências** inline
  no HTML contra **3** ícones de traço/contorno (`stroke`) e **0**
  ícones referenciados da pasta `assets/icons/ui/` (ver abaixo).
- Tom secundário (sombra/profundidade) via `opacity:.5–.8` numa
  segunda `<path>`, não uma segunda cor — é assim que o site já cria
  a sensação de profundidade num ícone de cor única. Mantenha esse
  padrão em vez de introduzir gradientes ou uma segunda cor sólida.
- As 3 exceções em traço (`stroke`, sem preenchimento) ficam nos
  botões de navegação do mockup de celular (`.phone-chrome-top`) do
  curso de Android — **isso é intencional**: imitam os ícones de
  gesto/navegação reais do Android (que são traço fino), então não
  foram convertidos para o padrão sólido.
- Tamanhos via classe: `.ic-mono.sm`, `.ic-mono` (padrão), `.ic-mono.lg`.

## Achado: a pasta `assets/icons/ui/`

19 arquivos SVG (`home.svg`, `lock.svg`, `close.svg` etc.) — **zero
referências a eles em qualquer HTML do projeto**. Todo ícone
funcional do site hoje é colado inline (por isso as 315 ocorrências
de `fill="currentColor"` espalhadas pelas páginas, muitas vezes o
_mesmo_ path repetido dezenas de vezes). Essa pasta parece ter sido o
começo de uma biblioteca de componentes de ícone que nunca chegou a
ser adotada.

Ela não foi apagada porque **é exatamente a base que falta** pro
pedido de "biblioteca consistente de ícones" — ela só precisa
começar a ser referenciada em vez de recopiada. Isso é trabalho pra
próxima fase (ver `CHANGELOG.md`, item de dívida técnica), porque
significa revisar ~315 ocorrências espalhadas por 25 páginas — não é
algo pra fazer com segurança no meio de uma correção de bug.

## Tokens de cor (`assets/css/icons.css`)

```css
--icon-primary   /* = var(--text) — cor padrão, é o que já acontecia
                     por herança de currentColor; existe como token
                     nomeado pra ficar explícito, não muda nada visualmente */
--icon-secondary /* = var(--text-dim) — ícone de apoio/legenda */
--icon-muted     /* = var(--line) — ícone desabilitado/inativo */
--icon-accent    /* = var(--mint-dim) — destaque semântico */
```

Aplicados via classe **opt-in** (`.ic-mono.ic-muted`, `.ic-mono.ic-secondary`, `.ic-mono.ic-accent`)
— de propósito, sem tocar no `.ic-mono` base. Um ícone dentro de um
botão colorido (ex.: `.lp-btn.primary`) já herda a cor certa via
`currentColor`; um token de cor fixo no `.ic-mono` base quebraria essa
herança nos ~315 usos existentes. Os tokens ficam disponíveis pra quem
quiser uma cor deliberadamente diferente da herdada — não substituem
a herança, complementam.
