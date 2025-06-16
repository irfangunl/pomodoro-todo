export interface Todo {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  updatedAt?: string;
  dueDate: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
}
