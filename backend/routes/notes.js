const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.get('/', authMiddleware, notesController.getNotes);
router.post('/', authMiddleware, notesController.createNote);
router.put('/:id', authMiddleware, notesController.updateNote);
router.delete('/:id', authMiddleware, notesController.deleteNote);

module.exports = router;

