const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const userService = require('../services/user.service');

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// SCRUM-14: POST /users
const createUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await userService.createUser({ name, email, password });
  res.status(201).json({ status: 'success', data: { user } });
});

// SCRUM-14: GET /users
const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json({ status: 'success', data: { users } });
});

// SCRUM-14: GET /users/:id
const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!uuidRegex.test(id)) {
    throw new AppError('Invalid user ID format', 400);
  }
  const user = await userService.getUserById(id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ status: 'success', data: { user } });
});

// SCRUM-14: DELETE /users/:id
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!uuidRegex.test(id)) {
    throw new AppError('Invalid user ID format', 400);
  }
  const deleted = await userService.deleteUser(id);
  if (!deleted) throw new AppError('User not found', 404);
  res.status(204).send();
});

// SCRUM-56: GET /users/me
const getMe = catchAsync(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.json({ status: 'success', data: { user } });
});

// SCRUM-56: PUT /users/me  ← додано email
const updateMe = catchAsync(async (req, res) => {
  const { name, email, password, currentPassword } = req.body; // ← додано email
  const user = await userService.updateMe(req.user.id, { name, email, password, currentPassword });
  res.json({ status: 'success', data: { user } });
});

// SCRUM-56: GET /users/me/trees
const getMyTrees = catchAsync(async (req, res) => {
  const trees = await userService.getMyTrees(req.user.id);
  res.json({ status: 'success', data: { trees } });
});

// SCRUM-56: GET /users/me/certificates
const getMyCertificates = catchAsync(async (req, res) => {
  const certificates = await userService.getMyCertificates(req.user.id);
  res.json({ status: 'success', data: { certificates } });
});

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  getMe,
  updateMe,
  getMyTrees,
  getMyCertificates,
};
