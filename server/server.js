const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Ensure this path is correct
const vehicleRoute = require('./routes/vehicleRoutes')

const app = express();
const PORT = process.env.PORT;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Make sure this matches your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api', userRoutes);
app.use('/api', vehicleRoute);  // Ensure the correct path here for user routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
