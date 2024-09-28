const { getTransactions } = require('../db/dbQueries');

// Fetch transactions based on status and type
const fetchTransactions = async (req, res) => {
    const { transactionStatus, transactionType } = req.body; 

    try {
        const result = await getTransactions(transactionStatus, transactionType);
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    fetchTransactions,
};