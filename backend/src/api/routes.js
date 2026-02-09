
const express = require('express');
const router = express.Router();
const simulationManager = require('../simulator/SimulationManager');
const db = require('../db');

// GET /api/cells - Get current state of all cells (Live)
router.get('/cells', (req, res) => {
    const data = simulationManager.getCellsState();
    res.json(data);
});

// GET /api/cells/:id - Get specific cell
router.get('/cells/:id', (req, res) => {
    const data = simulationManager.getCellsState();
    const cell = data.find(c => c.id === req.params.id);
    if (cell) {
        res.json(cell);
    } else {
        res.status(404).json({ error: 'Cell not found' });
    }
});

// POST /api/cells/:id/increment - Manual production count
router.post('/cells/:id/increment', (req, res) => {
    const { amount } = req.body;
    const success = simulationManager.incrementProduction(req.params.id, amount || 1);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Cell not found' });
    }
});

// POST /api/cells/:id/toggle - Toggle Status
router.post('/cells/:id/toggle', (req, res) => {
    const status = simulationManager.toggleStatus(req.params.id);
    if (status) {
        res.json({ success: true, status });
    } else {
        res.status(404).json({ error: 'Cell not found' });
    }
});

// GET /api/dashboard/summary - Aggregate data
router.get('/dashboard/summary', (req, res) => {
    const data = simulationManager.getCellsState();

    // Calculate global OEE
    const totalProduced = data.reduce((acc, c) => acc + c.production.total, 0);
    const avgOee = data.reduce((acc, c) => acc + parseFloat(c.oee.global), 0) / data.length;

    res.json({
        totalCells: data.length,
        activeCells: data.filter(c => c.status === 'RUNNING').length,
        totalProduced,
        globalOEE: avgOee.toFixed(2),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
