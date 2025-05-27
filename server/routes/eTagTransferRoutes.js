const express = require('express');
const router = express.Router();
const {
    getRegisteredVehiclesController,
    getUnregisteredVehiclesController,
    requestEtagTransferController,
    finalizeEtagTransferController
} = require('../controllers/eTagTransferController');


router.get('/etag/vehicles/registered/:userId', getRegisteredVehiclesController);
router.get('/etag/vehicles/unregistered/:userId', getUnregisteredVehiclesController);


router.post('/etag/request-transfer', requestEtagTransferController);
router.post('/etag/finalize', finalizeEtagTransferController);

module.exports = router;
