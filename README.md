# FeedbackLoop — Portal de Aprovacao de Ativos Criativos

## Live Demo

https://mkt-client-feedback-loop.onrender.com/

## O Problema

Equipes de marketing e agencias de publicidade enfrentam um gargalo critico no fluxo de aprovacao de ativos criativos. O cenario e familiar:

- **Feedback fragmentado**: Comentarios sobre pecas criativas ficam espalhados entre e-mails, WhatsApp, Slack e reunioes — sem um local centralizado.
- **Confusao de versoes**: Arquivos como `banner_v2_final_FINAL_revisado(2).png` se multiplicam sem controle, gerando retrabalho e frustacao.
- **Aprovacoes lentas**: O time criativo perde horas rastreando quem precisa aprovar o que, qual versao esta em analise, e quais alteracoes ja foram incorporadas.
- **Falta de rastreabilidade**: Nao ha historico claro de decisoes — quem aprovou, quando, e por que as alteracoes foram solicitadas.

Segundo pesquisas do setor, equipes de marketing gastam ate **30% do tempo** em tarefas administrativas de aprovacao que poderiam ser automatizadas. Em agencias com multiplos clientes, esse problema se multiplica exponencialmente.

## A Solucao

**FeedbackLoop** e um portal centralizado de aprovacao de ativos criativos que transforma o caos em fluxo organizado:

### Anotacoes Visuais Diretas
Clique em qualquer ponto da imagem para criar uma anotacao com pin numerado. O feedback fica **exatamente** onde e relevante — sem descricoes vagas como "aquele texto la no canto".

### Aprovacao com Um Clique
Botoes claros de **"Aprovar"** e **"Solicitar Alteracoes"** eliminam a ambiguidade. Cada acao e registrada com autor, data e comentario.

### Historico de Versoes com Timeline
Cada versao do ativo e preservada com timeline visual. Nunca mais perca uma versao anterior ou se pergunte "o que mudou entre a v2 e a v3".

### Resumo Inteligente com IA
Integrado com **Claude (Anthropic)**, o sistema analisa todas as anotacoes e gera automaticamente:
- Resumo narrativo consolidado do feedback
- Itens de acao categorizados e priorizados (alta/media/baixa)
- Analise de sentimento geral do cliente

Isso permite que o designer receba um briefing claro e acionavel, em vez de interpretar dezenas de comentarios soltos.

## Por que Resolver Isso Importa

1. **Reducao de retrabalho**: Com versoes rastreadas e feedback centralizado, o designer sabe exatamente o que precisa mudar.
2. **Velocidade de entrega**: Aprovacoes que levavam dias por e-mail acontecem em minutos.
3. **Transparencia**: Historico completo de decisoes protege tanto a agencia quanto o cliente.
4. **Escala**: Uma agencia pode gerenciar dezenas de projetos simultaneamente sem perder o controle.

---

## Demonstracao

O aplicativo ja inicia com **dados de demonstracao** pre-carregados:

- **Campanha Verao 2026** (cliente: Loja Tropical) — 3 ativos com anotacoes, versoes e status variados
- **Rebranding Logo** (cliente: TechStart) — 2 variacoes de logo em revisao

Isso permite explorar todas as funcionalidades imediatamente apos iniciar o servidor.

---

## Stack Tecnologica

| Tecnologia | Finalidade |
|---|---|
| **Next.js 16** (App Router) | Framework full-stack com SSR e API routes |
| **TypeScript** | Tipagem estatica em todo o projeto |
| **Tailwind CSS v4** | Estilizacao utilitaria com tema customizado |
| **motion** (Framer Motion) | Animacoes fluidas (transicoes de pagina, pins, confetti) |
| **lucide-react** | Iconografia consistente e leve |
| **@anthropic-ai/sdk** | Integracao com Claude para resumo inteligente de feedback |

### Armazenamento
Este e um **MVP** — todos os dados ficam **em memoria** no servidor Node.js. Isso significa:
- Zero dependencias externas (sem banco de dados, sem Redis)
- Dados resetam ao reiniciar o servidor
- Dados de demonstracao sao carregados automaticamente

### Arquitetura
```
src/
├── app/                    # Pages e API Routes (App Router)
│   ├── api/projects/       # REST API completa
│   ├── novo-projeto/       # Pagina de criacao de projeto
│   └── projetos/           # Paginas de detalhe e revisao
├── lib/                    # Core: tipos, store, IA, utils
├── components/             # Componentes React organizados por dominio
│   ├── annotations/        # Sistema de anotacoes visuais
│   ├── versions/           # Timeline de versoes
│   ├── ai/                 # Painel de resumo IA
│   └── ui/                 # Componentes base reutilizaveis
└── hooks/                  # Custom hooks (user, annotations)
```

---

## Como Rodar

### Pre-requisitos
- **Node.js** 18+ (recomendado: 20+)
- **npm** (incluido com Node.js)

### Instalacao

```bash
# Clone o repositorio
git clone <url-do-repositorio>
cd mkt-client-feedback-loop

# Instale as dependencias
npm install
```

### Configuracao da IA (Opcional)

Para habilitar o recurso de **Resumo Inteligente com IA**, adicione sua API key da Anthropic:

```bash
# Edite o arquivo .env.local
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
```

> O aplicativo funciona normalmente sem a chave — o botao de IA ficara desabilitado com mensagem explicativa.

### Executando

```bash
# Modo desenvolvimento
npm run dev

# Acesse em http://localhost:3000
```

```bash
# Build de producao
npm run build
npm start
```

---

## API REST

Todas as rotas estao em `/api/projects/`:

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/api/projects` | Listar projetos com estatisticas |
| `POST` | `/api/projects` | Criar novo projeto |
| `GET` | `/api/projects/:id` | Detalhe do projeto |
| `PUT` | `/api/projects/:id` | Atualizar projeto |
| `DELETE` | `/api/projects/:id` | Excluir projeto |
| `GET` | `/api/projects/:id/assets` | Listar ativos do projeto |
| `POST` | `/api/projects/:id/assets` | Upload de novo ativo |
| `GET` | `/api/projects/:id/assets/:assetId` | Detalhe do ativo com versao e anotacoes |
| `PUT` | `/api/projects/:id/assets/:assetId` | Mudar status (aprovar/solicitar alteracoes) |
| `GET` | `/api/projects/:id/assets/:assetId/versions` | Listar versoes |
| `POST` | `/api/projects/:id/assets/:assetId/versions` | Enviar nova versao |
| `GET` | `/api/projects/:id/assets/:assetId/annotations` | Listar anotacoes |
| `POST` | `/api/projects/:id/assets/:assetId/annotations` | Criar anotacao |
| `PUT` | `/api/projects/:id/assets/:assetId/annotations` | Resolver ou responder anotacao |
| `POST` | `/api/projects/:id/assets/:assetId/ai/summarize` | Gerar resumo IA |

---

## Funcionalidades Detalhadas

### Sistema de Anotacoes
- Clique em qualquer ponto da imagem para criar um pin numerado
- Coordenadas armazenadas em percentuais (0-100%) para responsividade
- Cada anotacao suporta respostas (thread)
- Anotacoes podem ser marcadas como resolvidas
- Pins vermelhos para pendentes, verdes para resolvidos

### Fluxo de Aprovacao
- **Aprovar**: Um clique com animacao de confete celebratoria
- **Solicitar Alteracoes**: Requer comentario descrevendo o que precisa mudar
- Status rastreado: Pendente → Em Revisao → Aprovado / Alteracoes Solicitadas

### Controle de Versoes
- Upload de novas versoes a qualquer momento
- Timeline visual com autor, data e nota de mudanca
- Alternar entre versoes preserva anotacoes de cada uma
- Nova versao muda automaticamente o status para "Em Revisao"

### Resumo com IA
- Coleta todas as anotacoes da versao atual
- Envia para Claude Sonnet com prompt estruturado em portugues
- Retorna resumo narrativo + itens de acao + sentimento
- Categorias: tipografia, cores, layout, conteudo, imagem
- Prioridades: alta, media, baixa

---

## Design e UX

O aplicativo segue a estetica **"Editorial Studio"**:

- **Tema escuro** com paleta navy profundo e acentos indigo/violeta
- **Tipografia**: Sora (headings) + Outfit (body) via Google Fonts
- **Animacoes suaves** com motion: entrada de paginas, spring nos pins, confete na aprovacao
- **Layout responsivo**: Funciona em desktop e mobile
- **Cards** com bordas sutis, hover states e shadows

---

## Limitacoes do MVP

- **Dados em memoria**: Tudo e perdido ao reiniciar o servidor
- **Sem autenticacao**: Usuarios se identificam por nome (localStorage)
- **Tamanho de arquivo**: Maximo 5MB por upload (armazenado em base64)
- **Sem notificacoes**: Nao ha sistema de e-mail ou push
- **Single-instance**: Nao ha sincronizacao entre multiplos servidores

---

## Licenca

MIT
