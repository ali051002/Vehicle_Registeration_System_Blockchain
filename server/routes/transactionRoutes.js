const express = require("express")
const router = express.Router()
const {
  fetchTransactions,
  fetchPendingTransactions,
  fetchPendingTransfers,
  GenerateTransactionPDFbyId,
  GenerateAllTransactionsPDF,
  fetchPaidTransactions,
} = require("../controllers/transactionController")
const { approveRegistration } = require("../controllers/approveRegistrationController")
const { authenticateToken } = require("../middleware/auth")

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Transaction routes
router.get("/transactions", fetchTransactions)
router.post("/transactions", fetchTransactions)
router.get("/transactions/pending", fetchPendingTransactions)
router.get("/transactions/pending-transfers", fetchPendingTransfers)
router.post("/generateTransactionPDF", GenerateTransactionPDFbyId)
router.get("/generateAllTransactionsPDF", GenerateAllTransactionsPDF)
router.get("/transactions/paid", fetchPaidTransactions)

// Approve registration route
router.post("/approveRegistration", approveRegistration)

module.exports = router
