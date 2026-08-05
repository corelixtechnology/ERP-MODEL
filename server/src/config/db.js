import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

const connectDB = async () => {
  try {
    let dbUri = process.env.MONGO_URI;

    if (process.env.USE_IN_MEMORY_DB === 'true') {
      console.log('Starting in-memory MongoDB server...');
      mongod = await MongoMemoryServer.create();
      dbUri = mongod.getUri();
      console.log(`In-memory MongoDB started at: ${dbUri}`);
    }

    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error(`Disconnect error: ${error.message}`);
  }
};

export default connectDB;
