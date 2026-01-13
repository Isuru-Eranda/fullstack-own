const express = require('express');
const { getUserOrders, getOrderReceipt, getAllOrders, cancelOrder } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getUserOrders);
router.get('/:id/receipt', protect, getOrderReceipt);

// Admin routes
router.get('/admin/all', protect, isAdmin, getAllOrders);
router.put('/:id/cancel', protect, isAdmin, cancelOrder);

module.exports = router;
