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
const forecastRoutes = require('./routes/forecastRoutes');
const loadRoutes = require('./routes/loadRoutes');
const renewalRoutes = require('./routes/renewalRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');
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
        // Dynamic target occupancy rate per branch
        let targetOccupancy = 0.50;
        if (branch === 'hyderabad') targetOccupancy = 0.65;
        else if (branch === 'bangalore') targetOccupancy = 0.42;
        else if (branch === 'chennai') targetOccupancy = 0.78;
        else if (branch === 'indiranagar') targetOccupancy = 0.55;
        else if (branch === 'mumbai-bkc') targetOccupancy = 0.83;
        else if (branch === 'gurugram-cyber-city') targetOccupancy = 0.38;

        for (let index = 0; index < 40; index++) {
          const seatLetter = String.fromCharCode(65 + Math.floor(index / 8));
          const seatNum = (index % 8) + 1;
          const seatNumber = `${seatLetter}${seatNum}`;
          
          // Allocate statuses based on index and branch target occupancy
          const seatRatio = index / 40;
          let status = 'available';
          if (seatRatio < targetOccupancy) {
            status = (index % 5 === 0) ? 'reserved' : 'occupied';
          }

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

    // Auto-seed CRM Clients if missing
    const Client = require('./models/Client');
    const clientCount = await Client.countDocuments();
    if (clientCount === 0) {
      console.log('🌱 No CRM Client profiles found. Initiating auto-seed process...');
      const today = new Date();
      const createDateOffset = (monthsOffset) => {
        const d = new Date(today);
        d.setMonth(d.getMonth() + monthsOffset);
        return d;
      };

      const seedClients = [
        {
          clientName: 'Rohan Gupta',
          company: 'Zepto Growth',
          branch: 'indiranagar',
          contractStartDate: createDateOffset(-6),
          contractEndDate: createDateOffset(1),
          email: 'rohan.gupta@zepto.co',
          phone: '+91 98765 43210',
          occupancyDuration: 42,
          bookingFrequency: 35,
          roomUsage: 30,
          ticketSatisfaction: 20,
          recentActivity: 25
        },
        {
          clientName: 'Anisha Sen',
          company: 'Razorpay Ops',
          branch: 'indiranagar',
          contractStartDate: createDateOffset(-11),
          contractEndDate: createDateOffset(12),
          email: 'anisha.sen@razorpay.com',
          phone: '+91 98123 45678',
          occupancyDuration: 95,
          bookingFrequency: 92,
          roomUsage: 88,
          ticketSatisfaction: 90,
          recentActivity: 96
        },
        {
          clientName: 'Animesh Roy',
          company: 'CRED Premium',
          branch: 'indiranagar',
          contractStartDate: createDateOffset(-4),
          contractEndDate: createDateOffset(2),
          email: 'animesh@cred.club',
          phone: '+91 99887 76655',
          occupancyDuration: 60,
          bookingFrequency: 55,
          roomUsage: 65,
          ticketSatisfaction: 75,
          recentActivity: 52
        },
        {
          clientName: 'Deepak Sen',
          company: 'Urban Company',
          branch: 'mumbai-bkc',
          contractStartDate: createDateOffset(-10),
          contractEndDate: createDateOffset(2),
          email: 'deepak.sen@urbancompany.com',
          phone: '+91 97766 55443',
          occupancyDuration: 85,
          bookingFrequency: 80,
          roomUsage: 75,
          ticketSatisfaction: 85,
          recentActivity: 90
        },
        {
          clientName: 'Preeti Sharma',
          company: 'Swiggy Instamart',
          branch: 'gurugram-cyber-city',
          contractStartDate: createDateOffset(-8),
          contractEndDate: createDateOffset(0),
          email: 'preeti.s@swiggy.in',
          phone: '+91 96655 44332',
          occupancyDuration: 30,
          bookingFrequency: 25,
          roomUsage: 20,
          ticketSatisfaction: 40,
          recentActivity: 15
        },
        {
          clientName: 'Kunal Kapoor',
          company: 'Groww Wealth',
          branch: 'gurugram-cyber-city',
          contractStartDate: createDateOffset(-5),
          contractEndDate: createDateOffset(7),
          email: 'kunal.kapoor@groww.in',
          phone: '+91 95544 33221',
          occupancyDuration: 75,
          bookingFrequency: 70,
          roomUsage: 60,
          ticketSatisfaction: 80,
          recentActivity: 72
        },
        {
          clientName: 'Karthik Rao',
          company: 'PhonePe Finance',
          branch: 'hyderabad',
          contractStartDate: createDateOffset(-12),
          contractEndDate: createDateOffset(6),
          email: 'karthik@phonepe.com',
          phone: '+91 94433 22110',
          occupancyDuration: 90,
          bookingFrequency: 95,
          roomUsage: 85,
          ticketSatisfaction: 95,
          recentActivity: 92
        },
        {
          clientName: 'Sneha Reddy',
          company: 'Zomato Dine',
          branch: 'hyderabad',
          contractStartDate: createDateOffset(-3),
          contractEndDate: createDateOffset(9),
          email: 'sneha.reddy@zomato.com',
          phone: '+91 93322 11009',
          occupancyDuration: 65,
          bookingFrequency: 50,
          roomUsage: 55,
          ticketSatisfaction: 70,
          recentActivity: 68
        },
        {
          clientName: 'Divya Gowda',
          company: 'Lenskart Retail',
          branch: 'bangalore',
          contractStartDate: createDateOffset(-18),
          contractEndDate: createDateOffset(6),
          email: 'divya@lenskart.in',
          phone: '+91 92211 00998',
          occupancyDuration: 95,
          bookingFrequency: 90,
          roomUsage: 92,
          ticketSatisfaction: 90,
          recentActivity: 88
        },
        {
          clientName: 'Aditya Bhat',
          company: 'Ola Mobility',
          branch: 'bangalore',
          contractStartDate: createDateOffset(-6),
          contractEndDate: createDateOffset(1),
          email: 'aditya.bhat@olacabs.com',
          phone: '+91 91100 99887',
          occupancyDuration: 40,
          bookingFrequency: 45,
          roomUsage: 35,
          ticketSatisfaction: 50,
          recentActivity: 38
        },
        {
          clientName: 'Hari Krishnan',
          company: 'Ather Energy',
          branch: 'chennai',
          contractStartDate: createDateOffset(-9),
          contractEndDate: createDateOffset(3),
          email: 'hari.krishnan@atherenergy.com',
          phone: '+91 90099 88776',
          occupancyDuration: 78,
          bookingFrequency: 82,
          roomUsage: 80,
          ticketSatisfaction: 85,
          recentActivity: 75
        },
        {
          clientName: 'Nisha Nair',
          company: 'Meesho Logistics',
          branch: 'mumbai-bkc',
          contractStartDate: createDateOffset(-2),
          contractEndDate: createDateOffset(10),
          email: 'nisha.nair@meesho.com',
          phone: '+91 95151 51515',
          occupancyDuration: 70,
          bookingFrequency: 65,
          roomUsage: 70,
          ticketSatisfaction: 75,
          recentActivity: 60
        }
      ];

      await Client.create(seedClients);
      console.log(`✅ CRM Client auto-seed completed. Seeded ${seedClients.length} accounts.`);
    } else {
      console.log(`✅ CRM Client database verified. ${clientCount} active accounts ready.`);
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
app.use('/api/forecast', forecastRoutes);
app.use('/api/load-score', loadRoutes);
app.use('/api/renewal-predictions', renewalRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

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
