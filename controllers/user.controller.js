const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, address, role } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        status: 0,
        message: "Validation error",
        data: null,
        error: "All fields (name, email, phone, password, role) are required.",
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 0,
        message: "Validation error",
        data: null,
        error: "Please provide a valid email address.",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        status: 0,
        message: "Validation error",
        data: null,
        error: "Password must be at least 6 characters long.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 0,
        message: "User already exists",
        data: null,
        error: "The provided email is already registered.",
      });
    }

    // Check if phone is already registered
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(409).json({
        status: 0,
        message: "Phone already exists",
        data: null,
        error: "The provided phone number is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      role,
    });

    // Generate JWT token
    const token = generateToken(newUser);

    // Get user data without password for response
    const userData = await User.findById(newUser._id);

    // Success response
    return res.status(201).json({
      status: 1,
      message: "User registered successfully",
      data: {
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
        },
        token,
      },
      error: null,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
      data: null,
      error: error.message || "Something went wrong.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log login attempt details (remove in production)
    console.log(
      `Login attempt for email: ${email}, password provided: ${!!password}`
    );

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 0,
        message: "Validation error",
        data: null,
        error: "Email and password are required.",
      });
    }

    // Check if user exists - explicitly include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(400).json({
        status: 0,
        message: "Invalid credentials",
        data: null,
        error: "Invalid email or password.",
      });
    }

    // Log detailed user info for debugging (remove in production)
    console.log(`User found: ID=${user._id}, email=${user.email}`);
    console.log(`Password field exists: ${!!user.password}`);
    console.log(`Password field type: ${typeof user.password}`);
    console.log(
      `Password field length: ${user.password ? user.password.length : 0}`
    );

    // Check if password exists in the user record
    if (!user.password) {
      console.error(`User ${user._id} has no password field in database`);
      return res.status(500).json({
        status: 0,
        message: "Server error",
        data: null,
        error: "Account configuration issue. Please contact support.",
      });
    }

    // Compare password - using try/catch specifically for bcrypt operation
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: 0,
          message: "Invalid credentials",
          data: null,
          error: "Invalid email or password.",
        });
      }

      // Generate JWT token
      const token = generateToken(user);

      // Success response - don't include password in response
      return res.json({
        status: 1,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        error: null,
      });
    } catch (bcryptError) {
      console.error(`bcrypt error for user ${user._id}:`, bcryptError);
      return res.status(500).json({
        status: 0,
        message: "Server error",
        data: null,
        error: "Authentication error. Please try again later.",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Success response
    return res.json({
      status: 1,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      error: null,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      status: 0,
      message: "Server error",
      data: null,
      error: err.message || "An unexpected error occurred.",
    });
  }
};

module.exports = { registerUser, loginUser };
