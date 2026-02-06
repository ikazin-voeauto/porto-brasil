
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./api/routes');
const totvsRoutes = require('./totvs_mock/routes');

app.use('/api', apiRoutes);
app.use('/totvs-api', totvsRoutes); // Mount TOTVS mock on a separate base to simulate external API

// Start Simulator
const simulationManager = require('./simulator/SimulationManager');
simulationManager.start();

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

// Start Server
app.listen(port, () => {
    console.log(`Backend Application running on port ${port}`);
    console.log(`- API: http://localhost:${port}/api`);
    console.log(`- TOTVS Mock: http://localhost:${port}/totvs-api`);
});
