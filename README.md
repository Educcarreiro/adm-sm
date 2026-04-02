# Soccer Mind ADM

Painel administrativo interno da Soccer Mind para gestão de clientes, contratos, chamados (service desk) e usuários da equipe.

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Radix UI + shadcn/ui
- Supabase (banco de dados + real-time)
- React Router

## Funcionalidades

- **Dashboard** — métricas em tempo real (clubes, chamados, receita, upsells)
- **Clientes** — cadastro e gestão de clubes
- **Service Desk** — abertura, acompanhamento e resposta a chamados em tempo real
- **Contratos** — gestão de contratos e upsells contratados
- **Upsells** — catálogo de módulos disponíveis
- **Usuários Internos** — adicionar e remover membros da equipe

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_aqui
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

### 4. Build para produção

```bash
npm run build
```

## Integração com a Soccer Mind Platform

Os chamados criados pelos clientes na Soccer Mind Platform são recebidos automaticamente neste painel via Supabase Realtime. Qualquer ticket inserido na tabela `tickets` aparece instantaneamente no Service Desk sem necessidade de refresh.
