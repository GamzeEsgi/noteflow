/**
 * Vercel Serverless Function Handler
 * Express uygulamasını Vercel serverless functions olarak çalıştırır
 */

// Error handling için try-catch
let app;

try {
  // Backend'i yükle
  app = require('../backend/server');
  
  // App'in export edildiğinden emin ol
  if (!app) {
    throw new Error('Backend server export edilemedi');
  }
  
  console.log('✅ Backend başarıyla yüklendi');
} catch (error) {
  console.error('❌ Backend yüklenirken hata:', error);
  console.error('Hata stack:', error.stack);
  
  // Fallback app oluştur - en azından hata mesajı dönsün
  const express = require('express');
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
  // Tüm route'lar için error handler
  app.use((req, res) => {
    res.status(500).json({ 
      error: 'Backend initialization failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  });
}

// Vercel serverless function export
module.exports = app;
