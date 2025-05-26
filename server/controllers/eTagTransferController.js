const {
    getRegisteredVehiclesByUserId,
    getUnregisteredVehiclesByUserId,
    createEtagTransferRequest,
    finalizeEtagTransfer
} = require('../db/dbQueries');


const getRegisteredVehiclesController = async (req, res) => {
    try {
        const vehicles = await getRegisteredVehiclesByUserId(req.params.userId);
        res.status(200).json({ message: 'Registered vehicles fetched', data: vehicles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getUnregisteredVehiclesController = async (req, res) => {
    try {
        const vehicles = await getUnregisteredVehiclesByUserId(req.params.userId);
        res.status(200).json({ message: 'Unregistered vehicles fetched', data: vehicles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const requestEtagTransferController = async (req, res) => {
    const { oldVehicleId, newVehicleId, amountIfCharged } = req.body;

    if (!oldVehicleId || !newVehicleId || amountIfCharged == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await createEtagTransferRequest(oldVehicleId, newVehicleId, amountIfCharged);
        res.status(200).json({ message: 'E-Tag transfer request created', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const finalizeEtagTransferController = async (req, res) => {
    const { transactionId } = req.body;

    if (!transactionId) {
        return res.status(400).json({ error: 'Transaction ID is required' });
    }

    try {
        await finalizeEtagTransfer(transactionId);
        res.status(200).json({ message: 'E-Tag transfer finalized' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRegisteredVehiclesController,
    getUnregisteredVehiclesController,
    requestEtagTransferController,
    finalizeEtagTransferController
};
