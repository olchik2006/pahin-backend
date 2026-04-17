const express = require('express');
const router = express.Router();
const { getSpecies } = require('../controllers/species.controller');

router.get('/', getSpecies);

module.exports = router;
