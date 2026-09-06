# Universidade Log

Plataforma de estudo gamificada, 100% estática (HTML/CSS/JS puro, sem
framework, sem backend) — cursos de IA Generativa, Android (Kotlin),
DevOps e Trigonometria, cada um com trilha visual, XP, conquistas,
minigames e glossário. Todo o progresso é salvo no `localStorage` do
navegador; não há conta, servidor nem banco de dados.

## Rodando localmente

Como é só HTML/CSS/JS estático, basta servir a pasta com qualquer
servidor local — não pode ser aberto com `file://` direto no navegador
porque o `fetch`/`localStorage` e os módulos JS exigem um servidor
(`http://`). Duas opções simples:

```bash
# Python (já vem instalado na maioria dos sistemas)
python3 -m http.server 8080

# ou, com Node instalado
npx serve .
```

Depois abra `http://localhost:8080`.

## Estrutura do projeto

```
index.html            → landing page
cursos.html           → página com os 4 cursos
cursos/               → hub de cada curso (aside com trilha de módulos)
  <curso>.html         → página-sede do curso (ex.: android.html)
  <curso>-material.html      → aprofundamento por módulo
  <curso>-projeto.html       → projeto prático
  <curso>-referencias.html   → referências
  <curso>-diario.html        → diário (DevOps)
glossario/<curso>.html → glossário-livro (flipbook) de cada curso
404.html, 403.html, 500.html, offline.html → páginas de erro/estado
assets/
  css/     → folhas de estilo (theme.css tem as variáveis de cor/fonte
             dos 13 temas; icons.css tem os popovers e ícones; as
             demais são por funcionalidade — games, flipbook, etc.)
  js/      → engine.js (XP/streak/conquistas), games.js (minigames),
             chrome-widgets.js (seletor de tema + painel de
             acessibilidade — fonte única usada por toda página),
             theme-picker.js, accessibility.js, calculator.js,
             flipbook.js
  icons/   → ui/ (ícones funcionais simples) e content/ (ilustrações
             coloridas estilo OpenMoji, uso decorativo)
  characters/ → arte + description.json dos personagens
CHANGELOG.md → histórico detalhado de cada versão
```

## Build de produção (opcional)

O site funciona perfeitamente sem build — é só abrir/publicar os
arquivos como estão. Existe um passo de build **opcional** que gera
uma cópia minificada (CSS/JS/HTML) em `dist/`, útil só se quiser
economizar banda em produção:

```bash
npm install
npm run build
```

Isso não muda nome de nenhum arquivo (então nenhum link quebra) e não
remove nenhuma funcionalidade — só espaços em branco, comentários e
formatação. `dist/` não é versionado (está no `.gitignore`); gere de
novo sempre que precisar, a partir do código-fonte normal.

## Documentação

Todo o histórico de mudanças, decisões e correções fica em
[`CHANGELOG.md`](./CHANGELOG.md), incluindo a causa raiz de bugs
corrigidos — vale a leitura antes de mexer em algo que já existe.
