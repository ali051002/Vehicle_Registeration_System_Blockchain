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

const fetchPendingTransactions = async (req, res) => {
    const transactionStatus = 'Pending'; // Hardcoded as "Pending"
    const transactionType = 'Registration'; // Hardcoded for vehicle registrations

    try {
        const result = await getTransactions(transactionStatus, transactionType);
        console.log(result.recordset);
        res.status(200).json(result.recordset); // Assuming recordset contains the transaction data
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


module.exports = {
    fetchTransactions,
    fetchPendingTransactions
};