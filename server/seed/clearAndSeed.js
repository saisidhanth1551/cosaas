const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Seat = require('../models/Seat');
const Room = require('../models/Room');
const Ticket = require('../models/Ticket');
const Client = require('../models/Client');

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

const TIME_SLOTS = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];
const DURATIONS = ['1 hour', '2 hours', 'Half Day', 'Full Day'];

const todayStr = new Date().toISOString().split('T')[0];

const seedAll = async () => {
  try {
    const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cosaas';
    console.log('🔌 Connecting to MongoDB for full database seeding...');
    await mongoose.connect(connString);
    console.log('🔌 Connected.');

    // 1. Clear all existing data
    console.log('🧹 Purging all collections...');
    await User.deleteMany({});
    await Seat.deleteMany({});
    await Room.deleteMany({});
    await Ticket.deleteMany({});
    await Client.deleteMany({});
    console.log('🧹 All collections purged.');

    // 2. Seed Users
    console.log('🌱 Seeding Users...');
    const users = [
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
    await User.create(users);
    console.log('✅ Users seeded.');

    // 3. Seed Seats
    console.log('🌱 Seeding Seats...');
    const seatData = [];
    BRANCHES.forEach(branch => {
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

        const seatRatio = index / 40;
        let status = 'available';
        if (seatRatio < targetOccupancy) {
          status = (index % 5 === 0) ? 'reserved' : 'occupied';
        }

        seatData.push({
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
    await Seat.insertMany(seatData);
    console.log(`✅ ${seatData.length} seats successfully seeded.`);

    // 4. Seed Conference Rooms
    console.log('🌱 Seeding Rooms...');
    const roomsSeedData = [
      { name: 'Kaveri Tech Pod', capacity: 4, branch: 'indiranagar', status: 'available', amenities: ['High-speed WiFi', '4K Monitor', 'Whiteboard'], bookings: [] },
      { name: 'Nandi Boardroom', capacity: 12, branch: 'indiranagar', status: 'available', amenities: ['Video Conferencing', 'Smart Projector'], bookings: [{ organizer: 'Razorpay Dev Team', date: todayStr, timeSlot: '11:00 AM - 12:00 PM', duration: '1 hour' }] },
      { name: 'Cubbon Collab Lab', capacity: 8, branch: 'indiranagar', status: 'available', amenities: ['Whiteboard Wall', 'Smart TV'], bookings: [] },
      
      { name: 'Gateway Boardroom', capacity: 16, branch: 'mumbai-bkc', status: 'available', amenities: ['Ultra-wide LED Screen', 'Poly Studio VC'], bookings: [{ organizer: 'Zepto Growth Ops', date: todayStr, timeSlot: '02:00 PM - 04:00 PM', duration: '2 hours' }] },
      { name: 'Elephanta Brainstorm Pod', capacity: 6, branch: 'mumbai-bkc', status: 'available', amenities: ['Dual Whiteboards', 'Apple TV Airplay'], bookings: [] },
      { name: 'Colaba Hub', capacity: 8, branch: 'mumbai-bkc', status: 'available', amenities: ['High-speed WiFi', '4K TV Screen'], bookings: [] },

      { name: 'Aravali Executive Center', capacity: 14, branch: 'gurugram-cyber-city', status: 'available', amenities: ['Executive Seating', '4K Interactive Screen'], bookings: [] },
      { name: 'Sohna Creative Lounge', capacity: 8, branch: 'gurugram-cyber-city', status: 'available', amenities: ['Beanbag Seating', 'Writable Walls'], bookings: [] },
      { name: 'Cyber Boardroom', capacity: 10, branch: 'gurugram-cyber-city', status: 'available', amenities: ['Video Conferencing', 'Smart TV'], bookings: [{ organizer: 'Lenskart Marketing', date: todayStr, timeSlot: '10:00 AM - 11:00 AM', duration: '1 hour' }] },

      { name: 'Charminar Boardroom', capacity: 15, branch: 'hyderabad', status: 'available', amenities: ['Dual 4K TV Screens', 'Cisco Webex Kit'], bookings: [{ organizer: 'Swiggy Operations', date: todayStr, timeSlot: '04:00 PM - 05:00 PM', duration: '1 hour' }] },
      { name: 'Golkonda Brainstorm Suite', capacity: 8, branch: 'hyderabad', status: 'available', amenities: ['Full Glass Whiteboard', 'Dynamic Mood Light'], bookings: [] },
      { name: 'Kakatiya Meeting Pod', capacity: 4, branch: 'hyderabad', status: 'available', amenities: ['4K Monitor', 'Whiteboard'], bookings: [] },

      { name: 'Koramangala Innovate Pod', capacity: 6, branch: 'bangalore', status: 'available', amenities: ['4K Screen', 'Glass Whiteboard'], bookings: [] },
      { name: 'Lalbagh Executive Room', capacity: 12, branch: 'bangalore', status: 'available', amenities: ['Video Conferencing', 'Smart Projector'], bookings: [] },
      { name: 'Bannerghatta Brainstorm Center', capacity: 10, branch: 'bangalore', status: 'available', amenities: ['Writable Wall', 'Smart TV Screen'], bookings: [] },

      { name: 'Marina Boardroom', capacity: 18, branch: 'chennai', status: 'available', amenities: ['8K Video Wall', 'Dolby Atmos Conference Audio'], bookings: [] },
      { name: 'Valluvar Meeting Suite', capacity: 8, branch: 'chennai', status: 'available', amenities: ['Magnetic Whiteboard', '4K Screen'], bookings: [] },
      { name: 'Nilgiri Collab Pod', capacity: 6, branch: 'chennai', status: 'available', amenities: ['High-speed WiFi', 'Smart Monitor'], bookings: [] }
    ];
    await Room.insertMany(roomsSeedData);
    console.log(`✅ ${roomsSeedData.length} conference rooms successfully seeded.`);

    // 5. Seed Support Tickets
    console.log('🌱 Seeding Tickets...');
    const ticketSeedData = [
      { title: 'AC cooling issue in 3rd floor open desks', description: 'The AC unit in Area B is making a loud rattling sound and not cooling properly.', status: 'open', priority: 'high', branch: 'indiranagar', reportedBy: 'Razorpay Devs', assignedStaff: 'Vikram Sharma (Maintenance)', resolutionNotes: '' },
      { title: 'Leaking water dispenser in pantry area', description: 'Water is pooling underneath the main dispenser in the 2nd-floor cafeteria.', status: 'in progress', priority: 'medium', branch: 'indiranagar', reportedBy: 'Swiggy Ops', assignedStaff: 'Amit Patel (Pantry Services)', resolutionNotes: '' },
      { title: 'Conference Room Nandi Smart TV lag', description: 'The Apple TV is lagging heavily during screen sharing.', status: 'resolved', priority: 'low', branch: 'indiranagar', reportedBy: 'Ather Design Team', assignedStaff: 'Pooja Hegde (IT Support)', resolutionNotes: 'Restarted Apple TV box and updated the tvOS firmware. Lag is resolved.', resolvedAt: new Date() },
      
      { title: 'Printer jam and toners empty in central hub', description: 'The main Xerox machine is completely out of toner and has a paper jam in Tray 2.', status: 'open', priority: 'medium', branch: 'mumbai-bkc', reportedBy: 'PhonePe Finance', assignedStaff: 'Karan Johar (Admin Ops)', resolutionNotes: '' },
      { title: 'Acoustic door seal damaged in Pod 4B', description: 'The rubber acoustic insulation seal on the glass door is coming loose.', status: 'in progress', priority: 'low', branch: 'mumbai-bkc', reportedBy: 'Zepto Devs', assignedStaff: 'Sanjay Dutt (Carpentry)', resolutionNotes: '' },
      { title: 'High latency on WiFi backup network', description: 'The backup network is dropping packets during video calls.', status: 'resolved', priority: 'high', branch: 'mumbai-bkc', reportedBy: 'Lenskart Logistics', assignedStaff: 'Pooja Hegde (IT Support)', resolutionNotes: 'Re-routed bandwidth allocation and restarted Area 4 WAP unit.', resolvedAt: new Date() },

      { title: 'RFID Card scanner failing at main entrance', description: 'The right-side turnstile RFID reader is not scanning visitor access passes.', status: 'open', priority: 'critical', branch: 'gurugram-cyber-city', reportedBy: 'Urban Company Ops', assignedStaff: 'Rohan Das (Security & IT)', resolutionNotes: '' },
      { title: 'No hot water in cafeteria pantry sinks', description: 'Geyser is not working in the cafeteria cleaning area.', status: 'in progress', priority: 'medium', branch: 'gurugram-cyber-city', reportedBy: 'Swiggy Team', assignedStaff: 'Amit Patel (Pantry Services)', resolutionNotes: '' },
      { title: 'Digital flipchart calibration issue in boardroom', description: 'Touch inputs on the smart flipchart are offset by about 2 inches.', status: 'resolved', priority: 'low', branch: 'gurugram-cyber-city', reportedBy: 'Razorpay Growth', assignedStaff: 'Pooja Hegde (IT Support)', resolutionNotes: 'Re-calibrated screen coordinates in options menu.', resolvedAt: new Date() },

      { title: 'Main boardroom AC not powering on', description: 'Charminar boardroom AC panel is completely blank, likely a blown fuse.', status: 'open', priority: 'high', branch: 'hyderabad', reportedBy: 'PhonePe Finance', assignedStaff: 'Vikram Sharma (Maintenance)', resolutionNotes: '' },
      { title: 'Ergonomic chair gas cylinder failure', description: 'Desk seat A8 drops to the lowest position as soon as sat on.', status: 'in progress', priority: 'low', branch: 'hyderabad', reportedBy: 'Swiggy Instamart', assignedStaff: 'Sanjay Dutt (Carpentry)', resolutionNotes: '' },
      { title: 'Coffee vending machine not grinding beans', description: 'Vending machine Dispenser 2 is throwing a "Grinder Clogged" warning.', status: 'resolved', priority: 'medium', branch: 'hyderabad', reportedBy: 'Lenskart Retail', assignedStaff: 'Amit Patel (Pantry Services)', resolutionNotes: 'Cleaned bean grinder hopper and cleared coffee dust clogging.', resolvedAt: new Date() },

      { title: 'Glass door hinge squeaking loudly in Pod C', description: 'Hinge is making a sharp screeching sound whenever opened.', status: 'open', priority: 'low', branch: 'bangalore', reportedBy: 'Ather Design Team', assignedStaff: 'Unassigned', resolutionNotes: '' },
      { title: 'WAP offline in Koramangala Area A', description: 'WAP unit 12 is displaying a solid red light and no SSID is visible.', status: 'in progress', priority: 'high', branch: 'bangalore', reportedBy: 'Razorpay Ops', assignedStaff: 'Pooja Hegde (IT Support)', resolutionNotes: '' },
      { title: 'Power socket not working at desk B12', description: 'Universal power outlet does not have active current flow.', status: 'resolved', priority: 'medium', branch: 'bangalore', reportedBy: 'Urban Company Ops', assignedStaff: 'Vikram Sharma (Maintenance)', resolutionNotes: 'Replaced faulty socket faceplate and reconnected ground wiring.', resolvedAt: new Date() },

      { title: 'Projector lamp burnt out in Marina room', description: 'Screen projector displays a red "Lamp Replacement" warning and turns off.', status: 'open', priority: 'high', branch: 'chennai', reportedBy: 'Swiggy Ops', assignedStaff: 'Pooja Hegde (IT Support)', resolutionNotes: '' },
      { title: 'Cabinet lock key broken in locker room', description: 'Key snapped inside Locker 42 tumbler lock cylinder.', status: 'in progress', priority: 'low', branch: 'chennai', reportedBy: 'Zepto Growth', assignedStaff: 'Sanjay Dutt (Carpentry)', resolutionNotes: '' },
      { title: 'Main entrance automatic sliding door lagging', description: 'Sliding glass doors take 3-4 seconds delay to trigger open.', status: 'resolved', priority: 'medium', branch: 'chennai', reportedBy: 'Razorpay Devs', assignedStaff: 'Vikram Sharma (Maintenance)', resolutionNotes: 'Cleaned floor tracks of dirt and lubricated door roller wheels.', resolvedAt: new Date() },

      // Backlog tickets to trigger recommendations for mumbai-bkc
      { title: 'Leaking ceiling tile', description: 'Water dropping near print area.', status: 'open', priority: 'high', branch: 'mumbai-bkc', reportedBy: 'Zepto Growth Ops', assignedStaff: 'Vikram Sharma (Maintenance)', resolutionNotes: '' },
      { title: 'Smartboard won\'t connect', description: 'HDMI signal drops.', status: 'open', priority: 'medium', branch: 'mumbai-bkc', reportedBy: 'Razorpay Dev Team', assignedStaff: 'Pooja Hegde (IT Support)', resolutionNotes: '' }
    ];
    await Ticket.insertMany(ticketSeedData);
    console.log(`✅ ${ticketSeedData.length} support tickets successfully seeded.`);

    // 6. Seed Clients (Auto-seed across all 6 branches)
    console.log('🌱 Seeding CRM Clients...');
    const createDateOffset = (monthsOffset) => {
      const today = new Date();
      const d = new Date(today);
      d.setMonth(d.getMonth() + monthsOffset);
      return d;
    };

    const clientsSeed = [
      { clientName: 'Rohan Gupta', company: 'Zepto Growth', branch: 'indiranagar', contractStartDate: createDateOffset(-6), contractEndDate: createDateOffset(1), email: 'rohan.gupta@zepto.co', phone: '+91 98765 43210', occupancyDuration: 42, bookingFrequency: 35, roomUsage: 30, ticketSatisfaction: 20, recentActivity: 25 },
      { clientName: 'Anisha Sen', company: 'Razorpay Ops', branch: 'indiranagar', contractStartDate: createDateOffset(-11), contractEndDate: createDateOffset(12), email: 'anisha.sen@razorpay.com', phone: '+91 98123 45678', occupancyDuration: 95, bookingFrequency: 92, roomUsage: 88, ticketSatisfaction: 90, recentActivity: 96 },
      { clientName: 'Animesh Roy', company: 'CRED Premium', branch: 'indiranagar', contractStartDate: createDateOffset(-4), contractEndDate: createDateOffset(2), email: 'animesh@cred.club', phone: '+91 99887 76655', occupancyDuration: 60, bookingFrequency: 55, roomUsage: 65, ticketSatisfaction: 75, recentActivity: 52 },
      
      { clientName: 'Deepak Sen', company: 'Urban Company', branch: 'mumbai-bkc', contractStartDate: createDateOffset(-10), contractEndDate: createDateOffset(2), email: 'deepak.sen@urbancompany.com', phone: '+91 97766 55443', occupancyDuration: 85, bookingFrequency: 80, roomUsage: 75, ticketSatisfaction: 85, recentActivity: 90 },
      { clientName: 'Priya Mehta', company: 'Pepperfry Studio', branch: 'mumbai-bkc', contractStartDate: createDateOffset(-5), contractEndDate: createDateOffset(1), email: 'priya@pepperfry.com', phone: '+91 95555 44433', occupancyDuration: 35, bookingFrequency: 30, roomUsage: 25, ticketSatisfaction: 30, recentActivity: 40 },
      
      { clientName: 'Preeti Sharma', company: 'Swiggy Instamart', branch: 'gurugram-cyber-city', contractStartDate: createDateOffset(-8), contractEndDate: createDateOffset(0), email: 'preeti.s@swiggy.in', phone: '+91 96655 44332', occupancyDuration: 30, bookingFrequency: 25, roomUsage: 20, ticketSatisfaction: 40, recentActivity: 15 },
      { clientName: 'Kunal Kapoor', company: 'Groww Wealth', branch: 'gurugram-cyber-city', contractStartDate: createDateOffset(-5), contractEndDate: createDateOffset(7), email: 'kunal.kapoor@groww.in', phone: '+91 95544 33221', occupancyDuration: 75, bookingFrequency: 70, roomUsage: 60, ticketSatisfaction: 80, recentActivity: 72 },
      
      { clientName: 'Karthik Rao', company: 'PhonePe Finance', branch: 'hyderabad', contractStartDate: createDateOffset(-12), contractEndDate: createDateOffset(6), email: 'karthik@phonepe.com', phone: '+91 94433 22110', occupancyDuration: 90, bookingFrequency: 95, roomUsage: 85, ticketSatisfaction: 95, recentActivity: 92 },
      { clientName: 'Sneha Reddy', company: 'Zomato Dine', branch: 'hyderabad', contractStartDate: createDateOffset(-3), contractEndDate: createDateOffset(9), email: 'sneha.reddy@zomato.com', phone: '+91 93322 11009', occupancyDuration: 65, bookingFrequency: 50, roomUsage: 55, ticketSatisfaction: 70, recentActivity: 68 },
      
      { clientName: 'Divya Gowda', company: 'Lenskart Retail', branch: 'bangalore', contractStartDate: createDateOffset(-18), contractEndDate: createDateOffset(6), email: 'divya@lenskart.in', phone: '+91 92211 00998', occupancyDuration: 95, bookingFrequency: 90, roomUsage: 92, ticketSatisfaction: 90, recentActivity: 88 },
      { clientName: 'Aditya Bhat', company: 'Ola Mobility', branch: 'bangalore', contractStartDate: createDateOffset(-6), contractEndDate: createDateOffset(1), email: 'aditya.bhat@olacabs.com', phone: '+91 91100 99887', occupancyDuration: 40, bookingFrequency: 45, roomUsage: 35, ticketSatisfaction: 50, recentActivity: 38 },
      
      { clientName: 'Hari Krishnan', company: 'Ather Energy', branch: 'chennai', contractStartDate: createDateOffset(-9), contractEndDate: createDateOffset(4), email: 'hari.k@atherenergy.com', phone: '+91 90099 88776', occupancyDuration: 78, bookingFrequency: 82, roomUsage: 75, ticketSatisfaction: 80, recentActivity: 85 }
    ];
    await Client.insertMany(clientsSeed);
    console.log(`✅ ${clientsSeed.length} CRM clients successfully seeded across all 6 branch locations.`);

    console.log('🎉 Consolidated database seeding successfully completed!');
    await mongoose.disconnect();
    console.log('🔌 Disconnected. Done.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Combined Seeder failed: ${error.message}`);
    process.exit(1);
  }
};

seedAll();
