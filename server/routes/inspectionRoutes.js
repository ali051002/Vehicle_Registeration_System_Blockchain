const express = require('express');
const authorize = require('../middleware/authMiddleware');
const { sendInspectionRequestController, getInspectionRequestsByOfficerIdController, getAllUsersWithInspectionOfficersController,approveInspectionRequestController } = require('../controllers/inspectionController');

const router = express.Router();

// Route to send an inspection request
router.post('/send-inspection-request',authorize(['government official']), sendInspectionRequestController);

// Route to fetch inspection requests by officer ID
router.get('/fetch-inspection-request-byOfficialID',authorize(['government official','InspectionOfficer']), getInspectionRequestsByOfficerIdController);

// Route to fetch all users with the "InspectionOfficer" role
router.get('/fetch-all-inspection-officers',authorize(['government official','InspectionOfficer']), getAllUsersWithInspectionOfficersController);

router.put('/approveInspection',authorize(['InspectionOfficer']), approveInspectionRequestController);

module.exports = router;
