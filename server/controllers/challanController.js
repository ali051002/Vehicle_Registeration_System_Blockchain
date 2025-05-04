const { createChallan, updateChallanPayment, getChallanDetailsByUserId } = require('../db/dbQueries');

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
  

  // controllers/challan.js
const getChallanDetailsByUserIdController = async (req, res) => {
  // read from query string  ➜ /challan-details-byUserId?userId=...
  const { userId } = req.query;          // ⬅️ change here

  if (!userId) {
    return res.status(400).json({ error: "UserId is required." });
  }

  try {
    const challans = await getChallanDetailsByUserId(userId);

    if (challans.length === 0) {
      return res.status(404).json({ message: "No challans found for this user." });
    }

    return res.status(200).json(challans);
  } catch (error) {
    console.error("Error fetching challan details:", error);
    return res.status(500).json({ error: "Failed to fetch challan details." });
  }
};

module.exports = {
  createChallanController,
  updateChallanPaymentController,
  getChallanDetailsByUserIdController
};


