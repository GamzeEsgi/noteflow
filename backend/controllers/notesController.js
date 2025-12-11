const Note = require('../models/Note');

// Get all notes for user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create note
exports.createNote = async (req, res) => {
  try {
    const { title, content, color, date } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    // Check note limit for free plan
    if (req.user.plan === 'free') {
      const noteCount = await Note.countDocuments({ user: req.user._id });
      if (noteCount >= 50) {
        return res.status(403).json({ 
          message: 'Free plan limit reached. Maximum 50 notes allowed.' 
        });
      }
    }

    const note = new Note({
      title,
      content,
      color: color || '#fef3c7',
      date: date ? new Date(date) : null,
      user: req.user._id
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { title, content, color, date } = req.body;
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (color) note.color = color;
    if (date !== undefined) note.date = date ? new Date(date) : null;
    note.updatedAt = Date.now();

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await Note.deleteOne({ _id: id });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

