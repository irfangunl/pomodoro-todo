const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const Todo = require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET - Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const { category, priority, completed } = req.query;
    
    // Build filter object
    let filter = {};
    
    if (category) {
      filter.category = new RegExp(category, 'i'); // Case insensitive
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    const todos = await Todo.find(filter).sort({ createdAt: -1 });    
    res.json({
      success: true,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todos'
    });
  }
});

// GET - Get single todo by ID
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todo'
    });
  }
});

// POST - Add new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description, priority = 'medium', category = 'General', dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    const newTodo = new Todo({
      title,
      description: description || '',
      priority,
      category,
      dueDate: dueDate || null
    });
    
    const savedTodo = await newTodo.save();
    
    res.status(201).json({
      success: true,
      data: savedTodo,
      message: 'Todo created successfully'
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating todo'
    });
  }
});

// PUT - Update todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { title, description, completed, priority, category, dueDate } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedTodo,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating todo'
    });
  }
});

// DELETE - Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }    res.json({
      success: true,
      data: deletedTodo,
      message: 'Todo deleted successfully'
    });  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting todo'
    });
  }
});

// GET - Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Todo.distinct('category');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// GET - Statistics
app.get('/api/stats', async (req, res) => {
  try {
    const todos = await Todo.find({});
    
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const byPriority = {
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length
    };
    
    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        byPriority
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Pomodoro Todo API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
});
