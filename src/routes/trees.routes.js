const express = require('express');
const router = express.Router();
const treesController = require('../controllers/trees.controller');
const {
  validate,
  validateQuery,
  plantTreeSchema,
  treesQuerySchema,
} = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', validateQuery(treesQuerySchema), treesController.getAllTrees);
router.get('/species', treesController.getSpecies);
router.get('/:id', treesController.getTreeById);
router.post('/', authMiddleware, validate(plantTreeSchema), treesController.plantTree);
router.delete('/:id', authMiddleware, treesController.deleteTree);

module.exports = router;
