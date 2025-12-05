require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const CACHE_FILE = "./cache.json";

// read cached data if available, otherwise return empty structure
function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch (err) {
    // if cache file is broken or missing, return a fresh object
    return { weather: {}, forecast: {}, lastUpdated: null };
  }
}

// store updated data back into cache.json
function writeCache(data) {
  data.lastUpdated = new Date().toISOString();  // track last cache time
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}

// fetch current weather for a city, use cached data if it exists
async function getCurrentWeather(city) {
  const cacheData = readCache();

  if (cacheData.weather[city]) {
    // return cached data if already stored
    return { source: "cache", data: cacheData.weather[city] };
  }

  try {
    const apiResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: "metric"
      },
      timeout: 5000
    });

    // save fresh response to cache
    cacheData.weather[city] = apiResponse.data;
    writeCache(cacheData);

    return { source: "api", data: apiResponse.data };
  } catch (err) {
    console.log("Weather Fetch Issue:", err.response?.data || err.message);
    throw new Error("Could not load current weather. Try a valid city.");
  }
}

// fetch 5 day forecast for a city, use cached version if available
async function getForecast(city) {
  const cacheData = readCache();

  if (cacheData.forecast[city]) {
    return { source: "cache", data: cacheData.forecast[city] };
  }

  try {
    const apiResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: "metric"
      },
      timeout: 5000
    });

    cacheData.forecast[city] = apiResponse.data;
    writeCache(cacheData);

    return { source: "api", data: apiResponse.data };
  } catch (err) {
    console.log("Forecast Fetch Issue:", err.response?.data || err.message);
    throw new Error("Could not load forecast. Try again.");
  }
}

module.exports = { getCurrentWeather, getForecast };
