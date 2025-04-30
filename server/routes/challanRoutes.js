const express = require('express');
const { createChallanController, updateChallanPaymentController, getChallanDetailsByUserIdController } = require('../controllers/challanController');

const router = express.Router();

router.post('/createChallan', createChallanController);

router.put('/update-payment', updateChallanPaymentController);

router.get('/challan-details-byUserId', getChallanDetailsByUserIdController);

module.exports = router;
