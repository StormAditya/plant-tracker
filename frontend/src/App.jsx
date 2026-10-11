import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SpeciesConfirmModal from './components/SpeciesConfirmModal';
import PlantCard from './components/PlantCard';
import AddHeightModal from './components/AddHeightModal';
import PlantDetailModal from './components/PlantDetailModal';
import FilterModal from './components/FilterModal';
import CustomSortDropdown from './components/CustomSortDropdown';
import LoginModal from './components/LoginModal';
import { plantApi } from './api/plantApi';
import { Leaf, Sparkles, Plus, Search, RefreshCw, AlertCircle, Filter, X, Heart, Lock } from 'lucide-react';

export default function App() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Admin Authentication State (Single Admin: RSWF / RSWFPASS)
  const [auth, setAuth] = useState(() => plantApi.getAuth());
  const isAdmin = Boolean(auth?.token && auth?.role === 'admin');

  // Login Modal State: Always opens first if the user is logged out when visiting/refreshing the site
  const [isLoginOpen, setIsLoginOpen] = useState(() => {
    const current = plantApi.getAuth();
    // If not logged in as admin, show login dialog first
    return !Boolean(current?.token && current?.role === 'admin');
  });

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
    // Clear any previous persistent dismissal flag so login dialog always appears when logged out
    localStorage.removeItem('rswf_guest_dismissed');
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

  const handleLoginSuccess = () => {
    const currentAuth = plantApi.getAuth();
    setAuth(currentAuth);
    setIsLoginOpen(false);
  };

  const handleContinueAsGuest = () => {
    // Continue viewing plants as guest for the current session
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    plantApi.logout();
    setAuth(null);
    // When logged out, reopen the login modal first so user can choose to log in again or continue as guest
    setIsLoginOpen(true);
  };

  const handleOpenUpload = () => {
    if (!isAdmin) {
      setIsLoginOpen(true);
      return;
    }
    setIsUploadOpen(true);
  };

  const handleRequestAddHeight = (plant) => {
    if (!isAdmin) {
      setIsLoginOpen(true);
      return;
    }
    setAddHeightPlant(plant);
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
    loadPlants();
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
  };

  // Callback when plant details are updated
  const handleUpdatePlant = async (id, payload) => {
    if (!isAdmin) {
      setIsLoginOpen(true);
      return;
    }
    try {
      const updated = await plantApi.updatePlant(id, payload);
      const plantObj = updated?.plant || updated;
      if (plantObj && plantObj.id) {
        setPlants((prev) => prev.map((p) => (p.id === plantObj.id ? plantObj : p)));
        setSelectedPlant(plantObj);
      }
    } catch (err) {
      console.error('Failed to update plant:', err);
      alert('Could not update plant: Admin authorization required.');
    }
  };

  // Callback when plant is deleted
  const handleDeletePlant = async (id) => {
    if (!isAdmin) {
      setIsLoginOpen(true);
      return;
    }
    try {
      await plantApi.deletePlant(id);
      setPlants((prev) => prev.filter((p) => p.id !== id));
      if (selectedPlant?.id === id) {
        setSelectedPlant(null);
      }
    } catch (err) {
      console.error('Failed to delete plant:', err);
      alert('Could not delete plant: Admin authorization required.');
    }
  };

  // Filter & Sort plants
  const sortedAndFilteredPlants = plants
    .filter((plant) => {
      // 1. Text Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = plant.speciesName?.toLowerCase().includes(query);
        const matchesSci = plant.scientificName?.toLowerCase().includes(query);
        const matchesNotes = plant.notes?.toLowerCase().includes(query);
        if (!matchesName && !matchesSci && !matchesNotes) return false;
      }

      const plantHeight = parseFloat(plant.currentHeight);
      const plantDate = new Date(plant.updatedAt || plant.createdAt);

      // 2. Exact Height
      if (filters.filterExactHeight) {
        const targetExact = parseFloat(filters.filterExactHeight);
        if (Math.abs(plantHeight - targetExact) > 0.05) return false;
      }

      // 3. Min Height
      if (filters.filterMinHeight) {
        const minVal = parseFloat(filters.filterMinHeight);
        if (plantHeight <= minVal) return false;
      }

      // 4. Max Height
      if (filters.filterMaxHeight) {
        const maxVal = parseFloat(filters.filterMaxHeight);
        if (plantHeight >= maxVal) return false;
      }

      // 5. Exact Date
      if (filters.filterExactDate) {
        const filterDateStr = filters.filterExactDate;
        const plantDateStr = plantDate.toISOString().split('T')[0];
        if (plantDateStr !== filterDateStr) return false;
      }

      // 6. Before Date
      if (filters.filterBeforeDate) {
        const beforeDate = new Date(filters.filterBeforeDate);
        beforeDate.setHours(23, 59, 59, 999);
        if (plantDate.getTime() > beforeDate.getTime()) return false;
      }

      // 7. After Date
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 1rem' }}>
      
      {/* Sticky Compact Mobile Scroll Top Bar */}
      <div className={`sticky-mobile-scroll-bar ${isScrolled ? 'visible' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img 
            src="/rswf-logo.jpg" 
            alt="RSWF Logo" 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.98rem', color: '#0f172a' }}>
            <span style={{ color: '#e69500', marginRight: '0.25rem' }}>RSWF</span>
            <span style={{ color: '#047857' }}>ScanFlora</span>
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

      {/* Header with RSWF Logo and Auth Controls */}
      <Header
        isAdmin={isAdmin}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', flex: 1 }}>

        {/* Search, Filter & Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Text Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
              placeholder="Search plants by name, scientific name or notes..."
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
              style={{ position: 'relative', height: '46px', border: activeFilterCount > 0 ? '1px solid #10b981' : undefined }}
              title="Open Advanced Filters"
            >
              <Filter size={16} color={activeFilterCount > 0 ? '#047857' : 'currentColor'} /> Filters
              {activeFilterCount > 0 && (
                <span style={{
                  background: '#10b981',
                  color: '#ffffff',
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

            {/* Custom Sort Dropdown */}
            <CustomSortDropdown value={sortBy} onChange={setSortBy} />

          </div>

          {/* Desktop Action Buttons */}
          <div className="top-action-bar-buttons" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={loadPlants} title="Refresh plant data">
              <RefreshCw size={16} className={isLoading ? 'spin' : ''} /> Refresh
            </button>
            {isAdmin ? (
              <button className="btn-primary" onClick={handleOpenUpload}>
                <Plus size={18} /> Identify & Add Plant
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={() => setIsLoginOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #ffca28 0%, #ffb300 50%, #e69500 100%)',
                  color: '#0f172a',
                  fontWeight: 800
                }}
                title="Log in as admin to add new plants"
              >
                <Lock size={16} /> Admin Login to Add Plants
              </button>
            )}
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
              style={{ background: 'none', border: 'none', color: '#b45309', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Backend Connection Error Alert */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            color: '#dc2626',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={24} />
              <div>
                <strong>Backend REST API Offline:</strong>
                <p style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: '#991b1b' }}>{error}</p>
              </div>
            </div>
            <button className="btn-secondary" onClick={loadPlants} style={{ color: '#0f172a' }}>Retry Connection</button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <RefreshCw size={40} color="#047857" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading plant database...</p>
          </div>
        ) : sortedAndFilteredPlants.length === 0 ? (
          /* Empty State */
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#047857', marginBottom: '1.25rem', border: '1px solid #a7f3d0' }}>
              <Leaf size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#0f172a' }}>
              {activeFilterCount > 0 ? 'No Plants Match Filters' : 'No Plants Saved Yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
              {activeFilterCount > 0
                ? 'Try resetting date and height filters or adjusting search keywords.'
                : isAdmin
                ? 'Upload a plant photo to automatically identify species, confirm predictions, and start logging plant height over time!'
                : 'Browse plants in the collection. Log in as RSWF Admin to upload photos and add new plants.'}
            </p>
            {activeFilterCount > 0 ? (
              <button className="btn-secondary" onClick={handleResetFilters}>
                Clear Active Filters
              </button>
            ) : isAdmin ? (
              <button className="btn-primary" onClick={handleOpenUpload}>
                <Sparkles size={18} /> Identify First Plant
              </button>
            ) : (
              <button className="btn-primary" onClick={() => setIsLoginOpen(true)}>
                <Lock size={18} /> Admin Login to Add Plants
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
                isAdmin={isAdmin}
                onSelect={setSelectedPlant}
                onAddHeight={handleRequestAddHeight}
                onDelete={handleDeletePlant}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer pinned at bottom */}
      <footer style={{
        marginTop: 'auto',
        width: '100%',
        maxWidth: '1400px',
        margin: 'auto auto 0 auto',
        padding: '1.25rem 1rem 3.5rem 1rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        flexWrap: 'wrap'
      }}>
        <strong style={{ color: 'var(--text-main)' }}>RSWF ScanFlora</strong>
        <span>•</span>
        <span style={{ color: '#e69500', fontWeight: 600 }}>Reform Social Welfare Foundation</span>
        <span>•</span>
        <span>Made with</span>
        <Heart size={13} color="#ef4444" fill="#ef4444" style={{ display: 'inline', margin: '0 1px' }} />
        <span>by</span>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          Aditya, Akanksha, Kaushiki, Ashish and Atishay
        </span>
      </footer>

      {/* Mobile Floating Action Squircle Stack (Bottom Right) */}
      <div className="floating-action-stack">
        <button
          className="floating-btn secondary-fab"
          onClick={loadPlants}
          title="Refresh plant list"
        >
          <RefreshCw size={20} className={isLoading ? 'spin' : ''} />
        </button>

        {isAdmin ? (
          <button
            className="floating-btn primary-fab"
            onClick={handleOpenUpload}
            title="Identify & Add Plant"
          >
            <Plus size={24} />
            <span className="fab-text">Add Plant</span>
          </button>
        ) : (
          <button
            className="floating-btn primary-fab"
            onClick={() => setIsLoginOpen(true)}
            title="Admin Login to Add Plants"
          >
            <Lock size={20} />
            <span className="fab-text">Admin Login</span>
          </button>
        )}
      </div>

      {/* Modals */}
      {isLoginOpen && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={handleContinueAsGuest}
          onClose={() => setIsLoginOpen(false)}
          canDismiss={true}
        />
      )}

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
          onManualSaveComplete={handlePlantSaved}
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
          isAdmin={isAdmin}
          onAddHeight={handleRequestAddHeight}
          onUpdatePlant={handleUpdatePlant}
          onDelete={handleDeletePlant}
          onClose={() => setSelectedPlant(null)}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}

    </div>
  );
}
