**Integrantes do Grupo:**
- André Moreira Guimarães, RA: 10416590
- Tomy Boimel, RA: 10417109

---

# Projeto Web Mobile - Radar Cidadão (Alertas de Bairro)

## 1. Processo de Ideação

### O Problema Social e o Contexto (Extensão Universitária)
Em metrópoles como São Paulo, a rápida urbanização aliada a desafios infraestruturais resulta em problemas crônicos como enchentes repentinas e acúmulo irregular de lixo em vias públicas. Esses eventos geram transtornos severos de mobilidade, riscos à saúde pública e prejuízos materiais. Atualmente, os moradores dependem de canais oficiais burocráticos ou de noticiários genéricos, muitas vezes descobrindo o problema apenas quando ficam presos no trânsito ou no trajeto a pé.

### A Solução Proposta: "Radar Cidadão"
Desenvolver uma aplicação web mobile colaborativa focada em micro-comunidades, inspirada na mecânica de alertas do Waze, mas com forte apelo em zeladoria urbana. A aplicação permite que o cidadão registre ocorrências exatamente onde ele está usando o GPS do dispositivo (insert) e visualize uma lista dinâmica de alertas ativos restritos à sua região ou bairro (listagem), criando uma rede de proteção e informação vizinha.

### Justificativa do Uso Exclusivo de Tecnologias Puras (Vanilla JS, HTML5, CSS3)
Para atender ao rigor técnico da disciplina e demonstrar o domínio dos fundamentos do desenvolvimento web mobile, a aplicação será construída exclusivamente com código nativo do navegador, sem o uso de frameworks (React, Vue, etc.) ou bibliotecas externas. A lógica dependerá dos seguintes recursos:

*   **HTML5 & CSS3 Responsivo:** Layout *Mobile First* utilizando Flexbox e CSS Grid nativos e *Media Queries* para garantir adaptação a qualquer tamanho de tela de smartphone.
*   **Geolocation API (Nativo em JS):** O JavaScript acessará a API navigator.geolocation para capturar a latitude e longitude exatas do usuário no momento do reporte (getCurrentPosition()). Sem esse recurso nativo, a aplicação não funciona.
*   **Manipulação Dinâmica do DOM: A renderização dos "cards" de alerta na tela de listagem não usará ng-repeat, mas sim métodos nativos como document.createElement(), document.getElementById() e innerHTML para injetar o conteúdo filtrado pelo JS.
*   **Lógica de Filtragem e Persistência Local:** Sem um backend nesta fase, utilizaremos a **Web Storage API (LocalStorage)** para simular o banco de dados. O JS lerá esse JSON local, aplicará cálculos matemáticos nativos (Math.sqrt(), Math.cos()) para determinar a distância entre o usuário e cada ocorrência, e filtrará a lista de arrays puras para exibir apenas os problemas "do bairro" (ex: raio de 2km).

### Objetivo de Extensão
Empoderar comunidades locais por meio de uma ferramenta tecnológica simples e autônoma, promovendo a segurança na mobilidade urbana e o letramento cívico comunitário.

---

## 2. Protótipo em Wireframe

Abaixo, apresentamos as principais interações do usuário focadas no uso de localização (Geolocalização via JS Puro):

### Tela 1: Reporte por Localização (Insert)
*(Nesta tela, o JavaScript acessa a Geolocation API ao carregar a página para identificar a rua atual do usuário. O usuário então seleciona o tipo de problema para um registro rápido e preciso.)*

<img width="401" height="637" alt="tela1" src="https://github.com/user-attachments/assets/1f514c82-30ad-4e9f-9a2b-6a6e56fb8d97" />



### Tela 2: Feed Dinâmico do Bairro (Listagem)
*(A lista gerada pelo JavaScript Puro a partir do LocalStorage. O script calcula a distância de cada ocorrência e renderiza dinamicamente os "cards", filtrando apenas os alertas que estão próximos ao usuário.)*

<img width="385" height="634" alt="tela2" src="https://github.com/user-attachments/assets/db66b362-c977-4a26-8567-286b042dcb6b" />


