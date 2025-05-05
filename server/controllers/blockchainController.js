const axios = require('axios');
require('dotenv').config();

const KALEIDO_BASE_URL = process.env.KALEIDO_BASE_URL; 
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; 
const KALEIDO_FROM_ADDRESS = process.env.KALEIDO_FROM_ADDRESS;
const KALEIDO_PRIVATE_KEY = process.env.KALEIDO_PRIVATE_KEY;
const KALEIDO_PASSWORD = process.env.KALEIDO_PASSWORD;

const AUTH_HEADER = {
    auth: {
        username: KALEIDO_PRIVATE_KEY,
        password: KALEIDO_PASSWORD
    },
    headers: {
        'Content-Type': 'application/json'
    }
};

//  Register a New Vehicle
const registerVehicleBC = async (req, res) => {
    try {
        const { engineNo, chassisNo, registrationNo, ownerCnic, registrationDate } = req.body;
        
        const response = await axios.post(
            `${KALEIDO_BASE_URL}/${CONTRACT_ADDRESS}/registerVehicle?kld-from=${KALEIDO_FROM_ADDRESS}&kld-sync=true`, 
            { engineNo, chassisNo, registrationNo, ownerCnic, registrationDate },
            AUTH_HEADER
        );

        const txHash = response.data.transactionHash || null;

        res.status(200).json({ 
            msg: 'Vehicle registered successfully', 
            txHash: txHash || "Transaction hash not available in response"
        });
    } catch (error) {
        console.error(' Error registering vehicle:', error.response?.data || error.message);
        res.status(500).json({ msg: 'Failed to register vehicle', error: error.response?.data || error.message });
    }
};

//  Get Vehicle Details
const getVehicleDetailsBC = async (req, res) => {
    try {
        const { registrationNo } = req.body;

        const response = await axios.get(
            `${KALEIDO_BASE_URL}/${CONTRACT_ADDRESS}/getVehicleDetails?registrationNo=${registrationNo}&kld-from=${KALEIDO_FROM_ADDRESS}`,
            AUTH_HEADER
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error(' Error fetching vehicle details:', error.response?.data || error.message);
        res.status(500).json({ msg: 'Failed to get vehicle details', error: error.response?.data || error.message });
    }
};

//  Get All Registered Vehicles
const getAllRegistrationNumbersBC = async (req, res) => {
    try {
        const response = await axios.get(
            `${KALEIDO_BASE_URL}/${CONTRACT_ADDRESS}/getAllRegistrationNumbers?kld-from=${KALEIDO_FROM_ADDRESS}`,
            AUTH_HEADER
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error(' Error fetching all registration numbers:', error.response?.data || error.message);
        res.status(500).json({ msg: 'Failed to fetch registration numbers', error: error.response?.data || error.message });
    }
};

//  Get Ownership History
const getOwnershipHistoryBC = async (req, res) => {
    try {
        const { registrationNo } = req.body;

        const response = await axios.get(
            `${KALEIDO_BASE_URL}/${CONTRACT_ADDRESS}/getOwnershipHistory?kld-from=${KALEIDO_FROM_ADDRESS}&registrationNo=${registrationNo}`,
            AUTH_HEADER
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error(' Error fetching ownership history:', error.response?.data || error.message);
        res.status(500).json({ msg: 'Failed to get ownership history', error: error.response?.data || error.message });
    }
};

//  Transfer Ownership
const transferOwnershipBC = async (req, res) => {
    try {
        const { registrationNo, fromCnic, toCnic, transferDate } = req.body;

        const response = await axios.post(
            `${KALEIDO_BASE_URL}/${CONTRACT_ADDRESS}/transferOwnership?kld-from=${KALEIDO_FROM_ADDRESS}&kld-sync=true`,
            { registrationNo, fromCnic, toCnic, transferDate },
            AUTH_HEADER
        );

        const txHash = response.data.transactionHash || null;

        res.status(200).json({ 
            msg: 'Ownership transferred successfully', 
            txHash: txHash || "Transaction hash not available in response"
        });
    } catch (error) {
        console.error(' Error transferring ownership:', error.response?.data || error.message);
        res.status(500).json({ msg: 'Failed to transfer ownership', error: error.response?.data || error.message });
    }
};

module.exports = {
    registerVehicleBC,
    getVehicleDetailsBC,
    getAllRegistrationNumbersBC,
    getOwnershipHistoryBC,
    transferOwnershipBC
};
