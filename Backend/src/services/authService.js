// src/services/authService.js

const prisma = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Register user
 */
async function register(username, password, email) {
  // Check if the username already exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    throw new Error('Username already exists');
  }
  // Encrypt the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  // Do not return the password field
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
} 


module.exports = {
  register,
};
