const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const userService = require('../services/user.service');
const treeService = require('../services/tree.service');

const getMe = catchAsync(async (req, res) => {
  const user = await userService.findById(req.user.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ message: 'success', status: 200, data: { user } });
});

const updateMe = catchAsync(async (req, res) => {
  const { full_name, avatar_url } = req.body;
  const user = await userService.update(req.user.id, { full_name, avatar_url });
  res.json({ message: 'success', status: 200, data: { user } });
});

const getMyTrees = catchAsync(async (req, res) => {
  const trees = await treeService.getByUserId(req.user.id);
  res.json({ message: 'success', status: 200, data: { trees } });
});

const deleteMe = catchAsync(async (req, res) => {
  await userService.remove(req.user.id);
  res.status(204).json({ message: 'User deleted', status: 204 });
});
const getMyCertificates = catchAsync(async (req, res) => {
  res.json({ message: 'success', status: 200, data: { certificates: [] } });
});
module.exports = { getMe, updateMe, getMyTrees, deleteMe, getMyCertificates };
