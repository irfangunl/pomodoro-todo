# Pomodoro Todo

Personal todo app with MongoDB integration. Simple, clean and useful.
And i'm a developer so i had to have a todo app in github right?

## Features

- ✅ Add, delete, complete todos
- ✅ Priority levels (high, medium, low)
- ✅ Category organization
- ✅ Due date setting
- ✅ Simple statistics
- ✅ Mobile responsive
- ✅ MongoDB database integration

## Todo

- [ ] Pomodoro timer
- [ ] Light/dark themes
- [ ] User authentication

## Tech Stack

- **Frontend**: React + TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Ready for production

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier works)

### 1. MongoDB Setup
1. Create MongoDB Atlas account at https://mongodb.com/atlas
2. Create a new cluster (M0 Sandbox - Free)
3. Create database user with read/write permissions
4. Add your IP to network access (0.0.0.0/0 for development)
5. Get connection string

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB connection string
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Configuration

Create `.env` file in backend folder:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/pomodoroTodoDB?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Todos
- `GET /api/todos` - Get all todos (with filtering)
- `GET /api/todos/:id` - Get single todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Additional
- `GET /api/categories` - Get all categories
- `GET /api/stats` - Get statistics
- `GET /health` - Health check

### Example Request
```javascript
// Create new todo
POST /api/todos
{
  "title": "Learn MongoDB",
  "description": "Complete MongoDB tutorial",
  "priority": "high",
  "category": "Learning",
  "dueDate": "2024-12-31"
}
```

## Testing

Test the API endpoints:
```bash
cd backend
node test-api.js
```

## Development

- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:3000
- MongoDB connection established automatically

## Project Structure
```
pomodoro-todo/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── Todo.js
│   ├── .env.example
│   ├── server.js
│   └── test-api.js
├── frontend/
│   └── src/
└── README.md
```
