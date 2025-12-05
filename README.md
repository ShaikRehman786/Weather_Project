# Weather API Integration Project

## Overview

This project is built as part of the Global Trend API Integration Internship Assignment. It uses the OpenWeather REST API to collect and display weather information. The application demonstrates API integration, caching, filtering, and error handling in a clean and structured manner.

## Features

* Fetch current weather for any location.
* Fetch 5-day forecast (in 3-hour intervals).
* Cache responses locally in a JSON file to reduce repeated network calls.
* Filter forecast data by maximum temperature using a query parameter.
  Example: `/forecast/London?maxTemp=25`
* View a single forecast record using index.
  Example: `/forecast/London/2`
* Includes proper error handling for invalid input, missing data, and network problems.

## Tech Stack Used

* Node.js
* Express.js
* Axios
* dotenv
* Local JSON storage (cache)

## Setup and Installation

### 1. Clone the Repository

```
git clone <repository_url>
cd weather-project
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root folder and add your OpenWeather API key:

```
WEATHER_API_KEY=YOUR_KEY_HERE
```

### 4. Start the Server

```
node app.js
```

or using nodemon:

```
nodemon app.js
```
<img width="1920" height="960" alt="image" src="https://github.com/user-attachments/assets/130c0f85-9c1e-4f11-abcb-822260502d0f" />

## API Endpoints

### Current Weather

```
GET /weather/:city
```
<img width="1920" height="961" alt="image" src="https://github.com/user-attachments/assets/0a05f620-ce67-4eb2-bce2-0fe6e5803606" />

Returns real-time weather data for the given city.

### 5-Day Forecast

```
GET /forecast/:city
```
<img width="1920" height="960" alt="image" src="https://github.com/user-attachments/assets/e17ba6a2-487a-455c-93b6-8849e9f764a4" />

Returns a detailed 5-day/3-hour forecast.

### Filter Forecast by Temperature

```
GET /forecast/:city?maxTemp=value
```
<img width="1920" height="960" alt="image" src="https://github.com/user-attachments/assets/c3097d9a-d9b2-4949-8417-6ec57e9b2c07" />

Shows forecast items with temperature lower than or equal to the given value.

### Detailed Forecast by Index

```
GET /forecast/:city/:index
```
<img width="1920" height="965" alt="image" src="https://github.com/user-attachments/assets/64876677-994c-44b7-b2d5-40476df201db" />

Returns a specific forecast entry from the list.

## Caching Information

* All fetched weather and forecast data are saved in `cache.json`.
* If a request is repeated for the same city, the response is returned from cache instead of calling the external API.
* The cache also stores a timestamp indicating when it was last updated.

## Error Handling

The application handles:

* Invalid or missing city names
* Network errors
* Timeout errors
* Missing API Key
* Corrupted or missing cache files
