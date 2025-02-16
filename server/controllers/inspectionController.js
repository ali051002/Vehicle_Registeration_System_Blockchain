const { sendInspectionRequest, 
    getInspectionRequestsByOfficerId, 
    getAllUsersWithInspectionOfficers,
    approveInspectionRequest,
    rejectInspectionRequest,
    getInspectionRequestsByVehicleId 
} = require('../db/dbQueries');

// Controller to handle sending an inspection request
const sendInspectionRequestController = async (req, res) => {
    const { VehicleId, OfficerId, AppointmentDate } = req.body;

    // Validate input
    if (!VehicleId || !OfficerId || !AppointmentDate) {
        return res.status(400).json({ error: 'Missing required fields: VehicleId, OfficerId, AppointmentDate' });
    }

    try {
        // Call the DB query to send the inspection request
        const result = await sendInspectionRequest(VehicleId, OfficerId, AppointmentDate);
        res.status(200).json({ message: 'Inspection request created successfully', data: result });
    } catch (error) {
        if (error.message.includes('The officer already has two appointments')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to create inspection request', details: error.message });
        }
    }
};


// Controller to fetch inspection requests by officer ID
const getInspectionRequestsByOfficerIdController = async (req, res) => {
    // Instead of reading from req.body:
    // const { OfficerId } = req.body;

    // Read from req.query:
    const { officerId } = req.query;

    try {
        // Fetch the inspection requests from the database
        const requests = await getInspectionRequestsByOfficerId(officerId);

        res.status(200).json({ 
            message: 'Inspection requests fetched successfully', 
            data: requests 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch inspection requests', 
            details: error.message 
        });
    }
};


// Controller to fetch all users with inspection officers
const getAllUsersWithInspectionOfficersController = async (req, res) => {
    try {
        // Fetch the data from the database
        const users = await getAllUsersWithInspectionOfficers();

        res.status(200).json({ message: 'Inspection officers fetched successfully', data: users });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inspection officers', details: error.message });
    }
};

// Controller to approve an inspection request
const approveInspectionRequestController = async (req, res) => {
    const { requestId } = req.body;

    if (!requestId) {
        return res.status(400).json({ error: 'Request ID is required' });
    }

    try {
        // Approve the inspection request
        await approveInspectionRequest(requestId);

        res.status(200).json({ message: 'Inspection request approved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve inspection request', details: error.message });
    }
};

const rejectInspectionRequestController = async (req, res) => {
    const { requestId } = req.body;

    if (!requestId) {
        return res.status(400).json({ error: 'Request ID is required' });
    }

    try {
        // Reject the inspection request
        await rejectInspectionRequest(requestId);

        res.status(200).json({ message: 'Inspection request rejected' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject inspection request', details: error.message });
    }
};

const getInspectionRequestsByVehicleIdController = async (req, res) => {
    const { vehicleId } = req.body;

    try {
        // Fetch the inspection requests from the database
        const requests = await getInspectionRequestsByVehicleId(vehicleId);

        res.status(200).json({ 
            message: 'Inspection requests fetched successfully', 
            data: requests 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch inspection requests', 
            details: error.message 
        });
    }
};


module.exports = {
    sendInspectionRequestController,
    getInspectionRequestsByOfficerIdController,
    getAllUsersWithInspectionOfficersController,
    approveInspectionRequestController,
    rejectInspectionRequestController,
    getInspectionRequestsByVehicleIdController
};
