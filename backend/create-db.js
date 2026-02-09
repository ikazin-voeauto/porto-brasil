const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
    // Connect to the default 'postgres' database first
    const client = new Client({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: 'postgres', // Connect to default db
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
    });

    try {
        await client.connect();
        console.log('✅ Connected to PostgreSQL');

        // Check if database exists
        const checkDb = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'portal_brasil'"
        );

        if (checkDb.rows.length > 0) {
            console.log('ℹ️  Database "portal_brasil" already exists');
        } else {
            await client.query('CREATE DATABASE portal_brasil');
            console.log('✅ Database "portal_brasil" created successfully');
        }

        await client.end();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

createDatabase();
