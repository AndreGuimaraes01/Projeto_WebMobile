/**
 * Cartesian Plane Module - Radar Cidadão
 * Renderiza plano cartesiano simples com usuário e alertas
 */

class CartesianPlane {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas não encontrado:', canvasId);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.padding = 60;

        // Escala em graus - com margem maior para visualizar bem
        this.latRange = 0.1;  // ~11km em latitude
        this.lonRange = 0.1;  // ~8km em longitude (menos devido a latitude)

        this.setupCanvas();
        this.setupEventListeners();

        // Desenha inicial
        setTimeout(() => this.draw(), 100);
    }

    /**
     * Configura dimensões do canvas
     */
    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = Math.max(300, rect.width - 20);
        this.height = Math.max(300, Math.min(600, window.innerHeight - 250));

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    /**
     * Event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.draw();
        });

        window.addEventListener('locationUpdated', () => {
            console.log('Localização atualizada, redesenhando...');
            this.draw();
        });

        window.addEventListener('alertAdded', () => {
            this.draw();
        });
    }

    /**
     * Calcula limites dinâmicos baseado na localização do usuário
     */
    getMapBounds() {
        const userLoc = geo.getLocation();

        if (!userLoc) {
            // Se sem localização, usa um padrão genérico
            return {
                latMin: -23.56,
                latMax: -23.46,
                lonMin: -46.72,
                lonMax: -46.62
            };
        }

        // Centraliza no usuário com margem
        return {
            latMin: userLoc.latitude - this.latRange / 2,
            latMax: userLoc.latitude + this.latRange / 2,
            lonMin: userLoc.longitude - this.lonRange / 2,
            lonMax: userLoc.longitude + this.lonRange / 2
        };
    }

    /**
     * Converte coordenadas geográficas para pixels no canvas
     */
    geoToPixel(latitude, longitude, bounds) {
        const x = this.padding +
                  ((longitude - bounds.lonMin) / (bounds.lonMax - bounds.lonMin)) *
                  (this.width - 2 * this.padding);

        const y = this.height - this.padding -
                  ((latitude - bounds.latMin) / (bounds.latMax - bounds.latMin)) *
                  (this.height - 2 * this.padding);

        return { x, y };
    }

    /**
     * Desenha o plano cartesiano completo
     */
    draw() {
        const bounds = this.getMapBounds();

        // Limpa canvas
        this.ctx.fillStyle = '#f9f9f9';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Desenha grid
        this.drawGrid(bounds);

        // Desenha eixos
        this.drawAxes(bounds);

        // Desenha alertas
        this.drawAlerts(bounds);

        // Desenha localização do usuário (por último, fica em cima)
        this.drawUserLocation(bounds);

        // Desenha legenda
        this.drawLegend();
    }

    /**
     * Desenha grid de fundo
     */
    drawGrid(bounds) {
        this.ctx.strokeStyle = '#e8e8e8';
        this.ctx.lineWidth = 1;

        // Grid vertical (5 linhas)
        for (let i = 0; i <= 5; i++) {
            const x = this.padding + (i / 5) * (this.width - 2 * this.padding);
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.padding);
            this.ctx.lineTo(x, this.height - this.padding);
            this.ctx.stroke();
        }

        // Grid horizontal (5 linhas)
        for (let i = 0; i <= 5; i++) {
            const y = this.padding + (i / 5) * (this.height - 2 * this.padding);
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, y);
            this.ctx.lineTo(this.width - this.padding, y);
            this.ctx.stroke();
        }
    }

    /**
     * Desenha eixos e labels
     */
    drawAxes(bounds) {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';

        // Eixo Y (latitude)
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, this.padding);
        this.ctx.lineTo(this.padding, this.height - this.padding);
        this.ctx.stroke();

        // Eixo X (longitude)
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, this.height - this.padding);
        this.ctx.lineTo(this.width - this.padding, this.height - this.padding);
        this.ctx.stroke();

        // Label X
        this.ctx.fillText('Longitude (Oeste → Leste)', this.width / 2 - 80, this.height - 15);

        // Label Y
        this.ctx.save();
        this.ctx.translate(20, this.height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Latitude (Sul → Norte)', 0, 0);
        this.ctx.restore();

        // Marcações nos eixos
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#666';

        // Marcações em X (longitude)
        for (let i = 0; i <= 5; i++) {
            const x = this.padding + (i / 5) * (this.width - 2 * this.padding);
            const lon = bounds.lonMin + (i / 5) * (bounds.lonMax - bounds.lonMin);
            this.ctx.fillText(lon.toFixed(4), x, this.height - this.padding + 15);
        }

        // Marcações em Y (latitude)
        this.ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const y = this.height - this.padding - (i / 5) * (this.height - 2 * this.padding);
            const lat = bounds.latMin + (i / 5) * (bounds.latMax - bounds.latMin);
            this.ctx.fillText(lat.toFixed(4), this.padding - 10, y + 4);
        }
    }

    /**
     * Desenha alertas no plano
     */
    drawAlerts(bounds) {
        const alerts = alertStorage.getAlerts();

        alerts.forEach(alert => {
            const pos = this.geoToPixel(alert.latitude, alert.longitude, bounds);

            // Verifica se está dentro do mapa visível
            if (pos.x < this.padding || pos.x > this.width - this.padding ||
                pos.y < this.padding || pos.y > this.height - this.padding) {
                return; // Pula se fora do mapa
            }

            // Cor baseada no tipo
            let color = '#007bff';
            if (alert.type === 'agua') color = '#00a8e1';
            if (alert.type === 'lixo') color = '#ff9800';

            // Mais escuro se urgente
            if (alert.severity === 'urgent') color = '#ff4444';

            // Desenha círculo do alerta
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 7, 0, 2 * Math.PI);
            this.ctx.fill();

            // Borda
            this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
        });
    }

    /**
     * Desenha localização do usuário
     */
    drawUserLocation(bounds) {
        const userLoc = geo.getLocation();
        if (!userLoc) {
            return;
        }

        const pos = this.geoToPixel(userLoc.latitude, userLoc.longitude, bounds);

        // Verifica se está dentro do mapa
        if (pos.x < this.padding || pos.x > this.width - this.padding ||
            pos.y < this.padding || pos.y > this.height - this.padding) {
            return;
        }

        // Círculo de raio (zona)
        this.ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
        this.ctx.fill();

        // Ponto de localização
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 9, 0, 2 * Math.PI);
        this.ctx.fill();

        // Borda branca
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        // Halo
        this.ctx.strokeStyle = 'rgba(76, 175, 80, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 28, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    /**
     * Desenha legenda
     */
    drawLegend() {
        const legendX = this.width - 170;
        const legendY = 20;

        // Fundo
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.fillRect(legendX - 10, legendY - 10, 160, 100);

        // Borda
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(legendX - 10, legendY - 10, 160, 100);

        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillStyle = '#333';

        // Sua localização
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.beginPath();
        this.ctx.arc(legendX + 10, legendY + 8, 4, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = '#333';
        this.ctx.font = '11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Sua Localização', legendX + 20, legendY + 12);

        // Alagamento
        this.ctx.fillStyle = '#00a8e1';
        this.ctx.beginPath();
        this.ctx.arc(legendX + 10, legendY + 30, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.fillStyle = '#333';
        this.ctx.fillText('Alagamento', legendX + 20, legendY + 34);

        // Lixo
        this.ctx.fillStyle = '#ff9800';
        this.ctx.beginPath();
        this.ctx.arc(legendX + 10, legendY + 52, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.fillStyle = '#333';
        this.ctx.fillText('Lixo', legendX + 20, legendY + 56);

        // Urgente
        this.ctx.fillStyle = '#ff4444';
        this.ctx.beginPath();
        this.ctx.arc(legendX + 10, legendY + 74, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.fillStyle = '#333';
        this.ctx.fillText('Urgente', legendX + 20, legendY + 78);
    }
}

// Instancia ao carregar
let cartesianPlane;
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cartesianCanvas');
    if (canvas) {
        cartesianPlane = new CartesianPlane('cartesianCanvas');
    }
});
