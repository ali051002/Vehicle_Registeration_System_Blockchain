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

const registerVehicleBC = async (req, res) => {
    try {
        const { chassisNo, engineNo,ownerCnic, paymentIntentId, registrationNo } = req.body;
        
        const response = await axios.post(
            `${KALEIDO_BASE_URL}/${CONTRACT_ADDRESS}/registerVehicle?kld-from=${KALEIDO_FROM_ADDRESS}&kld-sync=true`, 
            { chassisNo, engineNo,ownerCnic, paymentIntentId, registrationNo  },
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

const MAX_UINT256 = (1n << 256n) - 1n;

function toISO(timestampStr) {
  try {
    const ts = BigInt(timestampStr);
    if (ts === MAX_UINT256) {

      return new Date(0).toISOString();
    }
    const ms = ts * 1000n;
    if (ms > BigInt(Number.MAX_SAFE_INTEGER)) {

      return null;
    }
    return new Date(Number(ms)).toISOString();
  } catch {
    return null;
  }
}

const getVehicleDetailsBC = async (req, res) => {
  try {
    const { registrationNo } = req.body;
    const response = await axios.get(
      `${KALEIDO_BASE_URL}/${CONTRACT_ADDRESS}/getVehicleDetails?registrationNo=${registrationNo}&kld-from=${KALEIDO_FROM_ADDRESS}`,
      AUTH_HEADER
    );


    const vehicleDetails = { ...response.data };


    if (vehicleDetails.registrationDate !== undefined) {
      vehicleDetails.registrationDate = toISO(vehicleDetails.registrationDate);
    }


    if (Array.isArray(vehicleDetails.history)) {
      vehicleDetails.history = vehicleDetails.history.map(entry => ({
        ...entry,
        transferDate: entry.transferDate !== undefined
          ? toISO(entry.transferDate)
          : null
      }));
    }

    return res.status(200).json(vehicleDetails);
  } catch (error) {
    console.error('Error fetching vehicle details:', error.response?.data || error.message);
    res.status(500).json({
      msg: 'Failed to get vehicle details',
      error: error.response?.data || error.message
    });
  }
};



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


const getOwnershipHistoryBC = async (req, res) => {
    try {
        const { registrationNo } = req.body;

        const { data } = await axios.get(
            `${KALEIDO_BASE_URL}/${CONTRACT_ADDRESS}/getOwnershipHistory?kld-from=${KALEIDO_FROM_ADDRESS}&registrationNo=${registrationNo}`,
            AUTH_HEADER
        );

    const rawHistory = Array.isArray(data.output) ? data.output : [];


    const convertedHistory = rawHistory.map(entry => ({
      ownerCnic:   entry.ownerCnic,
      performedBy: entry.performedBy,
      transferDate: entry.transferDate != null
        ? toISO(entry.transferDate)
        : null
    }));

    return res.status(200).json(convertedHistory);
    } catch (error) {
        console.error(' Error fetching ownership history:', error.response?.data || error.message);
        res.status(500).json({ msg: 'Failed to get ownership history', error: error.response?.data || error.message });
    }
};


const transferOwnershipBC = async (req, res) => {
    try {
        const { registrationNo, fromCnic, toCnic } = req.body;

        const response = await axios.post(
            `${KALEIDO_BASE_URL}/${CONTRACT_ADDRESS}/transferOwnership?kld-from=${KALEIDO_FROM_ADDRESS}&kld-sync=true`,
            { registrationNo, fromCnic, toCnic },
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
