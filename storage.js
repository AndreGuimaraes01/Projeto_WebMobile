// ========== STORAGE.JS - Gerenciamento de Alertas ==========

class AlertStorage {
    constructor() {
        this.key = 'radarCidadaoAlerts';
        this.init();
    }

    // Inicializa com dados de exemplo se vazio
    init() {
        const existing = localStorage.getItem(this.key);
        if (!existing) {
            const defaultAlerts = [
                {
                    id: 'alert-1',
                    type: 'agua',
                    title: 'Alagamento',
                    description: 'Via parcialmente alagada',
                    latitude: -23.5515,
                    longitude: -46.6330,
                    severity: 'urgent',
                    timestamp: Date.now()
                },
                {
                    id: 'alert-2',
                    type: 'lixo',
                    title: 'Acúmulo de Lixo',
                    description: 'Lixo acumulado na esquina',
                    latitude: -23.5520,
                    longitude: -46.6340,
                    severity: 'moderate',
                    timestamp: Date.now()
                }
            ];
            localStorage.setItem(this.key, JSON.stringify(defaultAlerts));
            console.log('✅ Storage inicializado com alertas padrão');
        }
    }

    // Adiciona um novo alerta
    addAlert(alert) {
        try {
            const alerts = this.getAlerts();

            const newAlert = {
                id: 'alert-' + Date.now(),
                type: alert.type || 'agua',
                title: alert.title || 'Alerta',
                description: alert.description || '',
                latitude: alert.latitude,
                longitude: alert.longitude,
                severity: alert.severity || 'moderate',
                timestamp: Date.now()
            };

            alerts.push(newAlert);
            localStorage.setItem(this.key, JSON.stringify(alerts));

            console.log('✅ Alerta adicionado:', newAlert);

            // Dispara evento para atualizar outras páginas
            window.dispatchEvent(new CustomEvent('alertAdded', {
                detail: newAlert
            }));

            return newAlert;
        } catch (err) {
            console.error('❌ Erro ao adicionar alerta:', err);
            throw err;
        }
    }

    // Retorna todos os alertas
    getAlerts() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.error('❌ Erro ao ler alertas:', err);
            return [];
        }
    }

    // Calcula distância entre duas coordenadas (Haversine)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Retorna alertas próximos dentro de um raio
    getNearbyAlerts(lat, lon, radiusKm = 5) {
        const alerts = this.getAlerts();
        return alerts.filter(alert => {
            const distance = this.calculateDistance(lat, lon, alert.latitude, alert.longitude);
            return distance <= radiusKm;
        }).map(alert => ({
            ...alert,
            distance: this.calculateDistance(lat, lon, alert.latitude, alert.longitude)
        }));
    }

    // Limpa todos os alertas
    clearAll() {
        localStorage.removeItem(this.key);
        console.log('🗑️ Todos os alertas removidos');
    }
}

// Cria instância global
const alertStorage = new AlertStorage();

console.log('✅ storage.js carregado com sucesso');
