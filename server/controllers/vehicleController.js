const {
    getAllVehicles,
    getVehicleById,
    getVehiclesByOwner,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    requestVehicleRegistration,
    approveVehicleRegistration,
    requestOwnershipTransfer,
    approveOwnershipTransfer
} = require('../db/dbQueries');

// Get All Vehicles
const fetchAllVehicles = async (req, res) => {
    try {
        const result = await getAllVehicles();
        console.log('get vehicles API hit');
        res.status(200).json(result.recordset);
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
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }
        res.status(200).json(result.recordset[0]);
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
        res.status(200).json(result.recordset);
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
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


// Create Vehicle
const addVehicle = async (req, res) => {
    const {
        RegistrationNumber,
        OwnerId,
        Make,
        Model,
        Year,
        Color,
        ChassisNumber,
        EngineNumber,
        RegistrationDate,
        BlockchainTransactionId,
        Status,
        InsuranceDetails,
        InspectionReports
    } = req.body;

    if (!RegistrationNumber || !OwnerId || !Make || !Model || !Year || !Color || !ChassisNumber || !EngineNumber || !RegistrationDate) {
        return res.status(400).json({ msg: "All required fields must be provided" });
    }

    try {
        await createVehicle({
            RegistrationNumber,
            OwnerId,
            Make,
            Model,
            Year,
            Color,
            ChassisNumber,
            EngineNumber,
            RegistrationDate,
            BlockchainTransactionId,
            Status,
            InsuranceDetails,
            InspectionReports
        });
        res.status(201).json({ msg: "Vehicle created successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Update Vehicle
const modifyVehicle = async (req, res) => {
    const {
        VehicleId,
        RegistrationNumber,
        OwnerId,
        Make,
        Model,
        Year,
        Color,
        ChassisNumber,
        EngineNumber,
        RegistrationDate,
        BlockchainTransactionId,
        Status,
        InsuranceDetails,
        InspectionReports
    } = req.body;

    if (!VehicleId) {
        return res.status(400).json({ msg: "Vehicle ID is required" });
    }

    try {
        await updateVehicle(
            VehicleId,
            RegistrationNumber,
            OwnerId,
            Make,
            Model,
            Year,
            Color,
            ChassisNumber,
            EngineNumber,
            RegistrationDate,
            BlockchainTransactionId,
            Status,
            InsuranceDetails,
            InspectionReports
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

    try {
        const result = await requestVehicleRegistration(ownerId, make, model, year, color, chassisNumber, engineNumber);
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};





// Approve vehicle registration
const approveRegistration = async (req, res) => {
    const { transactionId, approvedBy, registrationNumber } = req.body;

    try {
        await approveVehicleRegistration(transactionId, approvedBy, registrationNumber);
        res.status(200).json({ msg: "Vehicle registration approved successfully." });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};





// Request ownership transfer
const transferOwnership = async (req, res) => {
    const { vehicleId, currentOwnerId, newOwnerCnic, transferFee } = req.body;

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
    transferOwnership,
    approveTransfer
};
