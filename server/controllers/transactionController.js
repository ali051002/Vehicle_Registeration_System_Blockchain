const { getAllTransactions } = require('../db/dbQueries');

// Get All Transactions
const fetchAllTransactions = async (req, res) => {
    try {
        const result = await getAllTransactions();
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    fetchAllTransactions
};
