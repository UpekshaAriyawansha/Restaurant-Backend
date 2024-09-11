import express from 'express';
import {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Get user by ID
router.get('/:id', getUserById);

// Update user by ID
router.put('/:id', updateUser);

// Delete user by ID
router.delete('/:id', deleteUser);

export default router;
