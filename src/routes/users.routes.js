const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validate, updateUserSchema } = require('../middleware/validate.middleware');

// SCRUM-56: /me endpoints (protected)
router.get('/me', authMiddleware, usersController.getMe);
router.put('/me', authMiddleware, validate(updateUserSchema), usersController.updateMe);
router.get('/me/trees', authMiddleware, usersController.getMyTrees);
router.get('/me/certificates', authMiddleware, usersController.getMyCertificates);

// SCRUM-14: CRUD /users
router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
