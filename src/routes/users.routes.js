const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validate, updateUserSchema } = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile endpoints
 */

// SCRUM-56: /me endpoints (protected)

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, usersController.getMe);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Оля Василишин
 *               email:
 *                 type: string
 *                 example: olya@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
router.put('/me', authMiddleware, validate(updateUserSchema), usersController.updateMe);

/**
 * @swagger
 * /api/users/me/trees:
 *   get:
 *     summary: Get trees planted by current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's trees
 *       401:
 *         description: Unauthorized
 */
router.get('/me/trees', authMiddleware, usersController.getMyTrees);

/**
 * @swagger
 * /api/users/me/certificates:
 *   get:
 *     summary: Get certificates of current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's certificates
 *       401:
 *         description: Unauthorized
 */
router.get('/me/certificates', authMiddleware, usersController.getMyCertificates);

// SCRUM-14: CRUD /users

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (admin)
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation failed
 */
router.post('/', usersController.createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get('/:id', usersController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', usersController.deleteUser);

module.exports = router;
