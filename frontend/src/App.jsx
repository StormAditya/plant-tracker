import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SpeciesConfirmModal from './components/SpeciesConfirmModal';
import PlantCard from './components/PlantCard';
import AddHeightModal from './components/AddHeightModal';
import PlantDetailModal from './components/PlantDetailModal';
import { plantApi } from './api/plantApi';
import { Leaf, Sparkles, Plus, Search, RefreshCw, AlertCircle, Camera } from 'lucide-react';

export default function App() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [identificationData, setIdentificationData] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [addHeightPlant, setAddHeightPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch plants on mount
  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await plantApi.getPlants();
      setPlants(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load plants from backend:', err);
      setError('Could not connect to backend server.');
      setIsLoading(false);
    }
  };

  // Callback when 480p image compression & AI identification finish
  const handleIdentificationComplete = (data) => {
    setIsUploadOpen(false);
    setIdentificationData(data);
  };

  // Callback when plant save completes in confirmation modal
  const handlePlantSaved = (savedPlant) => {
    setIdentificationData(null);
    setPlants((prev) => [savedPlant, ...prev.filter((p) => p.id !== savedPlant.id)]);
  };

  // Callback when new height log is saved
  const handleHeightLogSaved = (updatedPlant) => {
    setAddHeightPlant(null);
    setPlants((prev) => prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p)));
    if (selectedPlant?.id === updatedPlant.id) {
      setSelectedPlant(updatedPlant);
    }
  };

  // Callback for editing plant details
  const handleUpdatePlant = async (id, updateFields) => {
    try {
      const updated = await plantApi.updatePlant(id, updateFields);
      setPlants((prev) => prev.map((p) => (p.id === id ? updated : p)));
      if (selectedPlant?.id === id) {
        setSelectedPlant(updated);
      }
    } catch (err) {
      alert('Failed to update plant details');
    }
  };

  // Callback for deleting plant
  const handleDeletePlant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plant record?')) return;
    try {
      await plantApi.deletePlant(id);
      setPlants((prev) => prev.filter((p) => p.id !== id));
      if (selectedPlant?.id === id) setSelectedPlant(null);
    } catch (err) {
      alert('Failed to delete plant');
    }
  };

  // Filtered plants
  const filteredPlants = plants.filter((plant) => {
    const q = searchQuery.toLowerCase();
    return (
      plant.speciesName.toLowerCase().includes(q) ||
      (plant.scientificName && plant.scientificName.toLowerCase().includes(q)) ||
      (plant.notes && plant.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ minHeight: '100vh', padding: '0 1rem 3rem 1rem' }}>
      
      {/* Minimalist Header */}
      <Header />

      {/* Main Container - Full Width Mobile Friendly */}
      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Search & Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
              placeholder="Search plants or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', width: 'auto' }}>
            <button className="btn-secondary" onClick={loadPlants} title="Refresh plant list">
              <RefreshCw size={16} /> <span className="hide-mobile">Refresh</span>
            </button>
            <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
              <Plus size={18} /> Identify Plant
            </button>
          </div>

        </div>

        {/* Backend Connection Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            color: '#fca5a5',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={20} />
              <div>
                <strong>Backend REST API Offline</strong>
              </div>
            </div>
            <button className="btn-secondary" onClick={loadPlants} style={{ color: '#ffffff', minHeight: '36px', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Retry</button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <RefreshCw size={36} color="var(--emerald-primary)" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading plant database...</p>
          </div>
        ) : filteredPlants.length === 0 ? (
          /* Empty State */
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-light)', marginBottom: '1rem' }}>
              <Leaf size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Plants Saved Yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.25rem auto', fontSize: '0.85rem' }}>
              Upload or snap a plant photo to automatically identify species and track plant height over time!
            </p>
            <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
              <Sparkles size={18} /> Identify First Plant
            </button>
          </div>
        ) : (
          /* Responsive Plant Cards Grid (1 col mobile, 2 col tablet, 3-4 col desktop) */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onSelect={setSelectedPlant}
                onAddHeight={setAddHeightPlant}
                onDelete={handleDeletePlant}
              />
            ))}
          </div>
        )}

      </main>

      {/* Floating Mobile Bottom Action Navigation */}
      <div className="mobile-bottom-bar">
        <button
          onClick={loadPlants}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem' }}
        >
          <RefreshCw size={20} color="var(--emerald-light)" /> Refresh
        </button>

        {/* Floating Action Button (Camera Scan) */}
        <button
          className="mobile-fab-btn"
          onClick={() => setIsUploadOpen(true)}
          title="Scan Plant Species"
        >
          <Camera size={28} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => setIsUploadOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem' }}
        >
          <Plus size={20} color="var(--emerald-light)" /> Add Plant
        </button>
      </div>

      {/* Modals */}
      {isUploadOpen && (
        <ImageUploader
          onIdentificationComplete={handleIdentificationComplete}
          onClose={() => setIsUploadOpen(false)}
        />
      )}

      {identificationData && (
        <SpeciesConfirmModal
          data={identificationData}
          onSaveComplete={handlePlantSaved}
          onClose={() => setIdentificationData(null)}
        />
      )}

      {addHeightPlant && (
        <AddHeightModal
          plant={addHeightPlant}
          onSaveComplete={handleHeightLogSaved}
          onClose={() => setAddHeightPlant(null)}
        />
      )}

      {selectedPlant && (
        <PlantDetailModal
          plant={selectedPlant}
          onAddHeight={setAddHeightPlant}
          onUpdatePlant={handleUpdatePlant}
          onDelete={handleDeletePlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}

    </div>
  );
}
