const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Fake data - will connect to MongoDB later
let todos = [
  {
    id: 1,
    title: "Work with Pomodoro Technique",
    description: "Focus for 25 minutes and take 5 minute breaks",
    completed: false,
    priority: "high",
    category: "Work",
    createdAt: new Date().toISOString(),
    dueDate: null
  },
  {
    id: 2,
    title: "Prepare shopping list",
    description: "Create weekly shopping list",
    completed: true,
    priority: "medium",
    category: "Personal",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString()
  },
  {
    id: 3,
    title: "Yoga class",
    description: "Yoga class at 7 PM",
    completed: false,
    priority: "low",
    category: "Health",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    dueDate: new Date(Date.now() + 3600000).toISOString()
  }
];

// Routes

// GET - Get all todos
app.get('/api/todos', (req, res) => {
  const { category, priority, completed } = req.query;
  
  let filteredTodos = [...todos];
  
  if (category) {
    filteredTodos = filteredTodos.filter(todo => 
      todo.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (priority) {
    filteredTodos = filteredTodos.filter(todo => 
      todo.priority === priority
    );
  }
  
  if (completed !== undefined) {
    filteredTodos = filteredTodos.filter(todo => 
      todo.completed === (completed === 'true')
    );
  }
  
  res.json({
    success: true,
    data: filteredTodos,
    count: filteredTodos.length
  });
});

// GET - Get single todo by ID
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  
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
});

// POST - Add new todo
app.post('/api/todos', (req, res) => {
  const { title, description, priority = 'medium', category = 'General', dueDate } = req.body;
  
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }
  
  const newTodo = {
    id: Math.max(...todos.map(t => t.id)) + 1,
    title,
    description: description || '',
    completed: false,
    priority,
    category,
    createdAt: new Date().toISOString(),
    dueDate: dueDate || null
  };
  
  todos.push(newTodo);
  
  res.status(201).json({
    success: true,
    data: newTodo,
    message: 'Todo created successfully'
  });
});

// PUT - Update todo
app.put('/api/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }
  
  const { title, description, completed, priority, category, dueDate } = req.body;
  
  todos[todoIndex] = {
    ...todos[todoIndex],
    ...(title && { title }),
    ...(description !== undefined && { description }),
    ...(completed !== undefined && { completed }),
    ...(priority && { priority }),
    ...(category && { category }),
    ...(dueDate !== undefined && { dueDate })
  };
  
  res.json({
    success: true,
    data: todos[todoIndex],
    message: 'Todo updated successfully'
  });
});

// DELETE - Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }
  
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedTodo,
    message: 'Todo deleted successfully'
  });
});

// GET - Get categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(todos.map(todo => todo.category))];
  
  res.json({
    success: true,
    data: categories
  });
});

// GET - Statistics
app.get('/api/stats', (req, res) => {
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
