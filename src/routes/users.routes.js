const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/me', usersController.getMe);
router.put('/me', usersController.updateMe);
router.get('/me/trees', usersController.getMyTrees);
router.get('/me/certificates', usersController.getMyCertificates);

module.exports = router;
