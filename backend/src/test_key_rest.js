const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

async function testWorkingModel() {
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];

  for (const model of models) {
    console.log(`Testing REST call for model: ${model}...`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Identify plant: green split leaves. Return JSON: {\"species\": \"Monstera\"}" }] }]
        })
      });

      const json = await response.json();
      if (response.ok) {
        console.log(`🎉 SUCCESS with ${model}! Response:`, JSON.stringify(json).substring(0, 200));
        return model;
      } else {
        console.log(`❌ Fail ${model}:`, JSON.stringify(json));
      }
    } catch (err) {
      console.error(`Error with ${model}:`, err.message);
    }
  }
}

testWorkingModel();
