const express = require('express');
const { createChallanController, updateChallanPaymentController, getChallanDetailsByUserIdController, createStripePaymentSessionController,confirmChallanPayment,stripeWebhook} = require('../controllers/challanController');

const router = express.Router();

router.post('/createChallan', createChallanController);

router.put('/update-payment', updateChallanPaymentController);

router.get('/challan-details-byUserId', getChallanDetailsByUserIdController);

router.post('/stripe/payChallanbyId', createStripePaymentSessionController);

router.post('/stripe/confirm-payment', confirmChallanPayment);

//router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;

