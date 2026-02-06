
# Arquitetura da Solução Digital Industrial - Porto Brasil

Esta solução foi projetada seguindo os princípios da Indústria 4.0, garantindo escalabilidade, tempo real e integração.

## Visão Geral

O sistema é composto por três camaadas principais:

1.  **Chão de Fábrica Simulado (Edge)**:
    *   Simula 20 células de produção de cerâmica.
    *   Gera dados de sensores (temperatura, vibração), contagem de peças e status.
    *   Comunica-se via protocolo **MQTT**.

2.  **Backend & Integração (Core)**:
    *   **Node.js Server**: Gerencia a lógica de negócios e persistência.
    *   **MQTT Client**: Assina os tópicos das células.
    *   **API REST**: Expõe dados para o Frontend.
    *   **Simulador TOTVS Protheus**: Mock de APIs do ERP para integração de Ordens de Produção.
    *   **PostgreSQL**: Banco de dados para histórico de produção e OEE (opcional para simulação).

3.  **Frontend (Visualização)**:
    *   **React + Vite**: Aplicação SPA de alta performance.
    *   **Dashboard Interativo**: Gráficos em tempo real, animações e alertas.
    *   **Responsividade**: Otimizado para Desktop, Tablet e Mobile.

## Fluxo de Dados

1.  **Células (Simuladas)** geram eventos (peça produzida, parada, mudança de status) a cada segundo.
2.  Dados são publicados no tópico `porto-brasil/cell/{id}`.
3.  **Backend** recebe mensagens MQTT, calcula OEE em tempo real e atualiza o estado em memória.
4.  **Backend** persiste dados agregados no PostgreSQL para análise histórica.
5.  **Frontend** consome a API (`/api/cells`) para atualizar os cards e gráficos do operador.
6.  Integrações com **TOTVS** ocorrem via chamadas REST (`/totvs-api/`) para buscar OPs e apontar produção.

## Tecnologias

*   **Linguagem**: JavaScript/TypeScript (Full Stack).
*   **Runtime**: Node.js v18+.
*   **Protocolo**: MQTT (Mosquitto/HiveMQ).
*   **Banco de Dados**: PostgreSQL 18.
*   **Frontend**: React 19, TailwindCSS, Recharts.
*   **Containerização**: Preparado para Docker.
