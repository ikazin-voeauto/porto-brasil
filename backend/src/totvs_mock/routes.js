
const express = require('express');
const router = express.Router();

/**
 * Middleware: Simulate TOTVS Authentication (Basic Auth)
 * User: admin
 * Pass: totvs
 */
const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            code: "Unauthorized",
            message: "Authentication credentials required",
            detailedMessage: "Send Basic Auth header."
        });
    }
    const b64auth = authHeader.split(' ')[1];
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login === 'admin' && password === 'totvs') {
        return next();
    }

    return res.status(403).json({
        code: "Forbidden",
        message: "Invalid credentials",
        detailedMessage: "Access denied for user."
    });
};

// Apply Auth to all routes
// router.use(checkAuth); // Uncomment to enforce auth strictly, kept open for demo ease or use specific routes

// Mock Database of Production Orders (SC2 Table equivalent)
const productionOrders = [
    { C2_NUM: '100101', C2_PRODUTO: 'PRATO-FUNDO-BRANCO', C2_QUANT: 5000, C2_EMISSAO: '2026-02-01', C2_STATUS: 'S' }, // S=Started
    { C2_NUM: '100102', C2_PRODUTO: 'XICARA-CAFE-PRETO', C2_QUANT: 12000, C2_EMISSAO: '2026-02-02', C2_STATUS: 'P' }, // P=Planned
    { C2_NUM: '100103', C2_PRODUTO: 'BOWL-CERAMICA-AZUL', C2_QUANT: 3000, C2_EMISSAO: '2026-02-03', C2_STATUS: 'S' },
    { C2_NUM: '100104', C2_PRODUTO: 'PRATO-RASO-VERDE', C2_QUANT: 4500, C2_EMISSAO: '2026-02-04', C2_STATUS: 'P' },
    { C2_NUM: '100105', C2_PRODUTO: 'SOLA-SAPATO-BORRACHA', C2_QUANT: 1000, C2_EMISSAO: '2026-02-05', C2_STATUS: 'E' } // E=Ended
];

/**
 * Resource: /api/v1/production-orders
 * Description: Retrieves list of Production Orders
 * Standard TOTVS Paging: page=1, pageSize=10
 */
router.get('/production-orders', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = productionOrders.slice(start, end);

    res.json({
        hasNext: end < productionOrders.length,
        items: items.map(op => ({
            orderId: op.C2_NUM,
            productCode: op.C2_PRODUTO,
            quantity: op.C2_QUANT,
            status: op.C2_STATUS,
            issueDate: op.C2_EMISSAO
        })),
        total: productionOrders.length
    });
});

/**
 * Resource: /api/v1/sfca314
 * Description: Production Appointment (Apontamento de Produção)
 * Simulates the SFCA314 routine via REST
 */
router.post('/sfca314', (req, res) => {
    const { orderId, quantity, type, workCenter } = req.body;

    // Validation
    if (!orderId || !quantity || !type) {
        return res.status(400).json({
            code: "Bad Request",
            message: "Missing parameters",
            detailedMessage: "orderId, quantity and type are required."
        });
    }

    const op = productionOrders.find(o => o.C2_NUM === orderId);
    if (!op) {
        return res.status(404).json({
            code: "NotFound",
            message: "Production Order not found",
            detailedMessage: `Order ${orderId} does not exist in SC2.`
        });
    }

    if (op.C2_STATUS === 'E') {
        return res.status(422).json({
            code: "BusinessError",
            message: "Order already ended",
            detailedMessage: "Cannot report production for an ended order."
        });
    }

    // Simulate Processing time
    setTimeout(() => {
        // Success Logic
        console.log(`[TOTVS Mock] SFCA314: OP=${orderId} Qty=${quantity} WC=${workCenter} Type=${type}`);

        res.status(201).json({
            transactionId: Math.floor(Math.random() * 1000000000).toString(),
            status: "Success",
            message: "Production reported successfully.",
            generatedId: "H6" + Math.floor(Math.random() * 10000) // Simulating standard ID
        });
    }, 300);
});

module.exports = router;
