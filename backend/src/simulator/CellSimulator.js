
class CellSimulator {
    constructor(id, name, mqttClient) {
        this.id = id;
        this.name = name;
        this.mqttClient = mqttClient;

        // Configuration
        this.idealCycleTime = 10; // seconds per piece
        this.shiftLength = 8 * 3600; // 8 hours in seconds

        // State
        this.status = 'RUNNING'; // RUNNING, STOPPED, MAINTENANCE, ERROR
        this.lastPieceTime = Date.now();
        this.startTime = Date.now();

        // Production Counters
        this.produced = 0;
        this.good = 0;
        this.bad = 0;

        // Simulation Variance
        this.performanceFactor = 1.0; // 1.0 = perfect speed
        this.qualityFactor = 0.98; // 98% quality

        // OEE Metrics
        this.availability = 100;
        this.performance = 100;
        this.quality = 100;
        this.oee = 100;

        // Sensor Data
        this.temperature = 45.0;
        this.vibration = 2.0;
        this.currentProduct = 'PRATO-FUNDO-BRANCO';
        this.targetUnits = 5000;

        // Simulate some randomness
        this.randomizeFactors();
        setInterval(() => this.randomizeFactors(), 60000); // Change slightly every minute
    }

    randomizeFactors() {
        // Randomize performance between 0.8 and 1.1
        this.performanceFactor = 0.8 + Math.random() * 0.3;
        // Randomize quality between 0.90 and 0.99
        this.qualityFactor = 0.90 + Math.random() * 0.09;

        // Randomly change status occasionally
        if (Math.random() > 0.95) {
            const statuses = ['RUNNING', 'RUNNING', 'RUNNING', 'STOPPED', 'MAINTENANCE'];
            this.status = statuses[Math.floor(Math.random() * statuses.length)];
        } else if (this.status !== 'RUNNING' && Math.random() > 0.7) {
            this.status = 'RUNNING'; // Recovery
        }

        // Update product occasionally
        if (Math.random() > 0.98) {
            const products = ['PRATO-FUNDO-BRANCO', 'XICARA-CAFE-PRETO', 'BOWL-CERAMICA-AZUL', 'PRATO-RASO-VERDE'];
            this.currentProduct = products[Math.floor(Math.random() * products.length)];
            this.produced = 0; // Reset count for new product
            this.good = 0;
            this.bad = 0;
        }
    }

    tick() {
        // Update continuous sensors
        this.temperature = (this.status === 'RUNNING') ? 60 + Math.random() * 10 : 30 + Math.random() * 5;
        this.vibration = (this.status === 'RUNNING') ? 2 + Math.random() * 3 : 0.1;

        if (this.status !== 'RUNNING') return;

        const now = Date.now();
        const elapsed = (now - this.lastPieceTime) / 1000;
        const currentCycleTime = this.idealCycleTime / this.performanceFactor;

        if (elapsed >= currentCycleTime) {
            // Produced a piece
            this.produced++;

            // Determine quality
            if (Math.random() <= this.qualityFactor) {
                this.good++;
            } else {
                this.bad++;
            }

            this.lastPieceTime = now;
            this.publishUpdates();
        }

        this.calculateOEE();
    }

    calculateOEE() {
        const runTime = (Date.now() - this.startTime) / 1000; // simplified
        const plannedProductionTime = runTime; // Assuming 24/7 for simplicity or shift based

        // Availability: Run Time / Planned Production Time
        // For simulation, we'll penalize if status is not RUNNING
        this.availability = this.status === 'RUNNING' ? 95 + (Math.random() * 5) : 0;
        if (this.status === 'STOPPED') this.availability = 0;
        if (this.status === 'MAINTENANCE') this.availability = 0;

        // Performance: (Ideal Cycle Time * Total Pieces) / Run Time
        // Or simply compare current cycle time to ideal
        if (this.produced > 0) {
            const theoreticalMax = runTime / this.idealCycleTime;
            this.performance = Math.min(100, (this.produced / theoreticalMax) * 100);
        }

        // Quality: Good / Total
        if (this.produced > 0) {
            this.quality = (this.good / this.produced) * 100;
        }

        // OEE
        this.oee = (this.availability * this.performance * this.quality) / 10000;
    }

    publishUpdates() {
        if (!this.mqttClient) return;

        const baseTopic = `porto-brasil/cell/${this.id}`;

        const payload = {
            id: this.id,
            name: this.name,
            timestamp: new Date().toISOString(),
            status: this.status,
            production: {
                total: this.produced,
                good: this.good,
                bad: this.bad
            },
            oee: {
                availability: parseFloat(this.availability.toFixed(2)),
                performance: parseFloat(this.performance.toFixed(2)),
                quality: parseFloat(this.quality.toFixed(2)),
                global: parseFloat(this.oee.toFixed(2))
            },
            sensors: {
                temperature: parseFloat(this.temperature.toFixed(1)),
                vibration: parseFloat(this.vibration.toFixed(2))
            },
            product: {
                code: this.currentProduct,
                target: this.targetUnits
            }
        };

        // Publish main status
        this.mqttClient.publish(`${baseTopic}/telemetry`, JSON.stringify(payload));

        // Also simulate distinct raw topics if needed like the previous project
        this.mqttClient.publish(`${baseTopic}/status`, this.status);
    }
}

module.exports = CellSimulator;
