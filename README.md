<div align="center">
  <img src="assets/icons/brand/logo-lockup.svg" alt="Universidade Log Logo" width="300" />

  # Universidade Log

  **Plataforma de estudo 100% gratuita, gamificada e sem servidor.** <br/>
  *Aprenda IA Generativa, Android (Kotlin), DevOps e Trigonometria no seu ritmo.*

  [![Status](https://img.shields.io/badge/Status-Online-success?style=for-the-badge&logo=vercel)](https://universidade-log.vercel.app/)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](#)

  [Acesse o Projeto Online](https://universidade-log.vercel.app/) • [Relatar um Bug](.github/ISSUE_TEMPLATE/bug_report.md) • [Solicitar Funcionalidade](.github/ISSUE_TEMPLATE/feature_request.md)
</div>

<br/>

## 📖 Sobre o Projeto

**Universidade Log** é uma plataforma educacional inovadora que opera de forma totalmente estática. Sem a necessidade de banco de dados, servidores ou criação de contas, a plataforma oferece uma experiência de aprendizado gamificada e rica em conteúdo diretamente no navegador. 

Todo o seu progresso, XP e conquistas são salvos localmente utilizando o `localStorage`, garantindo total privacidade e uma experiência fluida.

### ✨ Principais Funcionalidades

- 🎮 **Gamificação Completa**: Ganhe XP, desbloqueie conquistas e mantenha seu *streak* diário.
- 📚 **Cursos Profundos**: Trilhas visuais para IA Generativa, Android (Kotlin), DevOps (Docker/K8s) e Trigonometria.
- 🧩 **Minigames Educativos**: Reforce seu conhecimento jogando diretamente no site.
- 📖 **Glossários Dinâmicos**: Material de apoio em formato de "flipbook" 3D para cada disciplina.
- 🎨 **Alta Customização**: 13 temas de cores incríveis para personalizar sua área de estudo.
- ♿ **Acessibilidade de Primeira**: Modos para daltonismo, aumento de fonte nativo e navegação 100% via teclado.

---

## 🛠️ Tecnologias Utilizadas

Este projeto desafia a tendência moderna de frameworks pesados, optando por um ecossistema **100% Vanilla**:

*   **HTML5** Semântico
*   **CSS3** (Variáveis nativas, Flexbox, Grid, Animações Avançadas)
*   **JavaScript Puro (Vanilla JS)**
*   Armazenamento: `localStorage` e `sessionStorage`
*   Hospedagem Recomendada: [Vercel](https://vercel.com)

---

## 🚀 Como Executar Localmente

Sendo uma aplicação puramente estática baseada na web moderna, tudo o que você precisa é de um servidor HTTP simples para evitar bloqueios de CORS ao importar módulos locais (o protocolo `file://` não suporta algumas APIs web usadas no projeto).

### Pré-requisitos
Qualquer servidor HTTP servirá. Exemplos: Python, Node.js, PHP, etc.

### Passos
1. Clone este repositório:
   ```bash
   git clone https://github.com/LucasEntweihen/Universidade-Log.git
   cd Universidade-Log
   ```
2. Inicie o servidor local:
   ```bash
   # Usando Python (já instalado no Mac/Linux e maioria do Windows)
   python -m http.server 8080

   # OU Usando Node.js / npx
   npx serve .
   ```
3. Abra seu navegador em: `http://localhost:8080`

---

## 📦 Build de Produção (Opcional)

A plataforma roda direto do código-fonte. No entanto, para produção (hospedagem), você pode optar por gerar uma build minificada que reduz o tamanho dos arquivos e acelera o carregamento.

```bash
npm install
npm run build
```
O código otimizado será gerado na pasta `/dist`. Basta apontar sua hospedagem (Vercel, Netlify, GitHub Pages) para publicar esta pasta.

---

## 📁 Estrutura de Diretórios

O projeto é organizado de forma modular e lógica:

```text
├── index.html                 # Landing page e entrada principal
├── cursos.html                # Hub com todos os cursos disponíveis
├── cursos/                    # Páginas e trilhas específicas por matéria
├── glossario/                 # Dicionários interativos de termos
├── assets/
│   ├── css/                   # Folhas de estilo modulares (temas, UI, fx)
│   ├── js/                    # Lógica da engine, games, acessibilidade
│   ├── icons/                 # Ícones SVGs e OpenMoji da interface
│   └── characters/            # Arte de personagens (.png) + meta dados (.json)
├── .github/                   # Templates para Issues e Pull Requests
├── build.js                   # Script de minificação e deploy de produção
└── package.json               # Dependências de desenvolvimento (Build/Format)
```

---

## 🤝 Como Contribuir

Contribuições tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/NovaFeature`)
3. Faça o Commit de suas mudanças (`git commit -m 'Add: Nova feature incrível'`)
4. Faça o Push para a Branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request utilizando o nosso [Template padrão](.github/PULL_REQUEST_TEMPLATE.md)

Leia nossos guias de contribuição nas [Issues Abertas](https://github.com/LucasEntweihen/Universidade-Log/issues) para entender como relatar bugs ou sugerir ideias.

---

## 📄 Licença

Distribuído sob licença própria. Veja o arquivo `LICENSE` para mais informações.

<div align="center">
  <br/>
  Feito com ❤️ pela Universidade Log
</div>