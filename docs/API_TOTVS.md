
# Documentação de Integração - TOTVS Protheus (Simulação)

Esta documentação descreve as APIs simuladas do ERP TOTVS Protheus para a integração com o sistema MES Porto Brasil.
O mock segue os padrões de resposta e erro do TOTVS REST Framework.

## Autenticação

Todos os endpoints suportam **Basic Auth**.
*   **User**: `admin`
*   **Password**: `totvs`

**Como gerar o Token (Header Authorization):**
Para autenticar, você deve enviar o header `Authorization: Basic <token>`.
O token é a string `user:password` codificada em Base64.

Exemplo em Linux/Mac:
```bash
echo -n "admin:totvs" | base64
# Saída: YWRtaW46dG90dnM=
```

Exemplo de Header:
`Authorization: Basic YWRtaW46dG90dnM=`


## Base URL
Local: `http://localhost:3000/totvs-api`

---

## Recursos

### 1. Listar Ordens de Produção (SC2)

Consulta a tabela de Ordens de Produção (SC2) filtrando por status.
Simula o endpoint padrão ERP TOTVS.

*   **Endpoint**: `/v1/erpprot/production-orders`
*   **Método**: `GET`
*   **Parâmetros**:
    *   `page`: (int) Página atual (default: 1)
    *   `pageSize`: (int) Itens por página (default: 10)
*   **Resposta Sucesso (200 OK)**:
    ```json
    {
      "hasNext": false,
      "items": [
        {
          "orderId": "100101",          // C2_NUM
          "productCode": "PRATO-FUNDO-BRANCO", // C2_PRODUTO
          "quantity": 5000,             // C2_QUANT
          "status": "S",                // C2_STATUS (S=Started, P=Planned, E=Ended)
          "issueDate": "2026-02-01"     // C2_EMISSAO
        }
      ],
      "total": 5
    }
    ```

### 2. Apontamento de Produção (Simulação SFCA314)

Endpoint que simula a execução da rotina `SFCA314` (Apontamento de Produção) via ExecAuto/REST.

*   **Endpoint**: `/v1/erpprot/production-appointments`
*   **Método**: `POST`
*   **Body (JSON)**:
    ```json
    {
      "orderId": "100101",   // Número da OP (Obrigatório)
      "quantity": 50,        // Quantidade (Obrigatório)
      "type": "GOOD",        // "GOOD" (Aprovado) ou "SCRAP" (Refugo)
      "workCenter": "CEL-01" // Centro de Trabalho
    }
    ```

*   **Resposta Sucesso (201 Created)**:
    ```json
    {
      "transactionId": "857391823",
      "status": "Success",
      "message": "Production reported successfully.",
      "generatedId": "H64821"
    }
    ```

*   **Resposta Erro - Negócio (422 Unprocessable Entity)**:
    ```json
    {
      "code": "BusinessError",
      "message": "Order already ended",
      "detailedMessage": "Cannot report production for an ended order."
    }
    ```

*   **Resposta Erro - Não Encontrado (404 Not Found)**:
    ```json
    {
      "code": "NotFound",
      "message": "Production Order not found",
      "detailedMessage": "Order 999999 does not exist in SC2."
    }
    ```
