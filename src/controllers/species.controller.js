const treeService = require('../services/tree.service');

const getSpecies = async (req, res) => {
  try {
    const species = await treeService.getAllSpecies();
    return res.status(200).json(species);
  } catch (error) {
    console.error('getSpecies error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getSpecies };
