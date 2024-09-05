const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const ownershipTransferRoutes = require('./routes/ownershipTransferRoutes');

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', transactionRoutes);
app.use('/api', ownershipTransferRoutes);

const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
