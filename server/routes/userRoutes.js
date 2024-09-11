const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup route
router.post('/user', userController.createUserController);

// Login route
router.post('/login', userController.loginController);

module.exports = router;
