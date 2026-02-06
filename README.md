
# Porto Brasil - Sistema de Monitoramento Industrial 4.0

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)]()
[![Node](https://img.shields.io/badge/node-18%2B-green.svg)]()
[![React](https://img.shields.io/badge/react-19-blue.svg)]()

Solução Digital Industrial completa para monitoramento de produção, cálculo de OEE e visualização de dados em tempo real, aplicada a 20 células de produção da linha de artigos de cerâmica de luxo.

---

## 🏭 Visão Geral

Sistema MES (Manufacturing Execution System) desenvolvido sob os princípios da **Indústria 4.0**:

- ✅ **Monitoramento em Tempo Real**: 20 células simultâneas via MQTT
- ✅ **Cálculo Automático de OEE**: Disponibilidade × Performance × Qualidade
- ✅ **Integração ERP**: Mock completo de APIs TOTVS Protheus
- ✅ **Multiplataforma**: Web, Desktop, Mobile (Android/iOS), Tablets
- ✅ **Dashboard Profissional**: Interface industrial premium com animações suaves
- ✅ **Persistência de Dados**: PostgreSQL 18 para histórico e análises

---

## 📸 Screenshots

![Dashboard](docs/images/dashboard.png)
*Dashboard principal com visão global das 20 células*

![OEE Detail](docs/images/oee-detail.png)
*Análise detalhada de OEE por célula*

---

## 🚀 Quick Start

### Instalação Rápida (3 comandos)

```bash
# 1. Backend (API + Simulador)
cd backend && npm install && npm start

# 2. Frontend (Dashboard) - Novo terminal
npm install && npm run dev

# 3. Acesse http://localhost:5173
```

> 💡 **Nota**: MQTT e PostgreSQL são opcionais. O sistema funciona completamente sem eles para demonstração.

---

## 📁 Estrutura do Projeto

```
porto-brasil/
├── backend/               # Node.js Backend
│   ├── src/
│   │   ├── simulator/     # Simulação das 20 células
│   │   ├── api/           # REST API endpoints
│   │   ├── totvs_mock/    # Simulação APIs TOTVS Protheus
│   │   └── db/            # Conexão PostgreSQL
│   └── package.json
│
├── components/            # Componentes React
│   ├── Dashboard.tsx      # Dashboard principal
│   ├── CellsGrid.tsx      # Grid de células
│   ├── MobileCounter.tsx  # Interface mobile operadores
│   └── ...
│
├── docs/                  # Documentação
│   ├── ARCHITECTURE.md    # Arquitetura técnica
│   ├── API_TOTVS.md       # APIs TOTVS simuladas
│   ├── API_REST.md        # Documentação REST API
│   ├── INSTALLATION.md    # Guia de instalação
│   └── USER_GUIDE.md      # Manual do usuário
│
├── App.tsx                # Aplicação principal React
├── types.ts               # TypeScript interfaces
└── STYLE_GUIDE.md         # Design System Porto Brasil
```

---

## 🛠️ Tecnologias

### Frontend
- **React 19** + **TypeScript**: UI moderna e type-safe
- **Vite**: Build ultra-rápido
- **Tailwind CSS**: Design system customizado
- **Recharts**: Visualização de dados

### Backend
- **Node.js 18**: Runtime JavaScript
- **Express**: Framework web minimalista
- **MQTT.js**: Protocolo de telemetria industrial
- **PostgreSQL**: Banco de dados relacional
- **pg**: Driver PostgreSQL nativo

### DevOps
- **Docker**: Containerização
- **GitHub Actions**: CI/CD (preparado)

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [📐 ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura técnica do sistema |
| [🔌 API_REST.md](docs/API_REST.md) | Documentação da API principal |
| [🏢 API_TOTVS.md](docs/API_TOTVS.md) | Mock de integração TOTVS Protheus |
| [💾 INSTALLATION.md](docs/INSTALLATION.md) | Guia de instalação multi-plataforma |
| [👤 USER_GUIDE.md](docs/USER_GUIDE.md) | Manual do usuário final |
| [🎨 STYLE_GUIDE.md](STYLE_GUIDE.md) | Design System Porto Brasil |

---

## 🎯 Funcionalidades Principais

### 1. Simulador de Produção

Simula 20 células de produção com:
- Contagem automática de peças (boas/defeituosas)
- Sensores virtuais (temperatura, vibração)
- Mudança de status (Operacional, Parado, Manutenção)
- Troca de produtos aleatória

### 2. Cálculo de OEE

**OEE = Disponibilidade × Performance × Qualidade**

- **Disponibilidade**: % tempo operando vs. planejado
- **Performance**: Velocidade real vs. ideal
- **Qualidade**: % peças boas

Atualizado em tempo real a cada produção.

### 3. Integração TOTVS Protheus (Mock)

APIs simuladas:
- `GET /production-orders`: Lista de Ordens de Produção (SC2)
- `POST /sfca314`: Apontamento de produção (routine SFCA314)

Comportamento idêntico ao ERP real para integração.

### 4. Dashboard Responsivo

- **Desktop**: Visão completa com tabelas e gráficos
- **Tablet**: Interface híbrida supervisores
- **Mobile**: Contador simplificado operadores
- **TV/Andon**: Visualização sem interação, auto-refresh

### 5. Histórico e Análises

- Gráficos de tendência de OEE
- Rankings de células
- Exportação de relatórios (PDF/Excel)
- Logs de alertas e paradas

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Backend `.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# MQTT
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_CLIENT_ID=porto-brasil-backend

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=porto_brasil_mes
PG_USER=postgres
PG_PASSWORD=your_password

# Logging
LOG_LEVEL=info
```

### Docker Compose

Execute o stack completo:
```bash
docker-compose up -d
```

Inclui:
- Backend (Node.js)
- Frontend (Nginx)
- PostgreSQL 18
- Mosquitto MQTT

---

## 📊 APIs Externas (TOTVS Protheus)

O sistema simula as seguintes APIs oficiais do TOTVS Protheus:

### Endpoints Implementados

1. **Ordens de Produção** (Tabela SC2)
   - `GET /api/v1/production-orders`
   - Retorna OPs planejadas e em andamento

2. **Apontamento de Produção** (SFCA314)
   - `POST /api/v1/sfca314`
   - Registra quantidade produzida ou refugo

3. **Itens/Produtos** (Tabela SB1)
   - `GET /api/v1/items`
   - Cadastro de produtos

**Autenticação**: Basic Auth (user: `admin`, pass: `totvs`)

Detalhes em [API_TOTVS.md](docs/API_TOTVS.md).

---

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
npm test

# E2E (futuro)
npm run test:e2e
```

---

## 🚢 Deploy

### Desenvolvimento
```bash
npm run dev
```

### Produção (Build)
```bash
npm run build
npm run preview
```

### IIS (Windows)
```powershell
.\setup_iis.ps1
```

### Nginx (Linux)
Ver [INSTALLATION.md](docs/INSTALLATION.md#linux-nginx)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

- [ ] WebSockets para updates real-time (substituir polling)
- [ ] Autenticação JWT
- [ ] Exportação avançada de relatórios
- [ ] Integração com APIs reais do TOTVS
- [ ] App Mobile nativo (Flutter)
- [ ] Dashboards personalizáveis (drag-and-drop)
- [ ] Machine Learning para predição de falhas

---

## 📄 Licença

Proprietary - Porto Brasil Cerâmicas © 2026

---

## 👥 Autores

**Equipe de Desenvolvimento Porto Brasil**
- Engenharia de Software
- Automação Industrial
- UX/UI Design

---

## 📞 Suporte

- **Email**: suporte@portobrasil.com.br
- **Documentação**: [docs/](docs/)
- **Issues**: GitHub Issues

---

## 🙏 Agradecimentos

- Equipe de Produção pela validação do sistema
- Departamento de TI pela infraestrutura
- Comunidade open-source pelas ferramentas utilizadas