const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.post('/checkout', saleController.procesarCompra);

router.get('/user/:id', saleController.getUserTickets);

module.exports = router;