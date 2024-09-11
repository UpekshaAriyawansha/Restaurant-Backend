import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken"; // For generating tokens

// Register new user
export const registerUser = async (req, res) => {
  const { name, phone, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      name,
      phone,
      password: hashedPassword,
      orderData: {},
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Find user by phone
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, phone, password, orderData } = req.body;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.orderData = orderData || user.orderData;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
