const express = require('express');
const router = express.Router();

// Controller ve middleware'leri güvenli şekilde yükle
let authController, authMiddleware;

try {
  authController = require('../controllers/authController');
  console.log('✅ Auth controller loaded');
} catch (error) {
  console.error('❌ Auth controller yüklenirken hata:', error.message);
  // Fallback controller oluştur
  authController = {
    register: async (req, res) => res.status(500).json({ mesaj: 'Controller yüklenemedi', error: error.message }),
    login: async (req, res) => res.status(500).json({ mesaj: 'Controller yüklenemedi', error: error.message }),
    getMe: async (req, res) => res.status(500).json({ mesaj: 'Controller yüklenemedi', error: error.message }),
    createTestUser: async (req, res) => res.status(500).json({ mesaj: 'Controller yüklenemedi', error: error.message }),
    listUsers: async (req, res) => res.status(500).json({ mesaj: 'Controller yüklenemedi', error: error.message }),
    deleteUser: async (req, res) => res.status(500).json({ mesaj: 'Controller yüklenemedi', error: error.message }),
    deleteAllUsers: async (req, res) => res.status(500).json({ mesaj: 'Controller yüklenemedi', error: error.message })
  };
}

try {
  authMiddleware = require('../middleware/authMiddleware');
  console.log('✅ Auth middleware loaded');
} catch (error) {
  console.error('❌ Auth middleware yüklenirken hata:', error.message);
  // Fallback middleware oluştur
  authMiddleware = (req, res, next) => {
    res.status(500).json({ mesaj: 'Middleware yüklenemedi', error: error.message });
  };
}

// Route handler'ları try-catch ile sarmala
const safeHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error('❌ Route handler error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          mesaj: 'Route handler hatası',
          message: 'Route handler error',
          error: error.message,
          errorName: error.name
        });
      }
    }
  };
};

router.post('/register', safeHandler(authController.register));
router.post('/login', safeHandler(authController.login));
// Türkçe route alias'ları
router.post('/giris', safeHandler(authController.login));
router.post('/kayit', safeHandler(authController.register));
router.get('/me', authMiddleware, safeHandler(authController.getMe));

// Test kullanıcısı oluşturma endpoint'i (sadece development/test için)
router.post('/create-test-user', safeHandler(authController.createTestUser));

// Kullanıcı yönetimi endpoint'leri
router.get('/users', safeHandler(authController.listUsers)); // Tüm kullanıcıları listele
router.delete('/user', safeHandler(authController.deleteUser)); // Email'e göre kullanıcı sil
router.delete('/users/all', safeHandler(authController.deleteAllUsers)); // Tüm kullanıcıları sil (DİKKAT!)

module.exports = router;
