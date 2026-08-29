const mongoose = require('mongoose');

// Plant Mongoose Schema for MongoDB Atlas
const heightLogSchema = new mongoose.Schema({
  id: { type: String, required: true },
  height: { type: Number, required: true },
  unit: { type: String, default: 'cm' },
  loggedAt: { type: Date, default: Date.now },
  note: { type: String, default: '' }
});

const plantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    speciesName: { type: String, required: true },
    scientificName: { type: String, default: '' },
    isSpeciesConfirmed: { type: Boolean, default: true },
    engineUsed: { type: String, default: 'Google Gemini AI' },
    currentHeight: { type: Number, required: true },
    heightUnit: { type: String, default: 'cm' },
    imageUrl: { type: String, default: '' },
    compressedResolution: { type: String, default: '480p' },
    careTips: { type: String, default: '' },
    notes: { type: String, default: '' },
    heightHistory: [heightLogSchema]
  },
  { timestamps: true }
);

const PlantModel = mongoose.model('Plant', plantSchema);

let isConnected = false;

async function connectMongoDB() {
  if (isConnected) return;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) return;

  try {
    console.log('🍃 Connecting to MongoDB Atlas Online Cloud Database...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas Online Cloud Database successfully!');
  } catch (err) {
    console.error('❌ MongoDB Atlas connection error:', err.message);
    isConnected = false;
  }
}

const mongoStorage = {
  async getAllPlants() {
    await connectMongoDB();
    if (!isConnected) return null;
    const plants = await PlantModel.find().sort({ createdAt: -1 });
    return plants.map((p) => p.toObject());
  },

  async getPlantById(id) {
    await connectMongoDB();
    if (!isConnected) return null;
    const plant = await PlantModel.findOne({ id });
    return plant ? plant.toObject() : null;
  },

  async savePlant(plantData) {
    await connectMongoDB();
    if (!isConnected) return null;

    const now = new Date();
    const plantId = plantData.id || 'plant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    const newPlant = new PlantModel({
      id: plantId,
      speciesName: plantData.speciesName || 'Unknown Plant',
      scientificName: plantData.scientificName || '',
      isSpeciesConfirmed: plantData.isSpeciesConfirmed !== undefined ? plantData.isSpeciesConfirmed : true,
      engineUsed: plantData.engineUsed || 'Google Gemini AI',
      currentHeight: parseFloat(plantData.height) || 0,
      heightUnit: plantData.heightUnit || 'cm',
      imageUrl: plantData.imageUrl || '',
      compressedResolution: plantData.compressedResolution || '480p',
      careTips: plantData.careTips || '',
      notes: plantData.notes || '',
      heightHistory: [
        {
          id: 'log_' + Date.now(),
          height: parseFloat(plantData.height) || 0,
          unit: plantData.heightUnit || 'cm',
          loggedAt: now,
          note: 'Initial plant record'
        }
      ]
    });

    await newPlant.save();
    return newPlant.toObject();
  },

  async updatePlant(id, updateFields) {
    await connectMongoDB();
    if (!isConnected) return null;

    const updated = await PlantModel.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  },

  async addHeightLog(plantId, height, unit, note) {
    await connectMongoDB();
    if (!isConnected) return null;

    const numericHeight = parseFloat(height);
    const newLog = {
      id: 'log_' + Date.now(),
      height: numericHeight,
      unit: unit || 'cm',
      loggedAt: new Date(),
      note: note || 'Growth update'
    };

    const updated = await PlantModel.findOneAndUpdate(
      { id: plantId },
      {
        $set: { currentHeight: numericHeight, heightUnit: newLog.unit },
        $push: { heightHistory: { $each: [newLog], $position: 0 } }
      },
      { new: true }
    );

    return updated ? updated.toObject() : null;
  },

  async deletePlant(id) {
    await connectMongoDB();
    if (!isConnected) return null;
    const result = await PlantModel.deleteOne({ id });
    return result.deletedCount > 0;
  }
};

module.exports = {
  mongoStorage,
  connectMongoDB
};
