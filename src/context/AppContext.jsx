import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { weatherService } from '../services/weatherService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [showDailyPrompt, setShowDailyPrompt] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadedTodos = storageService.getTodos();
    setTodos(loadedTodos);
    
    // Check for daily prompt
    const lastLogin = storageService.getLastLoginDate();
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      setShowDailyPrompt(true);
      storageService.setLastLoginDate(today);
    }
  }, []);
  
  // separate effect for initial location to allow manual override later
  useEffect(() => {
     // Check if user has saved manual location previously (could be added to storageService later)
     // For now, default to GPS if no manual set
     if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Only set if we haven't set it yet (or add a 'useGPS' flag)
          if (!location) { 
             setLocation({
                lat: position.coords.latitude,
                long: position.coords.longitude,
                name: 'Lokasi Saya'
             });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []); // Run once

  // Fetch Weather when location updates
  useEffect(() => {
    const fetchWeather = async () => {
      if (location) {
        setLoadingWeather(true);
        try {
          const data = await weatherService.getWeatherAndUV(location.lat, location.long);
          setWeather(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingWeather(false);
        }
      }
    };
    fetchWeather();
  }, [location]);

  const updateLocation = (newLoc) => {
    setLocation(newLoc); // { lat, long, name }
  };

  // Sync Todos to storage
  useEffect(() => {
    storageService.saveTodos(todos);
  }, [todos]);

  const addTodo = (text, category = 'daily', priority = 'normal') => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      category, // 'daily', 'weekly', 'monthly'
      priority, // 'normal', 'high', '#1', '#2', '#3'
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };
  
  // Helper to get Top 3
  const topPriorities = todos.filter(t => ['#1', '#2', '#3'].includes(t.priority));

  const closeDailyPrompt = () => setShowDailyPrompt(false);

  return (
    <AppContext.Provider value={{
      todos,
      addTodo,
      toggleTodo,
      deleteTodo,
      weather,
      loadingWeather,
      location,
      updateLocation,
      showDailyPrompt,
      closeDailyPrompt,
      topPriorities
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
