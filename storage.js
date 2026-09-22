/**
 * storage.js - Radar Cidadão
 * Guarda e lê os alertas no localStorage.
 */

const TITULOS = {
    agua: 'Alagamento',
    lixo: 'Acúmulo de Lixo'
};

class AlertStorage {
    constructor() {
        this.key = 'radarCidadaoAlerts';

        if (!localStorage.getItem(this.key)) {
            this.save([
                {
                    id: 'alert-1', type: 'agua', title: TITULOS.agua,
                    description: 'Via parcialmente alagada',
                    latitude: -23.5515, longitude: -46.6330,
                    severity: 'urgent', timestamp: Date.now()
                },
                {
                    id: 'alert-2', type: 'lixo', title: TITULOS.lixo,
                    description: 'Lixo acumulado na esquina',
                    latitude: -23.5520, longitude: -46.6340,
                    severity: 'moderate', timestamp: Date.now()
                }
            ]);
        }
    }

    save(alerts) {
        localStorage.setItem(this.key, JSON.stringify(alerts));
    }

    getAlerts() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || [];
        } catch (err) {
            console.error('Erro ao ler alertas:', err);
            return [];
        }
    }

    addAlert(dados) {
        const alerta = {
            id: 'alert-' + Date.now(),
            type: dados.type,
            title: TITULOS[dados.type] || 'Alerta',
            description: dados.description || '',
            latitude: dados.latitude,
            longitude: dados.longitude,
            severity: dados.severity || 'moderate',
            mine: true,
            timestamp: Date.now()
        };

        const alerts = this.getAlerts();
        alerts.push(alerta);
        this.save(alerts);

        window.dispatchEvent(new CustomEvent('alertAdded', { detail: alerta }));
        console.log('Alerta adicionado:', alerta);
        return alerta;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const rad = (graus) => graus * Math.PI / 180;
        const dLat = rad(lat2 - lat1);
        const dLon = rad(lon2 - lon1);

        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    getNearbyAlerts(lat, lon, radiusKm = 5) {
        return this.getAlerts()
            .map(alerta => ({
                ...alerta,
                distance: this.calculateDistance(lat, lon, alerta.latitude, alerta.longitude)
            }))
            .filter(alerta => alerta.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);
    }

    getMyAlertsToday() {
        const hoje = new Date().toDateString();
        return this.getAlerts().filter(alerta =>
            alerta.mine && new Date(alerta.timestamp).toDateString() === hoje
        );
    }

    clearAll() {
        localStorage.removeItem(this.key);
        console.log('Todos os alertas removidos');
    }
}

const alertStorage = new AlertStorage();

window.addEventListener('storage', (e) => {
    if (e.key === alertStorage.key) {
        window.dispatchEvent(new CustomEvent('alertAdded'));
    }
});
