const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/me', usersController.getMe);
router.put('/me', usersController.updateMe);
router.get('/me/trees', usersController.getMyTrees);
router.get('/me/certificates', usersController.getMyCertificates);

// SCRUM-14: CRUD /users
router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
