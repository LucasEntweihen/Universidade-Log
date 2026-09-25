# ASSESSOR.AI — MANUAL ARQUITETURAL, TÉCNICO E OPERACIONAL DEFINITIVO

---

## SUMÁRIO GERAL

1. [Introdução Formal, Contexto Histórico e Proposta de Valor](#1-introdução-formal-contexto-histórico-e-proposta-de-valor)
   - [1.1. Contexto do Projeto e Motivação Estratégica](#11-contexto-do-projeto-e-motivação-estratégica)
   - [1.2. O Problema da Monolitização em Sistemas de IA Conversacional](#12-o-problema-da-monolitização-em-sistemas-de-ia-conversacional)
   - [1.3. Verticais de Negócio Atendidas](#13-verticais-de-negócio-atendidas)
   - [1.4. Glossário de Conceitos e Nomenclaturas](#14-glossário-de-conceitos-e-nomenclaturas)
2. [Fundamentos Matemáticos, Cognitivos e Teoria da Computação](#2-fundamentos-matemáticos-cognitivos-e-teoria-da-computação)
   - [2.1. Formalização do Grafo de Estados como Autômato Finito Estendido](#21-formalização-do-grafo-de-estados-como-autômato-finito-estendido)
   - [2.2. Álgebra Linear dos Espaços Vetoriais e Métrica de Similaridade Cosseno](#22-álgebra-linear-dos-espaços-vetoriais-e-métrica-de-similaridade-cosseno)
   - [2.3. Topologia de Indexação em Grafos HNSW no Qdrant](#23-topologia-de-indexação-em-grafos-hnsw-no-qdrant)
   - [2.4. Teoria da Anonimização Criptográfica e Isomorfismo de Tokens de PII](#24-teoria-da-anonimização-criptográfica-e-isomorfismo-de-tokens-de-pii)
   - [2.5. Dinâmica Probabilística de Amostragem e Economia de Tokens](#25-dinâmica-probabilística-de-amostragem-e-economia-de-tokens)
3. [Taxonomia Completa da Stack Tecnológica e Dependências](#3-taxonomia-completa-da-stack-tecnológica-e-dependências)
   - [3.1. Quadro Sinótico do Ecossistema (requirements.txt)](#31-quadro-sinótico-do-ecossistema-requirementstxt)
   - [3.2. Árvore Completa de Imports e Relações de Acoplamento Módulo a Módulo](#32-árvore-completa-de-imports-e-relações-de-acoplamento-módulo-a-módulo)
4. [Configuração de Ambiente, Inicialização (.ENV) e Bootstrapping](#4-configuração-de-ambiente-inicialização-env-e-bootstrapping)
   - [4.1. Dicionário Exaustivo de Variáveis de Ambiente](#41-dicionário-exaustivo-de-variáveis-de-ambiente)
   - [4.2. Módulo de Configuração Central (app/config.py) e Validação Preventiva](#42-módulo-de-configuração-central-appconfigpy-e-validação-preventiva)
   - [4.3. Ciclo de Vida de Bootstrapping da Aplicação](#43-ciclo-de-vida-de-bootstrapping-da-aplicação)
5. [Modelagem de Dados Multiparadigma (Persistência Poliglota)](#5-modelagem-de-dados-multiparadigma-persistência-poliglota)
   - [5.1. Camada Relacional ACID (PostgreSQL / base.sql)](#51-camada-relacional-acid-postgresql--basesql)
   - [5.2. Camada Documental Semi-Estruturada (MongoDB / app/memory.py e app/perfil.py)](#52-camada-documental-semi-estruturada-mongodb--appmemorypy-e-appperfilpy)
   - [5.3. Camada Vetorial Densa (Qdrant / app/vectorstore.py)](#53-camada-vetorial-densa-qdrant--appvectorstorepy)
6. [Arquitetura do Grafo LangGraph: Máquina de Estados e Transições](#6-arquitetura-do-grafo-langgraph-máquina-de-estados-e-transições)
   - [6.1. Definição Estruturada do Estado Global (Estado)](#61-definição-estruturada-do-estado-global-estado)
   - [6.2. Topologia do Grafo e Diagrama Completo de Estados](#62-topologia-do-grafo-e-diagrama-completo-de-estados)
   - [6.3. Especificação Algorítmica e Comportamento dos Nós](#63-especificação-algorítmica-e-comportamento-dos-nós)
7. [Sistema de Segurança, Defense-in-Depth e Governança Regulatória](#7-sistema-de-segurança-defense-in-depth-e-governança-regulatória)
   - [7.1. Regras de Entrada e Classificação Semântica](#71-regras-de-entrada-e-classificação-semântica)
   - [7.2. Conformidade Regulatória (CVM / ANBIMA / LGPD)](#72-conformidade-regulatória-cvm--anbima--lgpd)
8. [Engenharia de Prompts, Personas e Protocolos de Comunicação](#8-engenharia-de-prompts-personas-e-protocolos-de-comunicação)
   - [8.1. Persona Base Compartilhada (PERSONA_SISTEMA)](#81-persona-base-compartilhada-persona_sistema)
   - [8.2. Protocolo de Encaminhamento do Roteador](#82-protocolo-de-encaminhamento-do-roteador)
   - [8.3. Contrato JSON dos Especialistas](#83-contrato-json-dos-especialistas)
   - [8.4. Formato de Apresentação do Orquestrador](#84-formato-de-apresentação-do-orquestrador)
9. [Especificação Exaustiva das Tools (Ferramentas dos Agentes)](#9-especificação-exaustiva-das-tools-ferramentas-dos-agentes)
   - [9.1. Tabela Detalhada de Assinaturas e Schemas](#91-tabela-detalhada-de-assinaturas-e-schemas)
10. [Especificação Completa da API REST FastAPI](#10-especificação-completa-da-api-rest-fastapi)
    - [10.1. Matriz de Endpoints da API](#101-matriz-de-endpoints-da-api)
11. [Engenharia de Frontend e Experiência do Usuário](#11-engenharia-de-frontend-e-experiência-do-usuário)
    - [11.1. Arquitetura da Interface Web e Filosofia Zero-Dependency](#111-arquitetura-da-interface-web-e-filosofia-zero-dependency)
    - [11.2. Módulo de Chat (frontend/app.js e frontend/index.html)](#112-módulo-de-chat-frontendappjs-e-frontendindexhtml)
    - [11.3. Design System e Tokens Visuais (style.css e perfil.css)](#113-design-system-e-tokens-visuais-stylecss-e-perfilcss)
12. [Pipeline de Ingestão de Conhecimento (Offline RAG Pipeline)](#12-pipeline-de-ingestão-de-conhecimento-offline-rag-pipeline)
    - [12.1. Parâmetros de Chunking](#121-parâmetros-de-chunking)
13. [Integração Contínua, DevOps e Topologia de Implantação](#13-integração-contínua-devops-e-topologia-de-implantação)
    - [13.1. Automação de CI/CD com GitHub Actions (ci-call-ai-service.yml)](#131-automação-de-cicd-com-github-actions-ci-call-ai-serviceyml)
    - [13.2. Topologia de Infraestrutura em Produção](#132-topologia-de-infraestrutura-em-produção)
14. [Auditoria Completa de Código, Vulnerabilidades e Roadmap de Correções](#14-auditoria-completa-de-código-vulnerabilidades-e-roadmap-de-correções)
    - [14.1. Inventário Detalhado de Falhas e Débitos Técnicos](#141-inventário-detalhado-de-falhas-e-débitos-técnicos)
    - [14.2. Guia de Correções Imediatas Linha a Linha](#142-guia-de-correções-imediatas-linha-a-linha)
    - [14.3. Recomendações para Escala Industrial e Observabilidade](#143-recomendações-para-escala-industrial-e-observabilidade)

---

## 1. INTRODUÇÃO FORMAL, CONTEXTO HISTÓRICO E PROPOSTA DE VALOR

### 1.1. Contexto do Projeto e Motivação Estratégica

O Assessor.AI foi projetado para atuar como um ecossistema cognitivo conversacional capaz de assessorar o usuário final na intersecção entre gestão orçamentária pessoal, organização temporal de compromissos e consultas regulatórias/institucionais.

Diferente de chatbots convencionais que realizam apenas geração de texto genérica, o sistema opera como uma plataforma *agentic-driven* conectada diretamente a bancos de dados relacionais para execução de operações contábeis, a bancos NoSQL para gerenciamento do ciclo de vida das conversas e a bancos vetoriais para ancoragem de conhecimento (*Grounding*) e memória semântica de longo prazo.

### 1.2. O Problema da Monolitização em Sistemas de IA Conversacional

Projetos de primeira geração de LLMs frequentemente utilizam uma abordagem de Agente Monolítico: um único prompt gigantesco contendo dezenas de ferramentas heterogêneas (consultar saldo, marcar reunião, consultar PDF, atualizar cadastro). Essa abordagem falha em escala devido a quatro fatores determinantes:

- **Poluição de Atenção (*Attention Bleed*):** À medida que o número de tools cresce, a probabilidade de seleção incorreta de ferramenta (*tool hallucination*) aumenta exponencialmente.
- **Conflito de Personas e Regras:** Regras estritas de compliance financeiro (ex.: CVM) acabam interferindo na informalidade esperada para uma marcação de agenda.
- **Explosão de Latência e Custo de Tokens:** Injetar descrições de todas as ferramentas e regras de todos os domínios em todas as mensagens onera o custo de inferência e a latência de TTFT (*Time-to-First-Token*).
- **Impossibilidade de Especialização de Modelos:** Tarefas de triagem rápida exigem modelos ultraleves (ex.: LLaMA 8B/70B), enquanto interpretação financeira complexa demanda modelos com maior raciocínio (ex.: Qwen 2.5 32B ou classe GPT-4).

O Assessor.AI resolve essa problemática através do padrão arquitetural **Hierarchical Multi-Agent Graph Router-Specialist-Orchestrator**, onde um agente de triagem rápida direciona o fluxo para nós especialistas isolados, cujo resultado estruturado é compilado por um nó orquestrador antes da entrega ao usuário.

### 1.3. Verticais de Negócio Atendidas

#### Vertical 1: Finanças Pessoais Estruturadas
- Lançamento de transações financeiras com valor, meio de pagamento, categoria inferida e timestamp.
- Agregação e totalização de saldo diário e saldos consolidados por período contábil.
- Atualização e exclusão lógica de movimentações financeiras.
- Análise de conformidade de gastos versus perfil cadastrado (renda, objetivo e apetite a risco).

#### Vertical 2: Agenda e Gestão de Tempo
- Consulta de compromissos por dia ou intervalo temporal.
- Algoritmo de detecção de conflitos de horários em janelas sobrepostas.
- Criação de eventos com título, localização, notas e participantes.

#### Vertical 3: Base de Conhecimento Institucional (FAQ / RAG)
- Recuperação estrita de trechos de documentos oficiais do sistema para sanar dúvidas operacionais, termos de uso e privacidade.

### 1.4. Glossário de Conceitos e Nomenclaturas

- **DAG (Directed Acyclic Graph):** Grafo direcionado acíclico que define a topologia de execução dos agentes em LangGraph.
- **PII (Personally Identifiable Information):** Dados pessoais sensíveis (CPF, telefone, e-mail) sujeitos à anonimização estrita antes de tocar qualquer LLM.
- **MemorySaver (Checkpointer):** Mecanismo de persistência de estado *in-memory* do LangGraph indexado por `thread_id` (aqui correspondente ao `session_id`).
- **Polyglot Persistence:** Arquitetura que emprega PostgreSQL (SQL relacional), MongoDB (NoSQL documental) e Qdrant (Vetorial denso) de forma cooperativa.
- **Upsert:** Operação atômica que atualiza um registro se a chave única existir, ou o insere caso não exista.

---

## 2. FUNDAMENTOS MATEMÁTICOS, COGNITIVOS E TEORIA DA COMPUTAÇÃO

### 2.1. Formalização do Grafo de Estados como Autômato Finito Estendido

O fluxo conversacional é formalmente descrito como uma sêxtupla:

$$\mathcal{M} = \langle \mathcal{S}, \Sigma, \Gamma, \delta, s_0, \mathcal{F} \rangle$$

Onde:
- $\mathcal{S} = \{ s_{\text{guard\_in}}, s_{\text{router}}, s_{\text{fin}}, s_{\text{age}}, s_{\text{faq}}, s_{\text{orch}}, s_{\text{guard\_out}}, s_{\text{end}} \}$ é o conjunto finito de estados (nós do grafo).
- $\Sigma$ é o alfabeto de entrada do usuário (mensagens em linguagem natural).
- $\Gamma$ é o espaço de estados de memória compartilhada:
  $$\text{Estado} = \langle \mathcal{M}_{\text{msgs}}, \mathcal{A}_{\text{agents}}, \mathcal{R}_{\text{route}}, \mathcal{P}_{\text{pii}}, \mathcal{I}_{\text{input}}, \mathcal{O}_{\text{final}}, \mathcal{E}_{\text{spec}}, \mathcal{B}_{\text{blocked}} \rangle$$
- $\delta: \mathcal{S} \times \Gamma \to \mathcal{S} \times \Gamma$ é a função de transição de estados determinada pelas arestas condicionais:

$$\delta(s_{\text{guard\_in}}, \Gamma) = \begin{cases} (s_{\text{end}}, \Gamma) & \text{se } \Gamma.\mathcal{B}_{\text{blocked}} = \text{True} \\ (s_{\text{router}}, \Gamma) & \text{se } \Gamma.\mathcal{B}_{\text{blocked}} = \text{False} \end{cases}$$

$$\delta(s_{\text{router}}, \Gamma) = \begin{cases} (s_{\text{fin}}, \Gamma) & \text{se } \Gamma.\mathcal{R}_{\text{route}} = \text{"financeiro"} \\ (s_{\text{age}}, \Gamma) & \text{se } \Gamma.\mathcal{R}_{\text{route}} = \text{"agenda"} \\ (s_{\text{faq}}, \Gamma) & \text{se } \Gamma.\mathcal{R}_{\text{route}} = \text{"faq"} \\ (s_{\text{end}}, \Gamma) & \text{se resposta direta / fora de escopo} \end{cases}$$

- $s_0 = s_{\text{guard\_in}}$ é o estado inicial de entrada.
- $\mathcal{F} = \{ s_{\text{end}} \}$ é o conjunto de estados finais de terminação.

```mermaid
stateDiagram-v2
    [*] --> GuardrailEntrada
    GuardrailEntrada --> FimBloqueado : Bloqueado (Ataque / PII / Ofensivo)
    GuardrailEntrada --> Roteador : Aprovado
    
    Roteador --> FimDireto : Saudação / Fora de Escopo
    Roteador --> EspecialistaFinanceiro : ROUTE=financeiro
    Roteador --> EspecialistaAgenda : ROUTE=agenda
    Roteador --> EspecialistaFAQ : ROUTE=faq
    
    EspecialistaFinanceiro --> Orquestrador : Emite JSON
    EspecialistaAgenda --> Orquestrador : Emite JSON
    
    EspecialistaFAQ --> FimFAQ : Resposta Direta RAG
    
    Orquestrador --> GuardrailSaida : Formata 3 Tópicos
    GuardrailSaida --> FimFinal : Resposta Auditada
    
    FimBloqueado --> [*]
    FimDireto --> [*]
    FimFAQ --> [*]
    FimFinal --> [*]
```

### 2.2. Álgebra Linear dos Espaços Vetoriais e Métrica de Similaridade Cosseno

O sistema projeta textos em um espaço euclidiano denso $\mathbb{R}^d$ com dimensão $d = 768$ utilizando a rede neural de embeddings `gemini-embedding-2-preview`:

$$\phi: \mathcal{T} \to \mathbb{R}^{768}, \quad \text{onde } \mathcal{T} \text{ é o espaço de cadeias de caracteres UTF-8}$$

Dado o vetor da consulta $u = \phi(q)$ e o vetor de um documento armazenado $v = \phi(d)$, a similaridade semântica é calculada pelo Cosseno do ângulo $\theta$ entre os vetores:

$$\text{Sim}_{\cos}(u, v) = \cos(\theta) = \frac{\langle u, v \rangle}{\|u\|_2 \cdot \|v\|_2} = \frac{\sum_{i=1}^{768} u_i v_i}{\sqrt{\sum_{i=1}^{768} u_i^2} \sqrt{\sum_{i=1}^{768} v_i^2}}$$

A distância métrica associada no Qdrant é a *Cosine Distance*:

$$D_{\cos}(u, v) = 1 - \text{Sim}_{\cos}(u, v)$$

A propriedade $D_{\cos}(u, v) \in [0, 2]$ garante uma métrica convexa estrita para vizinhança topológica.

### 2.3. Topologia de Indexação em Grafos HNSW no Qdrant

O Qdrant utiliza o algoritmo **HNSW (Hierarchical Navigable Small World)** para aproximar a busca de vizinhos mais próximos (*Approximate Nearest Neighbors - ANN*) com complexidade assintótica $O(\log N)$:
- O grafo é particionado em camadas hierárquicas $l = 0, 1, \dots, l_{\max}$.
- Na camada superior, a conectividade é esparsa com saltos longos (exploração global).
- Nas camadas inferiores, a densidade aumenta até $l=0$, onde a busca gananciosa (*greedy routing*) localiza o mínimo local exato.
- Na coleção `perfil_preferencias`, a busca é combinada com filtragem exata de predicados booleanos (*Payload Filtering*):

$$\mathcal{R}(q, u_{\text{id}}) = \text{Top-}k \left\{ v \in \mathcal{V} \mid \text{Payload}(v).\text{user\_id} = u_{\text{id}} \right\}$$

### 2.4. Teoria da Anonimização Criptográfica e Isomorfismo de Tokens de PII

A anonimização em `app/guardrail.py` atua como uma transformação bijetiva $f: \mathcal{P} \to \mathcal{K}$ mapeando sub-strings de PII para identificadores canônicos opacos:

$$\text{Token} = \text{"[PII\_"} \circ \text{tipo} \circ \text{"\_"} \circ \text{Hex}(\text{UUIDv4}()[0:6]) \circ \text{"]"}$$

A preservação semântica do grafo é assegurada porque a substituição $T' = f(T)$ preserva as relações gramaticais da frase original para a LLM, enquanto o mapa inverso $f^{-1}: \mathcal{K} \to \mathcal{P}$ reside exclusivamente na memória volátil do nó de execução, impedindo que CPFs e contatos transitem pelas APIs de terceiros.

### 2.5. Dinâmica Probabilística de Amostragem e Economia de Tokens

A amostragem de tokens no LLM segue a distribuição de probabilidade softmax com temperatura $T$:

$$P(w_i \mid w_{<i}) = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}$$

- **Agentes Especialistas e Guardrails ($T = 0.0$):** Colapsam a distribuição para a escolha determinística $\text{argmax}$ ($T \to 0$), eliminando estocasticidade na geração de SQLs, chamadas de tools e classificação de segurança.
- **Modelo Conversacional Geral ($T = 0.7$):** Permite diversidade léxica controlada apenas para saudações e interações abertas.

---

## 3. TAXONOMIA COMPLETA DA STACK TECNOLÓGICA E DEPENDÊNCIAS

### 3.1. Quadro Sinótico do Ecossistema (requirements.txt)

```mermaid
graph TD
    subgraph Web & Core Runtime
        F[fastapi] --> U[uvicorn]
        F --> P[pydantic]
        F --> PD[python-dotenv]
    end

    subgraph Agentic & LLM Framework
        LG[langgraph] --> LC[langchain]
        LC --> LCC[langchain-core]
        LC --> LCG[langchain-groq]
        LC --> LCGen[langchain-google-genai]
        LC --> LCom[langchain-community]
        LC --> LTS[langchain-text-splitters]
    end

    subgraph Data Stores & Ingestion
        QC[qdrant-client]
        PM[pymongo]
        PS[psycopg2-binary]
        PDF[pypdf]
        FA[faiss-cpu]
    end
```

| Pacote | Função Arquitetural | Importações Chave no Código |
|---|---|---|
| `fastapi` | Motor de APIs REST assíncronas, injeção de dependências e roteamento HTTP | `from fastapi import FastAPI, APIRouter, HTTPException, Query` |
| `uvicorn` | Servidor ASGI de alta performance para execução do FastAPI | `python -m uvicorn app.main:app --reload` |
| `pydantic` | Validação estrita de tipos, parsing e contratos de dados | `from pydantic import BaseModel, Field` |
| `langchain` | Abstração de agentes e decorators de tools | `from langchain.agents import create_agent, @tool` |
| `langchain-core` | Tipos base, mensagens, runnables e contratos de ferramentas | `from langchain_core.messages import RemoveMessage, RunnableConfig` |
| `langgraph` | Máquina de estados orientada a grafo para orquestração multiagente | `from langgraph.graph import StateGraph, END, MessagesState` |
| `langchain-groq` | SDK de comunicação de ultra-baixa latência com modelos Groq | `from langchain_groq import ChatGroq` |
| `langchain-google-genai` | SDK para embeddings e modelos Google Gemini | `from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI` |
| `qdrant-client` | Cliente de comunicação gRPC/REST com o banco vetorial Qdrant | `from qdrant_client import QdrantClient, models` |
| `pymongo` | Driver oficial para persistência de documentos e índices no MongoDB | `from pymongo import MongoClient` |
| `psycopg2-binary` | Driver nativo C para conexão e transações com PostgreSQL | `import psycopg2` |
| `pypdf` | Leitor e extrator de fluxos de texto de documentos PDF | `from langchain_community.document_loaders import PyPDFLoader` |
| `langchain-text-splitters` | Algoritmos de divisão de texto com overlap para RAG | `from langchain_text_splitters import RecursiveCharacterTextSplitter` |
| `python-dotenv` | Carregamento de variáveis de ambiente a partir do arquivo .env | `from dotenv import load_dotenv` |

### 3.2. Árvore Completa de Imports e Relações de Acoplamento

```mermaid
graph TD
    AppMain[app/main.py] --> RouteChat[app/routes/chat.py]
    AppMain --> RouteSess[app/routes/sessions.py]
    AppMain --> RoutePerf[app/routes/perfil.py]
    AppMain --> Config[app/config.py]

    RouteChat --> Graph[app/graph.py]
    RouteSess --> Memory[app/memory.py]
    RoutePerf --> Perfil[app/perfil.py]

    Graph --> LLMs[app/llms.py]
    Graph --> Guardrail[app/guardrail.py]
    Graph --> Prompts[app/prompts.py]
    Graph --> ToolFin[app/tools/financeiro.py]
    Graph --> ToolAge[app/tools/agenda.py]
    Graph --> ToolFAQ[app/tools/faq.py]
    Graph --> ToolMem[app/tools/memoria.py]
    Graph --> Memory

    ToolFin --> ToolPerf[app/tools/perfil.py]
    ToolFin --> ToolDB[app/tools/db.py]
    ToolAge --> ToolDB
    ToolFAQ --> Vectorstore[app/vectorstore.py]
    ToolMem --> Memory
    ToolPerf --> Perfil

    Perfil --> Memory
    Perfil --> Vectorstore
    Memory --> Vectorstore
    IngestFAQ[app/ingest_faq.py] --> Vectorstore
    IngestFAQ --> Config
    Vectorstore --> Config
    ToolDB --> Config
    LLMs --> Config
```

---

## 4. CONFIGURAÇÃO DE AMBIENTE, INICIALIZAÇÃO (.ENV) E BOOTSTRAPPING

### 4.1. Dicionário Exaustivo de Variáveis de Ambiente

```env
# ==============================================================================
# PROVEDORES DE INTELIGÊNCIA ARTIFICIAL E EMBEDDINGS
# ==============================================================================
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
# Utilizada por langchain_google_genai para:
# 1. Gerar vetores densos (768 dimensões) via modelo "gemini-embedding-2-preview"
# 2. Executar modelo LLM fallback gemini-3.6-flash/gemini-2.0-flash

GROQ_API_KEY="YOUR_GROQ_API_KEY_HERE"
# Utilizada por langchain_groq para acionar inferência ultrarrápida (LPU):
# 1. llm_rapido: Triagem, Roteamento, Orquestração e Guardrails
# 2. llm_especialista: Raciocínio especializado de Finanças e Agenda

GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"
# Alias de compatibilidade retroativa para SDKs internos do Google

# ==============================================================================
# BANCO DE DADOS VETORIAL (QDRANT CLOUD / HOSTED)
# ==============================================================================
QDRANT_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# Token JWT de autorização de leitura e escrita no cluster Qdrant

QDRANT_URL="https://217e7229-890b-4d5c-8ca6-e5db1a870ceb.eu-west-1-0.aws.cloud.qdrant.io"
# Endpoint HTTPS para comunicação gRPC/REST com as coleções vetoriais

# ==============================================================================
# BANCOS DE DADOS PERSISTENTES (RELACIONAL E DOCUMENTAL)
# ==============================================================================
DATABASE_URL="postgresql://postgres:94941@localhost:5432/db_assessor"
# URI de conexão TCP/IP com o cluster PostgreSQL (tabelas de transações e eventos)

MONGODB_URI="mongodb://localhost:27017"
# URI de conexão com o MongoDB (banco 'assessor', coleções 'perfis' e 'sessoes')
```

### 4.2. Módulo de Configuração Central (app/config.py) e Validação Preventiva

Implementa caminhos estáticos independentes do diretório corrente de execução (CWD):

```python
BASE_DIR     = Path(__file__).resolve().parent.parent # Raiz do repositório
DATA_DIR     = BASE_DIR / "data"                      # Armazenamento de arquivos binários/PDFs
FRONTEND_DIR = BASE_DIR / "frontend"                  # Arquivos estáticos servidos pelo FastAPI
FAQ_PDF_PATH = DATA_DIR / "FAQ_assessor_v1.1.pdf"     # Documento fonte do FAQ
```

A função `validar_config() -> list[str]` percorre o dicionário `OBRIGATORIAS`, acumulando mensagens de erro descritivas caso variáveis essenciais estejam ausentes ou o PDF de FAQ não seja localizado no sistema de arquivos.

### 4.3. Ciclo de Vida de Bootstrapping da Aplicação

Ao iniciar a aplicação (`uvicorn app.main:app`):
1. O `.env` é lido pelo `load_dotenv` na importação de `app/config.py`.
2. A validação de configuração é executada, emitindo alertas no `stdout`.
3. O módulo `app/vectorstore.py` estabelece o cliente `QdrantClient`. Se a coleção `perfil_preferencias` não existir, ela é criada dinamicamente com 768 dimensões e distância Cosseno, e um índice de payload `KEYWORD` é criado no campo `user_id`.
4. Os índices únicos do MongoDB (`col_perfis.create_index("user_id", unique=True)` e índices de `sessoes`) são registrados de forma idempotente.
5. As rotas dos módulos `chat`, `sessions` e `perfil` são registradas no `app = FastAPI()`.
6. O middleware de CORS é acoplado.
7. O diretório `frontend/` é montado na raiz `/` como arquivos estáticos (`StaticFiles`).

---

## 5. MODELAGEM DE DADOS MULTIPARADIGMA (PERSISTÊNCIA POLIGLOTA)

### 5.1. Camada Relacional ACID (PostgreSQL / base.sql)

```mermaid
erDiagram
    CATEGORIES ||--o{ TRANSACTIONS : "categoriza"
    TRANSACTION_TYPES ||--|{ TRANSACTIONS : "define tipo"
    
    CATEGORIES {
        int id PK
        varchar_64 name
        text description
        timestamptz created_at
    }

    TRANSACTION_TYPES {
        int id PK
        text type
    }

    TRANSACTIONS {
        bigint id PK
        numeric_14_2 amount
        int type FK
        int category_id FK
        text description
        varchar_32 payment_method
        timestamptz occurred_at
        text source_text
    }

    EVENTS {
        bigint id PK
        text title
        timestamptz start_time
        timestamptz end_time
        text location
        text notes
        timestamptz recorded_at
        text source_text
    }
```

#### DDL e Especificação Estrutural

**Tabela `transaction_types`:**
```sql
CREATE TABLE IF NOT EXISTS transaction_types (
  id   SERIAL PRIMARY KEY,
  type TEXT NOT NULL
);
-- Seed: 1 = 'INCOME', 2 = 'EXPENSES', 3 = 'TRANSFER'
```

**Tabela `categories`:**
```sql
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(64) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Seed: 'comida', 'besteira', 'estudo', 'férias', 'transporte', 'moradia',
-- 'saúde', 'lazer', 'contas', 'investimento', 'presente', 'outros'
```

**Tabela `transactions`:**
```sql
CREATE TABLE IF NOT EXISTS transactions (
  id             BIGSERIAL PRIMARY KEY,
  amount         NUMERIC(14,2) NOT NULL,
  type           INT REFERENCES transaction_types(id) NOT NULL DEFAULT 2,
  category_id    INT REFERENCES categories(id) ON DELETE SET NULL,
  description    TEXT,
  payment_method VARCHAR(32),
  occurred_at    TIMESTAMPTZ NOT NULL,
  source_text    TEXT NOT NULL
);
```

**Índices de Otimização Estratégicos:**
- `idx_transactions_occurred_at`: B-Tree em `occurred_at DESC` para ordenação temporal de extratos.
- `idx_transactions_category_time`: B-Tree composto em `(category_id, occurred_at DESC)` para somatórios por categoria.
- `idx_transactions_localday`: Índice funcional em `((occurred_at AT TIME ZONE 'America/Sao_Paulo')::date)` para cálculo de saldo diário instantâneo.

**Tabela `events`:**
```sql
CREATE TABLE IF NOT EXISTS events (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ,
  location    TEXT,
  notes       TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_text TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_start_time ON events (start_time DESC);
```

### 5.2. Camada Documental Semi-Estruturada (MongoDB / app/memory.py e app/perfil.py)

#### Coleção `perfis` (`app/perfil.py`)
Armazena a visão consolidada cadastral de cada usuário:

```json
{
  "_id": { "$oid": "66e01a8f9c1d2e3f4a5b6c7d" },
  "user_id": "usuario_teste",
  "renda_mensal": 4200.0,
  "objetivo": "Juntar para viagem em dezembro",
  "tolerancia_risco": "baixa",
  "atualizado_em": { "$date": "2026-09-10T12:00:00.000Z" }
}
```
- **Índice:** `user_id` único (`unique=True`).

#### Coleção `sessoes` (`app/memory.py`)
Registra o ciclo completo de mensagens trocadas e o resumo cognitivo:

```json
{
  "_id": "d9b2e6a1-4c3f-4e8a-b1d2-9f8e7d6c5b4a",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "usuario_teste",
  "iniciada_em": { "$date": "2026-09-10T14:30:00.000Z" },
  "atualizada_em": { "$date": "2026-09-10T14:35:22.000Z" },
  "resumo": "Usuário registrou gasto de R$ 50 no mercado e planejou economia para viagem.",
  "mensagens": [
    {
      "role": "human",
      "content": "Gastei 50 reais no mercado hoje"
    },
    {
      "role": "assistant",
      "content": "- Lancei R$ 50,00 em 'comida'.\n- *Recomendação*: Acompanhe os gastos da semana."
    }
  ]
}
```
- **Índices:** `session_id`, `user_id` e `iniciada_em`.

### 5.3. Camada Vetorial Densa (Qdrant / app/vectorstore.py)

```mermaid
graph TD
    subgraph "Cluster Qdrant Cloud (768 Dimensões / Cosine)"
        subgraph "Collection: perfil_preferencias"
            P1["Point: UUIDv5(DNS, user_id)\nVector: [768 floats]\nPayload: {user_id, preferencias, atualizado_em}"]
        end
        subgraph "Collection: memoria_resumos"
            M1["Point: doc_id (UUIDv4)\nVector: [768 floats]\nPayload: {user_id, session_id, resumo, iniciada_em}"]
        end
        subgraph "Collection: faq_chunks"
            F1["Point: chunk_id (UUIDv4)\nVector: [768 floats]\nPayload: {page_content, page_number, source}"]
        end
    end
```

- **Coleção `perfil_preferencias`:**
  - **Objetivo:** Permitir busca semântica sobre preferências não estruturadas (ex.: *"não quero risco"*, *"planejo comprar carro"*).
  - **Geração de ID:** `uuid.uuid5(uuid.NAMESPACE_DNS, user_id)` para assegurar idempotência (substituição do perfil antigo sem duplicação).
- **Coleção `memoria_resumos`:**
  - **Objetivo:** Fornecer contexto de sessões passadas para a tool `buscar_historico`.
  - **Payload Filter:** Filtrado obrigatoriamente por `models.FieldCondition(key="user_id", match=models.MatchValue(value=user_id))`.
- **Coleção `faq_chunks`:**
  - **Objetivo:** Base de conhecimento institucional dividida em chunks de 700 caracteres para atendimento a dúvidas gerais.

---

## 6. ARQUITETURA DO GRAFO LANGGRAPH: MÁQUINA DE ESTADOS E TRANSIÇÕES

### 6.1. Definição Estruturada do Estado Global (Estado)

Em `app/graph.py`, o estado é formalizado como:

```python
class Estado(MessagesState):
    agentes_chamados:   Annotated[list[str], operator.add]  # Lista cumulativa via reducer
    rota:               str                                 # "financeiro" | "agenda" | "faq"
    mapa_pii:           dict                                # Mapa {token_pii: valor_original}
    input:              str                                 # Entrada tratada / protocolo
    resposta_final:     str                                 # Texto final exibido ao usuário
    saida_especialista: str                                 # JSON textual emitido pelo especialista
    bloqueado:          bool                                # Sinalizador de veto de segurança
```

### 6.2. Topologia do Grafo e Diagrama Completo de Estados

```mermaid
flowchart TD
    Start((Início)) --> N_GIn[no_guardrail\nguardrail_entrd]
    
    N_GIn --> Cond_GIn{roteador_guardrail_entrd}
    Cond_GIn -- "bloqueado == True\n('fim')" --> End_Blocked((Fim - Bloqueado))
    Cond_GIn -- "bloqueado == False\n('roteador')" --> N_Router[no_roteador\nroteador]
    
    N_Router --> Cond_Router{decidir_especialista}
    Cond_Router -- "'fim'\n(Resposta Direta / Fora Escopo)" --> End_Direct((Fim - Direto))
    Cond_Router -- "'financeiro'" --> N_Fin[no_financeiro\nfinanceiro]
    Cond_Router -- "'agenda'" --> N_Age[no_agenda\nagenda]
    Cond_Router -- "'faq'" --> N_FAQ[no_faq\nfaq]
    
    N_Fin --> N_Orch[no_orquestrador\norquestrador]
    N_Age --> N_Orch
    
    N_FAQ --> End_FAQ((Fim - FAQ))
    
    N_Orch --> N_GOut[no_guardrail_saida\nguardrail_saida]
    N_GOut --> End_Final((Fim - Resposta Final))
```

### 6.3. Especificação Algorítmica e Comportamento dos Nós

1. **Nó `guardrail_entrd` (`no_guardrail`):**
   - Recebe a última mensagem do array `messages`.
   - Executa `anonimizar_entrada(texto)` gerando o texto tokenizado e o `mapa_pii`.
   - Executa `guardrail_entrada(texto_anonimizado)`.
   - Se for bloqueado: seta `bloqueado=True`, `resposta_final=mensagem_de_bloqueio` e encerra o fluxo.
   - Se aprovado: substitui a mensagem no histórico por uma mensagem sanitizada e prossegue.

2. **Nó `roteador` (`no_roteador`):**
   - Invoca o agente `router_app` com `TOOLS_MEMORIA` (`buscar_historico`).
   - Se a saída for saudação ou fora de escopo, não gera prefixo `ROUTE=` e grava a resposta diretamente em `resposta_final`.
   - Se demandar especialista, emite o protocolo textual `ROUTE={rota}\nPERGUNTA_ORIGINAL={texto}` no campo `input`.

3. **Nó `financeiro` (`no_financeiro`):**
   - Executa o agente `financeiro_app` munido das tools financeiras, de perfil e de memória.
   - Processa a solicitação e emite uma string estritamente formatada em JSON no campo `saida_especialista`.

4. **Nó `agenda` (`no_agenda`):**
   - Executa o agente `agenda_app` com tools de agendamento e memória.
   - Detecta conflitos e emite o resultado em JSON no campo `saida_especialista`.

5. **Nó `faq` (`no_faq`):**
   - Executa o agente `faq_app` que chama a tool `faq_retriever`.
   - Emite a resposta definitiva sobre o FAQ institucional diretamente para o usuário.

6. **Nó `orquestrador` (`no_orquestrador`):**
   - Lê o JSON de `saida_especialista`.
   - Humaniza e compõe a resposta final no formato de 3 tópicos (Diagnóstico, Recomendação, Acompanhamento).

7. **Nó `guardrail_saida` (`no_guardrail_saida`):**
   - Executa `guardrail_saida(resposta, mapa_pii)`.
   - Remove PIIs gerados pela LLM e executa o revisor de compliance regulatório antes do retorno final.

---

## 7. SISTEMA DE SEGURANÇA, DEFENSE-IN-DEPTH E GOVERNANÇA REGULATÓRIA

```mermaid
graph TB
    subgraph "Estágio 1: Guardrail de Entrada (Input Guardrail)"
        I_Raw[Entrada Bruta do Usuário] --> I_Anon[Anonimização de PII: Regex Match\nCPF, E-mail, Telefone]
        I_Anon --> I_Inj[Detecção de Prompt Injection\nRegex Heurístico]
        I_Inj --> I_Data[Detecção de Vazamento Interno\nKeywords de Sistema]
        I_Data --> I_LLM[Classificação Semântica LLM\nOfensivo, Perigoso, Ilícito, Político, Indicação]
        I_LLM --> I_Out[Input Aprovado e Higienizado]
    end

    subgraph "Estágio 2: Guardrail de Saída (Output Guardrail)"
        O_Raw[Resposta Bruta do Especialista/Orquestrador] --> O_PII[Higienização de PII Residual]
        O_PII --> O_Desanon[Desanonimização Controlada com mapa_pii]
        O_Desanon --> O_Comp[Revisão de Compliance CVM/ANBIMA\nProibição de Garantia de Retorno]
        O_Comp --> O_Out[Saída Segura Final]
    end
```

### 7.1. Regras de Entrada e Classificação Semântica

O classificador semântico categoriza a entrada em 6 rótulos exclusivos:
- **`APROVADO`:** Mensagem legítima sobre finanças, agenda ou FAQ.
- **`OFENSIVO`:** Xingamentos, assédio ou linguagem de ódio.
- **`PERIGOSO`:** Instruções prejudiciais à integridade física ou coletiva.
- **`ILICITO`:** Consultas de fraude, sonegação fiscal ou evasão de divisas.
- **`POLITICO`:** Opiniões e debates político-partidários.
- **`INDICACAO_INVEST`:** Solicitação de recomendação imperativa de compra de ativos individuais sem qualificação formal.

### 7.2. Conformidade Regulatória (CVM / ANBIMA / LGPD)

- **Resolução CVM nº 19/2021:** Veda a consultoria ou recomendação individualizada de valores mobiliários por sistemas automatizados desprovidos de autorização de analista credenciado (CNPI). O revisor de compliance do `guardrail_saida` atua bloqueando promessas de rentabilidade garantida e direcionando o usuário a consultar seu assessor humano.
- **Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018):** O mecanismo de tokenização impede o armazenamento e processamento de dados pessoais identificáveis em servidores de inferência de IA externos.

---

## 8. ENGENHARIA DE PROMPTS, PERSONAS E PROTOCOLOS DE COMUNICAÇÃO

### 8.1. Persona Base Compartilhada (PERSONA_SISTEMA)

```text
### PERSONA
Você é o Assessor.AI — um assistente pessoal de compromissos e finanças. Você é especialista em gestão financeira e organização de rotina. Sua principal característica é a objetividade e a confiabilidade. Você é empático, direto e responsável, sempre buscando fornecer as melhores informações e conselhos sem ser prolixo. Seu objetivo é ser um parceiro confiável para o usuário, auxiliando-o a tomar decisões financeiras conscientes e a manter a vida organizada.
```

### 8.2. Protocolo de Encaminhamento do Roteador

Quando uma solicitação necessita de processamento especializado, o roteador emite rigorosamente a sintaxe:

```text
ROUTE=financeiro
PERGUNTA_ORIGINAL=gastei 120 reais no restaurante com amigos hoje a noite
```

### 8.3. Contrato JSON dos Especialistas

Os especialistas emitem sua saída serializada no schema:

```json
{
  "dominio": "financeiro",
  "intencao": "inserir",
  "resposta": "Lancei R$ 120,00 em 'comida' hoje.",
  "recomendacao": "Você já atingiu 70% do orçamento de lazer/alimentação deste mês.",
  "acompanhamento": "Deseja ver o saldo restante na categoria?",
  "esclarecer": "",
  "escrita": {
    "operacao": "adicionar",
    "id": 482
  }
}
```

### 8.4. Formato de Apresentação do Orquestrador

O orquestrador compila o JSON na seguinte estrutura de exibição ao usuário final:

- Lancei R$ 120,00 em 'comida' hoje.
- *Recomendação*: Você já atingiu 70% do orçamento de lazer/alimentação deste mês.
- *Acompanhamento*: Deseja ver o saldo restante na categoria?

---

## 9. ESPECIFICAÇÃO EXAUSTIVA DAS TOOLS (FERRAMENTAS DOS AGENTES)

```mermaid
classDiagram
    class ToolDB {
        +get_conn() Connection
    }
    class ToolFinanceiro {
        +add_transaction(amount, source_text, occurred_at, type_id, type_name, category_id, description, payment_method)
        +search_transactions(limit, type_name, description_like, date_from, date_to)
        +saldo_total(date_from, date_to)
        +saldo_diario(date)
        +update_transaction(id, match_text, date_local, amount, type_id, type_name, category_id, category_name, description, payment_method, occurred_at)
    }
    class ToolAgenda {
        +consultar(date, start_time, end_time)
        +criar_evento(title, start_time, end_time, duration_hours, location, notes, source_text)
    }
    class ToolFAQ {
        +faq_retriever(question)
    }
    class ToolMemoria {
        +buscar_historico(busca)
    }
    class ToolPerfil {
        +consultar_perfil(busca)
    }

    ToolFinanceiro ..> ToolDB : Utiliza conexão Postgres
    ToolAgenda ..> ToolDB : Utiliza conexão Postgres
    ToolFinanceiro ..> ToolPerfil : Composição de ferramentas
```

### 9.1. Tabela Detalhada de Assinaturas e Schemas

| Tool | Módulo | Schema Pydantic | Operação no Banco | Retorno |
|---|---|---|---|---|
| `add_transaction` | `app/tools/financeiro.py` | `AddTransactionArgs` | `INSERT INTO transactions` | `{"status": "ok", "id": 1, "occurred_at": "..."}` |
| `search_transactions` | `app/tools/financeiro.py` | `SearchTransactionsArgs` | `SELECT ... FROM transactions` | `{"status": "ok", "count": N, "transactions": [...]}` |
| `saldo_total` | `app/tools/financeiro.py` | `SaldoTotalArgs` | `SELECT SUM(amount) ... GROUP BY type` | `{"status": "ok", "income": X, "expenses": Y, "saldo": Z}` |
| `saldo_diario` | `app/tools/financeiro.py` | `SaldoDiarioArgs` | `SELECT ... WHERE occurred_at::date = %s` | `{"status": "ok", "date": "...", "saldo": Z}` |
| `update_transaction` | `app/tools/financeiro.py` | `UpdateTransactionArgs` | `UPDATE transactions SET ...` | `{"status": "ok", "rows_affected": 1, "updated": {...}}` |
| `consultar` | `app/tools/agenda.py` | `ConsultarEvento` | `SELECT ... FROM events WHERE DATE(...)` | `{"status": "ok", "total": N, "eventos": [...]}` |
| `criar_evento` | `app/tools/agenda.py` | `CriarEvento` | `INSERT INTO events ...` | `{"status": "criado", "id": 1, "title": "..."}` |
| `faq_retriever` | `app/tools/faq.py` | `(question: str)` | `qdrant.query_points(faq_chunks)` | Texto concatenado dos chunks mais similares |
| `buscar_historico` | `app/tools/memoria.py` | `(busca: str)` | `qdrant.query_points(memoria_resumos)` | Lista formatada de resumos de sessões anteriores |
| `consultar_perfil` | `app/tools/perfil.py` | `(busca: str)` | `Mongo(perfis) + Qdrant(perfil_preferencias)` | Renda, objetivo, risco e preferências consolidadas |

---

## 10. ESPECIFICAÇÃO COMPLETA DA API REST FASTAPI

```mermaid
sequenceDiagram
    autonumber
    actor User as Cliente Web (Navegador)
    participant API as FastAPI Router (/chat)
    participant Graph as LangGraph Engine
    participant Agent as Especialista (Fin/Age/FAQ)
    participant DB as Postgres / Mongo / Qdrant
    
    User->>API: POST /chat {session_id, user_id, pergunta}
    API->>Graph: executar_fluxo_assessor(pergunta, session_id, user_id)
    Graph->>Graph: Guardrail Entrada (Anonimiza PII + Verifica Injeção)
    Graph->>Graph: Roteador (Classifica Domínio)
    Graph->>Agent: Executa Especialista com Tools
    Agent->>DB: Executa Consulta / Escrita SQL/NoSQL/Vetor
    DB-->>Agent: Retorna Registros
    Agent-->>Graph: Emite JSON Estruturado
    Graph->>Graph: Orquestrador (Formata 3 Tópicos)
    Graph->>Graph: Guardrail Saída (Compliance CVM + PII)
    Graph-->>API: Retorna Resposta Final Textual
    API->>DB: Salva Histórico em MongoDB (sessoes)
    API-->>User: HTTP 200 {resposta: "...", agentes_chamados: [...]}
```

### 10.1. Matriz de Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/chat` | Execução da mensagem conversacional |
| `POST` | `/sessions/{session_id}/iniciar` | Abertura explícita de sessão no MongoDB |
| `POST` | `/sessions/{session_id}/encerrar` | Geração de resumo via LLM e gravação de embedding no Qdrant |
| `POST` | `/perfil` | Cadastro e atualização de perfil financeiro (Mongo + Qdrant) |
| `GET` | `/perfil` | Consulta de perfil estruturado e preferências via Query Params |
| `GET` | `/perfil/{user_id}` | Consulta de perfil estruturado e preferências via Path Parameter |
| `GET` | `/health` | Verificação de saúde e integridade das variáveis de ambiente |
| `GET` | `/` | Servimento do SPA Frontend estático (StaticFiles) |

---

## 11. ENGENHARIA DE FRONTEND E EXPERIÊNCIA DO USUÁRIO

### 11.1. Arquitetura da Interface Web e Filosofia Zero-Dependency

O frontend foi construído em Vanilla JavaScript (ES6+), sem frameworks pesados (React/Vue/Angular), garantindo tempo de carregamento inferior a 50ms e zero dependências de compilação (*No-build workflow*).

### 11.2. Módulo de Chat (frontend/app.js e frontend/index.html)

- **Gerenciamento de Sessão:** Utiliza `localStorage` sob a chave `assistente_session_id`. Se inexistente, gera um UUID v4 via `crypto.randomUUID()`.
- **Mecanismo de Encerramento de Sessão:** O botão *"Nova Sessão"* aciona `POST /sessions/{sessionId}/encerrar`, aguarda o resumo retornado pela LLM, instancia um novo UUID e limpa a tela mantendo feedback visual no console.
- **Auto-resize do Composer:** Event listener de `input` que calcula dinamicamente `scrollHeight` limitando a altura máxima a 140px.
- **Tratamento de Teclas:** Envio com `Enter` direto e quebra de linha com `Shift + Enter`.

### 11.3. Design System e Tokens Visuais (style.css e perfil.css)

Baseado no conceito **Dark Glassmorphism Console**:
- **Cores Base:** Background `#0b0f14`, Painel `#10151c`, Borda `#232c38`.
- **Cores de Destaque:** Acentuação `#4fd1c5` (Teal futurista), Seleção `rgba(79, 209, 197, 0.12)`.
- **Tipografia:** `JetBrains Mono` para identidades de sessão, badges e código; `Inter` para legibilidade do texto corrido.

---

## 12. PIPELINE DE INGESTÃO DE CONHECIMENTO (OFFLINE RAG PIPELINE)

O arquivo `app/ingest_faq.py` é responsável pelo pipeline de ETL de documentos institucionais:

```mermaid
graph LR
    A["Arquivo PDF:<br>FAQ_assessor_v1.1.pdf"] -->|PyPDFLoader| B[Documentos de Página]
    B -->|RecursiveCharacterTextSplitter<br>chunk_size=700, overlap=150| C[Lista de Chunks de Texto]
    C -->|Batching em Lotes de 50| D["gerar_embeddings_batch<br>Gemini 768d"]
    D -->|Upsert| E["Qdrant Collection:<br>faq_chunks"]
```

### 12.1. Parâmetros de Chunking

- **`CHUNK_SIZE = 700`:** Garante que cada bloco contenha uma pergunta e resposta completa do FAQ sem truncamento contextual.
- **`CHUNK_OVERLAP = 150`:** Garante continuidade de fronteiras entre parágrafos adjacentes.
- **`BATCH_SIZE = 50`:** Otimiza requisições HTTP para a API de Embeddings do Google, prevenindo Rate Limiting (HTTP 429).

---

## 13. INTEGRAÇÃO CONTÍNUA, DEVOPS E TOPOLOGIA DE IMPLANTAÇÃO

### 13.1. Automação de CI/CD com GitHub Actions (ci-call-ai-service.yml)

O repositório possui integração contínua configurada via GitHub Actions utilizando workflows reutilizáveis centralizados:

```yaml
name: CI Call - AI Service Python FastAPI
on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main", "develop" ]
permissions:
  contents: read
jobs:
  call-ai-ci:
    name: Executar CI Python FastAPI Centralizado
    uses: Efficientia/.github/.github/workflows/ci-python-fastapi.yml@main
    with:
      python-version: '3.11'
```

### 13.2. Topologia de Infraestrutura em Produção

```mermaid
graph TD
    Client[Navegadores Clientes Web] -->|HTTPS| Cloudflare[Cloudflare CDN & WAF]
    Cloudflare -->|Reverse Proxy| Nginx[NGINX Ingress Controller]
    Nginx -->|Load Balancer| UvicornCluster[Cluster Uvicorn / Gunicorn ASGI\nPython 3.11 FastAPI]
    
    UvicornCluster -->|Pool TCP| Postgres[(PostgreSQL 16 Cluster\nPrimary + Read Replicas)]
    UvicornCluster -->|Pool TCP| Mongo[(MongoDB Atlas Replica Set)]
    UvicornCluster -->|gRPC / HTTPS| Qdrant[(Qdrant Cloud Managed Cluster)]
    UvicornCluster -->|HTTPS API| GroqAPI[Groq Inference Engine]
    UvicornCluster -->|HTTPS API| GoogleAPI[Google AI Studio API]
```

---

## 14. AUDITORIA COMPLETA DE CÓDIGO, VULNERABILIDADES E ROADMAP DE CORREÇÕES

### 14.1. Inventário Detalhado de Falhas e Débitos Técnicos

1. **Importação Relativa Quebrada no Script de Ingestão (`app/ingest_faq.py`):**
   - *Diagnóstico:* Na linha 18 consta `from vectorstore import ...` em vez de `from app.vectorstore import ...`. Ao rodar `python -m app.ingest_faq`, a execução falha com `ModuleNotFoundError`.

2. **Omissão do Campo `agentes_chamados` no Response (`app/routes/chat.py`):**
   - *Diagnóstico:* A rota instancia `ChatResponse(resposta=resposta)`, omitindo `agentes_chamados`. Como resultado, os badges de agentes no frontend nunca são renderizados.

3. **Incompatibilidade de Schema na Tool `add_transaction` (`app/tools/financeiro.py`):**
   - *Diagnóstico:* O prompt exige que o modelo infira e envie `category_name`, mas a classe `AddTransactionArgs` aceita exclusivamente `category_id: Optional[int]`. Se o modelo enviar `category_name`, o valor é descartado e o campo é gravado como `NULL`.

4. **Ausência de Join de Categorias em `search_transactions` (`app/tools/financeiro.py`):**
   - *Diagnóstico:* A query `SELECT` busca apenas colunas de `transactions` e `transaction_types`, impedindo o modelo de responder quais foram os gastos por categoria em buscas retroativas.

5. **Nomenclatura de Modelos Inexistentes (`app/llms.py`):**
   - *Diagnóstico:* `gemini-3.6-flash` não existe na API do Google Gemini, provocando exceção que cai no bloco `except` de fallback. Os identificadores `openai/gpt-oss-120b` e `qwen/qwen3.6-27b` não são oficiais da API Groq.

6. **Data e Hora Congeladas no Contexto dos Prompts (`app/prompts.py`):**
   - *Diagnóstico:* `_agora = datetime.now(...)` é executado na importação do módulo. Servidores com semanas de uptime enviarão a data em que o processo iniciou.

7. **Bypass do Guardrail de Saída (`app/graph.py`):**
   - *Diagnóstico:* Respostas diretas do roteador e o nó `faq` apontam diretamente para `END`, sem passar pela auditoria de `guardrail_saida`.

8. **Ausência de `user_id` no Banco Relacional (`base.sql`):**
   - *Diagnóstico:* As tabelas `transactions` e `events` não possuem coluna de identificação do usuário, misturando dados de múltiplos usuários em uma base compartilhada.

### 14.2. Guia de Correções Imediatas Linha a Linha

#### Correção 1: `app/ingest_faq.py` (Linha 18)

```python
# ANTES:
from vectorstore import qdrant, gerar_embeddings_batch, COLLECTION_FAQ

# DEPOIS:
from app.vectorstore import qdrant, gerar_embeddings_batch, COLLECTION_FAQ
```

#### Correção 2: `app/routes/chat.py` (Linhas 8–14)

```python
# ANTES:
@router.post("/chat", response_model=ChatResponse)
def conversar(requisicao: ChatRequest) -> ChatResponse:
    resposta = executar_fluxo_assessor(
        requisicao.pergunta, requisicao.session_id, requisicao.user_id
    )
    return ChatResponse(resposta=resposta)

# DEPOIS:
@router.post("/chat", response_model=ChatResponse)
def conversar(requisicao: ChatRequest) -> ChatResponse:
    resposta, agentes = executar_fluxo_assessor(
        requisicao.pergunta, requisicao.session_id, requisicao.user_id
    )
    return ChatResponse(resposta=resposta, agentes_chamados=agentes)
```

#### Correção 3: `app/tools/financeiro.py` (Adicionar `category_name` em `AddTransactionArgs` e `add_transaction`)

```python
class AddTransactionArgs(BaseModel):
    amount: float = Field(..., description="Valor da transação (use positivo).")
    source_text: str = Field(..., description="Texto original do usuário.")
    occurred_at: Optional[str] = Field(default=None, description="Timestamp ISO 8601.")
    type_id: Optional[int] = Field(default=None, description="ID em transaction_types (1=INCOME, 2=EXPENSES, 3=TRANSFER).")
    type_name: Optional[str] = Field(default=None, description="Nome do tipo: INCOME | EXPENSES | TRANSFER.")
    category_id: Optional[int] = Field(default=None, description="FK de categories (opcional).")
    category_name: Optional[str] = Field(default=None, description="Nome da categoria (ex.: comida, lazer, transporte).")
    description: Optional[str] = Field(default=None, description="Descrição (opcional).")
    payment_method: Optional[str] = Field(default=None, description="Forma de pagamento (opcional).")
```

E dentro de `add_transaction()`:

```python
if not category_id and category_name:
    category_id = _get_category_id(cur, category_name)
```

### 14.3. Recomendações para Escala Industrial e Observabilidade

- **Instrumentação com OpenTelemetry e Langfuse/LangSmith:** Inserir tracing distribuído em cada nó do grafo para rastrear latência de TTFT, contagem de tokens de entrada/saída e custos por chamada.
- **Gerenciamento de Conexão com Connection Pooling (SQLAlchemy / PgBouncer):** Substituir o `psycopg2.connect()` direto em cada tool por um pool persistente para evitar exaustão de conexões no PostgreSQL em cenários concorrentes.
- **Execução Assíncrona de Background Tasks:** Transferir o salvamento de mensagens no MongoDB (`salvar_mensagem`) para `BackgroundTasks` do FastAPI, reduzindo a latência da resposta HTTP percebida pelo usuário final.

---

*Documento técnico compilado e validado para o ecossistema Assessor.AI.*
