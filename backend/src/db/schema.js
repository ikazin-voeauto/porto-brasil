
const { pool } = require('./index');

async function initDb() {
    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Table for Production Log (Granular)
            await client.query(`
                CREATE TABLE IF NOT EXISTS production_log (
                    id SERIAL PRIMARY KEY,
                    cell_id VARCHAR(50) NOT NULL,
                    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    product_code VARCHAR(100),
                    status VARCHAR(50),
                    units_good INTEGER DEFAULT 0,
                    units_bad INTEGER DEFAULT 0,
                    cycle_time_ms INTEGER
                );
            `);

            // Table for OEE Snapshots (Aggregated)
            await client.query(`
                CREATE TABLE IF NOT EXISTS oee_snapshots (
                    id SERIAL PRIMARY KEY,
                    cell_id VARCHAR(50) NOT NULL,
                    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    availability NUMERIC(5,2),
                    performance NUMERIC(5,2),
                    quality NUMERIC(5,2),
                    global_oee NUMERIC(5,2),
                    temperature NUMERIC(5,2),
                    vibration NUMERIC(5,2)
            );
        `);

            await client.query('COMMIT');
            console.log('Database initialized successfully.');
        } catch (e) {
            await client.query('ROLLBACK');
            console.error('Error initializing database:', e);
        } finally {
            client.release();
        }
    } catch (err) {
        // PostgreSQL not available - system will work without persistence
        console.warn('⚠️  PostgreSQL not available - running in memory-only mode');
        console.warn('   Install PostgreSQL 18 to enable data persistence');
    }
}

async function logProduction(data) {
    // Only log if there was production in this tick to save space, 
    // or log everything if granular tracking is needed. 
    // For simulation, we'll log when a piece is produced.
    if (data.production.good === 0 && data.production.bad === 0) return;

    try {
        const query = `
            INSERT INTO production_log (cell_id, product_code, status, units_good, units_bad, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [
            data.id,
            data.product.code,
            data.status,
            data.production.good, // This is cumulative in the object, we might want delta. 
            // For simplicity in this simulation, let's assume this function receives the current state 
            // and we rely on the implementation to control frequency or we modify the simulator to send events.
            data.production.bad,
            data.timestamp
        ];
        // Note: In a real scenario we'd calculate delta or log events. 
        // Here we will log snapshots.
        // await pool.query(query, values); 
    } catch (err) {
        console.error('Error logging production:', err.message);
    }
}

async function logSnapshot(data) {
    try {
        // Validate required data structure
        // Validate required data structure
        if (!data || !data.id || data.oee === undefined) {
            console.warn('Invalid data structure for logging snapshot - missing id or oee');
            return;
        }

        const query = `
            INSERT INTO oee_snapshots (cell_id, availability, performance, quality, global_oee, temperature, vibration, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        // Safely extract values support both nested (old) and flat (new/simulation) structures
        const safeOee = (typeof data.oee === 'object' && data.oee !== null) ? data.oee : {};
        const safeSensors = (typeof data.sensors === 'object' && data.sensors !== null) ? data.sensors : {};

        const values = [
            data.id,
            safeOee.availability !== undefined ? safeOee.availability : data.availability,
            safeOee.performance !== undefined ? safeOee.performance : data.performance,
            safeOee.quality !== undefined ? safeOee.quality : data.quality,
            safeOee.global !== undefined ? safeOee.global : (typeof data.oee === 'number' ? data.oee : 0),
            safeSensors.temperature !== undefined ? safeSensors.temperature : data.temperature,
            safeSensors.vibration !== undefined ? safeSensors.vibration : data.vibration,
            data.timestamp || new Date().toISOString()
        ];
        await pool.query(query, values);
    } catch (err) {
        // Suppress errors for simulation if DB isn't present
        // console.error('Error logging snapshot:', err.message);
    }
}

module.exports = { initDb, logSnapshot };
