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

// Validate Stripe Secret Key is present
if (!process.env.STRIPE_SECRET_KEY) {
    console.error('ERROR: STRIPE_SECRET_KEY environment variable is not set');
    // Continue execution, but log the error
}

// Apply CORS middleware first with expanded configuration
app.use(cors({
    origin: ['http://localhost:3000', 'https://securechain-inky.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // CORS preflight request cache time (24 hours)
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

// Stripe webhook endpoint MUST come before body parsers
// This is because Stripe needs the raw body for signature verification
app.post('/api/stripe/webhook', 
    express.raw({ type: 'application/json' }), 
    (req, res, next) => {
        try {
            // Pass to the webhook handler
            stripeWebhook(req, res);
        } catch (error) {
            console.error('Stripe webhook error:', error);
            res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
);

// Standard middleware for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
    // Don't log webhook requests (they can be large and contain sensitive data)
    if (!req.originalUrl.includes('/webhook')) {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    }
    next();
});

// Routes
app.use('/api', userRoutes);
app.use('/api', vehicleRoute);
app.use('/api', transactionRoute);
app.use('/api', emailRoutes);
app.use('/api', otpRoutes);
app.use('/api', inspectionRoutes);
app.use('/api', challanRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Stripe-specific error handling
app.use('/api/stripe', (err, req, res, next) => {
    console.error('Stripe API error:', err);
    
    // Handle specific Stripe errors
    if (err.type === 'StripeCardError') {
        return res.status(400).json({ error: err.message });
    }
    if (err.type === 'StripeInvalidRequestError') {
        return res.status(400).json({ error: 'Invalid parameters in Stripe request' });
    }
    if (err.type === 'StripeAPIError') {
        return res.status(500).json({ error: 'Error communicating with Stripe' });
    }
    if (err.type === 'StripeConnectionError') {
        return res.status(503).json({ error: 'Stripe service unavailable' });
    }
    if (err.type === 'StripeAuthenticationError') {
        return res.status(401).json({ error: 'Stripe authentication failed' });
    }
    
    // For other Stripe errors
    next(err);
});

// General error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    
    // Don't expose error details in production
    const message = process.env.NODE_ENV === 'production' 
        ? 'Something went wrong, please try again later.'
        : err.message || 'Unknown error occurred';
        
    res.status(err.status || 500).json({ 
        error: message,
        // Include request ID if you implement request tracking
        requestId: req.id
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    
    // Force close after 10s if server hasn't closed
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
});

module.exports = app; // Export for testing