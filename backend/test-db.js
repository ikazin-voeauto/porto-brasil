
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

async function testConnection() {
    console.log('Testing connection with settings:');
    console.log(`User: ${process.env.PG_USER}`);
    console.log(`Host: ${process.env.PG_HOST}`);
    console.log(`Database: ${process.env.PG_DATABASE}`);
    console.log(`Port: ${process.env.PG_PORT}`);

    try {
        await client.connect();
        console.log('✅ Connection successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Server time:', res.rows[0].now);
        await client.end();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        if (err.code) console.error('Error Code:', err.code);
        // Specialized hints
        if (err.code === '3D000') {
            console.error('Hint: The database "portal_brasil" might not exist. Try creating it with: CREATE DATABASE portal_brasil;');
        }
        if (err.code === '28P01') {
            console.error('Hint: Check your username or password.');
        }
    }
}

testConnection();
