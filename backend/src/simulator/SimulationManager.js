
const mqtt = require('mqtt');
const CellSimulator = require('./CellSimulator');
const { initDb, logSnapshot } = require('../db/schema');

class SimulationManager {
    constructor() {
        this.cells = [];
        this.client = null;
        this.isRunning = false;

        // Try to init DB, but don't block
        initDb();
    }

    start() {
        console.log('Starting Simulation Manager...');

        // Connect to MQTT
        // Default to localhost, but can be configured via env
        const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
        this.client = mqtt.connect(brokerUrl);

        this.client.on('connect', () => {
            console.log(`Connected to MQTT Broker at ${brokerUrl}`);
            this.initCells();
            this.startLoop();
        });

        this.client.on('error', (err) => {
            console.error('MQTT Connection Error:', err);
        });
    }

    initCells() {
        // Initialize 20 cells
        for (let i = 1; i <= 20; i++) {
            const id = i.toString().padStart(2, '0');
            const name = `Célula de Produção ${id}`;
            const cell = new CellSimulator(id, name, this.client);
            this.cells.push(cell);
        }
        console.log(`Initialized ${this.cells.length} Production Cells.`);
    }

    startLoop() {
        this.isRunning = true;

        // Update loop - 1Hz (1 second) simulation tick
        setInterval(() => {
            this.cells.forEach(cell => cell.tick());
        }, 1000);

        // Telemetry loop - Broadcast state explicitly every 2 seconds
        setInterval(() => {
            const states = this.getCellsState();
            states.forEach(state => {
                // Find the original cell to call publish
                // Or just modify logic. simpler: call publish on cell, then log using the formatted state
            });

            this.cells.forEach(cell => cell.publishUpdates());

            // Log to DB
            states.forEach(state => logSnapshot(state));
        }, 5000); // Log every 5 seconds to reduce noise
    }

    getCellsState() {
        return this.cells.map(cell => {
            let status = 'STOPPED';
            if (cell.status === 'RUNNING') status = 'OPERATIONAL';
            else if (cell.status === 'MAINTENANCE') status = 'MAINTENANCE';
            else if (cell.status === 'STOPPED') status = 'STOPPED';

            // Logic for 'WARNING': if Running but OEE < 60
            if (status === 'OPERATIONAL' && cell.oee < 60) status = 'WARNING';

            return {
                id: cell.id,
                name: cell.name,
                status: status,
                oee: parseFloat(cell.oee.toFixed(2)),
                availability: parseFloat(cell.availability.toFixed(2)),
                performance: parseFloat(cell.performance.toFixed(2)),
                quality: parseFloat(cell.quality.toFixed(2)),
                currentProduct: cell.currentProduct,
                unitsProduced: cell.produced,
                targetUnits: cell.targetUnits,
                goodPieces: cell.good,
                badPieces: cell.bad,
                temperature: parseFloat(cell.temperature.toFixed(1)),
                vibration: parseFloat(cell.vibration.toFixed(2)),
                // Extra fields for compatibility
                production: {
                    total: cell.produced,
                    good: cell.good,
                    bad: cell.bad
                }
            };
        });
    }
}

module.exports = new SimulationManager();
