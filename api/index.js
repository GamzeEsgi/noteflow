/**
 * Vercel Serverless Function Handler
 * Express uygulamasını Vercel serverless functions olarak çalıştırır
 */

// Error handling için try-catch
let app;
try {
  app = require('../backend/server');
} catch (error) {
  console.error('Backend yüklenirken hata:', error);
  // Fallback app oluştur
  const express = require('express');
  app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    res.status(500).json({ 
      error: 'Backend initialization failed',
      message: error.message 
    });
  });
}

// Vercel serverless function export
module.exports = app;
