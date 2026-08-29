const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing API Key starting with:', apiKey ? apiKey.substring(0, 8) : 'NONE');

const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-flash',
  'gemini-2.0-flash-exp',
  'gemini-flash'
];

async function runTest() {
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello in 3 words");
      const text = await result.response.text();
      console.log(` SUCCESS with ${modelName}:`, text);
      return modelName;
    } catch (err) {
      console.log(` FAIL with ${modelName}:`, err.message);
    }
  }
}

runTest();
