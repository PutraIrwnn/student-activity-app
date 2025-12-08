import React, { useState, useEffect } from 'react';
import { Calendar, Clock as ClockIcon } from 'lucide-react';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="glass-card" style={{ 
      padding: '0.8rem 1.5rem', display: 'flex', flexDirection: 'column', 
      alignItems: 'flex-start', justifyContent: 'center', minWidth: '180px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
        <ClockIcon size={18} />
        <span>{formatTime(time)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: 0.8, marginTop: '4px' }}>
        <Calendar size={14} />
        <span>{formatDate(time)}</span>
      </div>
    </div>
  );
};

export default ClockWidget;
