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

/**
 * @swagger
 * tags:
 *   name: Trees
 *   description: Tree planting endpoints
 */

/**
 * @swagger
 * /api/trees:
 *   get:
 *     summary: Get all trees with optional pagination and filters
 *     tags: [Trees]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 12
 *         description: Items per page
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *           example: Сосна
 *         description: Filter by species name (partial match)
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *           example: Львів
 *         description: Filter by region (partial match)
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *         description: Filter trees planted from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-12-31
 *         description: Filter trees planted to this date
 *     responses:
 *       200:
 *         description: List of trees
 *       400:
 *         description: Validation failed
 */
router.get('/', validateQuery(treesQuerySchema), treesController.getAllTrees);

/**
 * @swagger
 * /api/trees/species:
 *   get:
 *     summary: Get all available tree species
 *     tags: [Trees]
 *     security: []
 *     responses:
 *       200:
 *         description: List of tree species
 */
router.get('/species', treesController.getSpecies);

/**
 * @swagger
 * /api/trees/{id}:
 *   get:
 *     summary: Get tree by ID
 *     tags: [Trees]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tree data
 *       404:
 *         description: Tree not found
 */
router.get('/:id', treesController.getTreeById);

/**
 * @swagger
 * /api/trees:
 *   post:
 *     summary: Plant a new tree
 *     tags: [Trees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [speciesId, latitude, longitude]
 *             properties:
 *               speciesId:
 *                 type: string
 *                 format: uuid
 *                 example: ddce780d-2270-42d6-a836-446ca4ff3baa
 *               latitude:
 *                 type: number
 *                 example: 49.8397
 *               longitude:
 *                 type: number
 *                 example: 24.0297
 *               locationName:
 *                 type: string
 *                 example: Львів, парк Франка
 *               message:
 *                 type: string
 *                 example: Посаджено на память
 *     responses:
 *       201:
 *         description: Tree planted successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validate(plantTreeSchema), treesController.plantTree);

/**
 * @swagger
 * /api/trees/{id}:
 *   delete:
 *     summary: Delete tree by ID
 *     tags: [Trees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tree deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tree not found
 */
router.delete('/:id', authMiddleware, treesController.deleteTree);

module.exports = router;
