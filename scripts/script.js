//goog: AIzaSyAEEw5zXUOdJHaDevVFPQ2FueFnXi8fJjU > key=API_KEY

var STATE = {
		view: 'current',
		lat: '',
		long: '',
		timezone: '',
		timeOffset: '',
		days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	},
	currentBtn = document.querySelector('#current_button'),
	hourlyBtn = document.querySelector('#hourly_button'),
	dailyBtn = document.querySelector('#daily_button'),
	docBody = document.querySelector('body')


// set the local time zone and time offset
var timeZone = function(timeObj) {
	var timeData = timeObj
	STATE.timeOffset = timeData.offset
	STATE.timezone = timeData.timezone * 3600
}


// Convert the timestring to a useable date.
var calcTime = function(timeString) {

	var localTimeString = timeString + STATE.timezone
	var dateString = new Date(timeString * 1000)
	return dateString

}

// pull and format the current weather
var currentWeather = function(weatherObj) {
	var weatherData = weatherObj,
		currentContainer = document.querySelector('#current #temp')
		
	currentContainer.innerHTML += Math.round(weatherData.temperature)
	
	
	currentBtn.addEventListener('click',changeView)
}

// pull and format hourly weather for the next 24 hours
var hourlyWeather = function(weatherObj) {
	var weatherData = weatherObj, //object > hourly > data
	currentContainer = document.querySelector('#hourly #temp')

	for ( var i = 0; i < 24; i++ ) {

		var thisTime = (calcTime(weatherData[i].time)).getHours(),
			thisTemp = Math.round(weatherData[i].temperature)
		currentContainer.innerHTML += '<p>' + thisTime + ':' + thisTemp + '</p>'

	}
	hourlyBtn.addEventListener('click',changeView)

}

// pull and format daily weather for the next 7 days
var dailyWeather = function(weatherObj) {
	var weatherData = weatherObj, //object > daily > data
	currentContainer = document.querySelector('#daily #temp')

	for ( var i = 0; i < 7; i++ ) {

		var thisDay = (calcTime(weatherData[i].time)).getDay(),
			thisTemp = Math.round(weatherData[i].temperatureMax)
		currentContainer.innerHTML += '<p>' + STATE.days[thisDay] + ':' + thisTemp + '</p>'
		
	}
	dailyBtn.addEventListener('click',changeView)

}

// VIEWS

// change view to current and update hash

var changeView = function() {
	
	STATE.view = this.className
	docBody.className = STATE.view
	location.hash = STATE.lat + '/' + STATE.long + '/' + STATE.view

}





// build out the app

var dataHandler = function(weatherObj) {
	var weatherData = weatherObj
	STATE.lat = weatherData.latitude
	STATE.long = weatherData.longitude
	console.log(weatherData)
	currentWeather(weatherData.currently)
	hourlyWeather(weatherData.hourly.data)
	dailyWeather(weatherData.daily.data)
	timeZone(weatherData)
}



// get the weather data
var dataRequest = function(positionObject) {

	var meteobeURL = 'https://api.darksky.net/forecast/bebcaaaee24ff81211d1700c0720964d/'

	var long = positionObject.coords.longitude,
	    lat = positionObject.coords.latitude

	var promise = $.getJSON(meteobeURL + lat + ',' + long + '?callback=?')
	promise.then(dataHandler)

}

// searchdataRequest()
// get the user's current location
navigator.geolocation.getCurrentPosition(dataRequest)