const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const AUTH_KEY = 'rswf_admin_auth';

function getAuthToken() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}`, 'x-admin-token': token } : {};
}

export const plantApi = {
  // Authentication Helpers (Admin: RSWF / RSWFPASS)
  async login(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      let errorMessage = 'Invalid credentials';
      try {
        const err = await response.json();
        errorMessage = err.error || err.message || errorMessage;
      } catch {
        if (response.status === 404) {
          errorMessage = 'Backend is deploying new routes on Render. Please wait ~1-2 minutes and try again.';
        } else if (response.status === 502 || response.status === 503) {
          errorMessage = 'Backend server is waking up from sleep (Render free tier). Please wait 30 seconds and try again.';
        } else {
          errorMessage = 'Login failed. Please check backend connection.';
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        token: data.token,
        username: data.user?.username || 'RSWF',
        role: 'admin',
        loggedInAt: Date.now()
      }));
    }
    return data;
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  getAuth() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async verifyAuth() {
    const token = getAuthToken();
    if (!token) return false;
    try {
      const res = await fetch(`${BASE_URL}/auth/verify`, {
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Upload photo & run AI plant species identification (Admin only)
  async identifyPlant(compressedFile) {
    const formData = new FormData();
    formData.append('image', compressedFile);

    const response = await fetch(`${BASE_URL}/identify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Identification failed' }));
      throw new Error(err.error || 'Failed to identify plant species');
    }

    return await response.json();
  },

  // Fetch all saved plant profiles (Public - Anyone can view)
  async getPlants() {
    const response = await fetch(`${BASE_URL}/plants`);
    if (!response.ok) {
      throw new Error('Failed to fetch plant list');
    }
    const data = await response.json();
    return data.plants || [];
  },

  // Fetch single plant profile by ID (Public - Anyone can view)
  async getPlantById(id) {
    const response = await fetch(`${BASE_URL}/plants/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch plant details');
    }
    const data = await response.json();
    return data.plant;
  },

  // Upload photo directly to Cloudinary (Admin only)
  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Failed to upload photo to Cloudinary');
    }

    return await response.json();
  },

  // Save new plant (Admin only)
  async savePlant(plantPayload) {
    const response = await fetch(`${BASE_URL}/plants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
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

  // Update existing plant profile details (Admin only)
  async updatePlant(id, updatePayload) {
    const response = await fetch(`${BASE_URL}/plants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updatePayload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(err.error || 'Failed to update plant');
    }

    const data = await response.json();
    return data.plant;
  },

  // Add new height log measurement (Admin only)
  async addHeightLog(plantId, payload, legacyUnit, legacyNote) {
    let bodyPayload;
    if (typeof payload === 'object' && payload !== null) {
      bodyPayload = {
        height: parseFloat(payload.height),
        heightUnit: payload.heightUnit || payload.unit || 'cm',
        note: payload.note || 'Recorded growth update',
        loggedAt: payload.loggedAt
      };
    } else {
      bodyPayload = {
        height: parseFloat(payload),
        heightUnit: legacyUnit || 'cm',
        note: legacyNote || 'Recorded growth update'
      };
    }

    const response = await fetch(`${BASE_URL}/plants/${plantId}/height`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Failed to record height' }));
      throw new Error(err.error || 'Failed to record new height measurement');
    }

    const data = await response.json();
    return data.plant;
  },

  // Delete plant profile (Admin only)
  async deletePlant(id) {
    const response = await fetch(`${BASE_URL}/plants/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Delete failed' }));
      throw new Error(err.error || 'Failed to delete plant');
    }

    return true;
  }
};
