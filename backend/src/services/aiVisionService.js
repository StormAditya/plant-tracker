const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Identifies plant species from image buffer strictly using Google Gemini Vision AI.
 * Throws an explicit error if Gemini API quota/rate limit fails instead of silent fallback.
 */
async function identifyPlantSpecies(imageBuffer, mimeType, originalFilename) {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('GEMINI_API_KEY is missing or unconfigured. Please configure a valid Gemini API key.');
  }

  const modelCandidates = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];
  let lastErrorMsg = '';

  for (const modelName of modelCandidates) {
    try {
      console.log(`🤖 Invoking Google Gemini Vision AI (${modelName})...`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: mimeType || 'image/jpeg'
        }
      };

      const prompt = `Analyze this plant photo carefully and identify the exact plant species. Return JSON ONLY in this format:
{
  "speciesName": "Common Name of the plant",
  "scientificName": "Botanical Genus species name",
  "family": "Botanical Family",
  "confidenceScore": 0.95,
  "suggestedHeight": 20,
  "careTips": "Short 1-2 sentence care guidance",
  "careSummary": "Short care summary for notes",
  "suggestedAlternatives": [
    {"speciesName": "Alt Species 1", "scientificName": "Alt Genus 1", "confidenceScore": 0.80}
  ]
}`;

      // 25 second timeout for image vision processing
      const fetchPromise = model.generateContent([prompt, imagePart]);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out after 25s')), 25000)
      );

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      const responseText = await result.response.text();
      
      const cleanJson = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson);

      console.log(`🎉 SUCCESS: Identified by Google Gemini AI (${modelName}): ${parsed.speciesName}`);
      return {
        ...parsed,
        careSummary: parsed.careSummary || parsed.careTips,
        engineUsed: `Google Gemini AI (${modelName})`,
        isAiPowered: true
      };
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} error:`, err.message);
      lastErrorMsg = err.message;
    }
  }

  // Strictly throw Gemini error instead of returning inaccurate built-in fallback predictions
  throw new Error(`Google Gemini Vision AI Error: ${lastErrorMsg || 'Quota or API rate limit exceeded. Please try again.'}`);
}

module.exports = {
  identifyPlantSpecies
};
