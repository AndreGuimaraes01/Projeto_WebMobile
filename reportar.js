const statusCard = document.getElementById('statusCard');
const statusTitle = statusCard.querySelector('.status-title');
const statusSubtitle = statusCard.querySelector('.status-subtitle');
const form = document.getElementById('report-form');
const formTitle = document.getElementById('form-title');
const alertType = document.getElementById('alert-type');
const descricao = document.getElementById('descricao');
const gravidade = document.getElementById('gravidade');
const reportStatus = document.getElementById('report-status');
const userReportCount = document.getElementById('userReportCount');

function showMessage(texto, tipo = '') {
    reportStatus.textContent = texto;
    reportStatus.className = 'report-status ' + tipo;
}

function updateLocationStatus() {
    const loc = geo.getLocation();

    statusCard.classList.toggle('ok', Boolean(loc));
    statusCard.classList.toggle('erro', !loc);

    if (!loc) {
        statusTitle.textContent = 'Sem localização';
        statusSubtitle.textContent = 'Permita o GPS ou configure em "Plano"';
        return;
    }

    statusTitle.textContent = `Localizado (${loc.manual ? 'Manual' : 'GPS'})`;
    statusSubtitle.textContent = `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
}

function updateUserReports() {
    const total = alertStorage.getMyAlertsToday().length;
    userReportCount.textContent = total === 0
        ? 'Você ainda não enviou nenhum alerta.'
        : `Você enviou ${total} alerta(s) hoje. Obrigado!`;
}

function openForm(tipo, titulo) {
    if (!geo.getLocation()) {
        showMessage('Defina sua localização primeiro em "Plano".', 'erro');
        return;
    }

    alertType.value = tipo;
    formTitle.textContent = titulo;
    form.hidden = false;
    showMessage('');
    form.scrollIntoView({ behavior: 'smooth' });
    descricao.focus();
}

function closeForm() {
    form.reset();
    form.hidden = true;
}

document.getElementById('btn-water').addEventListener('click', () => openForm('agua', 'Reportar Alagamento'));
document.getElementById('btn-trash').addEventListener('click', () => openForm('lixo', 'Reportar Acúmulo de Lixo'));
document.getElementById('btn-cancel').addEventListener('click', () => {
    closeForm();
    showMessage('');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const loc = geo.getLocation();
    const desc = descricao.value.trim();

    if (!loc) return showMessage('Localização não definida.', 'erro');
    if (!alertType.value) return showMessage(' Escolha o tipo de alerta.', 'erro');
    if (!desc) return showMessage('Descreva o problema.', 'erro');

    try {
        alertStorage.addAlert({
            type: alertType.value,
            description: desc,
            severity: gravidade.value,
            latitude: loc.latitude,
            longitude: loc.longitude
        });

        closeForm();
        showMessage('Alerta enviado com sucesso! Obrigado por ajudar a comunidade.', 'ok');
    } catch (err) {
        console.error('Erro ao salvar alerta:', err);
        showMessage('Erro ao enviar alerta: ' + err.message, 'erro');
    }
});

updateLocationStatus();
updateUserReports();
window.addEventListener('locationUpdated', updateLocationStatus);
window.addEventListener('alertAdded', updateUserReports);
