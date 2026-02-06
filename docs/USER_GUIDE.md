
# Guia do Usuário - Porto Brasil MES

Manual de operação do Sistema de Monitoramento de Produção Industrial.

---

## 📱 Acesso ao Sistema

### Web (Navegador)
Acesse: `http://localhost:5173` (desenvolvimento) ou o endereço configurado em produção.

**Navegadores Compatíveis**:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### Mobile (App Android/iOS)
Baixe o aplicativo da loja ou use a versão PWA do navegador.

---

## 🔐 Login

### Primeiro Acesso

1. **Tela de Acesso ao Sistema**:
   - Digite o código de acesso fornecido pela TI
   - Clique em "Desbloquear Sistema"

2. **Tela de Login**:
   - **Usuário**: Seu login corporativo
   - **Senha**: Senha inicial (solicite mudança no primeiro acesso)
   - Clique em "Entrar"

### Perfis de Usuário

- **Operador**: Visualização de células, registro de contagem
- **Supervisor**: Visão completa, análises e relatórios
- **Gestor**: Dashboard executivo, exportações
- **Manutenção**: Acesso a logs técnicos e status de equipamentos

---

## 🏠 Dashboard Principal

### Visão Geral

O Dashboard apresenta métricas em tempo real:

**Métricas Globais** (topo):
- **Células Ativas**: Quantas estão produzindo
- **Produção Total**: Peças produzidas no período
- **OEE Médio**: Overall Equipment Effectiveness global

**Grid de Células**:
- 20 cards representando cada célula
- Código de cores por status
- OEE individual em destaque

### Interpretação de Cores

| Cor | Status | Significado |
|-----|--------|-------------|
| 🟢 Verde | OPERATIONAL | Produção normal |
| 🟡 Amarelo | WARNING | Desempenho abaixo do esperado |
| 🔴 Vermelho | STOPPED | Parada não planejada |
| ⚙️ Azul | MAINTENANCE | Manutenção programada |

---

## 📊 OEE - Overall Equipment Effectiveness

### O que é OEE?

OEE mede a eficiência produtiva através de 3 pilares:

**1. Disponibilidade** (Availability)
- % do tempo em que a máquina esteve disponível para produzir
- **Cálculo**: Tempo Operando / Tempo Planejado
- **Meta**: ≥ 90%

**2. Performance** (Desempenho)
- Velocidade real vs. velocidade ideal
- **Cálculo**: (Tempo Ideal × Peças) / Tempo Real
- **Meta**: ≥ 95%

**3. Qualidade** (Quality)
- % de peças boas (sem defeitos)
- **Cálculo**: Peças Boas / Total Produzido
- **Meta**: ≥ 98%

**OEE Global** = Disponibilidade × Performance × Qualidade

**Exemplo**:
```
Disponibilidade: 90%
Performance: 95%
Qualidade: 98%

OEE = 0.90 × 0.95 × 0.98 = 83.79%
```

### Benchmarks Industriais

- **World Class**: OEE ≥ 85%
- **Bom**: 60% - 85%
- **Aceitável**: 40% - 60%
- **Crítico**: < 40% (Requer ação imediata)

---

## 📋 Operações Comuns

### 1. Visualizar Detalhes de uma Célula

1. No Dashboard, clique no card da célula desejada
2. Será aberto um painel lateral com:
   - Gráfico de produção em tempo real
   - Histórico de OEE
   - Sensores (temperatura, vibração)
   - Últimas falhas registradas
3. Clique em "Fechar" ou `ESC` para voltar

### 2. Modo Operador (Mobile)

Ideal para operadores no chão de fábrica.

1. No menu lateral, clique em **"Operador"**
2. Selecione a célula que está operando
3. Tela grande com contador de peças
4. Botões:
   - ➕ **Incrementar**: Registra peça produzida
   - ⚠️ **Defeito**: Reporta peça com problema
   - ⏸️ **Parar/Iniciar**: Controle de status

### 3. Ver Histórico de Produção

1. Menu lateral → **"Análise"**
2. Selecione o período (Hoje, Semana, Mês)
3. Visualize:
   - Gráfico de tendência de OEE
   - Tabela de produção por célula
   - Ranking de desempenho
4. **Exportar**: Clique em "Exportar PDF" ou "Excel"

### 4. Consultar Alertas

1. Menu lateral → **"Alertas"**
2. Filtros disponíveis:
   - Severidade (Crítico, Aviso, Info)
   - Célula específica
   - Período
3. Clique em um alerta para ver detalhes
4. Marque como "Resolvido" após tratativa

---

## 🔔 Notificações e Alarmes

### Tipos de Alertas

**🔴 Crítico** (Alerta sonoro):
- Parada não planejada > 5 minutos
- OEE < 40%
- Sensor de temperatura crítica

**🟡 Aviso**:
- Performance abaixo da meta
- Qualidade < 95%
- Manutenção preventiva próxima

**ℹ️ Informativo**:
- Troca de produto
- Fim de turno
- Logs do sistema

### Configurações de Notificações

Perfil → Configurações → Notificações
- Ativar/Desativar alarmes sonoros
- Receber emails (apenas Supervisores+)
- Frequência de resumos

---

## 📱 Uso em Diferentes Dispositivos

### Desktop (PC/Notebook)

**Navegação**: Mouse + Teclado
- **Mouse Scroll**: Rolar entre seções
- **Atalhos**:
  - `D`: Ir para Dashboard
  - `A`: Ir para Análises
  - `ESC`: Fechar modais

### Tablet

**Navegação**: Touch
- **Swipe**: Deslizar entre telas
- **Pinch**: Zoom em gráficos
- **Orientação**: Funciona em landscape e portrait

### Smartphone

**Interface Simplificada**:
- Menu hambúrguer (☰) no topo
- Prioriza ação rápida:
  - Contador de peças
  - Reportar defeitos
  - Ver status geral

### TV/Tela Grande (Andon Board)

**Modo Visualização**:
- Auto-refresh a cada 5 segundos
- Sem interação (somente leitura)
- Fontes aumentadas para leitura à distância
- Rotação automática entre dashboards

---

## 🔧 Solução de Problemas

### Dados não atualizam

1. Verifique sua conexão com a internet
2. Atualize a página (F5)
3. Limpe o cache do navegador
4. Entre em contato com TI se persistir

### Não consigo fazer login

1. Verifique usuário e senha (case-sensitive)
2. Use "Esqueci minha senha" para resetar
3. Confirme com TI se seu acesso está ativo

### Dashboard está lento

1. Feche outras abas/programas
2. Use Chrome ou Edge (melhor performance)
3. Em mobile, feche apps em segundo plano

---

## 📞 Suporte

**TI - Problemas Técnicos**:
- Email: ti@portobrasil.com.br
- Ramal: 4000

**Engenharia - Dúvidas sobre OEE/Processos**:
- Email: engenharia@portobrasil.com.br
- Ramal: 4100

**Treinamento**:
- Agende via RH para capacitação presencial

---

## 📖 Glossário

- **OEE**: Overall Equipment Effectiveness (Eficiência Global do Equipamento)
- **Célula**: Unidade de produção individual
- **SKU**: Stock Keeping Unit (Produto/Código)
- **OP**: Ordem de Produção
- **Refugo**: Peça defeituosa/descartada
- **Takt Time**: Tempo ideal de ciclo
- **Downtime**: Tempo de parada
