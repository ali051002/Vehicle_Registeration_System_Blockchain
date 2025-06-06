const bcrypt = require('bcrypt');
const { 
    createUser, 
    loginUser, 
    getAllUsers, 
    getUserByName, 
    getUserById, 
    updateUser, 
    updateUserPassword,
    deleteUser 
} = require('../db/dbQueries');

// Create User Controller (Signup)
const createUserController = async (req, res) => {
    try {
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'user',
            cnic: req.body.cnic,
            phoneNumber: req.body.phoneNumber,
            addressDetails: req.body.addressDetails,
            profilePicture: req.body.profilePicture || ''
        };

        const userId = await createUser(userData);
        res.status(201).json({
            msg: "User created successfully",
            userID: userId  // Sending back the user ID to the client if needed
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
        const result = await loginUser(email, password);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// Get All Users Controller
const fetchAllUsers = async (req, res) => {
    try {
        const result = await getAllUsers();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get User by Name Controller
const fetchUserByName = async (req, res) => {
    const userName = req.query.name;
    if (!userName) {
        return res.status(400).json({ msg: "User name is required" });
    }
    try {
        const result = await getUserByName(userName);
        if (!result) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get User by ID Controller
const fetchUserById = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
    }
    try {
        const result = await getUserById(userId);
        
        if (!result) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(
        result.recordsets[0][0]
        );
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Update User Controller
const modifyUser = async (req, res) => {
    const { UserId, Name, Email, Password, cnic, PhoneNumber, AddressDetails, ProfilePicture } = req.body;
    if (!UserId) {
        return res.status(400).json({ msg: "User ID is required" });
    }
    const saltRounds = 10; // Number of rounds for bcrypt
    const newPasswordHash = await bcrypt.hash(Password, saltRounds);
    try {
        await updateUser(UserId, Name, Email, newPasswordHash, cnic, PhoneNumber, AddressDetails, ProfilePicture);
        res.status(200).json({ msg: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Delete User Controller
const removeUser = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
    }
    try {
        await deleteUser(userId);
        res.status(200).json({ msg: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }



};

const fetchGovernmentOfficialById = async (req, res) => {
    const officialId = req.params.id;
    if (!officialId) {
        return res.status(400).json({ msg: "Government Official ID is required" });
    }
    try {
        const result = await getUserById(officialId);
        
        if (!result) {
            return res.status(404).json({ msg: "Government Official not found" });
        }
        res.status(200).json(result.recordsets[0][0]);  // Adjust this to match the returned data structure
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const updatePasswordController = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ msg: "Email and New Password are required" });
        }

        // Hash the new password before storing it
        const saltRounds = 10; // Number of rounds for bcrypt
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Call the dbQuery function to update the password
        const message = await updateUserPassword(email, newPasswordHash);

        // Respond with the success message
        res.status(200).json({ msg: message });
    } catch (error) {
        res.status(500).json({ msg: "Error updating password", error: error.message });
    }
};

module.exports = {
    createUserController,
    loginController,
    fetchAllUsers,
    fetchUserByName,
    fetchUserById,
    modifyUser,
    updatePasswordController,
    removeUser   
};
