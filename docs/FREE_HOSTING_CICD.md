# Deploy Automático com Render Blueprint (Recomendado)

Este guia explica como fazer o deploy **automático e gratuito** da aplicação completa (Frontend + Backend + Banco de Dados) usando Render Blueprints.

Esta abordagem substitui a necessidade de configurar serviços manualmente um por um.

---

## 1. O que será criado?
Ao seguir este guia, o Render criará automaticamente:
1.  **Frontend (Site Estático)**: A interface do usuário.
2.  **Backend (Node.js)**: A API e servidor MQTT.
3.  **Banco de Dados (PostgreSQL)**: Para armazenar dados de produção.

Tudo isso interligado automaticamente através do arquivo `render.yaml` já incluído no projeto.

---

## 2. Passo a Passo

### 2.1. Conectar ao Render
1.  Acesse [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
2.  Clique em **New Blueprint Instance**.
3.  Conecte sua conta do GitHub.
4.  Selecione este repositório (`porto-brasil`).

### 2.2. Configurar o Deploy
O Render lerá o arquivo `render.yaml` e mostrará os serviços que serão criados.

1.  Dê um nome para o serviço (ex: `porto-brasil-prod`).
2.  Clique em **Apply**.

O Render iniciará o deploy de todos os componentes:
- O banco de dados será provisionado.
- O backend será construído e conectado ao banco.
- O frontend será construído e configurado para apontar para o backend.

---

## 3. URLs de Acesso
Após o deploy (pode levar alguns minutos), você verá duas URLs principais no dashboard:
- **Frontend**: `https://porto-brasil-frontend-xxxx.onrender.com` (Acesse aqui!)
- **Backend**: `https://porto-brasil-backend-xxxx.onrender.com` (API)

---

## 4. GitHub Pages (Opcional / Demo)
O projeto também está configurado para deploy automático no **GitHub Pages** (veja a aba Actions no GitHub).
- **URL**: `https://<seu-usuario>.github.io/porto-brasil/`
- **Limitação**: O GitHub Pages hospeda apenas o frontend estático.
- **Comportamento**: Como o backend não roda no GitHub, a aplicação entrará automaticamente em **Modo de Demonstração (Mock)**, exibindo dados simulados. Isso é perfeito para apresentar o visual do projeto sem custos de servidor.

---

## 5. Variáveis de Ambiente
As variáveis são gerenciadas automaticamente pelo `render.yaml`.
- `VITE_API_BASE_URL`: Aponta automaticamente para o backend no Render.
- `DATABASE_URL`: Injetada automaticamente no backend.
- `MQTT_BROKER_URL`: Configurado para usar um broker público de testes (`mqtt://test.mosquitto.org`) para garantir funcionamento imediato. Para produção real, recomenda-se um broker privado.

---

## Troubleshooting
- **Deploy falhou?** Verifique os logs no dashboard do Render.
- **Login não funciona?** O banco de dados inicia vazio. O sistema permite login com qualquer usuário simulado no frontend ou você pode precisar criar usuários via API/Banco se a lógica mudar.
- **Persistência**: O login agora é persistido no navegador. Se recarregar a página, você continuará logado.
