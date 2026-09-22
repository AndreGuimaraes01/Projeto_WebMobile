const plano = new CartesianPlane('mapCanvas', 'alertCount');

const locationForm = document.getElementById('locationForm');
const latInput = document.getElementById('latitude');
const lonInput = document.getElementById('longitude');
const btnGps = document.getElementById('btnGps');
const locationStatus = document.getElementById('locationStatus');

function updateStatus() {
    const loc = geo.getLocation();
    locationStatus.classList.remove('manual', 'gps');

    if (!loc) {
        locationStatus.textContent = 'Aguardando localização...';
        return;
    }

    latInput.value = loc.latitude.toFixed(4);
    lonInput.value = loc.longitude.toFixed(4);
    locationStatus.textContent =
        `Localização atual (${loc.manual ? 'Manual' : 'GPS'}): ` +
        `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
    locationStatus.classList.add(loc.manual ? 'manual' : 'gps');
}

locationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        geo.setLocationManual(latInput.value, lonInput.value);
    } catch (err) {
        locationStatus.textContent = '⚠️ ' + err.message + '. Ex.: -23.5505 e -46.6333';
    }
});

btnGps.addEventListener('click', () => {
    btnGps.disabled = true;
    locationStatus.textContent = '📡 Buscando GPS...';

    geo.setLocationGPS()
        .catch(err => {
            locationStatus.textContent = 'Não foi possível usar o GPS: ' + err.message;
        })
        .finally(() => {
            btnGps.disabled = false;
        });
});

updateStatus();
window.addEventListener('locationUpdated', updateStatus);
