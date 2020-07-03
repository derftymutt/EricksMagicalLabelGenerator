const express = require('express');

const OrderController = require('../controllers/orders');

const router = express.Router();

router.post('', OrderController.createOrder);

router.get('', OrderController.getOrders);

router.get('/:id', OrderController.getOrder);

router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
