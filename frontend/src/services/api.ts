import { Todo, ApiResponse, CreateTodoRequest, UpdateTodoRequest, TodoStats } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Todo operations
  async getTodos(filters?: {
    category?: string;
    priority?: string;
    completed?: boolean;
  }): Promise<ApiResponse<Todo[]>> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.completed !== undefined) params.append('completed', String(filters.completed));

    const queryString = params.toString();
    const endpoint = queryString ? `/todos?${queryString}` : '/todos';
    
    return this.request<Todo[]>(endpoint);
  }
  async getTodo(id: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`);
  }

  async createTodo(todo: CreateTodoRequest): Promise<ApiResponse<Todo>> {
    return this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  }

  async updateTodo(id: string, updates: UpdateTodoRequest): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTodo(id: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTodo(id: string, completed: boolean): Promise<ApiResponse<Todo>> {
    return this.updateTodo(id, { completed });
  }

  // Categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/categories');
  }

  // Stats
  async getStats(): Promise<ApiResponse<TodoStats>> {
    return this.request<TodoStats>('/stats');
  }

  // Health check
  async healthCheck(): Promise<any> {
    try {
      const response = await fetch('http://localhost:5000/health');
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
