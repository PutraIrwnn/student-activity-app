import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LayoutDashboard, Sun, CloudSun, MapPin, CloudRain, Wind } from 'lucide-react';
import DailyPromptModal from './components/DailyPromptModal';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import PriorityWidget from './components/PriorityWidget';
import ClassSchedule from './components/ClassSchedule';
import LocationPicker from './components/LocationPicker';
import ClockWidget from './components/ClockWidget';

const Header = ({ onOpenLocation }) => {
  const { weather, location } = useApp();
  
  return (
    <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.8)', padding: '0.8rem', borderRadius: '16px', 
          color: 'var(--color-primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          <LayoutDashboard size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            Student Dashboard
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 600 }}>
            Make today amazing! ✨
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ClockWidget />

        {weather && (
          <button 
            onClick={onOpenLocation}
            className="glass-card" 
            style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '50px', cursor: 'pointer', border: '2px solid transparent' }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1 }}>{weather.temperature}°</div>
              <div style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <MapPin size={10} /> {location ? location.name.split(',')[0] : 'Lokasi'}
              </div>
            </div>
            <div style={{ fontSize: '2rem' }}>
                {weather.weatherCode > 50 ? '🌧️' : '🌤️'}
            </div>
          </button>
        )}
      </div>
    </header>
  );
}

const Dashboard = () => {
  const { weather, loadingWeather } = useApp();
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Time-Aware UV Logic
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 15; // After 3 PM usually UV drops significantly
  const isUVRisky = weather && weather.uvIndexMax >= 5 && !isEvening;

  return (
    <div>
      <Header onOpenLocation={() => setShowLocationPicker(true)} />
      <DailyPromptModal />
      {showLocationPicker && <LocationPicker onClose={() => setShowLocationPicker(false)} />}
      
      {/* Top Priority Section */}
      <PriorityWidget />

      {/* Main Layout: Two Independent Columns to prevent vertical gaps */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '2rem', 
        alignItems: 'flex-start' 
      }}>
        
        {/* LEFT COLUMN: Schedule & Todo */}
        <div style={{ 
          flex: '1 1 350px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem' 
        }}>
          <ClassSchedule />
          <TodoList />
        </div>

        {/* RIGHT COLUMN: Weather & Pomodoro */}
        <div style={{ 
          flex: '1 1 350px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem' 
        }}>
          
          {/* Weather Card */}
          <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {weather && weather.weatherCode > 50 ? <CloudRain color="#3B82F6" /> : <Sun color="#F59E0B" />}
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Weather Insight</h2>
              </div>
              
              {loadingWeather ? (
                <p>Detecting weather...</p>
              ) : weather ? (
                 <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {weather.description}
                    </div>
                    <p style={{ margin: '0 0 1rem 0' }}>
                      Indeks UV Maksimal: <strong>{weather.uvIndexMax}</strong>
                    </p>
                    
                    {isUVRisky ? (
                      <div style={{ 
                        padding: '1rem', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#B91C1C', 
                        borderRadius: '12px',
                        fontWeight: '600',
                        display: 'flex', gap: '8px', alignItems: 'center'
                      }}>
                        ⚠️ Warning UV Tinggi!<br/>Wajib pakai Sunscreen.
                      </div>
                    ) : (
                       <div style={{ 
                        padding: '1rem', 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: '#047857', 
                        borderRadius: '12px',
                        fontWeight: '600',
                        display: 'flex', gap: '8px', alignItems: 'center'
                      }}>
                        {isEvening ? '🌙 Matahari rendah.' : '✅ UV Aman.'} <br/>
                        {isEvening ? 'No sunscreen needed.' : 'Have fun!'}
                      </div>
                    )}
                 </div>
              ) : (
                 <p style={{ opacity: 0.6, fontStyle: 'italic' }}>
                   Aktifkan lokasi atau klik widget cuaca di atas untuk memilih kota manual.
                 </p>
              )}
          </div>

          <PomodoroTimer />
        </div>

      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;
