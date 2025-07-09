
// db.js - Database connection setup
require('dotenv').config();
const mongoose = require('mongoose');
//const logger = require('./logger'); // Optional logger

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sunabeda';

// Database connection options
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10, // Maintain up to 10 socket connections
};

// Connection events
mongoose.connection.on('connected', () => {
  console.log(`MongoDB connected to ${mongoose.connection.host}`);
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

// Database connection function
const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB at ${DB_URI}...`);
    await mongoose.connect(DB_URI, dbOptions);
    console.log(`Connected to MongoDB at ${DB_URI}`);
  } catch (err) {
    console.log('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  mongoose, // Export mongoose if you need it elsewhere
};