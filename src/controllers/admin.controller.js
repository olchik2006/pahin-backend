const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const adminModel = require('../models/admin.model');

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getPendingTrees = catchAsync(async (req, res) => {
  const trees = await adminModel.getPendingTrees();
  res.json({ status: 'success', data: { trees } });
});

const approveTree = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!uuidRegex.test(id)) throw new AppError('Невірний формат ID', 400);
  const tree = await adminModel.updateTreeStatus(id, 'approved');
  if (!tree) throw new AppError('Заявку не знайдено', 404);
  res.json({ status: 'success', data: { tree } });
});

const rejectTree = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!uuidRegex.test(id)) throw new AppError('Невірний формат ID', 400);
  const tree = await adminModel.updateTreeStatus(id, 'rejected');
  if (!tree) throw new AppError('Заявку не знайдено', 404);
  res.json({ status: 'success', data: { tree } });
});

module.exports = { getPendingTrees, approveTree, rejectTree };
