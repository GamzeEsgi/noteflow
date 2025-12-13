const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // JWT_SECRET kontrolü
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not set in authMiddleware');
      return res.status(500).json({ 
        mesaj: 'Sunucu yapılandırma hatası.',
        message: 'Server configuration error' 
      });
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        mesaj: 'Token bulunamadı.',
        message: 'No token, authorization denied' 
      });
    }

    // Token'ı decode et (User model'ine ihtiyaç yok)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // User bilgisini decoded token'dan al (User model'ine gerek yok)
    req.user = {
      _id: decoded.userId,
      id: decoded.userId,
      ...decoded
    };
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ 
      mesaj: 'Geçersiz token.',
      message: 'Token is not valid',
      error: error.message 
    });
  }
};

module.exports = authMiddleware;



