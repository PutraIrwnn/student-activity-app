// Open-Meteo API
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// WMO Weather interpretation codes (Simplified)
const WEATHER_CODES = {
  0: 'Cerah ☀️',
  1: 'Cerah Berawan 🌤️',
  2: 'Berawan ☁️',
  3: 'Mendung ☁️',
  45: 'Berkabut 🌫️',
  48: 'Kabut Rime 🌫️',
  51: 'Gerimis Ringan 🌧️',
  53: 'Gerimis Sedang 🌧️',
  55: 'Gerimis Lebat 🌧️',
  61: 'Hujan Ringan ☔',
  63: 'Hujan Sedang ☔',
  65: 'Hujan Lebat ⛈️',
  71: 'Salju Ringan ❄️',
  73: 'Salju Sedang ❄️',
  75: 'Salju Lebat ❄️',
  80: 'Hujan Lokal Ringan 🌦️',
  81: 'Hujan Lokal Sedang 🌦️',
  82: 'Hujan Lokal Lebat ⛈️',
  95: 'Badai Petir ⚡',
  96: 'Badai Petir + Hujan Es ⛈️',
  99: 'Badai Petir + Hujan Es Lebat ⛈️'
};

export const weatherService = {
  getWeatherAndUV: async (lat, long) => {
    if (!lat || !long) return null;
    try {
      const response = await fetch(
        `${FORECAST_URL}?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code,is_day&daily=uv_index_max&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Weather fetch failed');
      const data = await response.json();
      
      const code = data.current.weather_code;
      const description = WEATHER_CODES[code] || 'Tidak diketahui';

      return {
        temperature: data.current.temperature_2m,
        weatherCode: code,
        isDay: data.current.is_day, // 1 = Day, 0 = Night
        description,
        uvIndexMax: data.daily.uv_index_max[0] || 0,
      };
    } catch (error) {
      console.error('Weather Service Error:', error);
      throw error;
    }
  },

  searchCity: async (query) => {
    if (!query || query.length < 3) return [];
    try {
      const response = await fetch(`${GEOCODING_URL}?name=${query}&count=5&language=id&format=json`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Geocoding Error:', error);
      return [];
    }
  }
};
