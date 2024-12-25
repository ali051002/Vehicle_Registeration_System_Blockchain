const express = require('express');
const { sendInspectionRequestController, getInspectionRequestsByOfficerIdController, getAllUsersWithInspectionOfficersController } = require('../controllers/inspectionController');

const router = express.Router();

// Route to send an inspection request
router.post('/send-inspection-request', sendInspectionRequestController);

// Route to fetch inspection requests by officer ID
router.get('/fetch-inspection-request-byOfficialID', getInspectionRequestsByOfficerIdController);

// Route to fetch all users with the "InspectionOfficer" role
router.get('/fetch-all-inspection-officers', getAllUsersWithInspectionOfficersController);

module.exports = router;
