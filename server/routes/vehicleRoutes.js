const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Get all vehicles
router.get('/vehicles', vehicleController.fetchAllVehicles);

// Get vehicle by ID
router.get('/vehicle/:id', vehicleController.fetchVehicleById);

// Get vehicles by owner
router.get('/vehiclesByOwner', vehicleController.fetchVehiclesByOwner);

// Create vehicle
router.post('/vehicle', vehicleController.addVehicle);

// Update vehicle
router.put('/vehicle', vehicleController.modifyVehicle);

// Delete vehicle
router.delete('/vehicle/:id', vehicleController.removeVehicle);

module.exports = router;
