# Deploy gratuito com CI/CD (push na main)

Este guia descreve um fluxo gratuito (ou com free tier) para publicar **frontend + backend** automaticamente ao fazer push na branch `main` usando **CI/CD**.

> **Resumo rápido:**
> - **Backend**: Render (Free Tier) com deploy automático via GitHub.
> - **Frontend**: Vercel (Free Tier) com deploy automático via GitHub.
> - **Banco de dados**: usar PostgreSQL gratuito (Render, Neon, Supabase) se necessário.

---

## 1. Pré-requisitos
- Repositório no GitHub.
- Aplicação funcionando localmente.
- Variáveis de ambiente definidas (ver seção 5).

---

## 2. Estrutura sugerida
Este repositório possui:
- **Frontend**: Vite/React na raiz.
- **Backend**: Node.js em `backend/`.

---

## 3. Backend (Render)

### 3.1. Criar serviço
1. Crie uma conta em https://render.com
2. Clique em **New** → **Web Service**.
3. Conecte o repositório GitHub.
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start` (ou `node src/index.js`, ajuste conforme o backend)
   - **Runtime**: Node.js

### 3.2. Deploy automático
- Ative **Auto-Deploy** para o branch `main`.
- Render já faz deploy automático a cada push.

### 3.3. Variáveis de ambiente
No Render → **Environment**:
- `PORT=3000` (Render define automaticamente, mas pode manter se exigido)
- `MQTT_BROKER_URL=...`
- `PG_HOST=...`
- `PG_PORT=...`
- `PG_DATABASE=...`
- `PG_USER=...`
- `PG_PASSWORD=...`

> O backend deve ler o `PORT` do ambiente, pois o Render injeta a porta padrão.

---

## 4. Frontend (Vercel)

### 4.1. Criar projeto
1. Crie uma conta em https://vercel.com
2. Importe o repositório GitHub.
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `/` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.2. Variável de ambiente (API)
- Defina a URL do backend:
  - `VITE_API_BASE_URL=https://<seu-backend-render>.onrender.com`

### 4.3. Deploy automático
- Vercel faz deploy automático a cada push na `main`.

---

## 5. CI/CD com GitHub Actions (opcional)

Se preferir ter um pipeline explícito, use o exemplo abaixo para disparar deployments manuais via API (Render/Vercel). Isso é opcional, pois ambos já fazem deploy automático via integração GitHub.

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Render Deploy
        run: curl -X POST "$RENDER_DEPLOY_HOOK"
      - name: Trigger Vercel Deploy
        run: curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_$VERCEL_PROJECT_ID/$VERCEL_DEPLOY_HOOK"
```

> Use **secrets** (`RENDER_DEPLOY_HOOK`, `VERCEL_PROJECT_ID`, `VERCEL_DEPLOY_HOOK`) no GitHub.

---

## 6. Banco de dados gratuito (opcional)
Se precisar persistência:
- **Render PostgreSQL** (Free Tier)
- **Neon** (Postgres grátis)
- **Supabase** (Postgres grátis)

Configure o backend para apontar para o host/credenciais do serviço escolhido.

---

## 7. Checklist final
- [ ] Backend publicado e funcionando na URL pública.
- [ ] Frontend apontando para o backend via `VITE_API_BASE_URL`.
- [ ] Deploy automático ativado (push na `main`).
- [ ] Variáveis de ambiente configuradas.

---

## 8. Troubleshooting
- **Erro de porta**: garanta que o backend lê `process.env.PORT`.
- **CORS**: configure o backend para aceitar o domínio do frontend.
- **Timeout**: verifique se o backend usa `npm start` e não `npm run dev`.

---

## 9. Alternativas gratuitas
- **Railway** (free tier, bom para Node + DB).
- **Fly.io** (free tier, precisa mais configuração).
- **Netlify** (frontend estático).

