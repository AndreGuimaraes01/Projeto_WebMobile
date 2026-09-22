/**
 * alerts-counter.js - Radar Cidadão
 * Mostra quantos alertas existem de cada tipo nos botões da página "Reportar".
 * O número aparece como um selo animado (CSS: .btn[data-count]::after).
 */

class AlertsCounter {
    constructor() {
        this.buttons = {
            agua: document.getElementById('btn-water'),
            lixo: document.getElementById('btn-trash')
        };
        this.stats = this.getStats();
        this.renderCounters();

        window.addEventListener('alertAdded', () => this.updateCounters());
    }

    // Conta alertas por tipo: { agua: 3, lixo: 1 }
    getStats() {
        const stats = { agua: 0, lixo: 0 };
        alertStorage.getAlerts().forEach(alerta => {
            if (alerta.type in stats) stats[alerta.type]++;
        });
        return stats;
    }

    // Total de alertas
    getTotalAlerts() {
        return alertStorage.getAlerts().length;
    }

    // Relê o storage e atualiza os selos
    updateCounters() {
        const antes = this.stats;
        this.stats = this.getStats();
        this.renderCounters(antes);
    }

    // Escreve o número no botão e anima se ele mudou
    renderCounters(antes = this.stats) {
        for (const tipo in this.buttons) {
            const btn = this.buttons[tipo];
            if (!btn) continue;

            const total = this.stats[tipo];
            if (total > 0) {
                btn.dataset.count = total;
            } else {
                delete btn.dataset.count;
            }

            if (total !== antes[tipo]) {
                btn.classList.remove('pulse-animate');
                void btn.offsetWidth; // reinicia a animação
                btn.classList.add('pulse-animate');
            }
        }
    }
}

const alertsCounter = new AlertsCounter();
