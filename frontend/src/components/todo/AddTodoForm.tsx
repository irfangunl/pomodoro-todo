import React, { useState } from 'react';
import { CreateTodoRequest } from '../../types';
import { Card, Button, Input } from '../ui';

interface AddTodoFormProps {
  onAddTodo: (todo: CreateTodoRequest) => void;
  categories: string[];
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ 
  onAddTodo, 
  categories 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<CreateTodoRequest>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    onAddTodo({
      ...formData,
      dueDate: formData.dueDate || undefined,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'General',
      dueDate: '',
    });
    setIsExpanded(false);
  };

  const handleInputChange = (field: keyof CreateTodoRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  if (!isExpanded) {
    return (
      <Card className="mb-6">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left flex items-center space-x-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-lg">Add new task...</span>
        </button>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}        <Input
          type="text"
          placeholder="Task title..."
          value={formData.title}
          onChange={handleInputChange('title')}
          className="text-lg border-none shadow-none p-0 focus:ring-0"
          autoFocus
        />

        {/* Description */}
        <textarea
          placeholder="Description (optional)..."
          value={formData.description}
          onChange={handleInputChange('description')}
          rows={3}
          className="
            block w-full border border-gray-300 rounded-xl shadow-sm p-3
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 
            focus:border-primary-500 transition-colors duration-200 resize-none
          "
        />

        {/* Options Row */}
        <div className="flex flex-wrap gap-4">
          {/* Priority */}
          <div className="flex-1 min-w-32">            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={handleInputChange('priority')}
              className="
                block w-full border border-gray-300 rounded-xl shadow-sm px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                transition-colors duration-200
              "
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex-1 min-w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={handleInputChange('category')}
              className="
                block w-full border border-gray-300 rounded-xl shadow-sm px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                transition-colors duration-200
              "
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div className="flex-1 min-w-32">            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange('dueDate')}
              className="
                block w-full border border-gray-300 rounded-xl shadow-sm px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                transition-colors duration-200
              "
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsExpanded(false);
              setFormData({
                title: '',
                description: '',
                priority: 'medium',
                category: 'General',
                dueDate: '',
              });
            }}          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={!formData.title.trim()}
          >
            Add Task
          </Button>
        </div>
      </form>
    </Card>
  );
};
