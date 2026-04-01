const express = require('express');
const router = express.Router();
const treesController = require('../controllers/trees.controller');
const { validate, plantTreeSchema } = require('../middleware/validate.middleware');

router.get('/', treesController.getAllTrees);
router.get('/species', treesController.getSpecies);
router.get('/:id', treesController.getTreeById);
router.post('/', validate(plantTreeSchema), treesController.plantTree);
router.delete('/:id', treesController.deleteTree);

module.exports = router;
