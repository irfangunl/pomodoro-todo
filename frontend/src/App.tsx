import React, { useState, useEffect } from 'react';
import { Todo, CreateTodoRequest, TodoStats } from './types';
import { apiService } from './services/api';
import { TodoList, AddTodoForm } from './components/todo';
import { Card, Button } from './components/ui';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<string[]>(['General', 'Work', 'Personal', 'Health']);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    category?: string;
    priority?: string;
    completed?: boolean;
  }>({});

  // Load initial data
  useEffect(() => {
    loadTodos();
    loadCategories();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getTodos(filter);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Error loading todos');
      console.error('Error loading todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(prev => Array.from(new Set([...prev, ...response.data])));
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleAddTodo = async (todoData: CreateTodoRequest) => {
    try {
      const response = await apiService.createTodo(todoData);
      setTodos(prev => [response.data, ...prev]);
      loadStats(); // Refresh stats
      setError(null);
    } catch (err) {
      setError('Error adding todo');
      console.error('Error adding todo:', err);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await apiService.toggleTodo(id, completed);
      setTodos(prev => 
        prev.map(todo => 
          todo._id === id ? { ...todo, completed } : todo
        )
      );
      loadStats(); // Refresh stats
      setError(null);
    } catch (err) {
      setError('Error updating todo');
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await apiService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
      loadStats(); // Refresh stats
      setError(null);
    } catch (err) {
      setError('Error deleting todo');
      console.error('Error deleting todo:', err);
    }
  };

  const clearFilter = () => {
    setFilter({});
  };

  const activeFilters = Object.values(filter).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📝 Todo App
              </h1>
              <p className="text-gray-600 mt-1">
                Organize and track your tasks
              </p>
            </div>
            
            {stats && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  {stats.completionRate}%
                </div>
                <div className="text-sm text-gray-500">
                  {stats.completed}/{stats.total} completed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card padding="sm" className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Tasks</div>
            </Card>
            
            <Card padding="sm" className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </Card>
            
            <Card padding="sm" className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </Card>
            
            <Card padding="sm" className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.byPriority.high}</div>
              <div className="text-sm text-gray-500">High Priority</div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="font-medium text-gray-900">Filters:</h3>
            
            {/* Category Filter */}
            <select
              value={filter.category || ''}
              onChange={(e) => setFilter(prev => ({ 
                ...prev, 
                category: e.target.value || undefined 
              }))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filter.priority || ''}
              onChange={(e) => setFilter(prev => ({ 
                ...prev, 
                priority: e.target.value || undefined 
              }))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Completion Filter */}
            <select
              value={filter.completed === undefined ? '' : filter.completed.toString()}
              onChange={(e) => setFilter(prev => ({ 
                ...prev, 
                completed: e.target.value === '' ? undefined : e.target.value === 'true'
              }))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="">All</option>
              <option value="false">Pending</option>
              <option value="true">Completed</option>
            </select>

            {/* Clear Filters */}
            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilter}>
                Clear Filters ({activeFilters})
              </Button>
            )}
          </div>
        </Card>

        {/* Add Todo Form */}
        <AddTodoForm onAddTodo={handleAddTodo} categories={categories} />

        {/* Todo List */}
        <TodoList
          todos={todos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;
