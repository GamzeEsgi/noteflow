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
    const mongoose = require('mongoose');
    
    // Eğer bağlantı yoksa, bağlanmayı dene
    if (mongoose.connection.readyState !== 1) {
      console.log('🔄 MongoDB bağlantısı kuruluyor...');
      await connectDB();
    }
    
    next();
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
    // Bağlantı hatası olsa bile devam et (bazı endpoint'ler çalışabilir)
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
  const mongoose = require('mongoose');
  res.json({ 
    status: 'OK', 
    message: 'NoteSaaS API is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
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
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Vercel serverless function export
module.exports = app;
