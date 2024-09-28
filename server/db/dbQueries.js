const { sql, poolPromise } = require('./dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new user (Signup)
const createUser = async (userData) => {
    const pool = await poolPromise;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return pool.request()
        .input('Name', sql.NVarChar(100), userData.name)
        .input('Email', sql.NVarChar(100), userData.email)
        .input('Password', sql.NVarChar(256), hashedPassword)  // Store the hashed password
        .input('Role', sql.NVarChar(50), userData.role)
        .input('EthereumAddress', sql.NVarChar(100), userData.ethereumAddress)
        .input('PhoneNumber', sql.NVarChar(20), userData.phoneNumber)
        .input('AddressDetails', sql.NVarChar(255), userData.addressDetails)
        .input('ProfilePicture', sql.NVarChar(255), userData.profilePicture)
        .execute('sp_CreateUser');
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
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT token if credentials are correct
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return token and user data including role
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,  // Include role in the response
            ethereumAddress: user.ethereumAddress,
            phoneNumber: user.phoneNumber,
            addressDetails: user.addressDetails,
            profilePicture: user.profilePicture
        }
    };
};

const getAllUsers = async () => {
    const pool = await poolPromise;
    return pool.request().execute('sp_GetAllUsers');
};

const getUserByName = async (userName) => {
    const pool = await poolPromise;
    return pool.request()
        .input('UserName', sql.NVarChar(255), userName)
        .execute('sp_GetUserByName');
};

const getUserById = async (userId) => {
    const pool = await poolPromise;
    return pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .execute('sp_GetUserById');
};

const updateUser = async (UserId, Name, Email, Password, Role, EthereumAddress, PhoneNumber, AddressDetails, ProfilePicture) => {
    const pool = await poolPromise;
    return pool.request()
        .input('UserId', sql.UniqueIdentifier, UserId)
        .input('Name', sql.NVarChar(100), Name)
        .input('Email', sql.NVarChar(100), Email)
        .input('Password', sql.NVarChar(256), Password)
        .input('Role', sql.NVarChar(50), Role)
        .input('EthereumAddress', sql.NVarChar(100), EthereumAddress)
        .input('PhoneNumber', sql.NVarChar(20), PhoneNumber)
        .input('AddressDetails', sql.NVarChar(255), AddressDetails)
        .input('ProfilePicture', sql.NVarChar(255), ProfilePicture)
        .execute('sp_UpdateUser');
};

const deleteUser = async (userId) => {
    const pool = await poolPromise;
    return pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .execute('sp_DeleteUser');
};

const getAllVehicles = async () => {
    const pool = await poolPromise;
    return pool.request().execute('sp_GetAllVehicles');
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

// Transaction Queries
const getAllTransactions = async () => {
    const pool = await poolPromise;
    return pool.request().execute('sp_GetAllTransactions');
};

// Ownership Transfer Queries
const getAllOwnershipTransfers = async () => {
    const pool = await poolPromise;
    return pool.request().execute('sp_GetAllOwnershipTransfers');
};

const transferOwnership = async (VehicleId, CurrentOwnerId, NewOwnerId, TransferFee, BlockchainTransactionId, Comments) => {
    const pool = await poolPromise;
    return pool.request()
        .input('VehicleId', sql.UniqueIdentifier, VehicleId)
        .input('CurrentOwnerId', sql.UniqueIdentifier, CurrentOwnerId)
        .input('NewOwnerId', sql.UniqueIdentifier, NewOwnerId)
        .input('TransferFee', sql.Decimal(18, 2), TransferFee)
        .input('BlockchainTransactionId', sql.NVarChar(100), BlockchainTransactionId)
        .input('Comments', sql.NVarChar(sql.Max), Comments)
        .execute('sp_TransferOwnership');
};


module.exports = {
    createUser,
    getUserByEmail,
    loginUser,
    getAllVehicles,
    getVehicleById,
    getVehiclesByOwner,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getAllTransactions,
    getAllOwnershipTransfers,
    transferOwnership,
    getAllUsers,
    getUserByName,
    getUserById,
    updateUser,
    deleteUser  
};
