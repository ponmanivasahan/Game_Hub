const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const env = require('../config/env');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

async function register({ name, username, email, password, role = 'gamer' }) {
  if (!name || !username || !email || !password) {
    throw new Error('Name, username, email, and password are required.');
  }

  const allowedRoles = ['gamer', 'developer'];
  const userRole = allowedRoles.includes(role) ? role : 'gamer';

  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) {
    throw new Error('A user with this email address already exists.');
  }

  const existingUsername = await userRepository.findByUsername(username);
  if (existingUsername) {
    throw new Error('This username is already taken. Please choose another.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await userRepository.create({
    name,
    username,
    email,
    passwordHash,
    role: userRole
  });

  const token = generateToken(newUser);

  return {
    user: newUser,
    token
  };
}

async function login({ emailOrUsername, password }) {
  if (!emailOrUsername || !password) {
    throw new Error('Email/username and password are required.');
  }

  let user = await userRepository.findByEmail(emailOrUsername);
  if (!user) {
    user = await userRepository.findByUsername(emailOrUsername);
  }

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (!user.is_active) {
    throw new Error('Your account has been deactivated. Please contact support.');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new Error('Invalid email or password.');
  }

  await userRepository.updateLastLogin(user.id);

  const token = generateToken(user);
  const userSafe = await userRepository.findById(user.id);

  return {
    user: userSafe,
    token
  };
}

async function getMe(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found.');
  }
  return user;
}

async function updateProfile(userId, data) {
  return userRepository.updateProfile(userId, data);
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
