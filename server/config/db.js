const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/carcare_connect';

  try {
    // Attempt connecting to the configured MongoDB URI (timeout 3.5s if not running)
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3500,
    });
    console.log(`[MongoDB] Connected to Primary Database: ${conn.connection.host}`);
    return conn;
  } catch (primaryErr) {
    console.warn(`[MongoDB Warning] Primary connection to ${mongoUri} failed: ${primaryErr.message}`);
    const isLocalMongo = /^mongodb(?:\+srv)?:\/\/(localhost|127\.0\.0\.1)([:/]|$)/i.test(mongoUri);
    if (process.env.NODE_ENV === 'production' || (process.env.MONGO_URI && !isLocalMongo)) {
      throw primaryErr;
    }
    console.log(`[MongoDB] Launching automated embedded MongoDB In-Memory Server for zero-config local execution...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Embedded In-Memory Database connected successfully at ${inMemoryUri}`);
      
      // Auto seed in-memory DB if empty
      const seeder = require('../utils/seeder');
      await seeder.seedIfNeeded();
      return conn;
    } catch (memErr) {
      console.error('[MongoDB Error] Failed to start in-memory database:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
