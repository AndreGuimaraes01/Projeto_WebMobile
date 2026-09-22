/**
 * feed.js - Radar Cidadão
 * Página "Ver Bairro" (feed.html): lista os alertas próximos ao usuário.
 * Precisa de: storage.js e geo.js
 */

const RAIO_KM = 2;
const ICONES = { agua: '💧', lixo: '🗑️' };
const SELOS = {
    urgent: '<span class="badge badge-urgent">🔴 Urgente</span>',
    moderate: '<span class="badge badge-warning">🟡 Moderado</span>',
    low: '<span class="badge">🟢 Leve</span>'
};

const filtro = document.getElementById('filtro-tipo');
const lista = document.getElementById('alert-list');
const contador = document.getElementById('alertCount');

// "Há 5 min", "Há 2h", "Há 3d"
function tempoAtras(timestamp) {
    const minutos = Math.floor((Date.now() - timestamp) / 60000);
    if (minutos < 1) return 'Agora mesmo';
    if (minutos < 60) return `Há ${minutos} min`;
    if (minutos < 1440) return `Há ${Math.floor(minutos / 60)}h`;
    return `Há ${Math.floor(minutos / 1440)}d`;
}

// Mensagem única na lista (lista vazia, sem localização...)
function mostrarMensagem(texto) {
    lista.innerHTML = `<li class="alert-empty">${texto}</li>`;
}

// Monta o <li> de um alerta
function criarCard(alerta) {
    const li = document.createElement('li');
    li.className = 'alert-card';
    li.innerHTML = `
        <span class="alert-icon">${ICONES[alerta.type] || '⚠️'}</span>
        <article class="alert-info">
            <h4>${alerta.title} ${SELOS[alerta.severity] || ''}</h4>
            <p>A ${Math.round(alerta.distance * 1000)} m de você</p>
            <time datetime="${new Date(alerta.timestamp).toISOString()}">${tempoAtras(alerta.timestamp)}</time>
            <details>
                <summary class="alert-link">Ver detalhes</summary>
                <p class="descricao"></p>
                <p>Coordenadas: ${alerta.latitude.toFixed(4)}, ${alerta.longitude.toFixed(4)}</p>
            </details>
        </article>
    `;
    // textContent evita que o texto digitado vire HTML
    li.querySelector('.descricao').textContent = alerta.description || 'Sem descrição.';
    return li;
}

function renderAlerts() {
    const loc = geo.getLocation();

    if (!loc) {
        contador.textContent = '0';
        mostrarMensagem('📍 Defina sua localização em "Plano" para ver os alertas.');
        return;
    }

    const proximos = alertStorage.getNearbyAlerts(loc.latitude, loc.longitude, RAIO_KM);
    const tipo = filtro.value;
    const exibidos = tipo === 'todos' ? proximos : proximos.filter(a => a.type === tipo);

    contador.textContent = proximos.length;

    if (exibidos.length === 0) {
        mostrarMensagem('✨ Nenhum alerta nesta região no momento');
        return;
    }

    lista.innerHTML = '';
    exibidos.forEach(alerta => lista.appendChild(criarCard(alerta)));
}

// Inicialização
renderAlerts();
filtro.addEventListener('change', renderAlerts);
window.addEventListener('locationUpdated', renderAlerts);
window.addEventListener('alertAdded', renderAlerts);
