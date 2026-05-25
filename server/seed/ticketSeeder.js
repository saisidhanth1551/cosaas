const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ticket = require('../models/Ticket');

// Load environment variables
dotenv.config();

const ticketSeedData = [
  // Indiranagar
  {
    title: 'AC cooling issue in 3rd floor open desks',
    description: 'The AC unit in Area B is making a loud rattling sound and not cooling properly.',
    status: 'open',
    priority: 'high',
    branch: 'indiranagar',
    reportedBy: 'Razorpay Devs',
    assignedStaff: 'Vikram Sharma (Maintenance)',
    resolutionNotes: ''
  },
  {
    title: 'Leaking water dispenser in pantry area',
    description: 'Water is pooling underneath the main dispenser in the 2nd-floor cafeteria.',
    status: 'in progress',
    priority: 'medium',
    branch: 'indiranagar',
    reportedBy: 'Swiggy Ops',
    assignedStaff: 'Amit Patel (Pantry Services)',
    resolutionNotes: ''
  },
  {
    title: 'Conference Room Nandi Smart TV lag',
    description: 'The Apple TV is lagging heavily during screen sharing.',
    status: 'resolved',
    priority: 'low',
    branch: 'indiranagar',
    reportedBy: 'Ather Design Team',
    assignedStaff: 'Pooja Hegde (IT Support)',
    resolutionNotes: 'Restarted Apple TV box and updated the tvOS firmware. Lag is resolved.',
    resolvedAt: new Date()
  },

  // Mumbai BKC
  {
    title: 'Printer jam and toners empty in central hub',
    description: 'The main Xerox machine is completely out of toner and has a paper jam in Tray 2.',
    status: 'open',
    priority: 'medium',
    branch: 'mumbai-bkc',
    reportedBy: 'PhonePe Finance',
    assignedStaff: 'Karan Johar (Admin Ops)',
    resolutionNotes: ''
  },
  {
    title: 'Acoustic door seal damaged in Pod 4B',
    description: 'The rubber acoustic insulation seal on the glass door is coming loose.',
    status: 'in progress',
    priority: 'low',
    branch: 'mumbai-bkc',
    reportedBy: 'Zepto Devs',
    assignedStaff: 'Sanjay Dutt (Carpentry)',
    resolutionNotes: ''
  },
  {
    title: 'High latency on WiFi backup network',
    description: 'The backup network is dropping packets during video calls.',
    status: 'resolved',
    priority: 'high',
    branch: 'mumbai-bkc',
    reportedBy: 'Lenskart Logistics',
    assignedStaff: 'Pooja Hegde (IT Support)',
    resolutionNotes: 'Re-routed bandwidth allocation and restarted Area 4 WAP unit.',
    resolvedAt: new Date()
  },

  // Gurugram Cyber City
  {
    title: 'RFID Card scanner failing at main entrance',
    description: 'The right-side turnstile RFID reader is not scanning visitor access passes.',
    status: 'open',
    priority: 'critical',
    branch: 'gurugram-cyber-city',
    reportedBy: 'Urban Company Ops',
    assignedStaff: 'Rohan Das (Security & IT)',
    resolutionNotes: ''
  },
  {
    title: 'No hot water in cafeteria pantry sinks',
    description: 'Geyser is not working in the cafeteria cleaning area.',
    status: 'in progress',
    priority: 'medium',
    branch: 'gurugram-cyber-city',
    reportedBy: 'Swiggy Team',
    assignedStaff: 'Amit Patel (Pantry Services)',
    resolutionNotes: ''
  },
  {
    title: 'Digital flipchart calibration issue in boardroom',
    description: 'Touch inputs on the smart flipchart are offset by about 2 inches.',
    status: 'resolved',
    priority: 'low',
    branch: 'gurugram-cyber-city',
    reportedBy: 'Razorpay Growth',
    assignedStaff: 'Pooja Hegde (IT Support)',
    resolutionNotes: 'Re-calibrated screen coordinates in options menu.',
    resolvedAt: new Date()
  },

  // Hyderabad
  {
    title: 'Main boardroom AC not powering on',
    description: 'Charminar boardroom AC panel is completely blank, likely a blown fuse.',
    status: 'open',
    priority: 'high',
    branch: 'hyderabad',
    reportedBy: 'PhonePe Finance',
    assignedStaff: 'Vikram Sharma (Maintenance)',
    resolutionNotes: ''
  },
  {
    title: 'Ergonomic chair gas cylinder failure',
    description: 'Desk seat A8 drops to the lowest position as soon as sat on.',
    status: 'in progress',
    priority: 'low',
    branch: 'hyderabad',
    reportedBy: 'Swiggy Instamart',
    assignedStaff: 'Sanjay Dutt (Carpentry)',
    resolutionNotes: ''
  },
  {
    title: 'Coffee vending machine not grinding beans',
    description: 'Vending machine Dispenser 2 is throwing a "Grinder Clogged" warning.',
    status: 'resolved',
    priority: 'medium',
    branch: 'hyderabad',
    reportedBy: 'Lenskart Retail',
    assignedStaff: 'Amit Patel (Pantry Services)',
    resolutionNotes: 'Cleaned bean grinder hopper and cleared coffee dust clogging.',
    resolvedAt: new Date()
  },

  // Bangalore
  {
    title: 'Glass door hinge squeaking loudly in Pod C',
    description: 'Hinge is making a sharp screeching sound whenever opened.',
    status: 'open',
    priority: 'low',
    branch: 'bangalore',
    reportedBy: 'Ather Design Team',
    assignedStaff: 'Unassigned',
    resolutionNotes: ''
  },
  {
    title: 'WAP offline in Koramangala Area A',
    description: 'WAP unit 12 is displaying a solid red light and no SSID is visible.',
    status: 'in progress',
    priority: 'high',
    branch: 'bangalore',
    reportedBy: 'Razorpay Ops',
    assignedStaff: 'Pooja Hegde (IT Support)',
    resolutionNotes: ''
  },
  {
    title: 'Power socket not working at desk B12',
    description: 'Universal power outlet does not have active current flow.',
    status: 'resolved',
    priority: 'medium',
    branch: 'bangalore',
    reportedBy: 'Urban Company Ops',
    assignedStaff: 'Vikram Sharma (Maintenance)',
    resolutionNotes: 'Replaced faulty socket faceplate and reconnected ground wiring.',
    resolvedAt: new Date()
  },

  // Chennai
  {
    title: 'Projector lamp burnt out in Marina room',
    description: 'Screen projector displays a red "Lamp Replacement" warning and turns off.',
    status: 'open',
    priority: 'high',
    branch: 'chennai',
    reportedBy: 'Swiggy Ops',
    assignedStaff: 'Pooja Hegde (IT Support)',
    resolutionNotes: ''
  },
  {
    title: 'Cabinet lock key broken in locker room',
    description: 'Key snapped inside Locker 42 tumbler lock cylinder.',
    status: 'in progress',
    priority: 'low',
    branch: 'chennai',
    reportedBy: 'Zepto Growth',
    assignedStaff: 'Sanjay Dutt (Carpentry)',
    resolutionNotes: ''
  },
  {
    title: 'Main entrance automatic sliding door lagging',
    description: 'Sliding glass doors take 3-4 seconds delay to trigger open.',
    status: 'resolved',
    priority: 'medium',
    branch: 'chennai',
    reportedBy: 'Razorpay Devs',
    assignedStaff: 'Vikram Sharma (Maintenance)',
    resolutionNotes: 'Cleaned floor tracks of dirt and lubricated door roller wheels.',
    resolvedAt: new Date()
  }
];

const seedTickets = async () => {
  console.log('🔌 Connecting to MongoDB for tickets seeding...');
  try {
    const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cosaas';
    await mongoose.connect(connString);
    console.log('🔌 Connected.');

    console.log('🧹 Purging historical support ticket records...');
    await Ticket.deleteMany({});
    console.log('🧹 Purged.');

    console.log('🌱 Inserting 18 premium operational support tickets...');
    await Ticket.insertMany(ticketSeedData);
    console.log('✅ Support tickets successfully seeded!');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB seeder. Exiting.');
    process.exit(0);
  } catch (err) {
    console.error(`❌ Seeder failure: ${err.message}`);
    process.exit(1);
  }
};

seedTickets();
