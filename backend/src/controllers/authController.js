const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updated = await authService.updateProfile(req.user.id, req.body);
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile
};
