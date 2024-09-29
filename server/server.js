const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const userRoutes = require('./routes/userRoutes'); // User-related routes
const vehicleRoute = require('./routes/vehicleRoutes'); // Vehicle-related routes
const transactionRoute = require('./routes/transactionRoutes'); // Transaction-related routes

const app = express();
const PORT = process.env.PORT || 8085; // Fallback to 8085 if no PORT specified in .env

// Enable CORS for frontend
app.use(cors({
    origin: 'http://localhost:3000', // Ensure this matches your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api', userRoutes); // Scoped to '/api/users'
app.use('/api', vehicleRoute); // Scoped to '/api/vehicles'
app.use('/api', transactionRoute); // Scoped to '/api/transactions'

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ msg: 'Something went wrong, please try again later.' });
});

// Fallback route for undefined routes
app.use((req, res) => {
    res.status(404).send({ msg: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
