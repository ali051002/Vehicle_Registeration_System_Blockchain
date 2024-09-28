const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');


// Get transactions with optional filters for status and type
router.get('/transactions', transactionController.fetchTransactions);

module.exports = router;
