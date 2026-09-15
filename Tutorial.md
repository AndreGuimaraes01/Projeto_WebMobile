# 📍 Radar Cidadão - Documentação Completa

**Versão:** 2.0  
**Data:** Setembro 2026  
**Autores:** André Moreira Guimarães, Tomy Boimel

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [O Problema e a Solução](#o-problema-e-a-solução)
3. [Funcionalidades](#funcionalidades)
4. [Arquitetura Técnica](#arquitetura-técnica)
5. [Como Usar](#como-usar)
6. [Estrutura de Arquivos](#estrutura-de-arquivos)
7. [Guia de Desenvolvimento](#guia-de-desenvolvimento)
8. [Recursos JavaScript](#recursos-javascript)
9. [Perguntas Frequentes](#perguntas-frequentes)

---

## 🎯 Visão Geral

**Radar Cidadão** é uma aplicação web mobile colaborativa que permite aos cidadãos reportar e visualizar alertas sobre problemas urbanos em suas comunidades locais.

**Inspiração:** Waze para problemas urbanos (alagamentos, lixo, etc)

**Tecnologia:** HTML5, CSS3 e JavaScript Puro (Vanilla JS) - sem frameworks ou bibliotecas externas

**Objetivo de Extensão:** Empoderar comunidades locais através de uma ferramenta tecnológica acessível para melhorar a segurança na mobilidade urbana

---

## 🚨 O Problema e a Solução

### O Desafio

Em metrópoles como São Paulo, problemas infraestruturais ocorrem constantemente:
- **Enchentes repentinas** por entupimento de bueiros
- **Acúmulo de lixo** em ruas e calçadas
- **Risco de mobilidade** para pedestres e veículos
- **Falta de informação rápida** sobre o que está acontecendo

Os cidadãos dependem de canais burocráticos ou noticiários genéricos, descobrindo problemas apenas quando já afetam diretamente suas rotas.

### A Solução Proposta

Radar Cidadão oferece:

✅ **Registro Rápido:** Reporte ocorrências onde você está usando GPS  
✅ **Visibilidade Local:** Veja alertas numa lista dinâmica filtrada por proximidade  
✅ **Dados Precisos:** Cada report inclui localização exata, tipo, gravidade e descrição  
✅ **Sem Dependências:** Funciona totalmente offline, dados salvos localmente  
✅ **Responsivo:** Interface otimizada para mobile, tablet e desktop

---

## ✨ Funcionalidades

### 1. 📍 Aba Reportar
**O que faz:** Permite criar um novo alerta sobre um problema encontrado

**Fluxo:**
1. Configurar localização (GPS ou manual) na aba "Plano"
2. Clicar em "Alagamento" ou "Lixo"
3. Preencher descrição do problema
4. Definir gravidade (Leve / Moderado / Grave)
5. Opcionalmente, adicionar foto
6. Enviar alerta

**Validações:**
- Localização é obrigatória
- Descrição não pode estar vazia
- Tipo de alerta deve estar definido

### 2. 📋 Aba Ver Bairro
**O que faz:** Exibe lista dinâmica de alertas próximos ao usuário

**Recursos:**
- Lista filtrada por distância (até 5km por padrão)
- Filtro por tipo (Todos, Alagamento, Lixo)
- Cards com ícone, tipo, descrição e gravidade
- Clique para ver detalhes completos
- Contador de alertas ativos

**Cálculo de Distância:** Usa fórmula Haversine para precisão geográfica

### 3. 🗺️ Aba Plano
**O que faz:** Gerencia localização do usuário e exibe mapa visual

**Recursos:**
- **GPS Automático:** Detecta posição do dispositivo
- **Entrada Manual:** Digite latitude e longitude manualmente
- **Mapa Interativo:** Canvas com plano cartesiano
- **Visualização Espacial:** Pontos de alertas mapeados no canvas
- **Legenda:** Cores diferentes para tipo e gravidade

**Componentes:**
- Entrada de coordenadas (Latitude / Longitude)
- Botão "Detectar Localização"
- Canvas para visualização do plano
- Status da localização atual
- Legenda de cores

### 4. 📚 Como Funciona (NOVO)
**O que faz:** Guia interativo sobre como usar a aplicação

**Conteúdo:**
- Explicação de cada aba
- Guia passo a passo
- Dicas e boas práticas
- Perguntas frequentes
- Informações técnicas

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

```
┌─────────────────────────────────────┐
│      Frontend (HTML/CSS/JS)         │
├─────────────────────────────────────┤
│  • HTML5 Semântico                  │
│  • CSS3 Responsivo (Mobile First)   │
│  • JavaScript Puro (Vanilla)        │
├─────────────────────────────────────┤
│      APIs Nativas do Navegador      │
├─────────────────────────────────────┤
│  • Geolocation API (GPS)            │
│  • LocalStorage (Persistência)      │
│  • DOM API (Manipulação)            │
│  • Canvas API (Renderização)        │
│  • File API (Upload de fotos)       │
└─────────────────────────────────────┘
```

### Módulos JavaScript

#### 📦 storage.js
Gerencia persistência e cálculos de dados

**Classe:** `AlertStorage`

**Métodos principais:**
```javascript
addAlert(alert)                              // Adiciona novo alerta
getAlerts()                                  // Retorna todos os alertas
getNearbyAlerts(lat, lon, radiusKm)         // Filtra por distância
calculateDistance(lat1, lon1, lat2, lon2)   // Calcula distância Haversine
clearAll()                                   // Limpa storage
```

**Dados de Exemplo:**
```javascript
{
    id: "alert-1702814400000",
    type: "agua" | "lixo",
    title: "Alagamento" | "Acúmulo de Lixo",
    description: "Via parcialmente alagada na Rua X",
    latitude: -23.5515,
    longitude: -46.6330,
    severity: "low" | "moderate" | "urgent",
    timestamp: 1702814400000
}
```

#### 📦 alerts-counter.js (NOVO)
Feature simples que anima contadores de alertas

**Classe:** `AlertsCounter`

**Métodos:**
```javascript
updateCounters()    // Lê storage e atualiza contadores
renderCounters()    // Mostra badges animados nos botões
getStats()         // Retorna dados formatados
getTotalAlerts()   // Retorna total
```

**Recurso Visual:** Badges com animação pop-in nos botões de ação

#### 📦 geo.js
Gerencia geolocalização do usuário

**Funções principais:**
```javascript
getLocation()      // Retorna localização armazenada
setLocationGPS()   // Detecta via GPS
setLocationManual() // Define manualmente
```

#### 📦 cartesiano.js
Renderiza plano cartesiano com alertas

**Funcionalidades:**
- Desenha canvas com grid
- Mapeia coordenadas geográficas para pixels
- Marca alertas com cores diferentes
- Marca posição do usuário
- Legenda interativa

### Fluxo de Dados

```
Usuario
  │
  ├─→ [Reportar] → AlertStorage.addAlert()
  │                    ↓
  │              localStorage.setItem()
  │                    ↓
  │              CustomEvent 'alertAdded'
  │
  ├─→ [Ver Bairro] → AlertStorage.getNearbyAlerts()
  │                    ↓
  │              Renderiza lista dinâmica
  │
  ├─→ [Plano] → geo.getLocation()
  │              cartesiano.draw()
  │
  └─→ [Como Funciona] → Guia estático + dicas
```

---

## 🎮 Como Usar

### Passo 1: Configurar Localização

1. Abra a aba **"Plano"** (🗺️)
2. Clique em **"Detectar Localização"** para usar GPS
   - Autorize acesso à localização no navegador
   - Aguarde alguns segundos
3. OU digite manualmente:
   - Latitude: -23.5515
   - Longitude: -46.6330
   - Clique em "Salvar Localização"

**Dica:** A localização fica salva no dispositivo para futuros reports

### Passo 2: Reportar um Problema

1. Vá para a aba **"Reportar"** (📍)
2. Verifique se há um card verde com sua localização
3. Clique em **"Alagamento"** ou **"Lixo"**
4. Preencha o formulário:
   - **Descrição:** Descreva exatamente o que viu
   - **Gravidade:** Escolha entre Leve / Moderado / Grave
   - **Foto (opcional):** Adicione uma imagem
5. Clique em **"Enviar Alerta"**
6. Confirme no popup de sucesso

**Boas Práticas:**
- Seja descritivo (altura da água, quantidade de lixo)
- Use fotos sempre que possível
- Classifique corretamente a gravidade

### Passo 3: Visualizar Alertas

1. Acesse a aba **"Ver Bairro"** (📋)
2. Veja a lista de alertas próximos a você
3. Use o filtro para ver apenas um tipo
4. Clique em um card para ver detalhes completos
5. Analise distância, tipo e gravidade

### Passo 4: Verificar Mapa Visual

1. Volte à aba **"Plano"** (🗺️)
2. Observe o plano cartesiano com:
   - 🟢 Seu ponto (posição atual)
   - 🔵 Pontos azuis (alagamentos)
   - 🟠 Pontos laranja (lixo)
   - 🔴 Pontos vermelhos (alertas urgentes)

---

## 📂 Estrutura de Arquivos

```
Projeto_WebMobile-main/
│
├── index.html              # Página de reporte
├── feed.html               # Feed de alertas
├── mapa.html               # Plano cartesiano
├── como-funciona.html      # Guia de uso (NOVO)
│
├── style.css               # Estilos responsivos
│
├── storage.js              # Gerenciador de alertas
├── alerts-counter.js       # Contador animado (NOVO)
├── geo.js                  # Geolocalização
├── cartesiano.js           # Renderização do plano
│
└── TUTORIAL.md             # Este arquivo
```

### Estrutura HTML Padrão

Cada página segue este template:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Radar Cidadão - [Página]</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <main id="app-container">
        <header>
            <h1>Título da Página</h1>
        </header>
        
        <section class="view">
            <!-- Conteúdo -->
        </section>
        
        <nav id="bottom-nav">
            <!-- Navegação móvel -->
        </nav>
        
        <footer>
            <!-- Rodapé -->
        </footer>
    </main>
    
    <script src="./storage.js"></script>
    <!-- Scripts adicionais -->
</body>
</html>
```

---

## 🔧 Guia de Desenvolvimento

### Ambiente de Desenvolvimento

**Requisitos:**
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Editor de código (VS Code, Sublime, etc)
- Servidor local (opcional, para testes de CORS)

**Iniciar Desenvolvimento:**
```bash
# Clone ou extraia o projeto
cd Projeto_WebMobile-main

# Abra qualquer HTML diretamente no navegador
# Ou use um servidor local:
python -m http.server 8000
# Acesse http://localhost:8000
```

### Adicionar Nova Feature

**Exemplo: Novo tipo de alerta**

1. **Edite storage.js** - Adicione novo tipo:
```javascript
// No objeto newAlert
type: 'agua' | 'lixo' | 'NOVO_TIPO'
```

2. **Edite index.html** - Novo botão:
```html
<button id="btn-novo" class="btn btn-primary">🆕 Novo Alerta</button>
```

3. **Adicione lógica em index.html**:
```javascript
document.getElementById('btn-novo').addEventListener('click', () => {
    // Seu código aqui
    alertType.value = 'novo';
});
```

4. **Edite style.css** - Cores e estilos:
```css
.novo-type {
    background: linear-gradient(...);
}
```

5. **Teste** - Recarregue o navegador

### Modificar Responsividade

**Media Queries Existentes:**
```css
/* Desktop (padrão) */
/* Tablet - 768px */
@media (max-width: 768px) { ... }

/* Mobile - 480px */
@media (max-width: 480px) { ... }
```

**Adicionar novo breakpoint:**
```css
@media (max-width: 320px) {
    /* Estilos para telas muito pequenas */
}
```

### Debug e Console

Todos os arquivos usam `console.log()` com emojis:
```javascript
console.log('✅ Sucesso');      // Verde
console.log('⚠️ Aviso');        // Amarelo
console.error('❌ Erro');        // Vermelho
```

**Acessar console:**
- Chrome/Edge: F12 → Console
- Firefox: F12 → Console
- Safari: Cmd+Option+I → Console

---

## 📚 Recursos JavaScript Utilizados

### Geolocation API
```javascript
navigator.geolocation.getCurrentPosition(success, error, options);
```

**Uso no projeto:**
```javascript
// Em geo.js
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => { /* Sucesso */ },
        error => { /* Erro */ }
    );
}
```

### LocalStorage API
```javascript
localStorage.setItem('key', JSON.stringify(data));
const data = JSON.parse(localStorage.getItem('key'));
localStorage.removeItem('key');
```

**Uso no projeto:**
- Armazenar alertas
- Salvar localização do usuário
- Persistir entre abas/sessões

### DOM API
```javascript
document.getElementById('id')
document.querySelector('.class')
element.addEventListener('click', handler)
element.innerHTML = '<html>'
```

**Uso no projeto:**
- Renderizar cards dinâmicos
- Manipular formulários
- Atualizar interface em tempo real

### Canvas API
```javascript
const ctx = canvas.getContext('2d');
ctx.fillRect(x, y, width, height);
ctx.fillText('texto', x, y);
```

**Uso no projeto:**
- Desenhar plano cartesiano
- Marcar pontos de alertas
- Renderizar legenda

### File API
```javascript
<input type="file" accept="image/*">
input.files[0]  // Acesso ao arquivo
```

**Uso no projeto:**
- Upload de fotos nos reports (preparado para futura integração)

---

## 🎨 Customização de Estilos

### Variáveis CSS (Temas)

Edite `:root` em `style.css`:

```css
:root {
    /* Cores primárias */
    --primary: #007bff;
    --primary-dark: #0056b3;
    --success: #4CAF50;
    --warning: #ffaa00;
    --danger: #ff4444;
    
    /* Espaçamento */
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    
    /* Tipografia */
    --font-size-base: 16px;
    --font-size-lg: 18px;
}
```

### Resposta Responsiva

**Mobile First:**
- Estilos base para mobile (480px)
- Ajustes para tablet (768px)
- Ajustes para desktop (1200px)

**Testes:**
```bash
# Chrome DevTools
Ctrl+Shift+I → Toggle device toolbar → Selecione dispositivo
```

---

## ❓ Perguntas Frequentes

### P: Onde os dados são salvos?
**R:** No LocalStorage do navegador. Cada dispositivo tem seus próprios dados isolados.

### P: Posso sincronizar com outro dispositivo?
**R:** Não, nesta versão. Os dados são locais. Versões futuras podem incluir sincronização na nuvem.

### P: Como funciona a distância?
**R:** Usa a fórmula Haversine que calcula a distância de arco entre dois pontos na Terra considerando raio de 6.371km.

### P: Posso deletar um alerta?
**R:** Atualmente não há função de delete individual. Use as DevTools para limpar o LocalStorage.

### P: Como limpar tudo?
**R:** Abra o Console (F12) e execute:
```javascript
localStorage.removeItem('radarCidadaoAlerts');
localStorage.removeItem('userLocation');
```

### P: Funciona sem internet?
**R:** Sim! Após carregar a página, tudo funciona offline. Geolocalização pode precisar de internet para melhor precisão.

### P: Qual é o tamanho máximo de foto?
**R:** Browsers limitam a ~5-10MB dependendo do dispositivo. Comprima imagens para melhor performance.

### P: Posso usar em PWA?
**R:** Sim! A estrutura é compatível. Adicione `manifest.json` e service worker para instalar como app.

---

## 🚀 Melhorias Futuras (Roadmap)

- [ ] Backend com Node.js/Express
- [ ] Banco de dados (MongoDB/PostgreSQL)
- [ ] Autenticação de usuários
- [ ] Upload de fotos para servidor
- [ ] Sincronização entre dispositivos
- [ ] Notificações em tempo real
- [ ] Dashboard com estatísticas
- [ ] Integração com APIs de trânsito
- [ ] PWA (Progressive Web App)
- [ ] Versão móvel nativa (React Native)

---

## 📞 Suporte

**Problemas Comuns:**

1. **GPS não funciona**
   - Verifique permissões do navegador
   - Use localização manual
   - Teste em navegador diferente

2. **Alertas não aparecem**
   - Limpe o cache (Ctrl+Shift+Delete)
   - Verifique o Console para erros
   - Tente em modo anônimo

3. **Interface desalinhada**
   - Zoom do navegador em 100%
   - Teste em outro navegador
   - Reporte bug com screenshot

---

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

---

**Desenvolvido com ❤️ para a comunidade de São Paulo**

Última atualização: Setembro 2026
