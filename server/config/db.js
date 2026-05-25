const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cosaas';
    const conn = await mongoose.connect(connString);
    console.log(`MongoDB Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failure: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
