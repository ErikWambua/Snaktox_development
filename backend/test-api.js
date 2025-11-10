const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

const testEndpoints = async () => {
  try {
    console.log('🧪 Testing SnaKTox API Endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    // Test authentication
    console.log('\n2. Testing authentication...');
    try {
      const authResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@snaktox.org',
        password: 'admin123'
      });
      console.log('✅ Authentication successful');
      
      const token = authResponse.data.data.token;
      
      // Test protected endpoint
      const snakesResponse = await axios.get(`${API_BASE}/snakes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Protected endpoint access successful');
      
    } catch (authError) {
      console.log('❌ Authentication test failed - run seed script first');
    }

    console.log('\n🎉 All basic tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testEndpoints();