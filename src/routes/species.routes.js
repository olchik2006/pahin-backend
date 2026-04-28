const express = require('express');
const router = express.Router();
const { getSpecies } = require('../controllers/species.controller');

/**
 * @swagger
 * tags:
 *   name: Species
 *   description: Tree species reference
 */

/**
 * @swagger
 * /api/species:
 *   get:
 *     summary: Get all tree species
 *     tags: [Species]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all tree species
 */
router.get('/', getSpecies);

module.exports = router;
