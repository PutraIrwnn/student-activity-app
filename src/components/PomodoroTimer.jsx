import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  
  const timerRef = useRef(null);

  // Request Notification Permission on mount
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsActive(false);
      handleTimerComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    const msg = mode === 'focus' ? "Fokus selesai! Waktunya istirahat ☕" : "Istirahat selesai! Kembali belajar 📚";
    if (Notification.permission === 'granted') {
      new Notification("Pomodoro Timer", { body: msg });
    } else {
      alert(msg);
    }
    // Auto switch mode
    if (mode === 'focus') {
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const setCustomTime = (minutes) => {
    setIsActive(false);
    setMode('focus'); // assume custom is usually for focus
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCustomInput = (e) => {
      const val = parseInt(e.target.value);
      if (!isNaN(val) && val > 0) {
          setCustomTime(val);
      }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.2rem' }}>
       <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.8rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={18} className="text-accent" /> Pomodoro Focus
      </h2>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          fontSize: '3rem', fontWeight: '800', fontVariantNumeric: 'tabular-nums',
          color: mode === 'focus' ? 'var(--color-text)' : 'var(--color-secondary)',
          lineHeight: 1, marginBottom: '0.2rem'
        }}>
          {formatTime(timeLeft)}
        </div>
        <p style={{ 
          fontSize: '0.9rem', textAlign: 'center', margin: '0 0 1rem 0', opacity: 0.7, fontWeight: '600',
          color: isActive ? 'var(--color-primary)' : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          {mode === 'focus' ? 'Doing Task' : 'Break Time'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={toggleTimer} className="btn-primary" style={{ width: '50px', height: '50px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isActive ? <Pause fill="white" size={20} /> : <Play fill="white" size={20} style={{ marginLeft: '4px' }} />}
          </button>
          <button onClick={resetTimer} style={{ width: '50px', height: '50px', borderRadius: '50%', padding: 0, background: 'rgba(255,255,255,0.5)', border: '1px solid white', color: '#4B5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RotateCcw size={20} />
          </button>
        </div>
        
        {/* Compact Quick Presets */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[25, 45, 60].map(t => (
            <button 
              key={t}
              onClick={() => setCustomTime(t)}
              style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(255,255,255,0.5)', border: '1px solid white', borderRadius: '8px' }}
            >
              {t}m
            </button>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '8px', border: '1px solid white' }}>
             <input 
                type="number" 
                placeholder="mnt"
                onChange={handleCustomInput}
                style={{ width: '30px', background: 'transparent', border: 'none', fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
