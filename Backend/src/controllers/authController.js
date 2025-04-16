// src/controllers/authController.js

const authService = require('../services/authService');

/**
 * Register
 */
async function register(req, res) {
  try {
    const { username, password, email } = req.body;
    const newUser = await authService.register(username, password, email);
    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    if (error.code === 'P2002') {
      // Unique constraint failed on the fields: `username` (or `email`)
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    console.error('Error in register:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
}

/**
 * Login
 * This function is called if the passport validation passes.
 */
function login(req, res) {
  // At this point, req.user is the user object deserialized by passport.
  res.json({
    message: 'Login successful',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    },
  });
}

/**
 * Logout
 */
function logout(req, res) {
  // req.logout is the logout method attached by Passport.
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
}

/**
 * Protected Route Test (Get User Information)
 */
function profile(req, res) {
  // Reaching here means the user has passed ensureAuthenticated.
  res.json({
    message: 'User information',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    },
  });
}

/**
 * Custom Middleware: Ensure the User is Logged In
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Please log in first' });
}

function loginFail(req, res) {
  res.status(401).json({ message: 'Login failed' });
}

module.exports = {
  register,
  login,
  logout,
  profile,
  ensureAuthenticated,
  loginFail,
};
