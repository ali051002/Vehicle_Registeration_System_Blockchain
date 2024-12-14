const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup route (Create a new user)
router.post('/user', userController.createUserController);

// Login route (Authenticate user and return token)
router.post('/login', userController.loginController);

// Get all users (Admin-level route)
router.get('/users', userController.fetchAllUsers);

// Get user by name (Search users by name)
router.get('/userByName', userController.fetchUserByName);

// Get user by ID (Fetch a specific user by their unique ID)
router.get('/user/:id', userController.fetchUserById);

// Update user details (Modify a user by ID)
router.put('/user', userController.modifyUser);

// Delete user by ID (Remove a user from the system)
router.delete('/user/:id', userController.removeUser);

router.put('/update-password', userController.updatePasswordController);

module.exports = router;
