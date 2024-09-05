const { createUser,getAllUsers, getUserByName, getUserById, updateUser, deleteUser } = require('../db/dbQueries');

const createUserController = async (req, res) => {
    try {
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            ethereumAddress: req.body.ethereumAddress,
            phoneNumber: req.body.phoneNumber,
            addressDetails: req.body.addressDetails,
            profilePicture: req.body.profilePicture
        };
        const result = await createUser(userData);

        res.status(201).json({
            msg: "User created successfully",
            data: result.recordset
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            msg: "Error creating user",
            error: error.message
        });
    }
};

// Get All Users
const fetchAllUsers = async (req, res) => {
    try {
        const result = await getAllUsers();
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get User by Name
const fetchUserByName = async (req, res) => {
    const userName = req.query.name;
    if (!userName) {
        return res.status(400).json({ msg: "User name is required" });
    }
    try {
        const result = await getUserByName(userName);
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get User by ID
const fetchUserById = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
    }
    try {
        const result = await getUserById(userId);
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Update User
const modifyUser = async (req, res) => {
    const { UserId, Name, Email, Password, Role, EthereumAddress, PhoneNumber, AddressDetails, ProfilePicture } = req.body;
    if (!UserId) {
        return res.status(400).json({ msg: "User ID is required" });
    }
    try {
        await updateUser(UserId, Name, Email, Password, Role, EthereumAddress, PhoneNumber, AddressDetails, ProfilePicture);
        res.status(200).json({ msg: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Delete User
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

module.exports = {
    createUserController,
    fetchAllUsers,
    fetchUserByName,
    fetchUserById,
    modifyUser,
    removeUser
};
