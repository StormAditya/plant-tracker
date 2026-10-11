const { GoogleGenerativeAI } = require('@google/generative-ai');

// Decoded backup key in case Render environment variable has not been configured
const BACKUP_KEY_B64 = 'QVEuQWI4Uk42S0U4bmJQdTdnWXFKbXE4NFloNVFhbkt0WU1TY3E5ZEFoU0RIWUgxQ05ld3c=';
const DEFAULT_KEY = Buffer.from(BACKUP_KEY_B64, 'base64').toString('utf8');

/**
 * Identifies plant species from image buffer strictly using Google Gemini Vision AI.
 * No heuristic or static fallback. Pure AI Vision only.
 */
async function identifyPlantSpecies(imageBuffer, mimeType, originalFilename) {
  const apiKey = (process.env.GEMINI_API_KEY || DEFAULT_KEY).trim();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please configure a valid Gemini API key.');
  }

  const modelCandidates = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  let lastErrorMsg = '';

  for (const modelName of modelCandidates) {
    try {
      console.log(`🤖 Invoking Google Gemini Vision AI (${modelName})...`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' }
      });

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: mimeType || 'image/jpeg'
        }
      };

      const prompt = `Analyze this plant photo carefully and identify the exact plant species.
Return JSON in this exact structure:
{
  "speciesName": "Common Name of the plant",
  "scientificName": "Botanical Genus species name",
  "family": "Botanical Family",
  "confidenceScore": 0.95,
  "suggestedHeight": 25,
  "careTips": "Short 1-2 sentence care guidance",
  "careSummary": "Short care summary for notes",
  "suggestedAlternatives": [
    {"speciesName": "Alternative Species 1", "scientificName": "Alternative Genus 1", "confidenceScore": 0.80}
  ]
}`;

      // 25 second timeout for image vision processing
      const fetchPromise = model.generateContent([prompt, imagePart]);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out after 25s')), 25000)
      );

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      const responseText = await result.response.text();

      // Robust JSON extraction
      let jsonString = responseText.trim();
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(jsonString);

      console.log(`🎉 SUCCESS: Identified by Google Gemini AI (${modelName}): ${parsed.speciesName}`);
      return {
        ...parsed,
        careSummary: parsed.careSummary || parsed.careTips || '',
        engineUsed: `Google Gemini AI (${modelName})`,
        isAiPowered: true
      };
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} error:`, err.message);
      lastErrorMsg = err.message;
    }
  }

  // Strictly throw Gemini error - No fallback
  throw new Error(`Google Gemini Vision AI Error: ${lastErrorMsg || 'API identification failed. Please check Gemini quota or try another photo.'}`);
}

module.exports = {
  identifyPlantSpecies
};
