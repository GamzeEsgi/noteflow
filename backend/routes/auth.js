const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);

// Test kullanıcısı oluşturma endpoint'i (sadece development/test için)
router.post('/create-test-user', authController.createTestUser);

module.exports = router;
