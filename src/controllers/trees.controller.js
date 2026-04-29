const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const treeService = require('../services/tree.service');

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getAllTrees = catchAsync(async (req, res) => {
  const { page, limit, species, region, dateFrom, dateTo } = req.query;
  const result = await treeService.getAllTrees({ page, limit, species, region, dateFrom, dateTo });
  res.json({ status: 'success', ...result });
});

const getSpecies = catchAsync(async (req, res) => {
  const species = await treeService.getAllSpecies();
  res.json({ message: 'success', status: 200, data: { species } });
});

const getTreeById = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!uuidRegex.test(id)) throw new AppError('Invalid tree ID format', 400);
  const tree = await treeService.getTreeById(id);
  if (!tree) throw new AppError('Tree not found', 404);
  res.json({ message: 'success', status: 200, data: { tree } });
});

const plantTree = catchAsync(async (req, res) => {
  const { speciesId, latitude, longitude, locationName, message } = req.body;
  const tree = await treeService.createTree({
    userId: req.user.id,
    speciesId,
    latitude,
    longitude,
    locationName,
    message,
  });
  res.status(201).json({ message: 'Tree planted successfully', status: 201, data: { tree } });
});

const deleteTree = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!uuidRegex.test(id)) throw new AppError('Invalid tree ID format', 400);
  const deleted = await treeService.deleteTree(id, req.user.id);
  if (!deleted) throw new AppError('Tree not found or you are not the owner', 404);
  res.status(204).send();
});

module.exports = { getAllTrees, getSpecies, getTreeById, plantTree, deleteTree };
