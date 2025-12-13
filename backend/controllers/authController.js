const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
exports.register = async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin.',
        error: 'MongoDB not connected'
      });
    }

    // Hem 'password' hem 'sifre' alanlarını kabul et
    const { email, password, sifre, ad, blok, kat, daire, telefon, rol } = req.body;
    const userPassword = password || sifre;

    if (!email || !userPassword) {
      return res.status(400).json({ 
        mesaj: 'Email ve şifre gereklidir.',
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        mesaj: 'Bu email zaten kullanılıyor.',
        message: 'User already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    // Create user - MongoDB User model'ine göre
    const userData = {
      email,
      password: hashedPassword,
      plan: 'free'
    };

    // Eğer User model'inde rol field'ı varsa ekle
    if (rol) {
      userData.rol = rol;
    }

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Frontend'in beklediği format
    const userRol = user.rol || 'sakin';

    res.status(201).json({
      mesaj: 'Kayıt başarılı',
      message: 'User created successfully',
      token,
      kullanici: {
        id: user._id,
        email: user.email,
        rol: userRol,
        plan: user.plan,
        ad: ad || null,
        blok: blok || null,
        kat: kat || null,
        daire: daire || null
      },
      // Backward compatibility
      user: {
        id: user._id,
        email: user.email,
        rol: userRol,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin.',
        error: 'MongoDB not connected'
      });
    }

    // Hem 'password' hem 'sifre' alanlarını kabul et
    const { email, password, sifre } = req.body;
    const userPassword = password || sifre;

    if (!email || !userPassword) {
      return res.status(400).json({ 
        mesaj: 'Email ve şifre gereklidir.',
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        mesaj: 'Email veya şifre hatalı.',
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(userPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        mesaj: 'Email veya şifre hatalı.',
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Frontend'in beklediği format: kullanici.rol
    // MongoDB User model'inde rol yoksa default 'sakin' kullan
    const userRol = user.rol || 'sakin';

    res.json({
      mesaj: 'Giriş başarılı',
      message: 'Login successful',
      token,
      kullanici: {
        id: user._id,
        email: user.email,
        rol: userRol,
        plan: user.plan
      },
      // Backward compatibility için user field'ı da ekle
      user: {
        id: user._id,
        email: user.email,
        rol: userRol,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      user: {
        id: user._id,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Create test user
exports.createTestUser = async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin.',
        error: 'MongoDB not connected'
      });
    }

    const testEmail = 'test@example.com';
    const testPassword = 'test123456';

    // Check if user exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      return res.json({
        message: 'Test kullanıcısı zaten mevcut',
        email: testEmail,
        password: testPassword,
        user: {
          id: existingUser._id,
          email: existingUser.email
        }
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);

    // Create user
    const user = new User({
      email: testEmail,
      password: hashedPassword,
      plan: 'free'
    });

    await user.save();

    res.status(201).json({
      message: 'Test kullanıcısı oluşturuldu',
      email: testEmail,
      password: testPassword,
      user: {
        id: user._id,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Create test user error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
};

// List all users
exports.listUsers = async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin.',
        error: 'MongoDB not connected'
      });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      message: 'Kullanıcılar listelendi',
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
};

// Delete user by email
exports.deleteUser = async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin.',
        error: 'MongoDB not connected'
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Delete user's notes
    const Note = require('../models/Note');
    const deletedNotes = await Note.deleteMany({ user: user._id });

    // Delete user
    await User.findByIdAndDelete(user._id);

    res.json({
      message: 'Kullanıcı başarıyla silindi',
      deletedUser: {
        id: user._id,
        email: user.email
      },
      deletedNotes: deletedNotes.deletedCount
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
};

// Delete all users (DANGER!)
exports.deleteAllUsers = async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin.',
        error: 'MongoDB not connected'
      });
    }

    // Delete all notes
    const Note = require('../models/Note');
    const deletedNotes = await Note.deleteMany({});

    // Delete all users
    const deletedUsers = await User.deleteMany({});

    res.json({
      message: 'Tüm kullanıcılar ve notlar silindi',
      deletedUsers: deletedUsers.deletedCount,
      deletedNotes: deletedNotes.deletedCount
    });
  } catch (error) {
    console.error('Delete all users error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
};

