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

const getAllVehicles = async () => {
    const pool = await poolPromise;
    return pool.request().execute('sp_GetAllVehicles');
};

module.exports = {
    createUser,
    getUserByEmail,
    loginUser,
    getAllVehicles
    
};
