const { createChallan, updateChallanPayment, getChallanDetailsByUserId, getChallanDetailsByChallanId } = require('../db/dbQueries');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const createChallanController = async (req, res) => {
    const { vehicleId, amount, type } = req.body;
    if (!vehicleId || amount == null || !type) {
      return res.status(400).json({ error: 'All fields (vehicleId, amount, type) are required.' });
    }
  
    try {
      const rows = await createChallan(vehicleId, amount, type);
      if (rows === 1) {
        return res.status(201).json({ message: 'Challan created successfully.' });
      } else {
        return res.status(500).json({ error: 'Failed to create challan row.' });
      }
    } catch (error) {
      console.error('Error creating challan:', error);
      return res.status(500).json({ error: error.message || 'Failed to create challan.' });
    }
  };
  

  const updateChallanPaymentController = async (req, res) => {
    const { challanId, paymentIntentId } = req.body;
    if (!challanId || !paymentIntentId) {
      return res.status(400).json({ error: 'ChallanId and PaymentIntentID are required.' });
    }
  
    try {
      const rows = await updateChallanPayment(challanId, paymentIntentId);
      if (rows === 1) {
        return res.status(200).json({ message: 'Challan payment updated successfully.' });
      } else {
        return res.status(404).json({ error: 'Challan not found or already paid.' });
      }
    } catch (error) {
      console.error('Error updating challan payment:', error);
      return res.status(500).json({ error: 'Failed to update challan payment.' });
    }
  };
  

  const getChallanDetailsByUserIdController = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'UserId is required.' });
    }
  
    try {
      const challans = await getChallanDetailsByUserId(userId);
      if (challans.length === 0) {
        return res.status(404).json({ message: 'No challans found for this user.' });
      }
      return res.status(200).json(challans);
    } catch (error) {
      console.error('Error fetching challan details:', error);
      return res.status(500).json({ error: 'Failed to fetch challan details.' });
    }
  };

  const createStripePaymentSessionController = async (req, res) => {
    const { challanId } = req.body;
  
    if (!challanId) {
      return res.status(400).json({ error: 'ChallanId is required.' });
    }
  
    try {
      const challan = await getChallanDetailsByChallanId(challanId);
  
      if (!challan) {
        return res.status(404).json({ error: 'Challan not found.' });
      }

      if (challan.PaymentStatus !== 'Pending') {
        return res.status(400).json({ error: 'Already paid.' });
      }
  
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'pkr',
              product_data: {
                name: `Challan Type: ${challan.Type}`,
                description: `Vehicle: ${challan.VehicleMake} ${challan.VehicleModel} | Chassis: ${challan.VehicleChassisNumber} | CNIC: ${challan.UserCNIC}`,
              },
              unit_amount: challan.Amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/payment-success',
        cancel_url: 'http://localhost:3000/payment-cancelled',
        metadata: {
          challanId: challanId.toString(),
        },
      });
  
      return res.status(200).json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error('Stripe session error:', error);
      return res.status(500).json({ error: 'Failed to create payment session.' });
    }
  }; 

  const confirmChallanPayment = async (req, res) => {
    const { sessionId, challanId } = req.body;
  
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      if (session.payment_status === 'paid') {
        await updateChallanPayment(challanId, session.payment_intent);
  
        return res.status(200).json({ success: true, message: 'Payment confirmed and challan updated' });
      } else {
        return res.status(400).json({ success: false, message: 'Payment not completed' });
      }
    } catch (err) {
      console.error('Stripe session fetch failed:', err);
      return res.status(500).json({ success: false, message: 'Error confirming payment' });
    }
  };

  const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];  
    const payload = req.body;
  
    let event;
  
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;  
      const challanId = session.metadata?.challanId; 
      const paymentIntentId = session.payment_intent;  
  
      try {
        await updateChallanPayment(challanId, paymentIntentId);
        console.log(`Payment for Challan ID: ${challanId} was successful`);
  
        res.json({ received: true });
      } catch (err) {
        console.error('Error updating Challan status:', err);
        res.status(500).json({ error: 'Failed to update Challan payment status' });
      }
    } else {
      res.json({ received: true });
    }
  };

module.exports = {
  createChallanController,
  updateChallanPaymentController,
  getChallanDetailsByUserIdController,
  createStripePaymentSessionController,
  confirmChallanPayment,
  stripeWebhook
};


