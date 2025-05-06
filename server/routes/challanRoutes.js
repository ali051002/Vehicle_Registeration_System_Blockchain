const express = require("express")
const {
  createChallanController,
  updateChallanPaymentController,
  getChallanDetailsByUserIdController,
  createStripePaymentSessionController,
  confirmChallanPayment,
} = require("../controllers/challanController")
const { authenticateToken } = require("../middleware/auth") // Assuming you have auth middleware

const router = express.Router()

// Apply authentication middleware to all routes EXCEPT the payment route
// This makes it clear which routes require authentication
router.post("/createChallan", authenticateToken, createChallanController)
router.put("/update-payment", authenticateToken, updateChallanPaymentController)
router.get("/challan-details-byUserId", authenticateToken, getChallanDetailsByUserIdController)

// Make the payment route public (no authentication required)
// If you DO need authentication, use: router.post("/stripe/payChallanbyId", authenticateToken, createStripePaymentSessionController)
router.post("/stripe/payChallanbyId", createStripePaymentSessionController)
router.post("/stripe/confirm-payment", authenticateToken, confirmChallanPayment)

// Note: The webhook route is defined in server.js because it needs special body parsing

module.exports = router
