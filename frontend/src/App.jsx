import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SpeciesConfirmModal from './components/SpeciesConfirmModal';
import PlantCard from './components/PlantCard';
import AddHeightModal from './components/AddHeightModal';
import PlantDetailModal from './components/PlantDetailModal';
import FilterModal from './components/FilterModal';
import CustomSortDropdown from './components/CustomSortDropdown';
import { plantApi } from './api/plantApi';
import { Leaf, Sparkles, Plus, Search, RefreshCw, AlertCircle, Filter, X } from 'lucide-react';

export default function App() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Advanced Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    filterExactHeight: '',
    filterMinHeight: '',
    filterMaxHeight: '',
    filterExactDate: '',
    filterBeforeDate: '',
    filterAfterDate: ''
  });

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [identificationData, setIdentificationData] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [addHeightPlant, setAddHeightPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch plants on mount
  useEffect(() => {
    loadPlants();

    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleUpdateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      filterExactHeight: '',
      filterMinHeight: '',
      filterMaxHeight: '',
      filterExactDate: '',
      filterBeforeDate: '',
      filterAfterDate: ''
    });
  };

  // Count active committed filters
  const activeFilterCount = [
    filters.filterExactHeight,
    filters.filterMinHeight,
    filters.filterMaxHeight,
    filters.filterExactDate,
    filters.filterBeforeDate,
    filters.filterAfterDate
  ].filter(Boolean).length;

  // Callback when 480p image compression & AI identification finish
  const handleIdentificationComplete = (data) => {
    setIsUploadOpen(false);
    setIdentificationData(data);
  };

  // Callback when plant save completes in confirmation modal
  const handlePlantSaved = (savedPlant) => {
    setIdentificationData(null);
    const plantObj = savedPlant?.plant || savedPlant;
    if (plantObj && plantObj.id) {
      setPlants((prev) => [plantObj, ...prev.filter((p) => p.id !== plantObj.id)]);
    }
    loadPlants(); // Background sync to guarantee full details instantly
  };

  // Callback when new height log is saved
  const handleHeightLogSaved = (updatedPlant) => {
    setAddHeightPlant(null);
    const plantObj = updatedPlant?.plant || updatedPlant;
    if (plantObj && plantObj.id) {
      setPlants((prev) => prev.map((p) => (p.id === plantObj.id ? plantObj : p)));
      if (selectedPlant?.id === plantObj.id) {
        setSelectedPlant(plantObj);
      }
    }
    loadPlants(); // Background sync
  };

  // Callback for editing plant details
  const handleUpdatePlant = async (id, updateFields) => {
    try {
      const updated = await plantApi.updatePlant(id, updateFields);
      const plantObj = updated?.plant || updated;
      if (plantObj && plantObj.id) {
        setPlants((prev) => prev.map((p) => (p.id === id ? plantObj : p)));
        if (selectedPlant?.id === id) {
          setSelectedPlant(plantObj);
        }
      }
      loadPlants();
    } catch (err) {
      alert('Failed to update plant details');
    }
  };

  // Callback for deleting plant (called after custom ConfirmDialogModal confirmation)
  const handleDeletePlant = async (id) => {
    try {
      await plantApi.deletePlant(id);
      setPlants((prev) => prev.filter((p) => p.id !== id));
      if (selectedPlant?.id === id) setSelectedPlant(null);
    } catch (err) {
      alert('Failed to delete plant');
    }
  };

  // Filtered & Sorted plants
  const sortedAndFilteredPlants = [...plants]
    .filter((plant) => {
      // 1. Text Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesText =
          (plant.speciesName && plant.speciesName.toLowerCase().includes(q)) ||
          (plant.scientificName && plant.scientificName.toLowerCase().includes(q)) ||
          (plant.notes && plant.notes.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      const currentH = parseFloat(plant.currentHeight) || 0;
      const plantDate = new Date(plant.updatedAt || plant.createdAt || Date.now());
      plantDate.setHours(0, 0, 0, 0);

      // 2. Exact Height
      if (filters.filterExactHeight !== '' && !isNaN(parseFloat(filters.filterExactHeight))) {
        if (Math.abs(currentH - parseFloat(filters.filterExactHeight)) > 0.1) return false;
      }

      // 3. Min Height (Larger than)
      if (filters.filterMinHeight !== '' && !isNaN(parseFloat(filters.filterMinHeight))) {
        if (currentH < parseFloat(filters.filterMinHeight)) return false;
      }

      // 4. Max Height (Smaller than)
      if (filters.filterMaxHeight !== '' && !isNaN(parseFloat(filters.filterMaxHeight))) {
        if (currentH > parseFloat(filters.filterMaxHeight)) return false;
      }

      // 5. Exact Date
      if (filters.filterExactDate) {
        const targetDate = new Date(filters.filterExactDate);
        targetDate.setHours(0, 0, 0, 0);
        if (plantDate.getTime() !== targetDate.getTime()) return false;
      }

      // 6. Before Date (To)
      if (filters.filterBeforeDate) {
        const beforeDate = new Date(filters.filterBeforeDate);
        beforeDate.setHours(23, 59, 59, 999);
        if (plantDate.getTime() > beforeDate.getTime()) return false;
      }

      // 7. After Date (From)
      if (filters.filterAfterDate) {
        const afterDate = new Date(filters.filterAfterDate);
        afterDate.setHours(0, 0, 0, 0);
        if (plantDate.getTime() < afterDate.getTime()) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.updatedAt || a.createdAt || 0) - new Date(b.updatedAt || b.createdAt || 0);
      if (sortBy === 'height-high') return (b.currentHeight || 0) - (a.currentHeight || 0);
      if (sortBy === 'height-low') return (a.currentHeight || 0) - (b.currentHeight || 0);
      if (sortBy === 'name') return (a.speciesName || '').localeCompare(b.speciesName || '');
      return 0;
    });

  return (
    <div style={{ minHeight: '100vh', padding: '0 1rem 3rem 1rem' }}>
      
      {/* Sticky Compact Mobile Scroll Top Bar */}
      <div className={`sticky-mobile-scroll-bar ${isScrolled ? 'visible' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
          }}>
            <Leaf size={18} color="#04120a" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
            Flora<span className="text-gradient">Scan</span>
          </span>
        </div>

        <div style={{ position: 'relative', flex: 1, maxWidth: '210px', marginLeft: '0.5rem' }}>
          <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.1rem', paddingRight: '0.6rem', height: '36px', minHeight: '36px', fontSize: '0.85rem', borderRadius: '10px', width: '100%' }}
            placeholder="Search plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Minimalist Header */}
      <Header />

      {/* Main Container */}
      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Search, Filter & Sort Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Text Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters & Sort Controls Wrapper Row */}
          <div className="search-filter-controls-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            
            {/* Advanced Filter Button */}
            <button
              className="btn-secondary"
              onClick={() => setIsFilterOpen(true)}
              style={{ position: 'relative', height: '46px', border: activeFilterCount > 0 ? '1px solid var(--emerald-primary)' : undefined }}
              title="Open Advanced Filters"
            >
              <Filter size={16} color={activeFilterCount > 0 ? 'var(--emerald-light)' : 'currentColor'} /> Filters
              {activeFilterCount > 0 && (
                <span style={{
                  background: 'var(--emerald-primary)',
                  color: '#04120a',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '0.2rem'
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Custom Glassmorphic Sort Dropdown */}
            <CustomSortDropdown value={sortBy} onChange={setSortBy} />

          </div>

          {/* Desktop Action Buttons */}
          <div className="top-action-bar-buttons" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={loadPlants} title="Refresh plant data">
              <RefreshCw size={16} className={isLoading ? 'spin' : ''} /> Refresh
            </button>
            <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
              <Plus size={18} /> Identify & Add Plant
            </button>
          </div>

        </div>

        {/* Active Filters Summary Chips */}
        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Filters:</span>
            
            {filters.filterExactHeight && (
              <span className="badge badge-emerald">
                Height: {filters.filterExactHeight} cm
                <X size={12} style={{ cursor: 'pointer', marginLeft: '0.2rem' }} onClick={() => handleUpdateFilter('filterExactHeight', '')} />
              </span>
            )}
            {filters.filterMinHeight && (
              <span className="badge badge-emerald">
                Height &gt; {filters.filterMinHeight} cm
                <X size={12} style={{ cursor: 'pointer', marginLeft: '0.2rem' }} onClick={() => handleUpdateFilter('filterMinHeight', '')} />
              </span>
            )}
            {filters.filterMaxHeight && (
              <span className="badge badge-emerald">
                Height &lt; {filters.filterMaxHeight} cm
                <X size={12} style={{ cursor: 'pointer', marginLeft: '0.2rem' }} onClick={() => handleUpdateFilter('filterMaxHeight', '')} />
              </span>
            )}
            {filters.filterExactDate && (
              <span className="badge badge-emerald">
                Date: {filters.filterExactDate}
                <X size={12} style={{ cursor: 'pointer', marginLeft: '0.2rem' }} onClick={() => handleUpdateFilter('filterExactDate', '')} />
              </span>
            )}
            {filters.filterAfterDate && (
              <span className="badge badge-emerald">
                After: {filters.filterAfterDate}
                <X size={12} style={{ cursor: 'pointer', marginLeft: '0.2rem' }} onClick={() => handleUpdateFilter('filterAfterDate', '')} />
              </span>
            )}
            {filters.filterBeforeDate && (
              <span className="badge badge-emerald">
                Before: {filters.filterBeforeDate}
                <X size={12} style={{ cursor: 'pointer', marginLeft: '0.2rem' }} onClick={() => handleUpdateFilter('filterBeforeDate', '')} />
              </span>
            )}

            <button
              onClick={handleResetFilters}
              style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear All
            </button>
          </div>
        )}

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
                <strong>Backend REST API Offline:</strong>
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
        ) : sortedAndFilteredPlants.length === 0 ? (
          /* Empty State */
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-light)', marginBottom: '1.25rem' }}>
              <Leaf size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              {activeFilterCount > 0 ? 'No Plants Match Filters' : 'No Plants Saved Yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
              {activeFilterCount > 0
                ? 'Try resetting date and height filters or adjusting search keywords.'
                : 'Upload a plant photo to automatically identify species, confirm predictions, and start logging plant height over time!'}
            </p>
            {activeFilterCount > 0 ? (
              <button className="btn-secondary" onClick={handleResetFilters}>
                Clear Active Filters
              </button>
            ) : (
              <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
                <Sparkles size={18} /> Identify First Plant
              </button>
            )}
          </div>
        ) : (
          /* Plant Cards Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {sortedAndFilteredPlants.map((plant) => (
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

      {/* Mobile Floating Action Squircle Stack (Bottom Right) */}
      <div className="floating-action-stack">
        <button
          className="floating-btn secondary-fab"
          onClick={loadPlants}
          title="Refresh plant list"
        >
          <RefreshCw size={20} className={isLoading ? 'spin' : ''} />
        </button>

        <button
          className="floating-btn primary-fab"
          onClick={() => setIsUploadOpen(true)}
          title="Identify & Add Plant"
        >
          <Plus size={24} />
          <span className="fab-text">Add Plant</span>
        </button>
      </div>

      {/* Modals */}
      {isFilterOpen && (
        <FilterModal
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

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
