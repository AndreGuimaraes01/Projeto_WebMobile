const CORES = {
    user: '#4CAF50',
    agua: '#00a8e1',
    lixo: '#ff9800',
    urgent: '#ff4444'
};

class CartesianPlane {
    constructor(canvasId, infoId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.info = document.getElementById(infoId);
        this.padding = 60;
        this.range = 0.02; // graus para cada lado do usuário (~2 km)

        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('locationUpdated', () => this.draw());
        window.addEventListener('alertAdded', () => this.draw());
    }

    // Ajusta o tamanho do canvas à largura da tela
    resize() {
        this.canvas.width = this.canvas.clientWidth || 600;
        this.canvas.height = Math.max(300, Math.round(this.canvas.width * 0.6));
        this.draw();
    }

    // Converte latitude/longitude em x/y do canvas
    toPixel(lat, lon, centro) {
        const w = this.canvas.width - 2 * this.padding;
        const h = this.canvas.height - 2 * this.padding;
        return {
            x: this.padding + ((lon - (centro.longitude - this.range)) / (2 * this.range)) * w,
            y: this.padding + (((centro.latitude + this.range) - lat) / (2 * this.range)) * h
        };
    }

    // O ponto cabe dentro da área do gráfico?
    isInside(p) {
        return p.x >= this.padding && p.x <= this.canvas.width - this.padding &&
               p.y >= this.padding && p.y <= this.canvas.height - this.padding;
    }

    // Desenha tudo
    draw() {
        const ctx = this.ctx;
        const user = geo.getLocation();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!user) {
            ctx.fillStyle = '#999';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Defina uma localização para ver o mapa',
                this.canvas.width / 2, this.canvas.height / 2);
            this.setInfo('Sem localização definida.');
            return;
        }

        this.drawGrid(user);
        const visiveis = this.drawAlerts(user);
        this.drawUser(user);

        const total = alertStorage.getAlerts().length;
        this.setInfo(`${total} alertas no total (${visiveis} visíveis nesta área)`);
    }

    // Grade, eixos e números das coordenadas
    drawGrid(user) {
        const ctx = this.ctx;
        const p = this.padding;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const partes = 4;

        ctx.font = '11px sans-serif';

        for (let i = 0; i <= partes; i++) {
            const x = p + i * (W - 2 * p) / partes;
            const y = p + i * (H - 2 * p) / partes;

            // Linhas da grade
            ctx.strokeStyle = '#e8e8e8';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, p);
            ctx.lineTo(x, H - p);
            ctx.moveTo(p, y);
            ctx.lineTo(W - p, y);
            ctx.stroke();

            // Números dos eixos
            const lon = user.longitude - this.range + i * (2 * this.range) / partes;
            const lat = user.latitude + this.range - i * (2 * this.range) / partes;
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText(lon.toFixed(4), x, H - p + 18);
            ctx.textAlign = 'right';
            ctx.fillText(lat.toFixed(4), p - 6, y + 4);
        }

        // Eixos X e Y
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p, p);
        ctx.lineTo(p, H - p);
        ctx.lineTo(W - p, H - p);
        ctx.stroke();

        // Nomes dos eixos
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Longitude (Oeste → Leste)', W / 2, H - 12);

        ctx.save();
        ctx.translate(14, H / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Latitude (Sul → Norte)', 0, 0);
        ctx.restore();
    }

    // Pontos dos alertas (retorna quantos apareceram)
    drawAlerts(user) {
        let visiveis = 0;

        alertStorage.getAlerts().forEach(alerta => {
            const pos = this.toPixel(alerta.latitude, alerta.longitude, user);
            if (!this.isInside(pos)) return;

            const cor = alerta.severity === 'urgent' ? CORES.urgent : (CORES[alerta.type] || '#007bff');
            this.drawPoint(pos, 7, cor);
            visiveis++;
        });

        return visiveis;
    }

    // Ponto verde do usuário com um anel em volta
    drawUser(user) {
        const pos = this.toPixel(user.latitude, user.longitude, user);

        this.ctx.strokeStyle = 'rgba(76, 175, 80, 0.4)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 26, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.drawPoint(pos, 9, CORES.user);
    }

    // Círculo colorido com borda branca
    drawPoint(pos, raio, cor) {
        this.ctx.fillStyle = cor;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, raio, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    // Texto abaixo do título do mapa
    setInfo(texto) {
        if (this.info) this.info.textContent = texto;
    }
}
