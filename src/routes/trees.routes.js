const express = require('express');
const router = express.Router();
const treesController = require('../controllers/trees.controller');

router.get('/', treesController.getAllTrees);
router.get('/species', treesController.getSpecies);
router.get('/:id', treesController.getTreeById);
router.post('/', treesController.plantTree);
router.delete('/:id', treesController.deleteTree);

module.exports = router;
