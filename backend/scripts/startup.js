const mongoose = require('mongoose');
const User = require('../models/User');

const initializeAdmin = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@snaktox.org' });
    
    if (!adminExists) {
      const adminUser = new User({
        email: 'admin@snaktox.org',
        password: 'admin123',
        role: 'ADMIN',
        profile: {
          firstName: 'System',
          lastName: 'Administrator',
          phone: '+254700000000',
          institution: 'SnaKTox',
          specialization: 'System Administration'
        }
      });
      
      await adminUser.save();
      console.log('✅ Default admin user created: admin@snaktox.org / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
  }
};

module.exports = initializeAdmin;