const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create User
router.post('/user', userController.createUserController);

// Get all users
router.get('/users', userController.fetchAllUsers);

// Get user by name
router.get('/userByName', userController.fetchUserByName);

// Get user by ID
router.get('/user/:id', userController.fetchUserById);

// Update user
router.put('/user', userController.modifyUser);

// Delete user
router.delete('/user/:id', userController.removeUser);

module.exports = router;
