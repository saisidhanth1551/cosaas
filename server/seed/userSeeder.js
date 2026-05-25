const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

const seedUsers = async () => {
  try {
    const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cosaas';
    
    console.log('🔌 Connecting to MongoDB for seeding...');
    await mongoose.connect(connString);
    console.log('🔌 Connected.');

    // Clear existing users
    console.log('🧹 Clearing historical user documents...');
    await User.deleteMany();
    console.log('🧹 Historical user records cleared.');

    // Seed targets
    const seedData = [
      {
        name: 'Nisha Rao',
        email: 'admin@cosaas.com',
        password: '123456',
        role: 'admin',
        branch: 'indiranagar'
      },
      {
        name: 'Rahul Nair',
        email: 'manager@cosaas.com',
        password: '123456',
        role: 'manager',
        branch: 'mumbai-bkc'
      },
      {
        name: 'Tanvi Shah',
        email: 'reception@cosaas.com',
        password: '123456',
        role: 'receptionist',
        branch: 'gurugram-cyber-city'
      }
    ];

    console.log('🌱 Seeding fresh demo corporate users...');
    // Utilizing User.create will trigger our UserSchema pre-save password-hashing hook!
    await User.create(seedData);
    console.log('✅ Demo users seeded successfully!');
    
    // Disconnect Mongoose
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB seeder. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder failure: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
