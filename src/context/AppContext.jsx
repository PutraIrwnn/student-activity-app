import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { weatherService } from '../services/weatherService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('user_location');
    return saved ? JSON.parse(saved) : null;
  });
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
  // separate effect for initial location to allow manual override later
  useEffect(() => {
     // Check directly from storage to avoid stale state closure issues
     const savedLoc = localStorage.getItem('user_location');
     
     // Only run GPS if WAAAAY empty (no saved location)
     if (!savedLoc && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
             const gpsLoc = {
                lat: position.coords.latitude,
                long: position.coords.longitude,
                name: 'Lokasi Saya (GPS)'
             };
             setLocation(gpsLoc);
             // Optional: Save GPS as default? 
             // localStorage.setItem('user_location', JSON.stringify(gpsLoc)); 
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
    setLocation(newLoc);
    localStorage.setItem('user_location', JSON.stringify(newLoc));
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
