const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Register a vehicle
router.post('/registerVehicle', vehicleController.registerVehicle);

// Approve vehicle registration
router.post('/approveRegistration', vehicleController.approveRegistration);

// Request ownership transfer
router.post('/transferOwnership', vehicleController.transferOwnership);

// Approve ownership transfer
router.post('/approveTransfer', vehicleController.approveTransfer);

// Get all vehicles
router.get('/vehicles', vehicleController.fetchAllVehicles);

// Get vehicle by ID
router.get('/vehicle/:id', vehicleController.fetchVehicleById);

// Get vehicles by owner
router.post('/vehiclesByOwner', vehicleController.fetchVehiclesByOwner);

// Get vehicles by owner's CNIC
router.post('/vehiclesByOwnerCNIC', vehicleController.fetchVehiclesByOwnerCNIC);

// Create a new vehicle
router.post('/vehicle', vehicleController.addVehicle);

// Update a vehicle
router.put('/vehicle', vehicleController.modifyVehicle);

// Delete a vehicle
router.delete('/vehicle/:id', vehicleController.removeVehicle);

module.exports = router;
