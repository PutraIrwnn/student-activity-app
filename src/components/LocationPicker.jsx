import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { weatherService } from '../services/weatherService';
import { useApp } from '../context/AppContext';

const LocationPicker = ({ onClose }) => {
  const { updateLocation } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.length < 3) return;
    
    setLoading(true);
    const data = await weatherService.searchCity(query);
    setResults(data);
    setLoading(false);
  };

  const handleSelect = (city) => {
    updateLocation({
      lat: city.latitude,
      long: city.longitude,
      name: `${city.name}, ${city.country}`
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <div className="glass-card" style={{ width: '90%', maxWidth: '400px', background: 'white' }}>
        <h3 style={{ marginTop: 0 }}>Cari Lokasi</h3>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Nama kota..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '10px' }}
            autoFocus
          />
          <button type="submit" className="btn-primary btn-icon"><Search size={20} /></button>
        </form>

        {loading && <p>Mencari...</p>}

        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
          {results.map(city => (
            <li key={city.id}>
              <button 
                onClick={() => handleSelect(city)}
                style={{ 
                  width: '100%', textAlign: 'left', padding: '10px', 
                  background: 'transparent', borderBottom: '1px solid #eee',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: '#333', fontWeight: 'normal'
                }}
              >
                <MapPin size={16} />
                <div>
                  <strong>{city.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{city.admin1}, {city.country}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
        
        <button onClick={onClose} style={{ marginTop: '1rem', width: '100%', background: '#eee', color: '#333' }}>
          Batal
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;
