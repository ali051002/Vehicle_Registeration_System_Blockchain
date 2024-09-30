const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');


// Register a vehicle
router.post('/registerVehicle', vehicleController.registerVehicle);

// Approve or Reject vehicle status updates
router.post('/vehicles/approve', vehicleController.updateVehicleStatusController);
router.post('/vehicles/reject', vehicleController.updateVehicleStatusController);

// Get vehicles in pending registration or unregistered status
router.get('/vehicles/pending', vehicleController.fetchPendingVehicles);

// Get registered or approved vehicles
router.get('/vehicles/registered', vehicleController.getRegisteredVehicles);

// Get vehicles by user ID
router.get('/vehicles/user/:id', vehicleController.getUserVehiclesController);

// Request ownership transfer
router.post('/transferOwnership', vehicleController.transferOwnership);

// Approve ownership transfer
router.post('/approveTransfer', vehicleController.approveTransfer);

// Get all vehicles
router.get('/vehicles', vehicleController.fetchAllVehicles);

// Get a single vehicle by ID
router.get('/vehicle/:id', vehicleController.fetchVehicleById);

// Get vehicles by owner using owner ID
router.post('/vehiclesByOwner', vehicleController.fetchVehiclesByOwner);

// Get vehicles by owner's CNIC
router.post('/vehiclesByOwnerCNIC', vehicleController.fetchVehiclesByOwnerCNIC);

// Create a new vehicle
router.post('/vehicle', vehicleController.addVehicle);

// Update an existing vehicle
router.put('/vehicle', vehicleController.modifyVehicle);

// Delete a vehicle
router.delete('/vehicle/:id', vehicleController.removeVehicle);

module.exports = router;
