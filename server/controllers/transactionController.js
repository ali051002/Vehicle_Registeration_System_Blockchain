const { getTransactionDetailsById, getAllTransactionDetails, getTransactions } = require('../db/dbQueries');
const pdf = require('html-pdf'); // Using 'html-pdf' to generate PDFs
const fs = require('fs');

// Fetch transactions based on status and type
const fetchTransactions = async (req, res) => {
    const { transactionStatus, transactionType } = req.body;

    try {
        const result = await getTransactions(transactionStatus, transactionType);
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};//

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

const fetchPendingTransfers = async (req, res) => {
    const transactionStatus = 'Pending'; // Hardcoded as "Pending"
    const transactionType = 'Ownership Transfer'; // Hardcoded for vehicle registrations

    try {
        const result = await getTransactions(transactionStatus, transactionType);
        console.log(result.recordset);
        res.status(200).json(result.recordset); // Assuming recordset contains the transaction data
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const GenerateTransactionPDFbyId = async (req, res) => {
    const { transactionId } = req.body; // Extract transaction ID from request body

    try {
        const transactionDetails = await getTransactionDetailsById(transactionId);

        // Check if transactionDetails exist
        if (!transactionDetails || transactionDetails.length === 0) {
            return res.status(404).json({ msg: 'Transaction details not found' });
        }

        const htmlContent = generateTransactionDetailsHTML(transactionDetails);

        // Generate PDF to buffer
        pdf.create(htmlContent).toBuffer((err, buffer) => {
            if (err) {
                return res.status(500).json({ msg: 'Error generating PDF', error: err.message });
            }

            // Set headers for download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="transaction-details-${transactionId}.pdf"`);

            // Send the PDF as a downloadable file
            res.send(buffer);
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const generateTransactionDetailsHTML = (transactionDetails) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };
    const transaction = transactionDetails[0];
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Details</title>
    <style>
        /* Minimal Tailwind CSS to ensure styles are applied */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            padding-top: 50px; /* Added padding at the top */
            background-color: #ffffff;
            color: #1f2937; /* Tailwind gray-800 */
            padding: 50px;
        }

      

        h2 {
            font-size: 1.8rem; /* Tailwind text-lg */
            font-weight: 700; /* Tailwind font-bold */
            text-align: center;
            margin-bottom: 20px;
        }
      

        h1 {
            text-align: center;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #d1d5db; /* Tailwind border-gray-300 */
            padding: 8px;
            text-align: left;
            font-size: 0.75rem; /* Tailwind text-xs */
        }

        th {
            background-color: #f3f4f6; /* Tailwind bg-gray-100 */
            font-weight: 500; /* Tailwind font-medium */
        }

        td {
            background-color: #ffffff; /* Tailwind bg-white */
        }

        .text-center {
            text-align: center;
        }
                .mt-6 {
            margin-top: 1.5rem;
        }

        .text-xs {
            font-size: 0.75rem;
        }

        @media print {
            @page {
                size: A4;
                margin: 1cm;
            }
        }
    </style>
</head>
<body>
    <h1>SecureChain</h1>
    <h2>Transaction Details</h2>
    <table>
        <tr>
            <th>Make</th>
            <td>${transaction.make}</td>
        </tr>
        <tr>
            <th>Model</th>
            <td>${transaction.model}</td>
        </tr>
        <tr>
            <th>Vehicle Registration Number</th>
            <td>${transaction.registrationNumber ? transaction.registrationNumber : "Unregistered"}</td>
        </tr>
        <tr>
            <th>From (CNIC)</th>
            <td>${transaction.fromCnic}</td>
        </tr>
        <tr>
            <th>To (CNIC)</th>
            <td>${transaction.toCnic}</td>
        </tr>
        <tr>
            <th>Transaction Type</th>
            <td>${transaction.transactionType}</td>
        </tr>
        <tr>
            <th>Created On</th>
            <td>${formatDate(transaction.timestamp)}</td>
        </tr>
        <tr>
            <th>Status</th>
            <td>${transaction.transactionStatus}</td>
        </tr>
        <tr>
            <th>Approval Date</th>
            <td>${formatDate(transaction.approvalDate)}</td>
        </tr>
    </table>

<footer class="mt-6 text-center text-gray-600 text-xs">
        <p>© ${new Date().getFullYear()} SecureChain. All Rights Reserved.</p>
    </footer>
</body>
</html>

    `;
};


// Function to fetch all transaction details and generate PDF
const GenerateAllTransactionsPDF = async (req, res) => {
    try {
        const transactions = await getAllTransactionDetails();

        // Check if there are transactions
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ msg: 'No transactions found' });
        }

        const htmlContent = generateAllTransactionDetailsHTML(transactions);

        // Generate PDF to buffer
        pdf.create(htmlContent).toBuffer((err, buffer) => {
            if (err) {
                return res.status(500).json({ msg: 'Error generating PDF', error: err.message });
            }

            // Set headers for download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="all-transactions.pdf"');

            // Send the PDF as a downloadable file
            res.send(buffer);
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const generateAllTransactionDetailsHTML = (transactions) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };
    let count = 0;
    let rows = '';
    transactions.forEach(transaction => {
        rows += `
            <tr>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${count=count+1}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${transaction.make}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${transaction.model}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${transaction.registrationNumber ? transaction.registrationNumber : "Unregistered"}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${transaction.fromCnic}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${transaction.toCnic}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${transaction.transactionType}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${formatDate(transaction.timestamp)}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${transaction.transactionStatus}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${formatDate(transaction.approvalDate)}</td>
            </tr>`;
    });

    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Transactions Report</title>
    <style>
        /* Minimal Tailwind CSS to ensure styles are applied */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            padding-top: 50px; /* Added padding at the top */
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f3f4f6;
            font-weight: 500;
        }

        td {
            background-color: #ffffff;
        }

        .text-center {
            text-align: center;
        }

        .text-sm {
            font-size: 0.65rem;
        }

        .text-gray-800 {
            color: #1f2937;
        }

        .text-gray-600 {
            color: #4b5563;
        }

        .bg-white {
            background-color: #ffffff;
        }

        .bg-gray-100 {
            background-color: #f3f4f6;
        }

        .font-medium {
            font-weight: 500;
        }

        .font-bold {
            font-weight: 700;
        }

        .border {
            border-width: 1px;
            border-color: #e5e7eb;
        }

        .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
        }

        .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        .mt-6 {
            margin-top: 1.5rem;
        }

        .text-xs {
            font-size: 0.75rem;
        }

        .text-lg {
            font-size: 1.8rem;
        }

        .text-2xl {
            font-size: 3rem;
        }

        @media print {
            @page {
                size: A4;
                margin: 1cm;
            }
        }

        .logo {
            max-width: 200px; /* Set max width for the logo */
            display: block;
            margin: 0 auto 20px; /* Center logo and add space below it */
        }
    </style>
</head>
<body class="bg-white p-8">

    <header class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-gray-800">SecureChain</h1>
        <h1 class="text-lg font-bold text-gray-800 mt-6">All Transactions Report</h1>
        <p class="text-sm text-gray-600">Generated on: ${new Date().toLocaleDateString()}</p>
    </header>

    <main>
        <table class="mt-6">
            <thead class="bg-gray-100">
                <tr>
                    <th class="border px-4 py-2 text-sm font-medium text-left">S#</th>
                    <th class="border px-4 py-2 text-sm font-medium text-left">Make</th>
                    <th class="border px-4 py-2 text-sm font-medium text-left">Model</th>
                    <th class="border px-4 py-2 text-sm font-medium text-left">Vehicle Registration #</th>
                    <th class="border px-4 py-2 text-sm font-medium text-left">From (CNIC)</th>
                    <th class="border px-4 py-2 text-sm font-medium text-left">To (CNIC)</th>
                    <th class="border px-4 py-2 text-sm font-medium text-left">Transaction Type</th>
                    <th class="border px-4 py-2 text-sm font-medium text-left">Created On</th>
                    <th class="border px-4 py-2 text-sm font-medium text-left">Status</th>
                    <th class="border px-4 py-2 text-sm font-medium text-left">Approval Date</th>
                </tr>
            </thead>
            <tbody class="bg-white">
                ${rows}
            </tbody>
        </table>
    </main>

    <footer class="mt-6 text-center text-gray-600 text-xs">
        <p>© ${new Date().getFullYear()} SecureChain. All Rights Reserved.</p>
    </footer>

</body>
</html>

    `;
};

module.exports = {
    fetchTransactions,
    fetchPendingTransactions,
    fetchPendingTransfers,
    GenerateTransactionPDFbyId,
    GenerateAllTransactionsPDF
};