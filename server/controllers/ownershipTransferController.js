const { getAllOwnershipTransfers, transferOwnership } = require('../db/dbQueries');

// Get All Ownership Transfers
const fetchAllOwnershipTransfers = async (req, res) => {
    try {
        const result = await getAllOwnershipTransfers();
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Transfer Ownership
const performOwnershipTransfer = async (req, res) => {
    const { VehicleId, CurrentOwnerId, NewOwnerId, TransferFee, BlockchainTransactionId, Comments } = req.body;
    try {
        await transferOwnership(VehicleId, CurrentOwnerId, NewOwnerId, TransferFee, BlockchainTransactionId, Comments);
        res.status(200).json({ msg: "Ownership transferred successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    fetchAllOwnershipTransfers,
    performOwnershipTransfer
};
