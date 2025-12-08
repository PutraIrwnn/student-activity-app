import React, { useMemo } from 'react';
import { BookOpen, CalendarCheck, Coffee } from 'lucide-react';

const SCHEDULE = {
  'Monday': ['Analisa dan perancangan sistem informasi'],
  'Tuesday': ['Digital dan media baru', 'Arsitektur Enterprise'],
  'Wednesday': ['Design UI/UX'],
  'Thursday': ['Desain dan manajemen jaringan komputer'],
  'Friday': ['Statistik Probabilitas & Sistem basis data'],
  'Saturday': [],
  'Sunday': []
};

// Map JS day index (0=Sun) to keys
const DAY_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ClassSchedule = () => {
  const today = new Date();
  const dayName = DAY_MAP[today.getDay()];
  const classes = SCHEDULE[dayName] || [];

  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.85)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
        <CalendarCheck className="text-primary" size={20} />
        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Jadwal Kuliah</h2>
        <span style={{ 
          fontSize: '0.8rem', background: '#E0E7FF', color: '#4338CA', 
          padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', marginLeft: 'auto'
        }}>
          {dayName}
        </span>
      </div>

      {classes.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {classes.map((subject, idx) => (
            <li key={idx} style={{ 
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px', background: 'white', borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'transform 0.1s'
            }}>
              <div style={{ 
                background: 'var(--color-primary)', width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0 
              }} />
              <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', lineHeight: '1.4' }}>{subject}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#6B7280' }}>
          <Coffee size={32} style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
          <p style={{ margin: 0, fontSize: '0.95rem' }}>Tidak ada kelas hari ini.</p>
          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Enjoy your free time! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;
