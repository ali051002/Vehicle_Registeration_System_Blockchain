const {
  createChallan,
  updateChallanPayment,
  getChallanDetailsByUserId,
  getChallanDetailsByChallanId,
  getUserById, // You'll need to import this function
} = require("../db/dbQueries")
require("dotenv").config()

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// ─────────────────────────────────────────────────────────────
// 1.  Create Challan
// ─────────────────────────────────────────────────────────────
const createChallanController = async (req, res) => {
  const { vehicleId, amount, type } = req.body

  if (!vehicleId || amount == null || !type) {
    return res.status(400).json({ error: "All fields (vehicleId, amount, type) are required." })
  }

  try {
    const rows = await createChallan(vehicleId, amount, type)
    if (rows === 1) {
      return res.status(201).json({ message: "Challan created successfully." })
    }
    return res.status(500).json({ error: "Failed to create challan row." })
  } catch (error) {
    console.error("Error creating challan:", error)
    return res.status(500).json({ error: error.message || "Failed to create challan." })
  }
}

// ─────────────────────────────────────────────────────────────
// 2.  Update Challan payment status
// ─────────────────────────────────────────────────────────────
const updateChallanPaymentController = async (req, res) => {
  const { challanId, paymentIntentId } = req.body

  if (!challanId || !paymentIntentId) {
    return res.status(400).json({ error: "ChallanId and PaymentIntentID are required." })
  }

  try {
    const rows = await updateChallanPayment(challanId, paymentIntentId)
    if (rows === 1) {
      return res.status(200).json({ message: "Challan payment updated successfully." })
    }
    return res.status(404).json({ error: "Challan not found or already paid." })
  } catch (error) {
    console.error("Error updating challan payment:", error)
    return res.status(500).json({ error: "Failed to update challan payment." })
  }
}

// ─────────────────────────────────────────────────────────────
// 3.  Get all challans for a user
// ─────────────────────────────────────────────────────────────
const getChallanDetailsByUserIdController = async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ error: "UserId is required." })
  }

  try {
    const challans = await getChallanDetailsByUserId(userId)
    if (!challans.length) {
      return res.status(404).json({ message: "No challans found for this user." })
    }
    return res.status(200).json(challans)
  } catch (error) {
    console.error("Error fetching challan details:", error)
    return res.status(500).json({ error: "Failed to fetch challan details." })
  }
}

// ─────────────────────────────────────────────────────────────
// 4.  Create Stripe checkout‑session
// ─────────────────────────────────────────────────────────────
const createStripePaymentSessionController = async (req, res) => {
  try {
    console.log("Payment session request:", req.body)

    const { challanId } = req.body
    if (!challanId) {
      return res.status(400).json({ error: "ChallanId is required." })
    }
    console.log(`Creating payment session for challan: ${challanId}`)

    // Fetch challan
    let challan
    try {
      challan = await getChallanDetailsByChallanId(challanId)
      console.log("Challan details:", challan)
    } catch (dbErr) {
      console.error("DB error:", dbErr)
      return res.status(500).json({ error: "Database error fetching challan details." })
    }

    if (!challan) {
      return res.status(404).json({ error: "Challan not found." })
    }
    if (challan.PaymentStatus !== "Pending") {
      return res.status(400).json({ error: "Already paid." })
    }

    const amount = Number.parseFloat(challan.Amount)
    if (Number.isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount." })
    }
    const unitAmount = Math.round(amount * 100) // PKR → paisa
    console.log(`Unit amount (paisa): ${unitAmount}`)

    const success_url = `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&challan_id=${challanId}`
    const cancel_url = `http://localhost:3000/payment-cancelled?challan_id=${challanId}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: `Challan Type: ${challan.Type || "Traffic Violation"}`,
              description: `Vehicle: ${challan.VehicleMake || ""} ${
                challan.VehicleModel || ""
              } | Chassis: ${challan.VehicleChassisNumber || ""} | CNIC: ${challan.UserCNIC || ""}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url,
      cancel_url,
      metadata: { challanId: challanId.toString() },
    })

    console.log(`Stripe session id: ${session.id}`)
    console.log(`Checkout URL: ${session.url}`)

    return res.status(200).json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error("createStripePaymentSessionController error:", err)
    return res.status(500).json({
      error: "Failed to create payment session.",
      details: err.message,
    })
  }
}

// ─────────────────────────────────────────────────────────────
// 5.  Manual payment confirmation (enhanced with user details)
// ─────────────────────────────────────────────────────────────
const confirmChallanPayment = async (req, res) => {
  const { sessionId, challanId } = req.body

  if (!sessionId || !challanId) {
    return res.status(400).json({ error: "Session ID and Challan ID are required." })
  }

  try {
    console.log(`Confirming payment – session: ${sessionId}, challan: ${challanId}`)

    // 1. Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    console.log(`Session status: ${session.payment_status}`)

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed." })
    }

    // 2. Update the challan payment status
    await updateChallanPayment(challanId, session.payment_intent)
    console.log(`Payment confirmed for challan: ${challanId}`)

    // 3. Fetch the complete challan details including user and vehicle info
    const challanDetails = await getChallanDetailsByChallanId(challanId)
    if (!challanDetails) {
      return res.status(404).json({
        success: false,
        message: "Challan not found after payment.",
      })
    }

    // 4. Prepare the response with all the details
    const responseData = {
      success: true,
      message: "Payment confirmed and challan updated.",
      amount: session.amount_total / 100,
      paymentDate: new Date(session.created * 1000).toISOString(),
      challanType: challanDetails.Type || "Traffic Violation",
      vehicleDetails: {
        make: challanDetails.VehicleMake || "",
        model: challanDetails.VehicleModel || "",
        chassisNumber: challanDetails.VehicleChassisNumber || "",
      },
      userDetails: {
        name: challanDetails.UserName || "",
        cnic: challanDetails.UserCNIC || "",
        phoneNumber: challanDetails.UserPhoneNumber || "",
      },
    }

    console.log("Sending payment confirmation with details:", responseData)
    return res.status(200).json(responseData)
  } catch (err) {
    console.error("Error confirming payment:", err)
    return res.status(500).json({
      success: false,
      message: "Error confirming payment.",
      error: err.message,
    })
  }
}

// ─────────────────────────────────────────────────────────────
// 6.  Stripe webhook
// ─────────────────────────────────────────────────────────────
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    // Make sure body‑parser left raw buffer on req.rawBody
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature failed:", err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log(`Webhook event: ${event.type}`)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const challanId = session.metadata?.challanId
    const paymentIntentId = session.payment_intent

    if (!challanId) {
      console.error("checkout.session.completed with no challanId")
      return res.status(400).json({ error: "No challanId in metadata." })
    }

    try {
      await updateChallanPayment(challanId, paymentIntentId)
      console.log(`Challan ${challanId} marked paid via webhook.`)
      return res.json({ received: true, status: "success" })
    } catch (dbErr) {
      console.error("DB update in webhook failed:", dbErr)
      return res.status(500).json({ error: "Failed to update Challan." })
    }
  }

  // acknowledge other events
  return res.json({ received: true })
}

module.exports = {
  createChallanController,
  updateChallanPaymentController,
  getChallanDetailsByUserIdController,
  createStripePaymentSessionController,
  confirmChallanPayment,
  stripeWebhook,
}
