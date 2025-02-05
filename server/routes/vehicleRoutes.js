const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware');
const vehicleController = require('../controllers/vehicleController');
const fileUpload = require('express-fileupload');

// Middleware to handle file uploads
router.use(fileUpload());


// Get all vehicles(use)
router.get('/vehicles',authorize(['government official']), vehicleController.fetchAllVehicles);
// Get vehicles by owner using owner ID(use)
router.post('/vehiclesByOwner', vehicleController.fetchVehiclesByOwner);

// Request Register a vehicle(use)
router.post('/registerVehicleRequest',authorize(['user']), vehicleController.registerVehicle);
// Approve Register a vehicle(use)
router.post('/approveRegistration',authorize(['government official']), vehicleController.approveRegistration);
// Reject Request(use)
router.post('/rejectRequest',authorize(['government official']), vehicleController.rejectRequest);

// Request ownership transfer(use)
router.post('/transferOwnership',authorize(['user']), vehicleController.transferOwnership);
// Approve ownership transfer(use)
router.post('/approveTransfer',authorize(['government official']), vehicleController.approveTransfer);

router.post('/rejectTransfer',authorize(['government official']),vehicleController.rejectRequest);
// Approve or Reject vehicle status updates
router.post('/vehicles/approve',authorize(['government official']), vehicleController.updateVehicleStatusController);
router.post('/vehicles/reject',authorize(['government official']), vehicleController.rejectRequest);

// Get vehicles in pending registration or unregistered status
router.get('/vehicles/pending',authorize(['government official']), vehicleController.fetchPendingVehicles);

// Get registered or approved vehicles
router.get('/vehicles/registered',authorize(['government official']), vehicleController.getRegisteredVehicles);

// Get vehicles by user ID
router.get('/vehicles/user/:id', vehicleController.getUserVehiclesController);


// Get a single vehicle by ID
router.get('/vehicleById', vehicleController.fetchVehicleById);


// Get vehicles by owner's CNIC
router.post('/vehiclesByOwnerCNIC', vehicleController.fetchVehiclesByOwnerCNIC);

// Create a new vehicle
router.post('/vehicle', vehicleController.addVehicle);

// Update an existing vehicle
router.put('/vehicle', vehicleController.modifyVehicle);

// Delete a vehicle
router.delete('/vehicle/:id', vehicleController.removeVehicle);//

// Route to upload vehicle document
router.post('/uploadDocument',authorize(['user']), vehicleController.uploadVehicleDocument);

router.post('/fetchDocuments',authorize(['government official']), vehicleController.fetchDocumentsByVehicleId);



module.exports = router;


