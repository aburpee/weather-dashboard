const apiKey = '69a46a10fbf2456deef572e3a4f08645'
let searchFormEl = document.querySelector('#search-form');
let locationInputEl = document.querySelector('#location');

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
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
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
}

searchFormEl.addEventListener('submit', formSubmitHandler);


