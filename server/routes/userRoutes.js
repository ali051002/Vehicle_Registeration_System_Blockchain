const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Signup route (Create a new user)
router.post('/user', userController.createUserController);

// Login route (Authenticate user and return token)
router.post('/login', userController.loginController);

// Get all users (Admin-level route)
router.get('/users', userController.fetchAllUsers);

// Get user by name (Search users by name)
router.get('/userByName',authorize(['user','government official','InspectionOfficer']), userController.fetchUserByName);

// Get user by ID (Fetch a specific user by their unique ID)
router.get('/user/:id',authorize(['user','government official','InspectionOfficer']), userController.fetchUserById);

// Update user details (Modify a user by ID)
router.put('/updateUser',authorize(['user','government official','InspectionOfficer']), userController.modifyUser);

// Delete user by ID (Remove a user from the system)
router.delete('/user/:id',authorize(['user','government official','InspectionOfficer']), userController.removeUser);

router.put('/update-password',authorize(['user','government official','InspectionOfficer']), userController.updatePasswordController);

module.exports = router;
