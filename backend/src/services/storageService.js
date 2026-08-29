const fs = require('fs');
const path = require('path');
const { mongoStorage } = require('./mongoStorage');
const { deleteImageFileOrCloud } = require('./cloudinaryStorage');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'plants_db.json');

function initLocalStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      plants: [],
      storageMetadata: {
        provider: process.env.STORAGE_PROVIDER || 'local',
        maxFreeStorageNote: 'Configured for compressed 480p image uploads.'
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readLocalData() {
  initLocalStorage();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading local JSON database:', err);
    return { plants: [] };
  }
}

function writeLocalData(data) {
  initLocalStorage();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Unified Storage Service (MongoDB Atlas Cloud DB primary, Local JSON DB fallback)
const storageService = {
  async getAllPlants() {
    if (process.env.MONGODB_URI) {
      const cloudPlants = await mongoStorage.getAllPlants();
      if (cloudPlants) return cloudPlants;
    }
    const db = readLocalData();
    return db.plants;
  },

  async getPlantById(id) {
    if (process.env.MONGODB_URI) {
      const cloudPlant = await mongoStorage.getPlantById(id);
      if (cloudPlant) return cloudPlant;
    }
    const db = readLocalData();
    return db.plants.find((p) => p.id === id);
  },

  async savePlant(plantData) {
    if (process.env.MONGODB_URI) {
      const cloudResult = await mongoStorage.savePlant(plantData);
      if (cloudResult) return cloudResult;
    }

    const db = readLocalData();
    const now = new Date().toISOString();
    const logDate = plantData.loggedAt ? new Date(plantData.loggedAt).toISOString() : now;

    const newPlant = {
      id: plantData.id || 'plant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
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
      createdAt: now,
      updatedAt: now,
      heightHistory: [
        {
          id: 'log_' + Date.now(),
          height: parseFloat(plantData.height) || 0,
          unit: plantData.heightUnit || 'cm',
          loggedAt: logDate,
          note: 'Initial plant record'
        }
      ]
    };

    db.plants.unshift(newPlant);
    writeLocalData(db);
    return newPlant;
  },

  async updatePlant(id, updateFields) {
    if (process.env.MONGODB_URI) {
      const cloudResult = await mongoStorage.updatePlant(id, updateFields);
      if (cloudResult) return cloudResult;
    }

    const db = readLocalData();
    const index = db.plants.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const plant = db.plants[index];
    const updatedPlant = {
      ...plant,
      ...updateFields,
      updatedAt: new Date().toISOString()
    };

    db.plants[index] = updatedPlant;
    writeLocalData(db);
    return updatedPlant;
  },

  async addHeightLog(plantId, height, unit, note, customLoggedAt) {
    if (process.env.MONGODB_URI) {
      const cloudResult = await mongoStorage.addHeightLog(plantId, height, unit, note, customLoggedAt);
      if (cloudResult) return cloudResult;
    }

    const db = readLocalData();
    const plant = db.plants.find((p) => p.id === plantId);
    if (!plant) return null;

    const now = new Date().toISOString();
    const logDate = customLoggedAt ? new Date(customLoggedAt).toISOString() : now;
    const numericHeight = parseFloat(height);

    const newLog = {
      id: 'log_' + Date.now(),
      height: numericHeight,
      unit: unit || plant.heightUnit || 'cm',
      loggedAt: logDate,
      note: note || 'Growth update'
    };

    if (!plant.heightHistory) plant.heightHistory = [];
    plant.heightHistory.push(newLog);
    plant.heightHistory.sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt));

    const latestLog = plant.heightHistory[0];
    if (latestLog) {
      plant.currentHeight = latestLog.height;
      plant.heightUnit = latestLog.unit;
    }
    plant.updatedAt = now;

    writeLocalData(db);
    return plant;
  },

  async deletePlant(id) {
    if (process.env.MONGODB_URI) {
      const cloudResult = await mongoStorage.deletePlant(id);
      if (cloudResult !== null) return cloudResult;
    }

    const db = readLocalData();
    const index = db.plants.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deletedPlant = db.plants[index];
      if (deletedPlant.imageUrl) {
        deleteImageFileOrCloud(deletedPlant.imageUrl);
      }
      db.plants.splice(index, 1);
      writeLocalData(db);
      return true;
    }
    return false;
  }
};

module.exports = storageService;
