
# Guia de Instalação - Porto Brasil MES

Este guia detalha a instalação completa do Sistema de Monitoramento Industrial da Porto Brasil em diferentes ambientes.

## 📋 Pré-requisitos

### Obrigatórios
- **Node.js**: v18.0.0 ou superior
- **npm**: v9.0.0 ou superior

### Opcionais (para funcionalidades completas)
- **PostgreSQL**: v18 (para histórico persistente)
- **MQTT Broker**: Mosquitto ou HiveMQ (para telemetria em tempo real)
- **Docker**: v20+ (para deploy containerizado)

---

## 🚀 Instalação Rápida (Desenvolvimento Local)

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd porto-brasil
```

### 2. Instale as Dependências

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
cd ..
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:

```env
# Server
PORT=3000

# MQTT
MQTT_BROKER_URL=mqtt://localhost:1883

# PostgreSQL (Opcional - se não configurado, funciona em memória)
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=porto_brasil_mes
PG_USER=postgres
PG_PASSWORD=your_password
```

### 4. Instale o MQTT Broker (Opcional)

**Windows**:
```powershell
# Usando Chocolatey
choco install mosquitto

# Ou baixe em: https://mosquitto.org/download/
```

**Linux**:
```bash
sudo apt-get update
sudo apt-get install mosquitto mosquitto-clients
sudo systemctl enable mosquitto
sudo systemctl start mosquitto
```

### 5. Configure o PostgreSQL (Opcional)

```bash
# Instale PostgreSQL 18
# Crie o banco de dados
psql -U postgres
CREATE DATABASE porto_brasil_mes;
\q
```

O schema será criado automaticamente na primeira execução.

### 6. Inicie o Sistema

**Terminal 1 - Backend (Simulador + API)**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (Dashboard)**:
```bash
npm run dev
```

Acesse:
- **Dashboard**: http://localhost:5173
- **API REST**: http://localhost:3000/api
- **Mock TOTVS**: http://localhost:3000/totvs-api

---

## 🐳 Deploy com Docker

### Build das Imagens

**Backend**:
```dockerfile
# Crie backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3000
CMD ["node", "src/index.js"]
```

**Frontend**:
```dockerfile
# Crie Dockerfile na raiz
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:18
    environment:
      POSTGRES_DB: porto_brasil_mes
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  mosquitto:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf

  backend:
    build: ./backend
    environment:
      MQTT_BROKER_URL: mqtt://mosquitto:1883
      PG_HOST: postgres
      PG_DATABASE: porto_brasil_mes
      PG_PASSWORD: postgres
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - mosquitto

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

Execute:
```bash
docker-compose up -d
```

---

## 🖥️ Deploy em Produção

### Windows (IIS)

Use o script fornecido:
```powershell
.\setup_iis.ps1
```

### Linux (Nginx)

```bash
# Build do frontend
npm run build

# Copie para nginx
sudo cp -r dist/* /var/www/html/

# Configure proxy reverso para backend
sudo nano /etc/nginx/sites-available/porto-brasil
```

Configuração Nginx:
```nginx
server {
    listen 80;
    server_name porto-brasil.local;

    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

---

## 📱 Build Mobile (Flutter - Futuro)

A pasta `flutter/` está preparada para desenvolvimento mobile:

```bash
cd flutter
flutter pub get
flutter run -d android  # ou ios
```

---

## ✅ Verificação da Instalação

### Teste o Backend
```bash
curl http://localhost:3000/health
# Resposta esperada: {"status":"UP","timestamp":"..."}
```

### Teste a API
```bash
curl http://localhost:3000/api/cells
# Resposta: Array com 20 células
```

### Teste o Mock TOTVS
```bash
curl http://localhost:3000/totvs-api/production-orders
# Resposta: Lista de OPs
```

---

## 🔧 Troubleshooting

### Erro: "Cannot connect to MQTT"
- Verifique se o Mosquitto está rodando: `mosquitto -v`
- O sistema continuará funcionando sem MQTT (apenas sem mensageria real-time)

### Erro: "PostgreSQL connection refused"
- Verifique se o PostgreSQL está ativo
- O sistema funcionará em memória se não conectar ao DB

### Frontend não carrega dados
- Verifique se o backend está na porta 3000
- Confirme CORS no backend (já configurado)
- Verifique o console do navegador (F12)

---

## 📚 Próximos Passos

- [Documentação das APIs](API_TOTVS.md)
- [Arquitetura do Sistema](ARCHITECTURE.md)
- [Guia do Usuário](USER_GUIDE.md)
