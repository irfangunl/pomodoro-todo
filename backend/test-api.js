// Test script for Pomodoro Todo API
console.log('🧪 Testing Pomodoro Todo API...\n');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testTodo = {
  title: 'MongoDB Test Todo',
  description: 'Testing MongoDB integration',
  priority: 'high',
  category: 'Development'
};

async function testAPI() {
  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test GET all todos
    console.log('\n2. Testing GET /api/todos...');
    const todosResponse = await fetch(`${BASE_URL}/todos`);
    const todosData = await todosResponse.json();
    console.log(`✅ GET todos: Found ${todosData.count} todos`);

    // Test POST new todo
    console.log('\n3. Testing POST /api/todos...');
    const postResponse = await fetch(`${BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTodo),
    });
    const newTodo = await postResponse.json();
    console.log('✅ POST todo:', newTodo.success ? 'Created successfully' : 'Failed');
    
    if (newTodo.success && newTodo.data._id) {
      const todoId = newTodo.data._id;

      // Test GET single todo
      console.log('\n4. Testing GET /api/todos/:id...');
      const singleTodoResponse = await fetch(`${BASE_URL}/todos/${todoId}`);
      const singleTodo = await singleTodoResponse.json();
      console.log('✅ GET single todo:', singleTodo.success ? 'Found' : 'Not found');

      // Test PUT update todo
      console.log('\n5. Testing PUT /api/todos/:id...');
      const updateResponse = await fetch(`${BASE_URL}/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });
      const updatedTodo = await updateResponse.json();
      console.log('✅ PUT todo:', updatedTodo.success ? 'Updated successfully' : 'Failed');

      // Test DELETE todo
      console.log('\n6. Testing DELETE /api/todos/:id...');
      const deleteResponse = await fetch(`${BASE_URL}/todos/${todoId}`, {
        method: 'DELETE',
      });
      const deletedTodo = await deleteResponse.json();
      console.log('✅ DELETE todo:', deletedTodo.success ? 'Deleted successfully' : 'Failed');
    }

    // Test categories
    console.log('\n7. Testing GET /api/categories...');
    const categoriesResponse = await fetch(`${BASE_URL}/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ GET categories:', categoriesData.success ? `Found ${categoriesData.data.length} categories` : 'Failed');

    // Test stats
    console.log('\n8. Testing GET /api/stats...');
    const statsResponse = await fetch(`${BASE_URL}/stats`);
    const statsData = await statsResponse.json();
    console.log('✅ GET stats:', statsData.success ? `Total: ${statsData.data.total} todos` : 'Failed');

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running on port 5000');
    console.log('   Run: node server.js');
  }
}

// Run tests only if server is accessible
testAPI();
