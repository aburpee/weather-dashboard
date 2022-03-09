const apiKey = '69a46a10fbf2456deef572e3a4f08645'
let searchFormEl = document.querySelector('#search-form');
let locationInputEl = document.querySelector('#location');
let cardContainerEl = document.querySelector('#weatherCard')
let todayContainerEl = document.querySelector('#todayContainer')

let formSubmitHandler = function(event) {
    event.preventDefault();
    var location = locationInputEl.value.trim();
    if (location) {
        getDailyWeather(location);
        locationInputEl.value = '';
    } else {
        alert('please enter a location')
    }
}

let getDailyWeather = function(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data, city);
                // console.log(data);
            })
        } else {
            alert('error: weather not found')
        }
    })
};

let displayWeather = function(weather, searchTerm) {
    console.log(weather);
    console.log(searchTerm);
    let today = new Date();
    let dd = String(today.getDate());
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy
    
    for (var i = 1; i < 6; i++) {
        let dailyWeather = weather.list[i].main.temp
        let dailyWind = weather.list[i].wind.speed
        let dailyVisibility = weather.list[i].weather[0].description
        let dailyVisibilityIcon = weather.list[i].weather[0].icon
        
        let weatherEl = document.createElement('div');
        weatherEl.classList = 'card col-sm-2 day1'

        let titleEl = document.createElement('h5');
        titleEl.textContent = today
        
        let tempEl = document.createElement('span')
        tempEl.textContent = "Temp: " + dailyWeather;
        
        let windEl = document.createElement('span')
        windEl.textContent = "Wind Speed: " + dailyWind

        let visEl = document.createElement('span')
        visEl.textContent = "Visibility: " + dailyVisibility + ' ' + dailyVisibilityIcon
        
        weatherEl.appendChild(titleEl)
        weatherEl.appendChild(tempEl);
        weatherEl.appendChild(windEl);
        weatherEl.appendChild(visEl);
        cardContainerEl.appendChild(weatherEl);

        dd++
        today = mm + '/' + dd + '/' + yyyy
    }

}

searchFormEl.addEventListener('submit', formSubmitHandler);


