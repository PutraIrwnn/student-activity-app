import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Trash2, Plus, Calendar } from 'lucide-react';

const TodoList = () => {
  const { todos, toggleTodo, deleteTodo, addTodo } = useApp();
  const [newItem, setNewItem] = useState('');
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'weekly', 'monthly'

  const handleAdd = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      addTodo(newItem, activeTab); // Pass category
      setNewItem('');
    }
  };

  const filteredTodos = todos.filter(t => t.category === activeTab);

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'daily': return 'Hari Ini';
      case 'weekly': return 'Minggu Ini';
      case 'monthly': return 'Bulan Ini';
      default: return '';
    }
  };

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '1rem', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '12px' }}>
        {['daily', 'weekly', 'monthly'].map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             style={{ 
               flex: 1, 
               fontSize: '0.9rem', 
               padding: '8px 4px',
               borderRadius: '8px',
               background: activeTab === tab ? 'white' : 'transparent',
               boxShadow: activeTab === tab ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
               color: activeTab === tab ? 'var(--color-primary)' : '#666'
             }}
           >
             {getTabLabel(tab)}
           </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {filteredTodos.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <Calendar size={40} strokeWidth={1.5} />
            <p style={{ marginTop: '10px' }}>Kosong. Yuk isi agenda {getTabLabel(activeTab)}!</p>
          </div>
        )}
        
        {filteredTodos.map(todo => (
          <div key={todo.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.4)',
            transition: 'all 0.2s',
            textDecoration: todo.completed ? 'line-through' : 'none',
            opacity: todo.completed ? 0.6 : 1
          }}>
             <button 
                onClick={() => toggleTodo(todo.id)}
                style={{
                  padding: '4px', borderRadius: '50%', width: '24px', height: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: todo.completed ? '#10B981' : 'white',
                  border: todo.completed ? 'none' : '2px solid #ddd',
                  color: 'white',
                  flexShrink: 0
                }}
             >
               {todo.completed && <Check size={14} strokeWidth={4} />}
             </button>
             
             <div style={{ flex: 1, wordBreak: 'break-word' }}>
                {todo.text}
             </div>

             <button 
               onClick={() => deleteTodo(todo.id)}
               style={{ background: 'transparent', color: '#ff6b6b', padding: '6px' }}
             >
               <Trash2 size={16} />
             </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Tambah agenda ${getTabLabel(activeTab)}...`}
          style={{
            flex: 1, padding: '12px 15px', borderRadius: '12px',
            background: 'white', border: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
          }}
        />
        <button type="submit" className="btn-primary btn-icon">
          <Plus size={24} />
        </button>
      </form>
    </div>
  );
};

export default TodoList;
