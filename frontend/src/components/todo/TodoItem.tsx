import React from 'react';
import { Todo } from '../../types';
import { Card, Button } from '../ui';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <Card className={`transition-all duration-200 ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start space-x-3">
        {/* Checkbox */}        <button
          onClick={() => onToggle(todo._id, !todo.completed)}
          className={`
            mt-1 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
            ${todo.completed 
              ? 'bg-primary-500 border-primary-500 text-white' 
              : 'border-gray-300 hover:border-primary-400'
            }
          `}
        >
          {todo.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={`
            text-lg font-medium transition-all duration-200
            ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}
          `}>
            {todo.title}
          </h3>

          {/* Description */}
          {todo.description && (
            <p className={`
              mt-1 text-sm transition-all duration-200
              ${todo.completed ? 'text-gray-400' : 'text-gray-600'}
            `}>
              {todo.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Priority */}
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
              ${priorityColors[todo.priority]}
            `}>
              {todo.priority}
            </span>

            {/* Category */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {todo.category}
            </span>

            {/* Due Date */}
            {todo.dueDate && (
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${isOverdue 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-blue-100 text-blue-800'
                }
              `}>                📅 {formatDate(todo.dueDate)}
                {isOverdue && ' (Overdue)'}
              </span>
            )}

            {/* Created Date */}
            <span className="text-xs text-gray-400">
              {formatDate(todo.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(todo)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          )}
            <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo._id)}
            className="text-gray-400 hover:text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  );
};
