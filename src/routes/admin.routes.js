const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.use(authMiddleware, adminMiddleware);

router.get('/trees', adminController.getPendingTrees);
router.patch('/trees/:id/approve', adminController.approveTree);
router.patch('/trees/:id/reject', adminController.rejectTree);

module.exports = router;
