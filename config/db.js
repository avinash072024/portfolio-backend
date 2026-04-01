const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: parseInt(process.env.MONGO_POOL_SIZE, 10) || 20,
      serverSelectionTimeoutMS: 5000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
