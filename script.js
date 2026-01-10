async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather_data");
    weatherDataSection.style.display = "block";
    const apiKey = "12eb907a580613c25b4e6ff4644f9938";


    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Leere Eingabe!</h2>
            <p>Bitte versuche es erneut mit einem gültigen <u>Städtenamen</u>.</p>
        </div>
        `;
        return;
    }

    async function getLonAndLat(){
        const countryCode = "DE"; // Countrycode für Deutschland (primärer Filter)
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)},${countryCode}&limit=5&appid=${apiKey}`;
        let response = await fetch(geocodeURL);

        if (!response.ok) {
            console.log("Error fetching geocode data", response.status);
            return;
        }
        
        let data = await response.json();

        // Wenn keine Treffer in Deutschland, erneut global suchen
        if (data.length == 0){
            // Kurze Benutzerinfo, dass globale Suche startet
            weatherDataSection.innerHTML = `
            <div>
                <p>Keine Treffer in Deutschland gefunden. Suche weltweit...</p>
            </div>
            `;

            const geocodeURLGlobal = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=5&appid=${apiKey}`;
            response = await fetch(geocodeURLGlobal);

            if (!response.ok) {
                console.log("Error fetching global geocode data", response.status);
                return;
            }

            data = await response.json();

            if (data.length == 0){
                weatherDataSection.innerHTML = `
                <div>
                    <h2>Die eingegebene Stadt konnte nicht gefunden werden!</h2>
                    <p>Bitte versuche es erneut mit einem gültigen Städtenamen.</p>
                </div>
                `;
                return;
            }
        }   
        
        const exact = data.find(d => d.name.toLowerCase() === searchInput.toLowerCase());
        const best = exact || data[0];
        return best;    
    }

    async function getWeatherData(lon, lat) { //lon = longitude, lat = latitude also Breiten und Löngengrade
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=de`;
        const response = await fetch(weatherURL);

        if (!response.ok) {
            console.log("Error fetching weather data", response.status);
            return;
        }

        const data = await response.json();
        weatherDataSection.style.display = "flex";
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
    if (!geocodeData) return; //Abbrechen, wenn die Stadt nicht gefunden wurde
    getWeatherData(geocodeData.lon, geocodeData.lat); //Anhand der Koordinaten Wetterdaten abrufen
        
    
}
