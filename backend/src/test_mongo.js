const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;
console.log('Testing MONGODB_URI connection...');

async function testConnection() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('🎉 SUCCESS: Connected to MongoDB Atlas Cloud Database!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Connection Error:', err.message);
  }
}

testConnection();
