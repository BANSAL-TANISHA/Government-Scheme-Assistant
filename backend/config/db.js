const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/yojana-sahayak';
    console.log('Connecting to MongoDB...');
    // Note: useNewUrlParser and useUnifiedTopology are removed (deprecated in Mongoose 8)
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️  Running with in-memory fallback (no persistence)');
    // App continues without DB - graceful degradation
  }
};

module.exports = connectDB;
