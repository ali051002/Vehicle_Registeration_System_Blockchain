const { sql, poolPromise } = require('./dbConfig');
const bcrypt = require('bcrypt');
const { response } = require('express');
const jwt = require('jsonwebtoken');

// Create a new user (Signup)
const createUser = async (userData) => {
    const pool = await poolPromise;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
        // Execute the stored procedure and capture the result
        const result = await pool.request()
            .input('Name', sql.NVarChar(100), userData.name)
            .input('Email', sql.NVarChar(100), userData.email)
            .input('Password', sql.NVarChar(256), hashedPassword)  // Store the hashed password
            .input('Role', sql.NVarChar(50), userData.role)
            .input('cnic', sql.NVarChar(15), userData.cnic)
            .input('PhoneNumber', sql.NVarChar(20), userData.phoneNumber)
            .input('AddressDetails', sql.NVarChar(255), userData.addressDetails)
            .input('ProfilePicture', sql.NVarChar(sql.MAX), userData.profilePicture)
            .execute('sp_CreateUser');

        // Assuming the stored procedure returns the ID of the newly created user
        return result.recordset[0].NewUserID;  // Adjust based on actual return structure
    } catch (error) {
        console.error('SQL Error:', error);
        throw error;  // Rethrowing the error to be handled by the caller
    }
};
// Fetch user by email (For login)
const getUserByEmail = async (email) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('Email', sql.NVarChar(100), email)
        .query('SELECT * FROM Users WHERE email = @Email');
  
    return result.recordset[0];  // Return the first user found
};

// Login User
const loginUser = async (email, password) => {
    // Fetch the user by email
    const user = await getUserByEmail(email);
    console.log('User:', user);  // Debug log

    // If the user does not exist, throw an error
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch);  // Debug log

    // If passwords do not match, throw an error
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT token if credentials are correct
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return token and user data including role and id
    return {
        token,
        user: {
            id: user._id,  // Ensure the user ID is included in the response
            name: user.name,
            email: user.email,
            role: user.role,  // Include role in the response
            cnic: user.cnic,
            phoneNumber: user.phoneNumber,
            addressDetails: user.addressDetails,
            profilePicture: user.profilePicture
        }
    };
};
const updateVehicleStatus = async (vehicleId, status) => {
    const pool = await poolPromise;
    return pool.request()
        .input('VehicleId', sql.UniqueIdentifier, vehicleId) // This refers to the input ID, not the column name
        .input('Status', sql.NVarChar(50), status)
        .execute('sp_UpdateVehicleStatus');
};

// Get all users
const getAllUsers = async () => {
    const pool = await poolPromise;
    return pool.request().execute('sp_GetAllUsers');
};

// Get user by name
const getUserByName = async (userName) => {
    const pool = await poolPromise;
    return pool.request()
        .input('UserName', sql.NVarChar(255), userName)
        .execute('sp_GetUserByName');
};

// Get user by ID
const getUserById = async (userId) => {
    const pool = await poolPromise;
    // response = 
    // console.log(response)
    return pool.request()
    .input('UserId', sql.UniqueIdentifier, userId)
    .execute('sp_GetUserById');
};

// Update user
const updateUser = async (UserId, Name, Email, Password, cnic, PhoneNumber, AddressDetails, ProfilePicture) => {
    const pool = await poolPromise;
    return pool.request()
        .input('UserId', sql.UniqueIdentifier, UserId)
        .input('Name', sql.NVarChar(100), Name)
        .input('Email', sql.NVarChar(100), Email)
        .input('Password', sql.NVarChar(256), Password)
        .input('cnic', sql.NVarChar(100), cnic)
        .input('PhoneNumber', sql.NVarChar(20), PhoneNumber)
        .input('AddressDetails', sql.NVarChar(255), AddressDetails)
        .input('ProfilePicture', sql.NVarChar(255), ProfilePicture)
        .execute('sp_UpdateUser');
};


const updateUserPassword = async (email, newPasswordHash) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('Email', sql.NVarChar(255), email)
            .input('NewPassword', sql.NVarChar(255), newPasswordHash)
            .execute('UpdateUserPassword'); // Name of the stored procedure

        return result.recordset[0].Message; // Return the success message
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};


// Delete user
const deleteUser = async (userId) => {
    const pool = await poolPromise;
    return pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .execute('sp_DeleteUser');
};

// Vehicle Queries
const getAllVehicles = async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().execute('sp_GetAllVehicles'); // Stored procedure to get all vehicles
      return result.recordset; // Ensure that this is returning an array
    } catch (err) {
      console.error('Error fetching all vehicles:', err);
      throw err;
    }
  };
  
  const getVehiclesByUserId = async (userId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('UserId', userId)
        .query('SELECT * FROM Vehicles WHERE ownerId = @UserId'); // Modify query as per your DB structure
      return result.recordset;
    } catch (error) {
      console.error('Error fetching vehicles by user ID:', error);
      throw error;
    }
  };

const getVehicleById = async (vehicleId) => {
    const pool = await poolPromise;
    return pool.request()
        .input('VehicleId', sql.UniqueIdentifier, vehicleId)
        .execute('sp_GetVehicleById');
};

const getVehiclesByOwner = async (ownerId) => {
    const pool = await poolPromise;
    return pool.request()
        .input('OwnerId', sql.UniqueIdentifier, ownerId)
        .execute('sp_GetVehiclesByOwner');
};

const getVehiclesByOwnerCNIC = async (cnic) => {
    const pool = await poolPromise;
    return pool.request()
        .input('CNIC', sql.NVarChar(15), cnic)
        .execute('GetVehicleByOwnerCNIC');
};


const createVehicle = async (params) => {
    const pool = await poolPromise;
    return pool.request()
        .input('RegistrationNumber', sql.NVarChar(50), params.RegistrationNumber)
        .input('OwnerId', sql.UniqueIdentifier, params.OwnerId)
        .input('Make', sql.NVarChar(50), params.Make)
        .input('Model', sql.NVarChar(50), params.Model)
        .input('Year', sql.Int, params.Year)
        .input('Color', sql.NVarChar(20), params.Color)
        .input('ChassisNumber', sql.NVarChar(50), params.ChassisNumber)
        .input('EngineNumber', sql.NVarChar(50), params.EngineNumber)
        .input('RegistrationDate', sql.Date, params.RegistrationDate)
        .input('BlockchainTransactionId', sql.NVarChar(100), params.BlockchainTransactionId)
        .input('Status', sql.NVarChar(20), params.Status)
        .input('InsuranceDetails', sql.NVarChar(255), params.InsuranceDetails)
        .input('InspectionReports', sql.NVarChar(sql.Max), params.InspectionReports)
        .execute('sp_CreateVehicle');
};

const updateVehicle = async (VehicleId, RegistrationNumber, OwnerId, Make, Model, Year, Color, ChassisNumber, EngineNumber, RegistrationDate, BlockchainTransactionId, Status, InsuranceDetails, InspectionReports) => {
    const pool = await poolPromise;
    return pool.request()
        .input('VehicleId', sql.UniqueIdentifier, VehicleId)
        .input('RegistrationNumber', sql.NVarChar(50), RegistrationNumber)
        .input('OwnerId', sql.UniqueIdentifier, OwnerId)
        .input('Make', sql.NVarChar(50), Make)
        .input('Model', sql.NVarChar(50), Model)
        .input('Year', sql.Int, Year)
        .input('Color', sql.NVarChar(20), Color)
        .input('ChassisNumber', sql.NVarChar(50), ChassisNumber)
        .input('EngineNumber', sql.NVarChar(50), EngineNumber)
        .input('RegistrationDate', sql.Date, RegistrationDate)
        .input('BlockchainTransactionId', sql.NVarChar(100), BlockchainTransactionId)
        .input('Status', sql.NVarChar(20), Status)
        .input('InsuranceDetails', sql.NVarChar(255), InsuranceDetails)
        .input('InspectionReports', sql.NVarChar(sql.Max), InspectionReports)
        .execute('sp_UpdateVehicle');
};

const deleteVehicle = async (vehicleId) => {
    const pool = await poolPromise;
    return pool.request()
        .input('VehicleId', sql.UniqueIdentifier, vehicleId)
        .execute('sp_DeleteVehicle');
};

const getTransactions = async (transactionStatus, transactionType) => {
    const pool = await poolPromise;
    return pool.request()
        .input('TransactionStatus', sql.NVarChar(50), transactionStatus)
        .input('TransactionType', sql.NVarChar(50), transactionType)
        .execute('GetTransactions');
};//

const requestVehicleRegistration = async (ownerId, make, model, year, color, chassisNumber, engineNumber) => {
    const pool = await poolPromise;
    return pool.request()
        .input('OwnerId', sql.UniqueIdentifier, ownerId)
        .input('Make', sql.NVarChar(100), make)
        .input('Model', sql.NVarChar(100), model)
        .input('Year', sql.Int, year)
        .input('Color', sql.NVarChar(50), color)
        .input('ChassisNumber', sql.NVarChar(100), chassisNumber)
        .input('EngineNumber', sql.NVarChar(100), engineNumber)
        .execute('RequestVehicleRegistration');
};

const approveVehicleRegistration = async (transactionId, approvedBy, registrationNumber) => {
    const pool = await poolPromise;
    return pool.request()
        .input('TransactionId', sql.UniqueIdentifier, transactionId)
        .input('ApprovedBy', sql.UniqueIdentifier, approvedBy)
        .input('RegistrationNumber', sql.NVarChar(50), registrationNumber)
        .execute('ApproveVehicleRegistration');
};

const rejectVehicleRequest = async (transactionId) => {
    const pool = await poolPromise;
    return pool.request()
        .input('TransactionId', sql.UniqueIdentifier, transactionId)
        .execute('RejectVehicleRequest');
};

const requestOwnershipTransfer = async (vehicleId, currentOwnerId, newOwnerCnic, transferFee) => {
    const pool = await poolPromise;
    return pool.request()
        .input('VehicleId', sql.UniqueIdentifier, vehicleId)
        .input('CurrentOwnerId', sql.UniqueIdentifier, currentOwnerId)
        .input('NewOwnerCnic', sql.NVarChar(15), newOwnerCnic)
        .input('TransferFee', sql.Decimal(18, 2), transferFee)
        .execute('RequestOwnershipTransfer');
};

const approveOwnershipTransfer = async (transactionId) => {
    const pool = await poolPromise;
    return pool.request()
        .input('TransactionId', sql.UniqueIdentifier, transactionId)
        .execute('ApproveOwnershipTransfer');
};

// Assign OTP to Email
const assignOtpToEmail = async (email, otp, expiryMinutes = 5) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('Email', sql.NVarChar(255), email)
            .input('Otp', sql.NVarChar(6), otp)
            .input('ExpiryMinutes', sql.Int, expiryMinutes)
            .execute('AssignOtpToEmail'); 

        return result.rowsAffected > 0; 
    } catch (error) {
        console.error('Error assigning OTP to email:', error);
        throw error;
    }
};


// Verify OTP
const verifyOtp = async (email, otp) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('Email', sql.NVarChar(255), email)
            .input('Otp', sql.NVarChar(6), otp)
            .execute('VerifyOtp'); // Ensure this matches the stored procedure name

        return result.recordset[0].isValid; // Adjust based on the actual return structure
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};

const getTransactionDetailsById = async (transactionId) => {
    const pool = await poolPromise; // Use the pool to manage the connection

    try {
        // Execute the stored procedure with the input parameter
        const result = await pool.request()
            .input('TransactionId', sql.UniqueIdentifier, transactionId) // Pass the transactionId securely
            .execute('GetTransactionDetailsById'); // Ensure this matches the stored procedure name

        return result.recordset; // Return the result from the stored procedure
    } catch (error) {
        console.error('Error getting transaction details by ID:', error);
        throw error; // Propagate the error
    }
};


  // Function to get all transaction details
  const getAllTransactionDetails = async () => {
    const pool = await poolPromise; // Use the pool to manage the connection

    try {
        // Execute the stored procedure without any input parameters
        const result = await pool.request()
            .execute('GetAllTransactionDetails'); // Ensure this matches the stored procedure name

        return result.recordset; // Return the result from the stored procedure
    } catch (error) {
        console.error('Error getting all transaction details:', error);
        throw error; // Propagate the error
    }
};

// Insert Vehicle Document
const insertVehicleDocument = async (vehicleId, documentType, fileName, fileType, fileContent) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('VehicleId', sql.UniqueIdentifier, vehicleId)
            .input('DocumentType', sql.NVarChar(255), documentType)
            .input('FileName', sql.NVarChar(255), fileName)
            .input('FileType', sql.NVarChar(50), fileType)
            .input('FileContent', sql.VarBinary, fileContent)
            .execute('InsertVehicleDocument');
        return result.recordset[0];
    } catch (error) {
        console.error('Error inserting vehicle document:', error);
        throw error;
    }
};

// Get Vehicle Documents by Vehicle ID
const getVehicleDocumentsByVehicleId = async (vehicleId) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('VehicleId', sql.UniqueIdentifier, vehicleId)
            .execute('GetVehicleDocumentsByVehicleId');
        return result.recordset; // Return all matching documents
    } catch (error) {
        console.error('Error fetching vehicle documents by Vehicle ID:', error);
        throw error;
    }
};

// Send Inspection Request
const sendInspectionRequest = async (vehicleId, officerId, appointmentDate) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('VehicleId', sql.UniqueIdentifier, vehicleId)
            .input('OfficerId', sql.UniqueIdentifier, officerId)
            .input('AppointmentDate', sql.DateTime, appointmentDate)
            .execute('SendInspectionRequest'); // Ensure this matches the stored procedure name

        return result.recordset; // Adjust if needed based on procedure's output
    } catch (error) {
        console.error('Error sending inspection request:', error);
        throw error;
    }
};

// Fetch all users with the InspectionOfficer role
const getAllUsersWithInspectionOfficers = async () => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .execute('GetAllInspectionOfficers'); // Ensure this matches the stored procedure name

        return result.recordset; // Adjust if needed based on the procedure's output
    } catch (error) {
        console.error('Error fetching users with inspection officers:', error);
        throw error;
    }
};

const getInspectionRequestsByOfficerId = async (officerId) => {
    const pool = await poolPromise;
    try {
        // Execute the stored procedure to fetch inspection requests by officerId
        const result = await pool.request()
            .input('OfficerId', sql.UniqueIdentifier, officerId) // Pass officerId as input parameter
            .execute('GetInspectionRequestsByOfficerId'); // Ensure this matches the stored procedure name

        return result.recordset; // Return the list of inspection requests
    } catch (error) {
        console.error('Error fetching inspection requests:', error);
        throw error;
    }
};


// Assign OTP to Email Procedure
const assignRegOtpToEmail = async (email, otp, expiryMinutes = 5) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('Email', sql.NVarChar(255), email)
            .input('Otp', sql.NVarChar(6), otp)
            .input('ExpiryMinutes', sql.Int, expiryMinutes)
            .execute('AssignRegOtpToEmail');

        return result.rowsAffected > 0; // Check if OTP is successfully assigned
    } catch (error) {
        console.error('Error assigning OTP to email:', error);
        throw error;
    }
};

// Verify OTP Procedure
const verifyRegOtp = async (email, otp) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('Email', sql.NVarChar(255), email)
            .input('Otp', sql.NVarChar(6), otp)
            .execute('VerifyRegOtp');

        return result.recordset[0].isValid; // Returns 1 for valid OTP, 0 for expired
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};

// Approve an inspection request
const approveInspectionRequest = async (requestId) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('RequestId', sql.UniqueIdentifier, requestId) 
            .execute('ApproveInspectionRequest'); // Calls the stored procedure

        // Confirm that the update was successful
        if (result.rowsAffected[0] === 0) {
            throw new Error("Inspection request not found or already approved.");
        }

        return result;
    } catch (error) {
        console.error('Error approving inspection request:', error);
        throw error;
    }
};


const rejectInspectionRequest = async (requestId) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('RequestId', sql.UniqueIdentifier, requestId) 
            .execute('RejectInspectionRequest'); 

        
        if (result.rowsAffected[0] === 0) {
            throw new Error("Inspection request not found or already proceeded.");
        }

        return result;
    } catch (error) {
        console.error('Error rejecting inspection request:', error);
        throw error;
    }
};

const getInspectionRequestsByVehicleId = async (vehicleId) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('VehicleId', sql.UniqueIdentifier, vehicleId) 
            .execute('GetInspectionDetailByVehicleId');

        return result.recordset; // Return the list of inspection requests
    } catch (error) {
        console.error('Error fetching inspection requests:', error);
        throw error;
    }
};

const createChallan = async (vehicleId, amount, type) => {
    const pool = await poolPromise;
    try {
      const result = await pool.request()
        .input('VehicleId', sql.UniqueIdentifier, vehicleId)
        .input('Amount', sql.Decimal(10, 2), amount)
        .input('Type', sql.NVarChar(50), type)
        .execute('sp_CreateChallan');
      return result.rowsAffected[0];
    } catch (err) {
      console.error('Error executing sp_CreateChallan:', err);
      throw err;
    }
  };
  

  const updateChallanPayment = async (challanId, paymentIntentId) => {
    const pool = await poolPromise;
    try {
      const result = await pool.request()
        .input('ChallanId', sql.UniqueIdentifier, challanId)
        .input('PaymentIntentID', sql.NVarChar(255), paymentIntentId)
        .execute('sp_UpdateChallanPayment');
      return result.rowsAffected[0];
    } catch (err) {
      console.error('Error executing sp_UpdateChallanPayment:', err);
      throw err;
    }
  };
  

  const getChallanDetailsByUserId = async (userId) => {
    const pool = await poolPromise;
    try {
      const result = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .execute('sp_GetChallanDetailsByUserId');
      return result.recordset; 
    } catch (err) {
      console.error('Error executing sp_GetChallanDetailsByUserId:', err);
      throw err;
    }
  };
  

module.exports = {
    createUser,
    getUserByEmail,
    loginUser,
    getAllUsers,
    getUserByName,
    getUserById,
    updateUser,
    updateUserPassword,
    deleteUser,
    getAllVehicles,
    getVehicleById,
    getVehiclesByOwner,
    getVehiclesByOwnerCNIC,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getTransactions,
    requestVehicleRegistration,
    approveVehicleRegistration,
    rejectVehicleRequest,
    requestOwnershipTransfer,
    approveOwnershipTransfer,
    updateVehicleStatus,
    getVehiclesByUserId,
    verifyOtp,
    assignOtpToEmail,
    getTransactionDetailsById,
    getAllTransactionDetails,
    insertVehicleDocument,
    getVehicleDocumentsByVehicleId,
    sendInspectionRequest,
    getInspectionRequestsByOfficerId,
    getAllUsersWithInspectionOfficers,
    assignRegOtpToEmail,
    verifyRegOtp,
    approveInspectionRequest,
    rejectInspectionRequest,
    getInspectionRequestsByVehicleId,
    createChallan,
    updateChallanPayment,
    getChallanDetailsByUserId
};