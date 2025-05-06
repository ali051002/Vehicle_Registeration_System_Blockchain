const {
  createChallan,
  updateChallanPayment,
  getChallanDetailsByUserId,
  getChallanDetailsByChallanId,
} = require("../db/dbQueries")
require("dotenv").config()

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const createChallanController = async (req, res) => {
  const { vehicleId, amount, type } = req.body
  if (!vehicleId || amount == null || !type) {
    return res.status(400).json({ error: "All fields (vehicleId, amount, type) are required." })
  }

  try {
    const rows = await createChallan(vehicleId, amount, type)
    if (rows === 1) {
      return res.status(201).json({ message: "Challan created successfully." })
    } else {
      return res.status(500).json({ error: "Failed to create challan row." })
    }
  } catch (error) {
    console.error("Error creating challan:", error)
    return res.status(500).json({ error: error.message || "Failed to create challan." })
  }
}

const updateChallanPaymentController = async (req, res) => {
  const { challanId, paymentIntentId } = req.body
  if (!challanId || !paymentIntentId) {
    return res.status(400).json({ error: "ChallanId and PaymentIntentID are required." })
  }

  try {
    const rows = await updateChallanPayment(challanId, paymentIntentId)
    if (rows === 1) {
      return res.status(200).json({ message: "Challan payment updated successfully." })
    } else {
      return res.status(404).json({ error: "Challan not found or already paid." })
    }
  } catch (error) {
    console.error("Error updating challan payment:", error)
    return res.status(500).json({ error: "Failed to update challan payment." })
  }
}

const getChallanDetailsByUserIdController = async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    return res.status(400).json({ error: "UserId is required." })
  }

  try {
    const challans = await getChallanDetailsByUserId(userId)
    if (challans.length === 0) {
      return res.status(404).json({ message: "No challans found for this user." })
    }
    return res.status(200).json(challans)
  } catch (error) {
    console.error("Error fetching challan details:", error)
    return res.status(500).json({ error: "Failed to fetch challan details." })
  }
}

const createStripePaymentSessionController = async (req, res) => {
  try {
    console.log("Payment session creation request received:", req.body)

    const { challanId } = req.body

    if (!challanId) {
      console.log("Missing challanId in request")
      return res.status(400).json({ error: "ChallanId is required." })
    }

    console.log(`Creating payment session for challan: ${challanId}`)

    // Get challan details from database
    let challan
    try {
      challan = await getChallanDetailsByChallanId(challanId)
      console.log("Challan details retrieved:", JSON.stringify(challan, null, 2))
    } catch (dbError) {
      console.error("Database error fetching challan:", dbError)
      return res.status(500).json({ error: "Database error fetching challan details." })
    }

    if (!challan) {
      console.log(`Challan not found: ${challanId}`)
      return res.status(404).json({ error: "Challan not found." })
    }

    if (challan.PaymentStatus !== "Pending") {
      console.log(`Challan already paid: ${challanId}`)
      return res.status(400).json({ error: "Already paid." })
    }

    // Ensure amount is a number and properly formatted for Stripe
    let amount = 0
    try {
      amount = Number.parseFloat(challan.Amount)
      if (isNaN(amount)) {
        console.error(`Invalid amount for challan: ${challanId}, amount: ${challan.Amount}`)
        return res.status(400).json({ error: "Invalid amount." })
      }
    } catch (parseError) {
      console.error("Error parsing amount:", parseError)
      return res.status(400).json({ error: "Invalid amount format." })
    }

    const unitAmount = Math.round(amount * 100) // Convert to cents and ensure it's an integer
    console.log(`Calculated unit amount: ${unitAmount}`)

    // Create Stripe checkout session
    console.log("Creating Stripe checkout session...")

    // Prepare session data
    const sessionData = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: `Challan Type: ${challan.Type || "Traffic Violation"}`,
              description: `Vehicle: ${challan.VehicleMake || ""} ${challan.VehicleModel || ""} | Chassis: ${
                challan.VehicleChassisNumber || ""
              } | CNIC: ${challan.UserCNIC || ""}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&challan_id=${challanId}",
      cancel_url: "http://localhost:3000/payment-cancelled?challan_id=${challanId}",
      metadata: {
        challanId: challanId.toString(),
      },
    }

    console.log("Session data prepared:", JSON.stringify(sessionData, null, 2))

    let session
    try {
      session = await stripe.checkout.sessions.create(sessionData)
      console.log(`Stripe session created: ${session.id}`)
      console.log(`Checkout URL: ${session.url}`)
    } catch (stripeError) {
      console.error("Stripe error:", stripeError)
      return res.status(500).json({
        error: "Failed to create payment session.",
        details: stripeError.message,
      })
    }

    return res.status(200).json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error("Unexpected error in createStripePaymentSessionController:", error)
    return res.status(500).json({
      error: "Failed to create payment session due to an unexpected error.",
      details: error.message,
    })
  }
}

const confirmChallanPayment = async (req, res) => {
  const { sessionId, challanId } = req.body

  if (!sessionId || !challanId) {
    return res.status(400).json({ error: "Session ID and Challan ID are required." })
  }

  try {
    console.log(`Confirming payment for session: ${sessionId}, challan: ${challanId}`)

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    console.log(`Session payment status: ${session.payment_status}`)

    if (session.payment_status === "paid") {
      await updateChallanPayment(challanId, session.payment_intent)
      console.log(`Payment confirmed and challan updated: ${challanId}`)

      return res.status(200).json({
        success: true,
        message: "Payment confirmed and challan updated",
        amount: session.amount_total / 100, // Convert back from cents
        paymentDate: new Date(session.created * 1000).toISOString(),
      })
    } else {
      console.log(`Payment not completed for session: ${sessionId}`)
      return res.status(400).json({ success: false, message: "Payment not completed" })
    }
  } catch (err) {
    console.error("Stripe session fetch failed:", err)
    return res.status(500).json({ success: false, message: "Error confirming payment" })
  }
}

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  const payload = req.body

  let event

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  console.log(`Webhook event type: ${event.type}`)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const challanId = session.metadata?.challanId
    const paymentIntentId = session.payment_intent

    if (!challanId) {
      console.error("No challanId found in session metadata")
      return res.status(400).json({ error: "No challanId found in session metadata" })
    }

    try {
      await updateChallanPayment(challanId, paymentIntentId)
      console.log(`Payment for Challan ID: ${challanId} was successful`)

      res.json({ received: true, status: "success" })
    } catch (err) {
      console.error("Error updating Challan status:", err)
      res.status(500).json({ error: "Failed to update Challan payment status" })
    }
  } else {
    // For other event types, just acknowledge receipt
    res.json({ received: true })
  }
}

module.exports = {
  createChallanController,
  updateChallanPaymentController,
  getChallanDetailsByUserIdController,
  createStripePaymentSessionController,
  confirmChallanPayment,
  stripeWebhook,
}
