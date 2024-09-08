const baseUrl = "https://api.weatherapi.com/v1/forecast.json?key=";
const apiKey = "b8390d3353264932983185912240509";
document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("Search_bar");
    const searchBtn = document.getElementById("Search_btn");
    const currentWeatherImage = document.getElementById('currentWeatherImage');
    const currentLocation = document.getElementById('currentLocation');
    const currentTempreture = document.getElementById('currentTempreture');
    const currentWeather = document.getElementById('currentWeather');

    searchBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        
        try {
            const searchVal = searchBar.value;
            const response = await fetch(`${baseUrl}${apiKey}&q=${searchVal}&days=7`);
            const data = await response.json();

            if (data.current) {
                currentWeatherImage.src = `${data.current.condition.icon} `;
                currentLocation.innerHTML = `${data.location.name} `;
                currentTempreture.innerHTML = `${data.current.temp_c} °C`;
                currentWeather.innerHTML = `${data.current.condition.text} `;
            } else {
                currentWeatherImage.src = "No data found";
            }
        } catch (error) {
            alert("Error fetching weather data: ", error);
        }
    });
});

// °C