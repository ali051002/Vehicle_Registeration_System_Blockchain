const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailNotificationRoutes');
const otpRoutes = require('./routes/otpRoutes');
const userRoutes = require('./routes/userRoutes');
const vehicleRoute = require('./routes/vehicleRoutes');
const transactionRoute = require('./routes/transactionRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const challanRoutes = require('./routes/challanRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');
const { stripeWebhook } = require('./controllers/challanController');

const app = express();
const PORT = process.env.PORT || 8085;

// Apply CORS middleware first
app.use(cors({
    origin: ['http://localhost:3000', 'https://securechain-inky.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

// IMPORTANT: Stripe webhook route must come before body parsers
// This is because Stripe needs the raw body for signature verification
app.post('/api/stripe/webhook', 
    express.raw({ type: 'application/json' }), 
    (req, res, next) => {
        // Log webhook received (but don't log the body for security)
        console.log(`Stripe webhook received: ${new Date().toISOString()}`);
        stripeWebhook(req, res, next);
    }
);

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', userRoutes);
app.use('/api', vehicleRoute);
app.use('/api', transactionRoute);
app.use('/api', emailRoutes);
app.use('/api', otpRoutes);
app.use('/api', inspectionRoutes);
app.use('/api', challanRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ msg: 'Something went wrong, please try again later.' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send({ msg: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
