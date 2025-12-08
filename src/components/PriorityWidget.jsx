import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Target, X } from 'lucide-react';

const PriorityWidget = () => {
  const { topPriorities, addTodo,  deleteTodo } = useApp();

  const getPriorityItem = (rank) => topPriorities.find(t => t.priority === rank);

  const handleSetPriority = (rank, text) => {
    if (text.trim()) {
      addTodo(text, 'daily', rank);
    }
  };

  const handleKeyDown = (e, rank) => {
    if (e.key === 'Enter') {
      handleSetPriority(rank, e.target.value);
      e.target.value = '';
    }
  };

  const PrioritySlot = ({ rank, color }) => {
    const item = getPriorityItem(rank);

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ 
          fontSize: '0.8rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.5)', 
          textTransform: 'uppercase', letterSpacing: '1px' 
        }}>
          Priority {rank}
        </div>
        
        <div style={{ 
          position: 'relative',
          background: item ? color : 'rgba(255,255,255,0.5)', 
          borderRadius: '12px', padding: '12px',
          minHeight: '60px', display: 'flex', alignItems: 'center',
          border: '2px dashed rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }}>
          {item ? (
            <>
              <span style={{ fontWeight: '600', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {item.text}
              </span>
              <button 
                onClick={() => deleteTodo(item.id)}
                style={{ 
                  position: 'absolute', top: -5, right: -5,
                  background: 'white', color: '#ff6b6b', borderRadius: '50%',
                  width: '20px', height: '20px', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              >
                <X size={12} strokeWidth={3} />
              </button>
            </>
          ) : (
            <input 
              type="text" 
              placeholder="Type & Enter..." 
              onKeyDown={(e) => handleKeyDown(e, rank)}
              style={{ 
                width: '100%', background: 'transparent', border: 'none', 
                textAlign: 'center', fontSize: '0.9rem', color: '#555' 
              }} 
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
       <h2 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
        <Trophy size={20} className="text-primary" fill="#FFD700" color="#B7791F" /> Top Priorities Today
      </h2>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <PrioritySlot rank="#1" color="linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)" />
        <PrioritySlot rank="#2" color="linear-gradient(135deg, #48DBFB 0%, #0ABDE3 100%)" />
        <PrioritySlot rank="#3" color="linear-gradient(135deg, #1DD1A1 0%, #10AC84 100%)" />
      </div>
    </div>
  );
};

export default PriorityWidget;
