# PORTO BRASIL — Industrial Design System & Style Guide
**Version 1.0**

> **Princípio Central:** A identidade visual manda. As cores informativas obedecem.
> O layout nunca chama mais atenção que os dados. Nunca "grita". Nunca inventa cor.

---

## 1. Paleta de Cores Oficial

Estas cores representam **90-95%** de toda a interface. Não use outras cores para estrutura.

### 🎨 Neutros Estruturais (Identity Core)

| Token | HEX | Aplicação Obrigatória |
| :--- | :--- | :--- |
| **`pb.black`** | `#0E0E0E` | Header, Sidebar, Botões Primários, Textos de Títulos |
| **`pb.darkGray`** | `#1C1C1C` | Fundos secundários escuros, Modais, Tooltips |
| **`pb.gray`** | `#6B6B6B` | Texto secundário, Legendas, Ícones inativos |
| **`pb.lightGray`** | `#DADADA` | Bordas, Divisórias, Linhas de grade sutis |
| **`pb.offWhite`** | `#F5F6F2` | **Fundo Principal** da aplicação (Background) |
| **`pb.white`** | `#FFFFFF` | Superfície de Cards, Tabelas, Campos de Input |

### ⚠️ Cores Informativas (Status Industrial)

O uso é **estritamente controlado**. Apenas para estados e exceções.

| Token | HEX | Significado | Regra de Uso |
| :--- | :--- | :--- | :--- |
| **`ind.ok`** | `#2F6F3E` | Operacional / Normal | Indicadores pontuais, nunca fundos inteiros. |
| **`ind.warn`** | `#8C7A3E` | Atenção / Warning | Requer monitoramento, mas não parada imediata. |
| **`ind.error`** | `#8E2A2A` | Crítico / Parada | Falha grave. Alta visibilidade necessária. |
| **`ind.info`** | `#4A5A64` | Informativo / Log | Notas de sistema, mensagens neutras. |

---

## 2. Tipografia (Industrial Clean)

Fontes permitidas: **Inter**, **Roboto**, ou **IBM Plex Sans**.
A hierarquia é definida por **peso** e **tamanho**, nunca por cor decorativa.

### Escala de Pesos
- **Bold (700):** Apenas para KPIs (Números grandes) e Cabeçalhos de Seção.
- **Semi-Bold (600):** Destaques importantes, Totais, Status.
- **Medium (500):** Labels de formulários, Cabeçalhos de tabela.
- **Regular (400):** Texto corrido, descrições, logs.

### Regras de Texto
*   **Contraste:** Texto principal sempre em `pb.black` ou `pb.darkGray`.
*   **Secundário:** Metadados e labels em `pb.gray`.
*   **Alinhamento:**
    *   Números: Alinhados à direita ou tabulares.
    *   Texto: Alinhado à esquerda.
    *   Evitar texto centralizado exceto em componentes muito específicos (ex: _Empty States_).

---

## 3. Elementos de Interface & Componentização

### Cards e Contêineres
*   **Fundo:** `pb.white`
*   **Borda:** 1px sólida `pb.lightGray`
*   **Sombra:** Mínima ou inexistente (`box-shadow: 0 1px 2px rgba(0,0,0,0.05)`)
*   **Padding:** Confortável (ex: `p-6` ou `24px`), consistente.

### Botões
*   **Primário:**
    *   Fundo: `pb.black`
    *   Texto: `pb.white`
    *   Hover: Opacidade 90% ou levemente mais claro (`#2A2A2A`). **Nunca mudar de cor.**
    *   Shape: Bordas levemente arredondadas (`rounded-md` ou `rounded-lg`), nunca `rounded-full` (exceto ícones).

### Tabelas (Data Grids)
*   **Cabeçalho:** Texto `pb.gray` (peso 500), Uppercase ou Capitalize consistente.
*   **Linhas:** Divisórias finas `pb.lightGray`.
*   **Striping (Zebra):** Opcional, usar cinza muito suave (`#F9F9F9`) se necessário.
*   **Células:** Dados numéricos monospaced (fonte mono) são preferíveis para tabulação.

---

## 4. Hierarquia e Destaque (Sem Cor)

Como guiar o olho do usuário **sem** usar o balde de tinta:

1.  **Tamanho:** Aumente a fonte do dado mais importante (KPI).
2.  **Peso:** Use negrito para o valor, regular para o label.
3.  **Espaço em Branco:** Isole o elemento crítico.
4.  **Bordas:** Use uma borda `pb.black` para um card selecionado.

🚫 **PROIBIDO:**
*   Gradientes (exceto talvez em gráficos muito sutis).
*   Sombras difusas e coloridas (Glow).
*   Botões de cores vibrantes (ex: azul, laranja).
*   Fundos coloridos para "decorar" o layout.

---

## 5. Visualização de Dados (Gráficos)

*   **Linhas de Gráfico:** Devem ser finas e precisas.
*   **Cores de Séries:** Usar a paleta informativa (`ind.ok`, `ind.warn`) apenas se a série representar aquele estado. Se forem categorias neutras, usar variações de cinza ou padrões de linha (tracejado, pontilhado).
*   **Grid:** `pb.lightGray` com baixa opacidade.

---

## 6. Responsividade & Adaptação de Ambiente

O layout não apenas "cabe" na tela, ele se adapta à **função** do usuário naquele dispositivo.

### 📱 Mobile (Operador em Campo)
*   **Contexto:** Operador de pé, andando, luvas, sol ou pouca luz.
*   **Layout:** Coluna única (Stack). Scroll vertical infinito.
*   **Elementos:**
    *   Botões com altura mínima de **48px** (dedo).
    *   Esconder navegação lateral (Menu Hamburger ou Bottom Bar).
    *   **Prioridade:** Alertas críticos e input de dados simples. Gráficos complexos somem ou simplificam.

### 💻 Tablet (Supervisor / Manutenção)
*   **Contexto:** Movel, mas com paradas para análise.
*   **Layout:** Híbrido. Sidebar colapsável. Grid de 2 colunas.
*   **Elementos:**
    *   Tabelas simplificadas (esconder colunas menos úteis).
    *   Permite drill-down (clicar para ver detalhes).

### 🖥️ Desktop (Gestão / Engenharia)
*   **Contexto:** Sentado, escritório, mouse e teclado.
*   **Layout:** Alta densidade. Dashboard completo.
*   **Métrica:** "Single Screen" sempre que possível (evitar scroll).
*   **Elementos:** Tabelas completas, exportação de dados, filtros complexos visíveis.

### 📺 TV / Grandes Formatos (Andon Board)
*   **Contexto:** Tela fixada na parede (Chão de fábrica). Leitura a 5-10 metros de distância.
*   **Interação:** **Zero.** (Read-only).
*   **Layout:**
    *   **Fonte Gigante:** Tamanho base duplicado (ex: texto 32px, KPIs 120px+).
    *   **Visual de Alto Contraste:** Fundo Escuro preferencial (`pb.black` ou `pb.darkGray`) para reduzir brilho excessivo ambiente.
    *   **Rotação:** Se houver muita informação, rotacionar telas automaticamente (Carrossel) a cada 30s.
    *   **Sem Inputs:** Esconder botões, menus, paginação e barras de scroll.
*   **Foco:** O estado atual da linha. O erro deve ser visto do outro lado do galpão.

---

## 8. Espaçamento e Dimensionamento (Métricas)

O sistema utiliza uma escala baseada em **4px** (regra do 4/8pt grid). Isso garante alinhamento matemático e consistência visual.

### Grid e Espaçamento (Padding/Margin)
| Token | Tamanho | Uso |
| :--- | :--- | :--- |
| **xs** | `4px` | Ajustes finos, espaço entre ícone e texto. |
| **sm** | `8px` | Espaço interno de botões compactos, gap de elementos relacionados. |
| **md** | `16px` | Padding padrão de cards densos, gap entre colunas. |
| **lg** | `24px` | Padding padrão de cards confortáveis, separação de seções. |
| **xl** | `32px` | Separação de grandes blocos de layout. |
| **2xl** | `48px` | Margens de layout principais. |

### Altura de Elementos Interativos (Inputs & Botões)
A consistência na altura cria ritmo vertical.

*   **Desktop (Mouse):** Altura **40px** (`h-10`). Foco em densidade.
*   **Tablet/Mobile (Touch):** Altura mínima **48px** (`h-12`). Foco em ergonomia.
*   **Botões Pequenos (Ações Secundárias):** Altura **32px** (`h-8`). Apenas desktop.

### Arredondamento (Border Radius)
Evite cantos excessivamente redondos que pareçam "brinquedo". Mantenha a sobriedade.

*   **Padrão:** `4px` ou `6px` (`rounded` ou `rounded-md`). Usado em botões, inputs, cards pequenos.
*   **Cards Grandes:** `8px` a `12px` (`rounded-lg`). Usado em contêineres principais.
*   **Proibido:** `rounded-full` para botões retangulares (formato "pílula"). Use apenas para tags/badges ou botões circulares de ícone.

---

## 9. Checklist de Conformidade

Antes de aprovar um PR ou Design:

- [ ]  O background é `pb.offWhite` (#F5F6F2)?
- [ ]  Estou usando alguma cor fora da paleta oficial? (Se sim, remova).
- [ ]  Os alertas (Verde/Amarelo/Vermelho) ocupam menos de 10% da área da tela?
- [ ]  O dado (número/informação) está mais visível que a caixa que o contém?
- [ ]  A tipografia é legível (Inter/Roboto/Plex Sans)?
- [ ]  O design parece "chato" mas profissional? (Isso é um elogio aqui).
