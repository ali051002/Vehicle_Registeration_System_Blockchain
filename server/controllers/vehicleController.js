const {
    getAllVehicles,
    getVehicleById,
    getVehiclesByOwner,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    requestVehicleRegistration,
    approveVehicleRegistration,
    rejectVehicleRequest,
    requestOwnershipTransfer,
    approveOwnershipTransfer,
    getVehiclesByOwnerCNIC,
    updateVehicleStatus,
    getVehiclesByUserId // Add the update vehicle status function
} = require('../db/dbQueries');

// Get All Vehicles
const fetchAllVehicles = async (req, res) => {
    try {
        const result = await getAllVehicles();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
const fetchPendingVehicles = async (req, res) => {
    try {
        const allVehicles = await getAllVehicles();
        const pendingVehicles = allVehicles.filter(vehicle => vehicle.status === 'Pending' || vehicle.status === 'Unregistered');
        res.status(200).json(pendingVehicles);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


// Get Vehicle by ID
const fetchVehicleById = async (req, res) => {
    const vehicleId = req.params.id;
    if (!vehicleId) {
        return res.status(400).json({ msg: "Vehicle ID is required" });
    }
    try {
        const result = await getVehicleById(vehicleId);
        if (!result) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get Vehicles by Owner
const fetchVehiclesByOwner = async (req, res) => {
    const { ownerId } = req.body;
    if (!ownerId) {
        return res.status(400).json({ msg: "Owner ID is required" });
    }
    try {
        const result = await getVehiclesByOwner(ownerId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get Vehicles by Owner's CNIC
const fetchVehiclesByOwnerCNIC = async (req, res) => {
    const { cnic } = req.body;
    if (!cnic) {
        return res.status(400).json({ msg: "CNIC is required" });
    }
    try {
        const result = await getVehiclesByOwnerCNIC(cnic);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Create Vehicle
const addVehicle = async (req, res) => {
    const {
        registrationNumber,
        ownerId,
        make,
        model,
        year,
        color,
        chassisNumber,
        engineNumber,
        registrationDate,
        blockchainTransactionId,
        status,
        insuranceDetails,
        inspectionReports
    } = req.body;

    // Required fields validation based on the database schema
    if (!registrationNumber || !ownerId || !make || !model || !year || !chassisNumber || !engineNumber || !registrationDate || !status) {
        return res.status(400).json({ msg: "All required fields must be provided" });
    }

    try {
        await createVehicle({
            registrationNumber,
            ownerId,
            make,
            model,
            year,
            color, // Optional field
            chassisNumber,
            engineNumber,
            registrationDate,
            blockchainTransactionId, // Optional field
            status,
            insuranceDetails, // Optional field
            inspectionReports // Optional field
        });
        res.status(201).json({ msg: "Vehicle created successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Update Vehicle
const modifyVehicle = async (req, res) => {
    const {
        vehicleId,
        registrationNumber,
        ownerId,
        make,
        model,
        year,
        color,
        chassisNumber,
        engineNumber,
        registrationDate,
        blockchainTransactionId,
        status,
        insuranceDetails,
        inspectionReports
    } = req.body;

    if (!vehicleId) {
        return res.status(400).json({ msg: "Vehicle ID is required" });
    }

    try {
        await updateVehicle(
            vehicleId,
            {
                registrationNumber,
                ownerId,
                make,
                model,
                year,
                color,
                chassisNumber,
                engineNumber,
                registrationDate,
                blockchainTransactionId,
                status,
                insuranceDetails,
                inspectionReports
            }
        );
        res.status(200).json({ msg: "Vehicle updated successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Delete Vehicle
const removeVehicle = async (req, res) => {
    const vehicleId = req.params.id;
    if (!vehicleId) {
        return res.status(400).json({ msg: "Vehicle ID is required" });
    }
    try {
        await deleteVehicle(vehicleId);
        res.status(200).json({ msg: "Vehicle deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Request vehicle registration
const registerVehicle = async (req, res) => {
    const { ownerId, make, model, year, color, chassisNumber, engineNumber } = req.body;

    if (!ownerId || !make || !model || !year || !color || !chassisNumber || !engineNumber) {
        return res.status(400).json({ msg: "All required fields must be provided" });
    }

    try {
        const result = await requestVehicleRegistration(ownerId, make, model, year, color, chassisNumber, engineNumber);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Approve vehicle registration
const approveRegistration = async (req, res) => {
    const { transactionId, approvedBy, registrationNumber } = req.body;

    if (!transactionId || !approvedBy || !registrationNumber) {
        return res.status(400).json({ msg: "All required fields must be provided" });
    }

    try {
        await approveVehicleRegistration(transactionId, approvedBy, registrationNumber);
        res.status(200).json({ msg: "Vehicle registration approved successfully." });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


const rejectRequest = async (req, res) => {
    const { transactionId } = req.body;

    if (!transactionId) {
        return res.status(400).json({ msg: "All required fields must be provided" });
    }

    try {
        await rejectVehicleRequest(transactionId);
        res.status(200).json({ msg: "Request rejected successfully." });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Update vehicle status (Approve or Reject)
const updateVehicleStatusController = async (req, res) => {
    const { vehicleId, status } = req.body;

    // Ensure both vehicleId and status are provided
    if (!vehicleId || !status) {
        return res.status(400).json({ msg: "Vehicle ID and Status are required" });
    }

    try {
        // Call the function to update the vehicle status in the database
        await updateVehicleStatus(vehicleId, status); // Assuming this updates the status
        res.status(200).json({ msg: `Vehicle status updated to ${status}` });
    } catch (error) {
        console.error('Error updating vehicle status:', error.message);
        res.status(500).json({ msg: "Failed to update vehicle status" });
    }
};

const getRegisteredVehicles = async (req, res) => {
    try {
        const vehicles = await getAllVehicles(); // Fetch all vehicles
        const registeredOrApprovedVehicles = vehicles.filter(vehicle => vehicle.status === 'Registered' || vehicle.status === 'Approved'); // Filter both registered and approved vehicles
        res.status(200).json(registeredOrApprovedVehicles); // Return vehicles with either status
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const getUserVehiclesController = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the request parameters
        const vehicles = await getVehiclesByUserId(userId); // Fetch vehicles by user ID
        res.status(200).json(vehicles); // Respond with the vehicles
    } catch (error) {
        console.error('Error fetching vehicles for user:', error);
        res.status(500).json({ message: 'Error fetching vehicles for user', error: error.message });
    }
};



// Request ownership transfer
const transferOwnership = async (req, res) => {
    const { vehicleId, currentOwnerId, newOwnerCnic, transferFee } = req.body;

    if (!vehicleId || !currentOwnerId || !newOwnerCnic || !transferFee) {
        return res.status(400).json({ msg: "All required fields must be provided" });
    }

    try {
        await requestOwnershipTransfer(vehicleId, currentOwnerId, newOwnerCnic, transferFee);
        res.status(200).json({ msg: "Ownership transfer requested successfully." });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Approve ownership transfer
const approveTransfer = async (req, res) => {
    const { transactionId } = req.body;

    if (!transactionId) {
        return res.status(400).json({ msg: "Transaction ID is required" });
    }

    try {
        await approveOwnershipTransfer(transactionId);
        res.status(200).json({ msg: "Ownership transfer approved successfully." });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    fetchAllVehicles,
    fetchVehicleById,
    fetchVehiclesByOwner,
    fetchVehiclesByOwnerCNIC,
    addVehicle,
    modifyVehicle,
    removeVehicle,
    registerVehicle,
    approveRegistration,
    rejectRequest,
    updateVehicleStatusController, // Added vehicle status update controller
    transferOwnership,
    approveTransfer,
    fetchPendingVehicles,
    getRegisteredVehicles,
    getUserVehiclesController // Add this function
};

