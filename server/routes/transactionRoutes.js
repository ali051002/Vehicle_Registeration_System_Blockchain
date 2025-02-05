const express = require('express');
const authorize = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');
const router = express.Router();



/* Get transactions with optional filters for status and type(use) 
{
    "transactionStatus": "Pending/Approved",
    "transactionType": "Registration/Ownership transfer"
}
*/    
router.get('/transactions',authorize(['government official']), transactionController.fetchTransactions);
router.get('/transactions/pending',authorize(['government official']), transactionController.fetchPendingTransactions);//
router.get('/transactions/pendingtransfers',authorize(['government official']), transactionController.fetchPendingTransfers);
// get transaction pdf donload 
router.post('/generateTransactionPDF',authorize(['government official']), transactionController.GenerateTransactionPDFbyId);
//get all transactions
router.get('/generateAllTransactionsPDF',authorize(['government official']), transactionController.GenerateAllTransactionsPDF);

module.exports = router; 
