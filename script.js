const apiKey = "14b48f3f28fba853fc6efcecc4308f09";

function getWeather() {
    const cityInput = document.getElementById("city-input");
    if (!cityInput) {
        console.warn("Поле ввода города не найдено");
        return;
    }

    const city = cityInput.value.trim();
    if (!city) {
        alert("Введите название города");
        return;
    }

    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${apiKey}`;
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ru&appid=${apiKey}`;

    fetch(urlCurrent)
        .then(response => {
            if (!response.ok) throw new Error("Город не найден");
            return response.json();
        })
        .then(data => {
            const temperatureEl = document.getElementById("temperature");
            const humidityEl = document.getElementById("humidity");
            const windEl = document.getElementById("wind");
            const iconImg = document.getElementById("weather-icon-img");
            const feelsLikeEl = document.getElementById("feels-like");
            const pressureEl = document.getElementById("pressure");

            if (feelsLikeEl) feelsLikeEl.innerText = `Ощущается как: ${Math.round(data.main.feels_like)}°C`;
            if (pressureEl) pressureEl.innerText = `Давление: ${Math.round(data.main.pressure * 0.75006375541921)} мм рт. ст.`;

            if (temperatureEl) temperatureEl.innerText = `${Math.round(data.main.temp)}°C`;
            if (humidityEl) humidityEl.innerText = `Влажность: ${data.main.humidity}%`;
            if (windEl) windEl.innerText = `Ветер: ${data.wind.speed} м/с`;
            if (iconImg) {
                const iconCode = data.weather[0].icon;
                iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                iconImg.alt = data.weather[0].description;
            }
        })
        .catch(error => {
            console.error("Ошибка получения текущей погоды:", error);
            alert("Ошибка! Проверьте название города или попробуйте позже.");
        });

    fetch(urlForecast)
        .then(response => {
            if (!response.ok) throw new Error("Ошибка прогноза");
            return response.json();
        })
        .then(data => {
            const weeklyForecastContainer = document.getElementById("weekly-forecast");
            if (!weeklyForecastContainer) return;

            weeklyForecastContainer.innerHTML = "";
            const days = {};

            data.list.forEach(forecast => {
                const date = new Date(forecast.dt_txt);
                const day = date.toLocaleDateString("ru-RU", { weekday: 'short', day: 'numeric', month: 'short' });

                if (date.getHours() === 12 && !days[day]) {
                    days[day] = forecast;
                }
            });

            Object.entries(days).slice(0, 3).forEach(([day, forecast]) => {
                const dayDiv = document.createElement("div");
                dayDiv.classList.add("forecast-day");

                dayDiv.innerHTML = `
                    <p><strong>${day}</strong></p>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
                    <p>Температура: ${Math.round(forecast.main.temp)}°C</p>
                    <p>Влажность: ${forecast.main.humidity}%</p>
                    <p>Ветер: ${forecast.wind.speed} м/с</p>
                `;

                weeklyForecastContainer.appendChild(dayDiv);
            });
        })
        .catch(error => {
            console.error("Ошибка прогноза:", error);
            alert("Ошибка прогноза. Попробуйте позже.");
        });
}

window.getWeather = getWeather;