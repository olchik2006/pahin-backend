const treeModel = require('../models/tree.model');
const speciesModel = require('../models/species.model');

const getAllTrees = async (filters) => {
  return await treeModel.getAllTrees(filters);
};

const getTreeById = async (id) => {
  return await treeModel.findTreeById(id);
};

const createTree = async (data) => {
  return await treeModel.createTree(data);
};

const getTreesByUserId = async (userId) => {
  return await treeModel.getTreesByUserId(userId);
};

const getAllSpecies = async () => {
  return await speciesModel.getAllSpecies();
};

module.exports = { getAllTrees, getTreeById, createTree, getTreesByUserId, getAllSpecies };
