const baseUrl = "https://api.weatherapi.com/v1/forecast.json?key=";
const apiKey = "b8390d3353264932983185912240509";


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
} else {
    console.log("Geolocation is not supported by this browser.");
}

// User Current Location
function success(position) {

    const currentWeatherImage = document.getElementById('currentWeatherImage');
    const currentLocation = document.getElementById('currentLocation');
    const currentTempreture = document.getElementById('currentTempreture');
    const currentWeather = document.getElementById('currentWeather');

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);

    fetch(`${baseUrl}${apiKey}&q=${latitude},${longitude}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.current) {
                currentWeatherImage.src = `${data.current.condition.icon} `;
                currentLocation.innerHTML = `${data.location.name} `;
                currentTempreture.innerHTML = `${data.current.temp_c} °C`;
                currentWeather.innerHTML = `${data.current.condition.text} `;
                currentMap(`${data.location.name} `);
            } else {
                currentWeatherImage.src = "No data found";
            }
        })
        .catch(error => console.log('Error fetching weather data: ', error));

}

// digital clock
function updateClock() {
    const today = new Date();
    let h = today.getHours();
    const meridiem = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    h = h.toString().padStart(2, '0');
    const m = today.getMinutes().toString().padStart(2, '0');
    const s = today.getSeconds().toString().padStart(2, '0');
    const timeString = `${h}: ${m}: ${s} ${meridiem}`;

    document.getElementById('clock').textContent = timeString;
    var t = setTimeout(updateClock, 500);
};
updateClock();
setInterval(updateClock, 1000);


//Search location
document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("Search_bar");
    const searchBtn = document.getElementById("Search_btn");
    const searchLocation = document.getElementById('searchLocation');
    const searchTemprature = document.getElementById('searchTemprature');
    const searchHumidity = document.getElementById('searchHumidity');
    const searchWindSpeed = document.getElementById('searchWindSpeed');
    const searchCondition = document.getElementById('searchCondition');
    const searchRegion = document.getElementById('searchRegion');
    const searchCountry = document.getElementById('searchCountry');
    const searchLongitude = document.getElementById('searchLongitude');
    const searchLatitude = document.getElementById('searchLatitude');

    searchBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            const searchVal = searchBar.value;
            const response = await fetch(`${baseUrl}${apiKey}&q=${searchVal}&days=7`);
            const data = await response.json();

            if (data.current) {

                searchLocation.innerHTML = `${data.location.name} `;
                searchTemprature.innerHTML = `${data.current.temp_c} °C`;
                searchHumidity.innerHTML = `${data.current.humidity} `;
                searchWindSpeed.innerHTML = `${data.current.wind_kph} `;
                searchCondition.innerHTML = `${data.current.condition.text}`;
                searchRegion.innerHTML = `${data.location.region} `;
                searchCountry.innerHTML = `${data.location.country} `;
                searchLongitude.innerHTML = `${data.location.lon}`;
                searchLatitude.innerHTML = `${data.location.lat} `;
            } else {
                currentWeatherImage.src = "No data found";
            }
        } catch (error) {
            alert("Error fetching weather data: ", error);
        }
    });
});

// weather forcasting
document.addEventListener("DOMContentLoaded", () => {
    
        const searchBtn = document.getElementById("Search_btn");
        const searchVal = document.getElementById("Search_bar").value;
    let reop = {
        method: 'POST'
    };
    fetch(`${baseUrl}${apiKey}&q=${searchVal}&days=7`, reop)
        .then(response => response.json())
        .then(data => {
            const startDate = new Date(`${data.forecast.forecastday[0].date}`);
            let currentDay = new Date(startDate);
            

            searchBtn.addEventListener("click", async (event) => {
                event.preventDefault();
                for (let i = 0; i < 7; i++) {
                    //hethuw blann toISOString, split
                    const formattedDate = currentDay.toISOString().split('T')[0];

                    fetch(`${baseUrl}${apiKey}&q=${searchVal}&days=7&dt=${formattedDate}&aqi=homagama&alerts=yes`)
                        .then(response => response.json())
                        .then(data => {

                            document.getElementById(`weekDays${i + 1}`).innerHTML = `${data.forecast.forecastday[0].date}`
                            document.getElementById(`imageWeather${i + 1}`).src = `${data.forecast.forecastday[0].day.condition.icon}`
                            document.getElementById(`temp${i + 1}`).innerHTML = `${data.forecast.forecastday[0].day.maxtemp_c} °C`

                        })
                        .catch(error => {
                            console.error("Error:", error);
                        });

                    currentDay.setDate(currentDay.getDate() + 1);
                }
            })
        });
    });


    let map; // Declare a variable to hold the map instance

    function initializeMap(latitude, longitude, pin) {
        if (!map) {
            map = L.map('map').setView([latitude, longitude], 13);
    
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        } else {
            map.setView([latitude, longitude], 13);
        }
    
        // Add a marker to the map
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`Location: ${pin}`)
            .openPopup();
    }
    
    // Event listener for search button
    document.getElementById("Search_btn").addEventListener("click", async () => {
        try {
            const searchVal = document.getElementById("Search_bar").value;
            const { latitude, longitude } = await fetchLocationData(searchVal);
            initializeMap(latitude, longitude, searchVal);
        } catch (error) {
            console.error('Error during fetch:', error);
            // Handle errors
        }
    });
    
    async function currentMap(currentLocation) {
        try {
            const { latitude, longitude } = await fetchLocationData(currentLocation);
            initializeMap(latitude, longitude, currentLocation);
        } catch (error) {
            console.error('Error during fetch:', error);
            // Handle errors
        }
    }
    
    async function fetchLocationData(location) {
        try {
            const response = await fetch(`${baseUrl}${apiKey}&q=${location}&days=7`);
            const data = await response.json();
            return { latitude: data.location.lat, longitude: data.location.lon };
        } catch (error) {
            console.error('Error fetching location data:', error);
            throw error; // Rethrow the error to handle it elsewhere if needed
        }
    }
    
    
// °C