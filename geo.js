class GeoLocation {
    constructor() {
        this.key = 'userLocation';
        this.userLocation = this.loadLocation();
    }
    loadLocation() {
        try {
            return JSON.parse(localStorage.getItem(this.key));
        } catch (err) {
            return null;
        }
    }

    getLocation() {
        return this.userLocation;
    }

    saveLocation(latitude, longitude, manual) {
        const location = { latitude, longitude, manual, timestamp: Date.now() };

        localStorage.setItem(this.key, JSON.stringify(location));
        this.userLocation = location;

        window.dispatchEvent(new CustomEvent('locationUpdated', { detail: location }));
        return location;
    }

    setLocationManual(lat, lon) {
        lat = parseFloat(lat);
        lon = parseFloat(lon);

        if (isNaN(lat) || isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
            throw new Error('Coordenadas inválidas');
        }
        return this.saveLocation(lat, lon, true);
    }

    setLocationGPS() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('GPS não disponível neste navegador'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => resolve(this.saveLocation(pos.coords.latitude, pos.coords.longitude, false)),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }
}

const geo = new GeoLocation();

window.addEventListener('storage', (e) => {
    if (e.key === geo.key) {
        geo.userLocation = geo.loadLocation();
        window.dispatchEvent(new CustomEvent('locationUpdated'));
    }
});

if (!geo.getLocation()) {
    geo.setLocationGPS().catch(() => {
        console.log('GPS indisponível - use a localização manual em "Plano"');
    });
}
