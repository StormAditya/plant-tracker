const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('Key prefix:', apiKey ? apiKey.substring(0, 10) : 'NONE');

async function testKey() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    console.log('Sending request to Gemini API...');
    const result = await Promise.race([
      model.generateContent("Test"),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout 5s - API key authentication failed')), 5000))
    ]);
    const text = await result.response.text();
    console.log('SUCCESS:', text);
  } catch (err) {
    console.log('KEY ERROR:', err.message);
  }
}

testKey();
