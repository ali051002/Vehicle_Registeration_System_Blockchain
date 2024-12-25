const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();



/* Get transactions with optional filters for status and type(use) 
{
    "transactionStatus": "Pending/Approved",
    "transactionType": "Registration/Ownership transfer"
}
*/    
router.get('/transactions', transactionController.fetchTransactions);
router.get('/transactions/pending', transactionController.fetchPendingTransactions);//
router.get('/transactions/pendingtransfers', transactionController.fetchPendingTransfers);
// get transaction pdf donload 
router.post('/generateTransactionPDF', transactionController.GenerateTransactionPDFbyId);
//get all transactions
router.get('/generateAllTransactionsPDF', transactionController.GenerateAllTransactionsPDF);

module.exports = router; 
