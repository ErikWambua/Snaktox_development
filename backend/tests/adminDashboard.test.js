// Integration tests using an in-memory MongoDB
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';

const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;
let app;
const User = require('../models/User');

describe('Admin dashboard integration', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB and set env var before requiring the app
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGODB_URI = uri;

    // Require the app after MONGODB_URI is set so server's connectDB uses the in-memory instance
    app = require('../server');

    // Wait for mongoose to connect
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }, 20000);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    // Clean collections before each test
    const collections = Object.keys(mongoose.connection.collections);
    for (const name of collections) {
      await mongoose.connection.collections[name].deleteMany({});
    }
  });

  test('GET /api/admin/dashboard without token returns 401', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/admin/dashboard with seeded admin returns 200', async () => {
    // Seed an admin user
    const admin = await User.create({
      email: 'admin@integration.test',
      password: 'password123',
      role: 'ADMIN',
      profile: { firstName: 'Admin', lastName: 'Test' }
    });

    // generate token using instance method
    const token = admin.generateAuthToken();

    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('stats');
  }, 10000);
});
