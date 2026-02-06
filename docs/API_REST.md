
# API REST - Documentação Técnica

Sistema Porto Brasil - Endpoints de Monitoramento Industrial

## Base URL
```
http://localhost:3000/api
```

---

## Endpoints Principais

### 1. Listar Todas as Células

Retorna o estado atual de todas as 20 células de produção.

**Endpoint**: `GET /cells`

**Resposta (200 OK)**:
```json
[
  {
    "id": "01",
    "name": "Célula de Produção 01",
    "status": "OPERATIONAL",
    "oee": 87.45,
    "availability": 95.2,
    "performance": 92.8,
    "quality": 98.9,
    "currentProduct": "PRATO-FUNDO-BRANCO",
    "unitsProduced": 1450,
    "targetUnits": 5000,
    "goodPieces": 1432,
    "badPieces": 18,
    "temperature": 64.2,
    "vibration": 3.15
  }
]
```

**Status Possíveis**:
- `OPERATIONAL`: Em produção normal
- `WARNING`: Operando mas com desempenho abaixo do esperado (OEE < 60%)
- `STOPPED`: Parada
- `MAINTENANCE`: Em manutenção

---

### 2. Buscar Célula Específica

**Endpoint**: `GET /cells/:id`

**Exemplo**: `GET /cells/05`

**Resposta (200 OK)**:
```json
{
  "id": "05",
  "name": "Célula de Produção 05",
  "status": "OPERATIONAL",
  ...
}
```

**Resposta Erro (404)**:
```json
{
  "error": "Cell not found"
}
```

---

### 3. Dashboard - Resumo Global

Retorna métricas agregadas de todas as células.

**Endpoint**: `GET /dashboard/summary`

**Resposta (200 OK)**:
```json
{
  "totalCells": 20,
  "activeCells": 17,
  "totalProduced": 28450,
  "globalOEE": "84.32",
  "timestamp": "2026-02-06T19:45:30.123Z"
}
```

---

## Integrações MQTT

O backend publica telemetria em tempo real via MQTT nos seguintes tópicos:

### Estrutura de Tópicos

```
porto-brasil/
  └── cell/
      ├── 01/
      │   ├── telemetry  (JSON completo)
      │   └── status     (String: RUNNING/STOPPED/MAINTENANCE)
      ├── 02/
      ...
      └── 20/
```

### Payload de Telemetria

Tópico: `porto-brasil/cell/{id}/telemetry`

```json
{
  "id": "01",
  "name": "Célula de Produção 01",
  "timestamp": "2026-02-06T19:45:30.123Z",
  "status": "RUNNING",
  "production": {
    "total": 1450,
    "good": 1432,
    "bad": 18
  },
  "oee": {
    "availability": 95.20,
    "performance": 92.80,
    "quality": 98.90,
    "global": 87.45
  },
  "sensors": {
    "temperature": 64.2,
    "vibration": 3.15
  },
  "product": {
    "code": "PRATO-FUNDO-BRANCO",
    "target": 5000
  }
}
```

### Frequência de Publicação
- **Telemetria Completa**: A cada 5 segundos
- **Status Changes**: Imediatamente ao mudar

---

## WebSocket (Futuro)

Planejado para versão 2.0:
```
ws://localhost:3000/ws/cells
```

---

## Autenticação (Produção)

Atualmente **desabilitado** para facilitar desenvolvimento.

Em produção, use **Bearer Token** ou **API Key**:

```http
GET /api/cells
Authorization: Bearer <token>
```

---

## Rate Limiting

- **Dev**: Sem limites
- **Prod**: 100 requisições/minuto por IP

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200    | Sucesso |
| 201    | Criado com sucesso |
| 400    | Bad Request - Parâmetros inválidos |
| 404    | Recurso não encontrado |
| 500    | Erro interno do servidor |

---

## Exemplos de Uso

### JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:3000/api/cells');
const cells = await response.json();
console.log(cells);
```

### Python (Requests)
```python
import requests
response = requests.get('http://localhost:3000/api/cells')
cells = response.json()
print(cells)
```

### cURL
```bash
curl http://localhost:3000/api/cells
```

---

## Versionamento

- **Versão Atual**: v1 (implícito em `/api/`)
- **Próxima Versão**: `/api/v2/` (quando houver breaking changes)
