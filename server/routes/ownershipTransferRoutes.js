const express = require('express');
const router = express.Router();
const ownershipTransferController = require('../controllers/ownershipTransferController');

// Get all ownership transfers
router.get('/ownershipTransfers', ownershipTransferController.fetchAllOwnershipTransfers);

// Transfer ownership
router.post('/transferOwnership', ownershipTransferController.performOwnershipTransfer);

module.exports = router;
