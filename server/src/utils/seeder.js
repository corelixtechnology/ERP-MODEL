import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const users = [
  {
    name: 'System Admin',
    email: 'admin@erp.com',
    password: 'password123',
    role: 'admin',
    isActive: true,
  },
  {
    name: 'Dr. John Doe (Faculty)',
    email: 'faculty@erp.com',
    password: 'password123',
    role: 'faculty',
    isActive: true,
  },
  {
    name: 'Jane Smith (Student)',
    email: 'student@erp.com',
    password: 'password123',
    role: 'student',
    isActive: true,
  },
  {
    name: 'Sarah Connor (Accounts)',
    email: 'accounts@erp.com',
    password: 'password123',
    role: 'accounts',
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college-erp';
    console.log(`Connecting to database at ${mongoUri} for seeding...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing users...');
    await User.deleteMany({ email: { $in: users.map(u => u.email) } });

    console.log('Inserting seed users...');
    const createdUsers = await User.create(users);

    console.log('Database seeded successfully!');
    console.log('Created accounts:');
    createdUsers.forEach(u => {
      console.log(`- ${u.name} (${u.role}): ${u.email} / password123`);
    });

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
