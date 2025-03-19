const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');


router.post('/registerBC', blockchainController.registerVehicleBC);


router.get('/details', blockchainController.getVehicleDetailsBC);


router.get('/all', blockchainController.getAllRegistrationNumbersBC);


router.get('/ownership-history', blockchainController.getOwnershipHistoryBC);


router.post('/transfer-ownership', blockchainController.transferOwnershipBC);

module.exports = router;
