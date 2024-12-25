const { sendInspectionRequest, getInspectionRequestsByOfficerId, getAllUsersWithInspectionOfficers } = require('../db/dbQueries');

// Controller to handle sending an inspection request
const sendInspectionRequestController = async (req, res) => {
    const { vehicleId, officerId, appointmentDate } = req.body;

    // Validate input
    if (!vehicleId || !officerId || !appointmentDate) {
        return res.status(400).json({ error: 'Missing required fields: vehicleId, officerId, appointmentDate' });
    }

    try {
        // Call the DB query to send the inspection request
        const result = await sendInspectionRequest(vehicleId, officerId, appointmentDate);
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
    const { officerId } = req.body;

    try {
        // Fetch the inspection requests from the database
        const requests = await getInspectionRequestsByOfficerId(officerId);

        res.status(200).json({ message: 'Inspection requests fetched successfully', data: requests });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inspection requests', details: error.message });
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



module.exports = {
    sendInspectionRequestController,
    getInspectionRequestsByOfficerIdController,
    getAllUsersWithInspectionOfficersController
};
