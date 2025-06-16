const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  dueDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // This creates createdAt and updatedAt automatically
});

module.exports = mongoose.model('Todo', todoSchema);
