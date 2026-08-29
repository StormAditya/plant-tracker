const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const plantApi = {
  // Upload photo & run AI plant species identification
  async identifyPlant(compressedFile) {
    const formData = new FormData();
    formData.append('image', compressedFile);

    const response = await fetch(`${BASE_URL}/identify`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Identification failed' }));
      throw new Error(err.error || 'Failed to identify plant species');
    }

    return await response.json();
  },

  // Fetch all saved plant profiles
  async getPlants() {
    const response = await fetch(`${BASE_URL}/plants`);
    if (!response.ok) {
      throw new Error('Failed to fetch plant list');
    }
    const data = await response.json();
    return data.plants || [];
  },

  // Fetch single plant profile by ID
  async getPlantById(id) {
    const response = await fetch(`${BASE_URL}/plants/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch plant details');
    }
    const data = await response.json();
    return data.plant;
  },

  // Save new plant (after user confirmation and edit step)
  async savePlant(plantPayload) {
    const response = await fetch(`${BASE_URL}/plants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plantPayload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Save failed' }));
      throw new Error(err.error || 'Failed to save plant profile');
    }

    const data = await response.json();
    return data.plant;
  },

  // Update existing plant profile details
  async updatePlant(id, updatePayload) {
    const response = await fetch(`${BASE_URL}/plants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });

    if (!response.ok) {
      throw new Error('Failed to update plant');
    }

    const data = await response.json();
    return data.plant;
  },

  // Add new height log measurement to track growth
  async addHeightLog(plantId, height, heightUnit = 'cm', note = '') {
    const response = await fetch(`${BASE_URL}/plants/${plantId}/height`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ height, heightUnit, note })
    });

    if (!response.ok) {
      throw new Error('Failed to record new height measurement');
    }

    const data = await response.json();
    return data.plant;
  },

  // Delete plant profile
  async deletePlant(id) {
    const response = await fetch(`${BASE_URL}/plants/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete plant');
    }

    return true;
  }
};
