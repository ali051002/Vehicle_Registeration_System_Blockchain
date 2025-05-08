const {
  getAllVehicles,
  getVehicleById,
  getVehiclesByOwner,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  requestVehicleRegistration,
  approveVehicleRegistration,
  requestOwnershipTransfer,
  checkRegistrationNumberExists,
  approveOwnershipTransfer,
  getVehiclesByOwnerCNIC,
  updateVehicleStatus,
  rejectVehicleRequest,
  insertVehicleDocument,
  getVehiclesByUserId,
  getVehicleDocumentsByVehicleId,
  getUserById,
  getTransactionDetailsById,
} = require("../db/dbQueries")

// Import email controller
const { sendEmail } = require("../controllers/emailNotificationController")

// Get All Vehicles
const fetchAllVehicles = async (req, res) => {
  try {
    const result = await getAllVehicles()
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

const fetchPendingVehicles = async (req, res) => {
  try {
    const allVehicles = await getAllVehicles()
    const pendingVehicles = allVehicles.filter(
      (vehicle) => vehicle.status === "Pending" || vehicle.status === "Unregistered",
    )
    res.status(200).json(pendingVehicles)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// Get Vehicle by ID
const fetchVehicleById = async (req, res) => {
  const vehicleId = req.query.vehicleId

  if (!vehicleId) {
    console.error("❌ Vehicle ID missing in request.")
    return res.status(400).json({ msg: "Vehicle ID is required" })
  }

  try {
    console.log("📡 Fetching vehicle details from DB for ID:", vehicleId)
    const result = await getVehicleById(vehicleId)

    console.log("✅ Raw DB Response:", result)

    if (!result || !result.recordset || result.recordset.length === 0) {
      console.warn("⚠ Vehicle not found in DB.")
      return res.status(404).json({ msg: "Vehicle not found" })
    }

    res.status(200).json(result.recordset[0])
  } catch (err) {
    console.error("❌ Error fetching vehicle:", err.message)
    res.status(500).json({ msg: "Internal server error" })
  }
}

// Get Vehicles by Owner
const fetchVehiclesByOwner = async (req, res) => {
  const { ownerId } = req.body
  if (!ownerId) {
    return res.status(400).json({ msg: "Owner ID is required" })
  }
  try {
    const result = await getVehiclesByOwner(ownerId)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// Get Vehicles by Owner's CNIC
const fetchVehiclesByOwnerCNIC = async (req, res) => {
  const { cnic } = req.body
  if (!cnic) {
    return res.status(400).json({ msg: "CNIC is required" })
  }
  try {
    const result = await getVehiclesByOwnerCNIC(cnic)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// Create Vehicle
const addVehicle = async (req, res) => {
  const {
    registrationNumber,
    ownerId,
    make,
    model,
    year,
    color,
    chassisNumber,
    engineNumber,
    registrationDate,
    blockchainTransactionId,
    status,
    insuranceDetails,
    inspectionReports,
  } = req.body

  if (
    !registrationNumber ||
    !ownerId ||
    !make ||
    !model ||
    !year ||
    !chassisNumber ||
    !engineNumber ||
    !registrationDate ||
    !status
  ) {
    return res.status(400).json({ msg: "All required fields must be provided" })
  }

  try {
    await createVehicle({
      registrationNumber,
      ownerId,
      make,
      model,
      year,
      color,
      chassisNumber,
      engineNumber,
      registrationDate,
      blockchainTransactionId,
      status,
      insuranceDetails,
      inspectionReports,
    })
    res.status(201).json({ msg: "Vehicle created successfully" })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// Update Vehicle
const modifyVehicle = async (req, res) => {
  const {
    vehicleId,
    registrationNumber,
    ownerId,
    make,
    model,
    year,
    color,
    chassisNumber,
    engineNumber,
    registrationDate,
    blockchainTransactionId,
    status,
    insuranceDetails,
    inspectionReports,
  } = req.body

  if (!vehicleId) {
    return res.status(400).json({ msg: "Vehicle ID is required" })
  }

  try {
    await updateVehicle(
      vehicleId,
      registrationNumber,
      ownerId,
      make,
      model,
      year,
      color,
      chassisNumber,
      engineNumber,
      registrationDate,
      blockchainTransactionId,
      status,
      insuranceDetails,
      inspectionReports,
    )
    res.status(200).json({ msg: "Vehicle updated successfully" })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// Delete Vehicle
const removeVehicle = async (req, res) => {
  const vehicleId = req.params.id
  if (!vehicleId) {
    return res.status(400).json({ msg: "Vehicle ID is required" })
  }
  try {
    await deleteVehicle(vehicleId)
    res.status(200).json({ msg: "Vehicle deleted successfully" })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// Request vehicle registration
const registerVehicle = async (req, res) => {
  const { ownerId, make, model, year, color, chassisNumber, engineNumber } = req.body

  if (!ownerId || !make || !model || !year || !chassisNumber || !engineNumber) {
    return res.status(400).json({ msg: "All required fields must be provided" })
  }

  try {
    const result = await requestVehicleRegistration(ownerId, make, model, year, color, chassisNumber, engineNumber)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// Approve vehicle registration with email notification
const approveRegistration = async (req, res) => {
  const { transactionId, approvedBy } = req.body

  if (!transactionId || !approvedBy) {
    return res.status(400).json({ msg: "Transaction ID and Approver ID are required" })
  }

  try {
    // Generate a random registration number (E-Tag)
    const registrationNumber = generateRegistrationNumber()

    // Approve the vehicle registration
    const result = await approveVehicleRegistration(transactionId, approvedBy, registrationNumber)

    // Get transaction details to get vehicle and user information
    const transactionDetails = await getTransactionDetailsById(transactionId)

    if (!transactionDetails || transactionDetails.length === 0) {
      return res.status(404).json({ msg: "Transaction details not found" })
    }

    const transaction = transactionDetails[0]

    // Get user details to get email
    const userResult = await getUserById(transaction.fromUserId)

    if (!userResult || !userResult.recordset || userResult.recordset.length === 0) {
      console.warn("User details not found for sending email notification")
    } else {
      const user = userResult.recordset[0]

      // Send email notification
      try {
        const emailData = {
          to: user.email,
          subject: "Vehicle E-Tag Generated Successfully",
          data: {
            user: user.name || "Vehicle Owner",
            action: "received an E-Tag for your vehicle",
            vehicle: `${transaction.make} ${transaction.model} (${transaction.year || "N/A"})`,
            status: `Your vehicle has been registered successfully with E-Tag: ${registrationNumber}`,
          },
        }

        await sendEmail({ body: emailData }, { status: () => ({ json: () => {} }) })
        console.log("E-Tag generation email notification sent successfully")
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError)
        // Continue with the response even if email fails
      }
    }

    // Return success response with registration number
    return res.status(200).json({
      msg: "Vehicle registration approved successfully",
      registrationNumber: registrationNumber,
    })
  } catch (error) {
    console.error("Error approving registration:", error)
    return res.status(500).json({ msg: "Server error", error: error.message })
  }
}

// Function to generate a random registration number (E-Tag)
const generateRegistrationNumber = () => {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ" // Excluding I and O to avoid confusion
  const numbers = "0123456789"

  // Format: ABC-123
  let regNumber = ""

  // Add 3 random letters
  for (let i = 0; i < 3; i++) {
    regNumber += letters.charAt(Math.floor(Math.random() * letters.length))
  }

  regNumber += "-"

  // Add 3 random numbers
  for (let i = 0; i < 3; i++) {
    regNumber += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }

  return regNumber
}

// Update vehicle status (Approve or Reject)
const updateVehicleStatusController = async (req, res) => {
  const { vehicleId, status } = req.body

  if (!vehicleId || !status) {
    return res.status(400).json({ msg: "Vehicle ID and Status are required" })
  }

  try {
    await updateVehicleStatus(vehicleId, status)
    res.status(200).json({ msg: `Vehicle status updated to ${status}` })
  } catch (error) {
    console.error("Error updating vehicle status:", error.message)
    res.status(500).json({ msg: "Failed to update vehicle status" })
  }
}

const getRegisteredVehicles = async (req, res) => {
  try {
    const vehicles = await getAllVehicles()
    const registeredOrApprovedVehicles = vehicles.filter(
      (vehicle) => vehicle.status === "Registered" || vehicle.status === "Approved",
    )
    res.status(200).json(registeredOrApprovedVehicles)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

const getUserVehiclesController = async (req, res) => {
  try {
    const userId = req.params.id
    const vehicles = await getVehiclesByUserId(userId)
    res.status(200).json(vehicles)
  } catch (error) {
    console.error("Error fetching vehicles for user:", error)
    res.status(500).json({ message: "Error fetching vehicles for user", error: error.message })
  }
}

// Request ownership transfer
const transferOwnership = async (req, res) => {
  const { vehicleId, currentOwnerId, newOwnerCnic, transferFee } = req.body

  if (!vehicleId || !currentOwnerId || !newOwnerCnic || !transferFee) {
    return res.status(400).json({ msg: "All required fields must be provided" })
  }

  try {
    await requestOwnershipTransfer(vehicleId, currentOwnerId, newOwnerCnic, transferFee)
    res.status(200).json({ msg: "Ownership transfer requested successfully." })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// Approve ownership transfer
const approveTransfer = async (req, res) => {
  const { transactionId } = req.body

  if (!transactionId) {
    return res.status(400).json({ msg: "Transaction ID is required" })
  }

  try {
    await approveOwnershipTransfer(transactionId)
    res.status(200).json({ msg: "Ownership transfer approved successfully." })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

const rejectRequest = async (req, res) => {
  const { transactionId } = req.body

  if (!transactionId) {
    return res.status(400).json({ msg: "Transaction id is required." })
  }

  try {
    await rejectVehicleRequest(transactionId)
    res.status(200).json({ msg: "Request rejected successfully." })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

const uploadVehicleDocument = async (req, res) => {
  const { vehicleId, documentType } = req.body

  if (!vehicleId) {
    return res.status(400).json({ error: "Vehicle ID is required." })
  }
  if (!documentType) {
    return res.status(400).json({ error: "Document type is required." })
  }
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "File is required." })
  }

  const file = req.files.file

  try {
    const result = await insertVehicleDocument(vehicleId, documentType, file.name, file.mimetype, file.data)

    res.status(201).json({
      message: "Document uploaded successfully",
      documentId: result.DocumentId,
    })
  } catch (error) {
    console.error("Error uploading vehicle document:", error)
    res.status(500).json({ error: "Failed to upload document.", details: error.message })
  }
}

// Fetch Documents by Vehicle ID from Body
const fetchDocumentsByVehicleId = async (req, res) => {
  const { vehicleId } = req.body

  if (!vehicleId) {
    return res.status(400).json({ error: "Vehicle ID is required in the request body." })
  }

  try {
    const documents = await getVehicleDocumentsByVehicleId(vehicleId)

    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: "No documents found for the provided Vehicle ID." })
    }

    const documentsForFrontend = documents.map((doc) => ({
      DocumentId: doc.DocumentId,
      DocumentType: doc.DocumentType,
      FileName: doc.FileName,
      FileType: doc.FileType,
      UploadedAt: doc.UploadedAt,
      FileContent: doc.FileContent.toString("base64"),
    }))

    return res.status(200).json({ message: "Documents retrieved successfully.", documents: documentsForFrontend })
  } catch (error) {
    console.error("Error fetching documents:", error)
    res.status(500).json({ error: "Failed to retrieve documents", details: error.message })
  }
}

module.exports = {
  fetchAllVehicles,
  fetchVehicleById,
  fetchVehiclesByOwner,
  fetchVehiclesByOwnerCNIC,
  addVehicle,
  modifyVehicle,
  removeVehicle,
  registerVehicle,
  approveRegistration,
  rejectRequest,
  updateVehicleStatusController,
  transferOwnership,
  approveTransfer,
  fetchPendingVehicles,
  getRegisteredVehicles,
  getUserVehiclesController,
  uploadVehicleDocument,
  fetchDocumentsByVehicleId,
}
