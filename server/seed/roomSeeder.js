const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('../models/Room');

// Load environment variables
dotenv.config();

const roomsSeedData = [
  // Indiranagar
  {
    name: 'Kaveri Tech Pod',
    capacity: 4,
    branch: 'indiranagar',
    status: 'available',
    amenities: ['High-speed WiFi', '4K Monitor', 'Whiteboard', 'Acoustic Proofing'],
    bookings: []
  },
  {
    name: 'Nandi Boardroom',
    capacity: 12,
    branch: 'indiranagar',
    status: 'available',
    amenities: ['Video Conferencing', 'Smart Projector', 'Wireless Presentation', 'Refreshment Bar'],
    bookings: [
      {
        organizer: 'Razorpay Dev Team',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '11:00 AM - 12:00 PM',
        duration: '1 hour'
      }
    ]
  },
  {
    name: 'Cubbon Collab Lab',
    capacity: 8,
    branch: 'indiranagar',
    status: 'available',
    amenities: ['Whiteboard Wall', 'Smart TV', 'Ideation Kit', 'Premium Soundbar'],
    bookings: []
  },

  // Mumbai BKC
  {
    name: 'Gateway Boardroom',
    capacity: 16,
    branch: 'mumbai-bkc',
    status: 'available',
    amenities: ['Ultra-wide LED Screen', 'Poly Studio VC', 'Soundproof Walls', 'Coffee Station'],
    bookings: [
      {
        organizer: 'Zepto Growth Ops',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '02:00 PM - 04:00 PM',
        duration: '2 hours'
      }
    ]
  },
  {
    name: 'Elephanta Brainstorm Pod',
    capacity: 6,
    branch: 'mumbai-bkc',
    status: 'available',
    amenities: ['Dual Whiteboards', 'Apple TV Airplay', 'Acoustic Glass', 'Hue Mood Lighting'],
    bookings: []
  },
  {
    name: 'Colaba Hub',
    capacity: 8,
    branch: 'mumbai-bkc',
    status: 'available',
    amenities: ['High-speed WiFi', '4K TV Screen', 'Magnetic Board', 'Espresso Access'],
    bookings: []
  },

  // Gurugram Cyber City
  {
    name: 'Aravali Executive Center',
    capacity: 14,
    branch: 'gurugram-cyber-city',
    status: 'available',
    amenities: ['Executive Seating', '4K Interactive Screen', 'Logitech MeetUp VC', 'Butler Call'],
    bookings: []
  },
  {
    name: 'Sohna Creative Lounge',
    capacity: 8,
    branch: 'gurugram-cyber-city',
    status: 'available',
    amenities: ['Beanbag Seating', 'Writable Walls', 'Ultra-short Projector', 'Surround Sound'],
    bookings: []
  },
  {
    name: 'Cyber Boardroom',
    capacity: 10,
    branch: 'gurugram-cyber-city',
    status: 'available',
    amenities: ['Video Conferencing', 'Smart TV', 'Digital Flipchart', 'Beverage Station'],
    bookings: [
      {
        organizer: 'Lenskart Marketing',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '10:00 AM - 11:00 AM',
        duration: '1 hour'
      }
    ]
  },

  // Hyderabad
  {
    name: 'Charminar Boardroom',
    capacity: 15,
    branch: 'hyderabad',
    status: 'available',
    amenities: ['Dual 4K TV Screens', 'Cisco Webex Kit', 'Acoustic Insulation', 'Premium Coffee'],
    bookings: [
      {
        organizer: 'Swiggy Operations',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '04:00 PM - 05:00 PM',
        duration: '1 hour'
      }
    ]
  },
  {
    name: 'Golkonda Brainstorm Suite',
    capacity: 8,
    branch: 'hyderabad',
    status: 'available',
    amenities: ['Full Glass Whiteboard', 'Dynamic Mood Light', 'Smart TV Screen', 'Power Hubs'],
    bookings: []
  },
  {
    name: 'Kakatiya Meeting Pod',
    capacity: 4,
    branch: 'hyderabad',
    status: 'available',
    amenities: ['4K Monitor', 'Whiteboard', 'High-speed WiFi', 'Ergonomic Chairs'],
    bookings: []
  },

  // Bangalore
  {
    name: 'Koramangala Innovate Pod',
    capacity: 6,
    branch: 'bangalore',
    status: 'available',
    amenities: ['4K Screen', 'Glass Whiteboard', 'Power Hubs', 'Ergonomic Chairs'],
    bookings: []
  },
  {
    name: 'Lalbagh Executive Room',
    capacity: 12,
    branch: 'bangalore',
    status: 'available',
    amenities: ['Video Conferencing', 'Smart Projector', 'Wireless Presentation', 'Refreshments'],
    bookings: []
  },
  {
    name: 'Bannerghatta Brainstorm Center',
    capacity: 10,
    branch: 'bangalore',
    status: 'available',
    amenities: ['Writable Wall', 'Smart TV Screen', 'Ideation Kit'],
    bookings: []
  },

  // Chennai
  {
    name: 'Marina Boardroom',
    capacity: 18,
    branch: 'chennai',
    status: 'available',
    amenities: ['8K Video Wall', 'Dolby Atmos Conference Audio', 'HDMI Hub', 'Mini Fridge'],
    bookings: []
  },
  {
    name: 'Valluvar Meeting Suite',
    capacity: 8,
    branch: 'chennai',
    status: 'available',
    amenities: ['Magnetic Whiteboard', '4K Screen', 'Logitech VC Pod', 'Premium Sound'],
    bookings: []
  },
  {
    name: 'Nilgiri Collab Pod',
    capacity: 6,
    branch: 'chennai',
    status: 'available',
    amenities: ['High-speed WiFi', 'Smart Monitor', 'Acoustic Insulation'],
    bookings: []
  }
];

const seedRooms = async () => {
  console.log('🔌 Connecting to MongoDB for room seeding...');
  try {
    const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cosaas';
    await mongoose.connect(connString);
    console.log('🔌 Connected.');

    console.log('🧹 Purging historical conference room records...');
    await Room.deleteMany({});
    console.log('🧹 Purged.');

    console.log('🌱 Inserting 18 premium meeting room records...');
    await Room.insertMany(roomsSeedData);
    console.log('✅ Conference rooms successfully seeded!');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB seeder. Exiting.');
    process.exit(0);
  } catch (err) {
    console.error(`❌ Seeder failure: ${err.message}`);
    process.exit(1);
  }
};

seedRooms();
