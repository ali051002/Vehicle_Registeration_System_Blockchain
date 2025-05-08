const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const fileUpload = require('express-fileupload');

// Middleware to handle file uploads
router.use(fileUpload());

// Get all vehicles(use)
router.get('/vehicles', vehicleController.fetchAllVehicles);
// Get vehicles by owner using owner ID(use)
router.post('/vehiclesByOwner', vehicleController.fetchVehiclesByOwner);

// Request Register a vehicle(use)
router.post('/registerVehicleRequest', vehicleController.registerVehicle);
// Approve Register a vehicle(use)
router.post('/approveRegistration', vehicleController.approveRegistration);
// Reject Request(use)
router.post('/rejectRequest', vehicleController.rejectRequest);

// Request ownership transfer(use)
router.post('/transferOwnership', vehicleController.transferOwnership);
// Approve ownership transfer(use)
router.post('/approveTransfer', vehicleController.approveTransfer);

router.post('/rejectTransfer',vehicleController.rejectRequest);
// Approve or Reject vehicle status updates
router.post('/vehicles/approve', vehicleController.updateVehicleStatusController);
router.post('/vehicles/reject', vehicleController.rejectRequest);

// Get vehicles in pending registration or unregistered status
router.get('/vehicles/pending', vehicleController.fetchPendingVehicles);

// Get registered or approved vehicles
router.get('/vehicles/registered', vehicleController.getRegisteredVehicles);

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
router.post('/uploadDocument', vehicleController.uploadVehicleDocument);

router.post('/fetchDocuments', vehicleController.fetchDocumentsByVehicleId);



module.exports = router;


