import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles } from 'lucide-react';

const DailyPromptModal = () => {
  const { showDailyPrompt, addTodo, closeDailyPrompt } = useApp();
  const [inputValue, setInputValue] = useState('');

  if (!showDailyPrompt) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue, 'high'); // High priority for the "One Big Thing"
      setInputValue('');
    }
    closeDailyPrompt();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(3px)'
    }}>
      <div className="card" style={{ width: '90%', maxWidth: '400px', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--color-primary)' }}>
            <Sparkles size={20} /> Daily Focus
          </h2>
          <button onClick={closeDailyPrompt} style={{ background: 'transparent', color: '#999', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>
        
        <p style={{ marginBottom: '1.5rem' }}>
          Halo! Apa <strong>satu hal penting</strong> yang harus kamu selesaikan hari ini?
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ketik target utamamu..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '2px solid #E5E7EB', marginBottom: '1rem',
              fontSize: '1rem', boxSizing: 'border-box'
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ flex: 1 }}>Set Target!</button>
            <button type="button" onClick={closeDailyPrompt} style={{ background: '#F3F4F6', color: '#4B5563', flex: 1 }}>
              Skip
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DailyPromptModal;
