async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather_data");
    weatherDataSection.style.display = "block";
    const apiKey = "12eb907a580613c25b4e6ff4644f9938";


    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
    }

    async function getLonAndLat(){
        const countryCode = 49; //CountryCode von Deutschland (wie beim Telefon)
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;
        const response = await fetch(geocodeURL);

        if (!response.ok) {
            console.log("Error fetching geocode data", response.status);
            return;
        }
        
        const data = await response.json();

        if (data.length == 0){
            weatherDataSection.innerHTML = `
            <div>
                <h2>Die eingegebene Stadt konnte nicht gefunden werden!</h2>
                <p>Bitte versuche es erneut mit einem gültigen Städtenamen.</p>
            </div>
            `;
            return;
        }   
        else {
            return data[0];    
        }
    }

    async function getWeatherData(lon, lat) { //lon = longitude, lat = latitude also Breiten und Löngengrade
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(weatherURL);

        if (!response.ok) {
            console.log("Error fetching weather data", response.status);
            return;
        }

        const data = await response.json();
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" /> 
        <div>
            <h2>Wetter in ${data.name}</h2>
            <p><strong>Temperatur:</strong> ${Math.round(data.main.temp - 273.15)}°C</p> 
            <p><strong>Wetterbeschreibung:</strong> ${data.weather[0].description}</p>
        </div>
        `; // ${Math.round(data.main.temp - 273.15)} = //Umrechnen Temperatur in Klevin zu Grad Celsius
        }

    document.getElementById("search").value = ""; //Suchfeld nach der Suche resetten
    const geocodeData = await getLonAndLat(); //Koordinaten der eingegebenen Stadt erhalten
    getWeatherData(geocodeData.lon, geocodeData.lat); //Anhand der Koordinaten Wetterdaten abrufen
        
    
}
