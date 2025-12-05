require("dotenv").config();
const express = require("express");
const { getCurrentWeather, getForecast } = require("./src/weather");

const app = express();

// just a small homepage message so '/' doesn't give 404
app.get("/", (req, res) => {
  res.send("🌦 Weather API → try /weather/Delhi or /forecast/Mumbai");
});

// current weather route
app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;

  if (!city) return res.status(400).json({ error: "City name required" });

  try {
    const weatherInfo = await getCurrentWeather(city);
    res.json(weatherInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// forecast route with optional filter
app.get("/forecast/:city", async (req, res) => {
  const city = req.params.city;
  const filterTemp = req.query.maxTemp;

  try {
    const forecastInfo = await getForecast(city);
    let data = forecastInfo.data;

    // if user gives ?maxTemp=30 filter only those
    if (filterTemp) {
      data.list = data.list.filter(item => item.main.temp <= Number(filterTemp));
    }

    res.json({
      source: forecastInfo.source,
      filtered: !!filterTemp,
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// individual forecast view by index, like /forecast/Delhi/3
app.get("/forecast/:city/:index", async (req, res) => {
  const { city, index } = req.params;

  try {
    const forecastInfo = await getForecast(city);
    const chosenSlot = forecastInfo.data.list[Number(index)];

    if (!chosenSlot) {
      return res.status(404).json({ error: "Invalid forecast index" });
    }

    res.json({ source: forecastInfo.source, data: chosenSlot });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
