# Pomodoro Todo

Personal todo app. Simple, clean and useful.

## Features

- Add, delete, complete todos
- Priority levels (high, medium, low)
- Category organization
- Due date setting
- Simple statistics
- Mobile responsive

## Todo

- Database connection
- Pomodoro timer
- Light/dark themes

## Tech stack

- React + TypeScript
- Tailwind CSS
- Express.js
- Node.js

## Setup

Backend:
```bash
cd backend
npm install
node server.js
```

Frontend:
```bash
cd frontend
npm install
npm start
```

## API

Simple REST API:

- `GET /api/todos` - Todo list
- `POST /api/todos` - New todo
- `PUT /api/todos/:id` - Update todo  
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/stats` - Statistics

Backend runs on http://localhost:5000, Frontend on http://localhost:3000.
