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


app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);


app.use(cors({
    origin: ['http://localhost:3000','https://securechain-inky.vercel.app', 'https://blockchain-sandy.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', userRoutes);
app.use('/api', vehicleRoute); 
app.use('/api', transactionRoute); 
app.use('/api', emailRoutes);
app.use('/api', otpRoutes);
app.use('/api', inspectionRoutes);
app.use('/api', challanRoutes);
app.use('/api/blockchain', blockchainRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ msg: 'Something went wrong, please try again later.' });
});

app.use((req, res) => {
    res.status(404).send({ msg: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
