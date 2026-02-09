# Documentação de Integração TOTVS Protheus - Projeto Porto Brasil

Este documento descreve as especificações técnicas, configurações necessárias e endpoints da API REST do TOTVS Protheus utilizados para integração com o Sistema de Monitoramento Industrial Porto Brasil.

Esta documentação serve como guia oficial para a equipe de TI da Porto Brasil configurar o ambiente de produção (Protheus) para substituir o Mock Server utilizado em desenvolvimento.

---

## 1. Visão Geral da Integração

O sistema de monitoramento comunica-se com o TOTVS Protheus via **REST API** para:
1.  **Leitura**: Consultar Ordens de Produção (Tabela `SC2`).
2.  **Escrita**: Realizar Apontamentos de Produção (Rotina `SFCA314` / Tabela `SH6`).

### Arquitetura
- **Protocolo**: HTTP/1.1 (REST)
- **Formato de Dados**: JSON
- **Autenticação**: Basic Auth (Padrão) ou OAuth2 (Recomendado se disponível no release)
- **Base URL (Exemplo)**: `http://<IP_PROTHEUS>:<PORTA_REST>/rest`

---

## 2. Configuração do Ambiente TOTVS Protheus

### 2.1. Pré-requisitos
Certifique-se de que o serviço REST está habilitado no `appserver.ini` do Protheus.

**Exemplo de configuração no `appserver.ini`:**
```ini
[HTTP]
Enable=1
Port=8080
Path=C:\TOTVS\Protheus\protheus_data\web

[REST]
Name=REST_API
Url=/rest
Port=8084
Security=1 ; 1 para Basic Auth
```

### 2.2. Criação de Usuário de Integração (SIGACFG)
Para segurança e auditoria, não utilize o usuário `admin`. Crie um usuário específico para esta integração.

1.  Acesse o módulo **Configurador (SIGACFG)**.
2.  Vá em **Usuários > Senhas > Usuários**.
3.  Inclua um novo usuário:
    *   **ID**: `MONITOR`
    *   **Nome**: Integração Monitoramento Industrial
    *   **Email**: ti@portobrasil.com.br
4.  Defina uma senha forte (ex: `P0rt0Br@sil2026`).
5.  **Acessos**:
    *   Garanta acesso às Filiais de produção.
    *   Garanta acesso aos módulos **PCP** (Planejamento e Controle da Produção).

### 2.3. Configuração de Menu e Permissões
O usuário `MONITOR` deve ter permissão para executar as rotinas envolvidas nas APIs. Se estiver usando APIs padrão (TLPP/MVC), verifique as permissões de acesso aos objetos de negócio.

---

## 3. Especificação das APIs (Endpoints)

Abaixo estão detalhados os serviços que devem ser expostos pelo Protheus. Caso o Protheus não possua as APIs nativas nestes exatos formatos, recomenda-se a criação de **APIs Customizadas (AdvPL/TLPP)** seguindo estas assinaturas para manter compatibilidade com o frontend desenvolvido.

### 3.1. Consultar Ordens de Produção
Retorna a lista de Orys de Produção ativas para alimentar o painel de planejamento.

- **Método**: `GET`
- **Rota Sugerida**: `/api/v1/erpprot/production-orders`
- **Referência Tabela**: `SC2` (Ordens de Produção)

#### Parâmetros de Query
| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `page` | Int | Não | Número da página (Padrão: 1) |
| `pageSize` | Int | Não | Registros por página (Padrão: 10) |
| `status` | String | Não | Filtro por status (ex: 'S' para Aberta) |

#### Exemplo de Resposta (JSON)
```json
{
  "hasNext": true,
  "total": 52,
  "items": [
    {
      "orderId": "100101",        // Campo C2_NUM
      "productCode": "PA-001",    // Campo C2_PRODUTO
      "quantity": 5000,           // Campo C2_QUANT
      "status": "S",              // Campo C2_STATUS (S=Suspens, P=Pend, R=Real)
      "issueDate": "2026-02-01"   // Campo C2_EMISSAO
    }
  ]
}
```

#### Implementação AdvPL (Sugestão de Query)
```sql
SELECT C2_NUM, C2_PRODUTO, C2_QUANT, C2_STATUS, C2_EMISSAO
FROM SC2010
WHERE D_E_L_E_T_ = '' AND C2_STATUS != 'E'
ORDER BY C2_EMISSAO DESC
```

---

### 3.2. Apontamento de Produção
Registra a produção realizada no chão de fábrica diretamente no ERP.

- **Método**: `POST`
- **Rota Sugerida**: `/api/v1/erpprot/production-appointments`
- **Rotina Automática Relacionada**: `SFCA314` (Apontamento de Produção Mod. 2) ou `MATA250` (Apontamento de Produção Simples).

#### Payload de Envio (JSON)
```json
{
  "orderId": "100101",      // Número da O.P. (Obrigatório)
  "quantity": 150,          // Quantidade Apontada
  "type": "NORMAL",         // Tipo: NORMAL, REWORK, SCRAP
  "workCenter": "CEL-01",   // Centro de Trabalho / Recurso
  "operatorId": "00452"     // Matrícula do Operador (Opcional)
}
```

#### Regras de Negócio (Validação no Protheus)
1.  Validar se a OP (`orderId`) existe na tabela `SC2` e não está encerrada.
2.  Validar se a quantidade acumulada não excede a quantidade da OP (se parametrizado para bloquear).
3.  Registrar o apontamento na tabela `SH6` (Movimentos de Produção).
4.  Atualizar saldo na `SC2`.

#### Exemplo de Resposta (Sucesso - 201 Created)
```json
{
  "transactionId": "98273645",
  "status": "Success",
  "message": "Production reported successfully.",
  "generatedId": "H6_000452" // ID gerado na SH6
}
```

#### Exemplo de Resposta (Erro - 4xx/5xx)
```json
{
  "code": "BusinessError",
  "message": "Order already ended",
  "detailedMessage": "A Ordem de Produção 100101 já foi encerrada."
}
```

---

## 4. Testes e Validação (Postman/Curl)

Para validar se a API do Protheus está respondendo conforme o mock, utilize os seguintes comandos:

**1. Teste de Conexão e Auth**
```bash
curl -u MONITOR:SENHA http://PROTHEUS_IP:8084/rest/api/v1/erpprot/production-orders
```

**2. Teste de Apontamento**
```bash
curl -X POST http://PROTHEUS_IP:8084/rest/api/v1/erpprot/production-appointments \
  -H "Content-Type: application/json" \
  -u MONITOR:SENHA \
  -d '{"orderId": "100101", "quantity": 10, "type": "NORMAL", "workCenter": "C01"}'
```

---

## 5. Anexo: Código Fonte Exemplo (AdvPL - REST)

Abaixo um esqueleto de **WSREST** em AdvPL para expor os endpoints acima, caso opte por desenvolvimento customizado ao invés de usar adaptador nativo.

```advpl
#Include "PROTHEUS.CH"
#Include "RESTFUL.CH"

WSRESTFUL erpprot DESCRIPTION "API Integracao Porto Brasil"

    WSMETHOD GET DESCRIPTION "Lista OPs" WSSYNTAX "/production-orders" PATH "/production-orders" PRODUCES APPLICATION_JSON
    WSMETHOD POST DESCRIPTION "Aponta Producao" WSSYNTAX "/production-appointments" PATH "/production-appointments" PRODUCES APPLICATION_JSON

END WSRESTFUL

WSMETHOD GET WSRECEIVE page, pageSize WSSERVICE erpprot
    Local oJson := JsonObject():New()
    Local aItems := {}
    // ... Logica de Query na SC2 ...
    oJson['items'] := aItems
    ::SetResponse(oJson:ToJson())
Return .T.

WSMETHOD POST WSSERVICE erpprot
    Local cBody := ::GetContent()
    Local oParse := JsonObject():New()
    
    oParse:FromJson(cBody)
    // ... Logica de ExecAuto SFCA314 ...
    
    ::SetResponse('{"status":"Success"}')
Return .T.
```
