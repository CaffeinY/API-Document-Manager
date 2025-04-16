// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Login user (using passport-local strategy)
router.post('/login', passport.authenticate('local', { failureRedirect: '/api/auth/login-fail' }), authController.login
);

// If login fails, return an example response
router.get('/login-fail', authController.loginFail);

// Logout
router.post('/logout', authController.logout);

// Protected route example (accessible only when logged in)
router.get('/profile', authController.ensureAuthenticated, authController.profile);

module.exports = router;
