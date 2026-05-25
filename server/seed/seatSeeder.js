const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Seat = require('../models/Seat');

// Load environment variables
dotenv.config();

const BRANCHES = [
  'hyderabad',
  'bangalore',
  'chennai',
  'indiranagar',
  'mumbai-bkc',
  'gurugram-cyber-city'
];

const CLIENTS = [
  'Razorpay Ops',
  'Zepto Growth',
  'Urban Company',
  'Swiggy Instamart',
  'PhonePe Finance',
  'Lenskart Retail',
  'Ather Energy',
  'Cred Operations',
  'PhysicsWallah',
  'BluSmart Ops'
];

const PATTERNS = ['available', 'occupied', 'reserved', 'available', 'available', 'occupied'];
const TIME_SLOTS = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];
const DURATIONS = ['1 hour', '2 hours', 'Half Day', 'Full Day'];

const seedSeats = async () => {
  try {
    const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cosaas';
    
    console.log('🔌 Connecting to MongoDB for seat seeding...');
    await mongoose.connect(connString);
    console.log('🔌 Connected.');

    console.log('🧹 Purging historical seat records...');
    await Seat.deleteMany();
    console.log('🧹 Purged.');

    const seedData = [];

    // Helper date generator (today's date string YYYY-MM-DD)
    const todayStr = new Date().toISOString().split('T')[0];

    // Seed 40 seats per branch
    BRANCHES.forEach(branch => {
      console.log(`🌱 Generating seat layout for branch: ${branch}...`);
      for (let index = 0; index < 40; index++) {
        // ID pattern A1-E8
        const seatLetter = String.fromCharCode(65 + Math.floor(index / 8));
        const seatNum = (index % 8) + 1;
        const seatNumber = `${seatLetter}${seatNum}`;

        const status = PATTERNS[index % PATTERNS.length];

        const seatRecord = {
          seatNumber,
          status,
          branch,
          assignedTo: status === 'available' ? '' : CLIENTS[index % CLIENTS.length],
          bookingDate: status === 'available' ? '' : todayStr,
          bookingTime: status === 'available' ? '' : TIME_SLOTS[index % TIME_SLOTS.length],
          duration: status === 'available' ? '' : DURATIONS[index % DURATIONS.length]
        };

        seedData.push(seatRecord);
      }
    });

    console.log(`🌱 Inserting ${seedData.length} seat records...`);
    await Seat.insertMany(seedData);
    console.log('✅ Coworking seats successfully seeded!');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB seeder. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seat Seeder failed: ${error.message}`);
    process.exit(1);
  }
};

seedSeats();
