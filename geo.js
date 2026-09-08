/**
 * Geolocation Module - Radar Cidadão
 * Gerencia localização do usuário (automática via GPS ou manual)
 */

class GeoLocation {
    constructor() {
        this.userLocation = this.loadLocation();
        this.isManualMode = this.userLocation && this.userLocation.manual;
    }

    /**
     * Carrega localização do localStorage
     */
    loadLocation() {
        const stored = localStorage.getItem('userLocation');
        if (stored) {
            return JSON.parse(stored);
        }
        return null;
    }

    /**
     * Salva localização no localStorage
     */
    saveLocation(latitude, longitude, manual = false) {
        const location = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            manual: manual,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('userLocation', JSON.stringify(location));
        this.userLocation = location;
        this.isManualMode = manual;
        // Dispara evento customizado
        window.dispatchEvent(new CustomEvent('locationUpdated', { detail: location }));
        return location;
    }

    /**
     * Solicita localização via Geolocation API
     */
    requestGPSLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation não disponível'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.saveLocation(latitude, longitude, false);
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.warn('Erro ao obter GPS:', error);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    /**
     * Define localização manualmente
     */
    setManualLocation(latitude, longitude) {
        return this.saveLocation(latitude, longitude, true);
    }

    /**
     * Obtém localização atual
     */
    getLocation() {
        return this.userLocation;
    }

    /**
     * Calcula distância entre dois pontos (Haversine - em km)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Converte graus para radianos
     */
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Verifica se ponto está dentro de raio
     */
    isWithinRadius(lat1, lon1, lat2, lon2, radiusKm) {
        const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
        return distance <= radiusKm;
    }
}

// Instancia global
const geo = new GeoLocation();

// Tenta obter GPS ao carregar
document.addEventListener('DOMContentLoaded', () => {
    if (!geo.getLocation()) {
        geo.requestGPSLocation().catch(err => {
            console.log('GPS não disponível - use localização manual');
        });
    }
});
