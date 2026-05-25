const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const seatRoutes = require('./routes/seatRoutes');
const roomRoutes = require('./routes/roomRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const activityRoutes = require('./routes/activityRoutes');
const User = require('./models/User');
const Seat = require('./models/Seat');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(async () => {
  // Self-repairing auto-seeding logic
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 No registered users found. Initiating auto-seed process...');
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
      await User.create(seedData);
      console.log('✅ Auto-seed completed. Seeded Nisha, Rahul, and Tanvi demo accounts.');
    } else {
      console.log(`✅ Database verified. ${userCount} existing users found.`);
    }

    // Auto-seed Coworking Seats if missing
    const seatCount = await Seat.countDocuments();
    if (seatCount === 0) {
      console.log('🌱 No coworking seat layouts found. Initiating auto-seed process...');
      
      const SEED_BRANCHES = ['hyderabad', 'bangalore', 'chennai', 'indiranagar', 'mumbai-bkc', 'gurugram-cyber-city'];
      const CLIENTS = ['Razorpay Ops', 'Zepto Growth', 'Urban Company', 'Swiggy Instamart', 'PhonePe Finance', 'Lenskart Retail', 'Ather Energy'];
      const PATTERNS = ['available', 'occupied', 'reserved', 'available', 'available', 'occupied'];
      const TIME_SLOTS = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];
      const DURATIONS = ['1 hour', '2 hours', 'Half Day', 'Full Day'];
      const todayStr = new Date().toISOString().split('T')[0];

      const seedData = [];

      SEED_BRANCHES.forEach(branch => {
        for (let index = 0; index < 40; index++) {
          const seatLetter = String.fromCharCode(65 + Math.floor(index / 8));
          const seatNum = (index % 8) + 1;
          const seatNumber = `${seatLetter}${seatNum}`;
          const status = PATTERNS[index % PATTERNS.length];

          seedData.push({
            seatNumber,
            status,
            branch,
            assignedTo: status === 'available' ? '' : CLIENTS[index % CLIENTS.length],
            bookingDate: status === 'available' ? '' : todayStr,
            bookingTime: status === 'available' ? '' : TIME_SLOTS[index % TIME_SLOTS.length],
            duration: status === 'available' ? '' : DURATIONS[index % DURATIONS.length]
          });
        }
      });

      await Seat.insertMany(seedData);
      console.log(`✅ Auto-seed completed. Seeded ${seedData.length} coworking seats across 6 locations.`);
    } else {
      console.log(`✅ Coworking seats verified. ${seatCount} layout items active.`);
    }

    // Auto-seed Conference Rooms if missing
    const Room = require('./models/Room');
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      console.log('🌱 No conference room records found. Initiating auto-seed process...');
      const { exec } = require('child_process');
      exec('node seed/roomSeeder.js', (err, stdout, stderr) => {
        if (err) console.error('⚠️ Room auto-seed warning:', err.message);
        else console.log('✅ Room auto-seed completed successfully via child_process.');
      });
    } else {
      console.log(`✅ Conference rooms verified. ${roomCount} active suites ready.`);
    }

    // Auto-seed Support Tickets if missing
    const Ticket = require('./models/Ticket');
    const ticketCount = await Ticket.countDocuments();
    if (ticketCount === 0) {
      console.log('🌱 No support ticket records found. Initiating auto-seed process...');
      const { exec } = require('child_process');
      exec('node seed/ticketSeeder.js', (err, stdout, stderr) => {
        if (err) console.error('⚠️ Ticket auto-seed warning:', err.message);
        else console.log('✅ Ticket auto-seed completed successfully via child_process.');
      });
    } else {
      console.log(`✅ Support tickets verified. ${ticketCount} operational records active.`);
    }
  } catch (err) {
    console.error(`⚠️ Auto-seeding warning: ${err.message}`);
  }
});

// Middleware configurations
app.use(cors());
app.use(express.json());

// Log incoming API Requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routing configurations
app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activity', activityRoutes);

// Base route health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: '🚀 CoSaaS MVC MongoDB Express API is fully functional.'
  });
});

// Global 404 Route handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint requested does not exist.' });
});

// Global Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error(`💥 Server execution error: ${err.stack}`);
  res.status(500).json({ error: 'Internal server pipeline runtime failure.' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 CoSaaS Express Server running on http://localhost:${PORT}`);
});
