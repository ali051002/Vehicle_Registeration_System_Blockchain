const { createUser, loginUser } = require('../db/dbQueries');

// Create User Controller (Signup)
const createUserController = async (req, res) => {
    try {
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,  // Raw password, will be hashed in dbQueries.js
            role: req.body.role || 'user',
            ethereumAddress: req.body.ethereumAddress,
            phoneNumber: req.body.phoneNumber,
            addressDetails: req.body.addressDetails,
            profilePicture: req.body.profilePicture || ''
        };

        const result = await createUser(userData);
        res.status(201).json({
            msg: "User created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error creating user",
            error: error.message
        });
    }
};

// Login User Controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Call the login function with email and password
        const result = await loginUser(email, password);

        // Return the token and user information
        res.status(200).json(result);
    } catch (err) {
        // Return error if login fails
        res.status(400).json({ msg: err.message });
    }
};

module.exports = {
    createUserController,
    loginController
};
