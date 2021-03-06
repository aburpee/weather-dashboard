const apiKey = '69a46a10fbf2456deef572e3a4f08645'
let searchFormEl = document.querySelector('#search-form');
let locationInputEl = document.querySelector('#location');
let cardContainerEl = document.querySelector('#weatherCard')
let todayContainerEl = document.querySelector('#todayContainer')


// accepts form data and calls the get daily weather function. sets conatiner values to zero
// after search so consecutive searches start anew
let formSubmitHandler = function(event) {
    event.preventDefault();
    var location = locationInputEl.value.trim();
    if (location) {
        getDailyWeather(location);
        locationInputEl.value = '';
        cardContainerEl.textContent = '';
        todayContainerEl.textContent = '';
    } else {
        alert('please enter a location')
    }
}

// fetches the open weather map api and sends searches to local storage
let getDailyWeather = function(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                let searchedCity = JSON.parse(localStorage.getItem('weatherApi')) || []
                if (searchedCity.indexOf(city) == -1) {
                searchedCity.push(city)
                localStorage.setItem('weatherApi', JSON.stringify(searchedCity)) 
                }
                displayWeather(data, city);
                displayLocalStorage()
                // console.log(data);
            })
        } else {
            alert('error: weather not found')
        }
    })
};

// displays local storage in a container and doesn't allow the same city to 
// be stored twice
let displayLocalStorage = function() {
    let searchedCity = JSON.parse(localStorage.getItem('weatherApi')) || []
    let buttonTag =''
    for (let i=0; i<searchedCity.length; i++) {
        buttonTag += `<li><button onclick="openWeather(event)" class='previoucity'>${searchedCity[i]}</button></li>`
    }
    document.querySelector('.previousSearches').innerHTML = buttonTag

}

// allows clicks on previous searches to display the weather
let openWeather = function(event) {
    var city = event.target.textContent
    getDailyWeather(city)
}



//specifically fetches the weather for today and creates elements for it at the top of the screen
let oneCallApi = function(lat, long) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&exclude={part}&appid=${apiKey}`
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                let backgroundColor
                if (data.current.uvi > 7) {
                    backgroundColor = 'bg-danger'
                } else if (data.current.uvi >2.9) {
                    backgroundColor = 'bg-warning'
                } else {
                    backgroundColor = 'bg-success'
                }
                document.getElementById('todayContainer').innerHTML=
                `<div class="container">
                <h4>Todays Weather</h4>
                <img src = 'https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png'>
                <p>Temp: ${data.current.temp} F</p>
                <p>Wind: ${data.current.wind_speed} mph</p>
                <p>Humidity: ${data.current.humidity} %</p>
                <p class = '${backgroundColor}'>UV Index: ${data.current.uvi}</p>
                `
            })
        } else {
            alert('error: weather not found')
        }
    })
}



// specifically displays weather for the next five days using a loop
let displayWeather = function(weather, searchTerm) {
    
    console.log(weather);
    console.log(searchTerm);
    
    let today = new Date();
    let dd = String(today.getDate() + 1);
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy
    let lat = weather.city.coord.lat
    let long = weather.city.coord.lon

    oneCallApi(lat, long)
//using i+8 because the breakdown of weather is by 3 hour increments
    for (var i = 0; i < weather.list.length; i+=8) {
        let dailyWeather = weather.list[i].main.temp
        let dailyWind = weather.list[i].wind.speed
        let dailyHumidity = weather.list[i].main.humidity
        
        let weatherEl = document.createElement('div');
        weatherEl.classList = 'card col-sm-2 day1'

        let titleEl = document.createElement('h5');
        titleEl.textContent = today
        
        let tempEl = document.createElement('span')
        tempEl.textContent = "Temp: " + dailyWeather + ' F'
        
        let windEl = document.createElement('span')
        windEl.textContent = "Wind: " + dailyWind + ' mph'

        let humidEl = document.createElement('span')
        // visEl.innerHTML = `<i class = 'dailyVisibilityIcon'></i>`
        humidEl.textContent = "Humidity: " + dailyHumidity + ' %'
        
        let weatherIcon = document.createElement('img')
        weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@2x.png`)
        
        weatherEl.appendChild(titleEl);
        weatherEl.appendChild(weatherIcon);
        weatherEl.appendChild(tempEl);
        weatherEl.appendChild(windEl);
        weatherEl.appendChild(humidEl);
        cardContainerEl.appendChild(weatherEl);

        dd++
        today = mm + '/' + dd + '/' + yyyy
    }
    
}

searchFormEl.addEventListener('submit', formSubmitHandler);
displayLocalStorage();


