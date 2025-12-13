// Vercel serverless function - Express app wrapper
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('../backend/config/database');

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL || '*')
    : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB bağlantısı - Her request'te bağlantıyı kontrol et ve gerekirse kur
app.use(async (req, res, next) => {
  try {
    // Mongoose modülünü yükle
    let mongoose;
    try {
      mongoose = require('mongoose');
    } catch (moduleError) {
      console.error('❌ Mongoose modülü yüklenemedi:', moduleError.message);
      // Mongoose yoksa bile devam et, controller'da hata dönecek
      return next();
    }
    
    // Eğer bağlantı yoksa, bağlanmayı dene
    if (mongoose.connection.readyState !== 1) {
      console.log('🔄 MongoDB bağlantısı kuruluyor...');
      try {
        await connectDB();
        console.log('✅ MongoDB bağlantısı başarılı');
      } catch (dbError) {
        console.error('❌ MongoDB bağlantı hatası:', dbError.message);
        console.error('❌ MongoDB bağlantı hatası stack:', dbError.stack);
        // Health check endpoint'i için bağlantı hatası olsa bile devam et
        if (req.path === '/api/health') {
          return next();
        }
        // Diğer endpoint'ler için de devam et, controller'da kontrol edilecek
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Middleware hatası:', error.message);
    console.error('❌ Middleware hatası stack:', error.stack);
    // Hata olsa bile devam et (SSL hatasını önlemek için)
    next();
  }
});

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend'), {
  maxAge: '1d',
  etag: true
}));

// Routes
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/notes', require('../backend/routes/notes'));

// Health check
app.get('/api/health', (req, res) => {
  try {
    const mongoose = require('mongoose');
    res.json({ 
      status: 'OK', 
      message: 'NoteSaaS API is running',
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      mongooseLoaded: true
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      message: 'NoteSaaS API is running',
      mongodb: 'error',
      mongooseLoaded: false,
      error: error.message
    });
  }
});

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Serve other HTML files
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

// Serve frontend for all other non-API routes
app.get('*', (req, res) => {
  // API route'larını atla
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint bulunamadı.' });
  }
  
  // Static dosyalar için 404 döndür
  const ext = path.extname(req.path);
  if (ext && ext !== '.html') {
    return res.status(404).send('File not found');
  }
  
  // Diğer HTML dosyaları için index.html gönder
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    mesaj: 'Bir hata oluştu.',
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Unhandled route handler - 404 için
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ 
      mesaj: 'API endpoint bulunamadı.',
      message: 'API endpoint not found' 
    });
  }
  res.status(404).send('Not found');
});

// Vercel serverless function export
// Vercel Express app'i direkt olarak export eder
module.exports = app;
