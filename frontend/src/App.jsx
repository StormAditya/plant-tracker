import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SpeciesConfirmModal from './components/SpeciesConfirmModal';
import PlantCard from './components/PlantCard';
import AddHeightModal from './components/AddHeightModal';
import PlantDetailModal from './components/PlantDetailModal';
import ApiMobileDocsModal from './components/ApiMobileDocsModal';
import { plantApi } from './api/plantApi';
import { Leaf, Sparkles, Plus, Search, Filter, Database, Zap, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'api-docs'
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
      setError('Could not connect to backend server. Please make sure backend is running on port 5000.');
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

  const totalLogs = plants.reduce((acc, p) => acc + (p.heightHistory?.length || 1), 0);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* Navbar Header */}
      <Header
        onOpenUpload={() => setIsUploadOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        plantCount={plants.length}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Banner Hero / Stats Bar */}
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>
              My Plant Collection & <span className="text-gradient">Growth Tracker</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Scan plant species, confirm predictions, and track height measurements over time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>TOTAL PLANTS</span>
              <strong style={{ fontSize: '1.4rem', color: 'var(--emerald-light)' }}>{plants.length}</strong>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>HEIGHT LOGS</span>
              <strong style={{ fontSize: '1.4rem', color: '#60a5fa' }}>{totalLogs}</strong>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.25)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', textTransform: 'uppercase', display: 'block' }}>STORAGE SAVED</span>
              <strong style={{ fontSize: '1.4rem', color: 'var(--emerald-light)' }}>~94% (480p)</strong>
            </div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
              placeholder="Search by species, scientific name or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={loadPlants} title="Refresh plant data from backend">
              <RefreshCw size={16} /> Refresh
            </button>
            <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
              <Plus size={18} /> Identify New Plant
            </button>
          </div>

        </div>

        {/* Backend Connection Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            color: '#fca5a5',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={24} />
              <div>
                <strong>Backend REST API Offline or Unreachable:</strong>
                <p style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: '#fee2e2' }}>{error}</p>
              </div>
            </div>
            <button className="btn-secondary" onClick={loadPlants} style={{ color: '#ffffff' }}>Retry Connection</button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <RefreshCw size={40} color="var(--emerald-primary)" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading plant database...</p>
          </div>
        ) : filteredPlants.length === 0 ? (
          /* Empty State */
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-light)', marginBottom: '1.25rem' }}>
              <Leaf size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Plants Saved Yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
              Upload a plant photo to automatically identify species, confirm predictions, and start logging plant height over time!
            </p>
            <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
              <Sparkles size={18} /> Identify First Plant
            </button>
          </div>
        ) : (
          /* Plant Cards Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
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

      {activeTab === 'api-docs' && (
        <ApiMobileDocsModal onClose={() => setActiveTab('gallery')} />
      )}

    </div>
  );
}
