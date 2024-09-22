const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup route (Create a new user)
router.post('/user', userController.createUserController);

// Login route (Authenticate user and return token)
router.post('/login', userController.loginController);

module.exports = router;
