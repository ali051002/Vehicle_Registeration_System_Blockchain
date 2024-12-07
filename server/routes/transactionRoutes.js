const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');


/* Get transactions with optional filters for status and type(use) 
{
    "transactionStatus": "Pending/Approved",
    "transactionType": "Registration/Ownership transfer"
}
*/    
router.get('/transactions', transactionController.fetchTransactions);
router.get('/transactions/pending', transactionController.fetchPendingTransactions);
router.get('/transactions/pendingtransfers', transactionController.fetchPendingTransfers);


module.exports = router;
