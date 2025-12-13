const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
// Türkçe route alias'ları
router.post('/giris', authController.login);
router.post('/kayit', authController.register);
router.get('/me', authMiddleware, authController.getMe);

// Test kullanıcısı oluşturma endpoint'i (sadece development/test için)
router.post('/create-test-user', authController.createTestUser);

// Kullanıcı yönetimi endpoint'leri
router.get('/users', authController.listUsers); // Tüm kullanıcıları listele
router.delete('/user', authController.deleteUser); // Email'e göre kullanıcı sil
router.delete('/users/all', authController.deleteAllUsers); // Tüm kullanıcıları sil (DİKKAT!)

module.exports = router;
