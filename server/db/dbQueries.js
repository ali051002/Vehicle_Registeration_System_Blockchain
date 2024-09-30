const { sql, poolPromise } = require('./dbConfig');
const bcrypt = require('bcrypt');
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
            .input('ProfilePicture', sql.NVarChar(255), userData.profilePicture)
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
    
    // If the user does not exist, throw an error
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    // If passwords do not match, throw an error
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT token if credentials are correct
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return token and user data including role and id
    return {
        token,
        user: {
            id: user.id,  // Ensure the user ID is included in the response
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
    return pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .execute('sp_GetUserById');
};

// Update user
const updateUser = async (UserId, Name, Email, Password, Role, cnic, PhoneNumber, AddressDetails, ProfilePicture) => {
    const pool = await poolPromise;
    return pool.request()
        .input('UserId', sql.UniqueIdentifier, UserId)
        .input('Name', sql.NVarChar(100), Name)
        .input('Email', sql.NVarChar(100), Email)
        .input('Password', sql.NVarChar(256), Password)
        .input('Role', sql.NVarChar(50), Role)
        .input('cnic', sql.NVarChar(100), cnic)
        .input('PhoneNumber', sql.NVarChar(20), PhoneNumber)
        .input('AddressDetails', sql.NVarChar(255), AddressDetails)
        .input('ProfilePicture', sql.NVarChar(255), ProfilePicture)
        .execute('sp_UpdateUser');
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
};

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



module.exports = {
    createUser,
    getUserByEmail,
    loginUser,
    getAllUsers,
    getUserByName,
    getUserById,
    updateUser,
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
    requestOwnershipTransfer,
    approveOwnershipTransfer,
    updateVehicleStatus,
    getVehiclesByUserId
};