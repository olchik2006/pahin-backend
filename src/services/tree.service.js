const treeModel = require('../models/tree.model');
const speciesModel = require('../models/species.model');

const getAllTrees = async (filters) => {
  const { page, limit, species, region, dateFrom, dateTo } = filters;

  const trees = await treeModel.getAllTrees({ species, region, dateFrom, dateTo, page, limit });

  if (page && limit) {
    const total = await treeModel.countTrees({ species, region, dateFrom, dateTo });
    return {
      data: trees,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  return { data: trees };
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

const mapSpeciesInfo = (s) => ({
  id: s.id,
  name: s.name,
  latinName: s.latinName,
  category: s.category,
  description: s.description,
  imageUrl: s.imageUrl,
  info: {
    sun: s.sun || undefined,
    ground: s.ground || undefined,
    distance: s.distance ? String(s.distance) : undefined,
    location: s.location || undefined,
  },
});

const getAllSpecies = async () => {
  const rows = await speciesModel.getAllSpecies();
  return rows.map(mapSpeciesInfo);
};

module.exports = { getAllTrees, getTreeById, createTree, getTreesByUserId, getAllSpecies };
