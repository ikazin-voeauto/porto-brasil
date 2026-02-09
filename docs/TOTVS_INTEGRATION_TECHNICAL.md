# Integração TOTVS Protheus - Documentação Técnica (TI)

Este documento detalha a integração do **TOTVS Protheus** com o **Sistema de Monitoramento Industrial Porto Brasil (MES)**, cobrindo configurações iniciais, criação de chaves/credenciais, integração via REST, opções avançadas (BI, IA, Data Lake, MQTT) e glossário técnico.

> **Nota:** Siga sempre a documentação oficial do Protheus para parâmetros específicos da sua versão e release.

---

## 1. Componentes do ecossistema Protheus
- **AppServer**: serviço de aplicação do Protheus (onde habilitamos REST).  
- **DbAccess**: serviço responsável pela conexão com o banco de dados (via DBDriver ou ODBC).  
- **Banco de Dados (PostgreSQL, MS SQL, Oracle, etc.)**: repositório principal do Protheus.  
- **RPO**: repositório de objetos do Protheus (fonte e executáveis).  
- **TSS/Outros Serviços** (quando aplicável): serviços auxiliares de integração.

---

## 2. Configuração inicial (AppServer + REST)

### 2.1. Verificações prévias
- Confirme a **versão do Protheus** e o **release** com suporte a REST.
- Verifique se o AppServer está funcionando e se a porta HTTP está liberada.

### 2.2. Exemplo de `appserver.ini`
```ini
[HTTP]
Enable=1
Port=8080
Path=C:\TOTVS\Protheus\protheus_data\web

[REST]
Name=REST_API
Url=/rest
Port=8084
Security=1 ; 1 = Basic Auth, 2 = OAuth2 (quando disponível)
```

> Ajuste portas e paths para seu ambiente.

---

## 3. Criação de usuários e credenciais

### 3.1. Usuário de integração
No **Configurador (SIGACFG)**:
1. Acesse **Usuários > Senhas > Usuários**.
2. Crie um usuário específico (ex.: `MONITOR`).
3. Atribua acesso aos módulos de **PCP** e às rotinas necessárias.

### 3.2. Chaves e tokens (OAuth2)
Quando disponível no seu release:
- Crie as **credenciais OAuth2** no Protheus (cliente, segredo, escopos).
- Obtenha o **access token** via endpoint de autenticação.
- Utilize `Bearer Token` nas requisições REST.

> Se OAuth2 não estiver disponível, utilize **Basic Auth** com usuário dedicado.

---

## 4. Integração REST (Protheus ↔ MES)

### 4.1. Endpoints esperados pelo MES
O frontend do projeto espera endpoints conforme descrito em **docs/TOTVS_INTEGRATION_GUIDE.md**.

Principais operações:
- **Consulta de Ordens de Produção** (tabela `SC2`).
- **Apontamento de Produção** (rotina `SFCA314` / tabela `SH6`).

### 4.2. Estrutura de autenticação
- **Basic Auth** (padrão): `Authorization: Basic <base64>`
- **OAuth2** (recomendado quando disponível): `Authorization: Bearer <token>`

---

## 5. Integrações além de API

### 5.1. BI / Analytics
- Extração de dados para **Power BI, Tableau, Qlik**.
- ETL para Data Warehouse (por exemplo, via jobs agendados ou CDC).

### 5.2. Data Lake / Data Warehouse
- **Data Lake** para armazenamento de dados brutos (histórico, sensores, logs).
- **Data Warehouse** para dados tratados e modelados para análises.

### 5.3. IA / Machine Learning
- Modelos preditivos para **falhas**, **manutenção**, **qualidade** e **OEE**.
- Treinamento com histórico de produção + dados de sensores.

### 5.4. MQTT / Indústria 4.0
- Comunicação com sensores e CLPs via **MQTT**.
- Integração de telemetria contínua com o MES.

### 5.5. Integração por ODBC
- Uso de **unixODBC** ou driver ODBC (Linux) para acesso controlado ao banco.
- Recomendado somente quando APIs não estiverem disponíveis.

---

## 6. Flutter como frontend multiplataforma
O Flutter pode ser utilizado para criar apps conectados ao Protheus/MES com um único código:
- **Android, iOS, Windows, Linux, macOS e Web**.
- Reduz tempo de desenvolvimento e padroniza UX.

---

## 7. Boas práticas de integração
- **Usuário dedicado** para integração (sem uso do `admin`).
- **Auditoria** de acessos e logs de integração.
- **Versionamento de APIs** (`/api/v1/...`).
- **Controle de erros** padronizado e logs estruturados.
- **Ambiente de homologação** antes do go‑live.

---

## 8. Glossário técnico (termos essenciais)

- **AdvPL**: linguagem de programação utilizada no Protheus.
- **MES**: Manufacturing Execution System (Sistema de Execução de Manufatura).
- **WSREST**: framework REST do Protheus para criação de serviços HTTP.
- **OAuth2**: protocolo de autenticação/autorização via tokens.
- **Token**: credencial temporária para acesso seguro.
- **Basic Auth**: autenticação simples via usuário/senha.
- **RPO**: repositório de objetos do Protheus.
- **DbAccess**: serviço de acesso ao banco de dados do Protheus.
- **AppServer**: servidor de aplicação do Protheus.
- **ODBC / unixODBC**: camada de conectividade a bancos (drivers).
- **API REST**: padrão de integração via HTTP usando JSON.
- **ETL**: processo de extração, transformação e carga de dados.
- **CDC**: captura de mudanças em dados (Change Data Capture).
- **MQTT**: protocolo leve para IoT e telemetria.
- **Data Lake**: repositório de dados brutos.
- **Data Warehouse**: dados tratados e estruturados para análise.
- **OEE**: indicador de eficiência global do equipamento.

---

## 9. Referências internas do projeto
- **docs/TOTVS_INTEGRATION_GUIDE.md**: formato esperado dos endpoints REST.
- **docs/API_TOTVS.md**: mock da API Protheus para desenvolvimento.
- **docs/API_REST.md**: API do backend do MES.
