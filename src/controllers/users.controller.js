const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const userService = require('../services/user.service');

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
  const user = await userService.getUserById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ status: 'success', data: { user } });
});

// SCRUM-14: DELETE /users/:id
const deleteUser = catchAsync(async (req, res) => {
  const deleted = await userService.deleteUser(req.params.id);
  if (!deleted) throw new AppError('User not found', 404);
  res.status(204).send();
});

// SCRUM-56: GET /users/me
const getMe = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ status: 'success', data: { user } });
});

// SCRUM-56: PUT /users/me
const updateMe = catchAsync(async (req, res) => {
  const { name, avatar_url } = req.body;
  const user = await userService.updateUser(req.user.id, { name, avatarUrl: avatar_url });
  res.json({ status: 'success', data: { user } });
});

// SCRUM-56: GET /users/me/trees
const getMyTrees = catchAsync(async (req, res) => {
  res.json({ status: 'success', data: { trees: [] } });
});

// SCRUM-56: GET /users/me/certificates
const getMyCertificates = catchAsync(async (req, res) => {
  res.json({ status: 'success', data: { certificates: [] } });
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
