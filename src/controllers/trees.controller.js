const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const treeService = require('../services/tree.service');

const getAllTrees = catchAsync(async (req, res) => {
  const { region, species_id, limit, offset } = req.query;
  const trees = await treeService.getAll({ region, species_id, limit, offset });
  const total = await treeService.getTotalCount();
  res.json({ message: 'success', status: 200, total, data: { trees } });
});

const getSpecies = catchAsync(async (req, res) => {
  const species = await treeService.getAllSpecies();
  res.json({ message: 'success', status: 200, data: { species } });
});

const getTreeById = catchAsync(async (req, res) => {
  const tree = await treeService.findById(req.params.id);
  if (!tree) throw new AppError('Tree not found', 404);
  res.json({ message: 'success', status: 200, data: { tree } });
});

const plantTree = catchAsync(async (req, res) => {
  const tree = await treeService.create({ ...req.body, user_id: req.user.id });
  res.status(201).json({ message: 'Tree planted successfully', status: 201, data: { tree } });
});

const deleteTree = catchAsync(async (req, res) => {
  const deleted = await treeService.remove(req.params.id, req.user.id);
  if (!deleted) throw new AppError('Tree not found or you are not the owner', 404);
  res.status(204).json({ message: 'Tree deleted', status: 204 });
});

module.exports = { getAllTrees, getSpecies, getTreeById, plantTree, deleteTree };
