// 	BASIC OUTLINE
	
// 	VARIABLES:
// 	* Should include:
// 		* base url
// 		* api key
// 		* STATE
// 			* current lat (from location data - browser or geocoded via maps api)
// 			* current long (from location data - browser or geocoded via maps api)
// 			* current view (from hash via button)
// 			* current timezone
// 			* current timezone offset
// 	GLOBAL FUNCTIONS:
// 	1. Default
// 		* fetch default location (fetchLocation func())
// 		* write API request URL (buildURL)
// 		* fetch default locationWeatherObject (fetchDefaultWeather func(buildURL))
// 		* write default STATE (writeCurrentState func()) > with additional helper functions
// 		* render default View (defaultDisplay)
// 	2. Search
// 		* fetch search location (searchLocation func()) > has additional helper functions
// 		* write API request URL (buildURL)
// 		* fetch search locationWeatherObject (fetchDefaultWeather func(buildURL))
// 		* write search STATE (writeCurrentState func()) > with additional helper functions
// 		* render search View (nowDisplay)
// 	3. Now, Hourly, Daily
// 		* fetch STATE lat, long
// 		* write API request URL (buildURL)
// 		* fetch appropriate locationWeatherObject (fetchDefaultWeather func(buildURL))
// 		* write appropriate STATE (writeCurrentState func()) > with additional helper functions
// 		* render appropriate View (nowDisplay, hourlyDisplay, dailyDisplay)


// VARIABLES
var STATE = {
		'lat': '',
		'long': '',
		'view': '',
		'timezone': '',
		'timezoneOffset': '',
		'location': '',
		'baseURL': 'https://api.darksky.net/forecast/',
		'apiKey': 'bebcaaaee24ff81211d1700c0720964d',
		'days': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	},
	currentBtn = document.querySelector('#current_button'),
	hourlyBtn = document.querySelector('#hourly_button'),
	dailyBtn = document.querySelector('#daily_button'),
	docBody = document.querySelector('body')

// HELPER FUNCTIONS


var loadDefaults = function(locationObj) {
	
	var locData = locationObj.coords
	STATE.lat = locData.latitude
	STATE.long = locData.longitude
	STATE.view = 'current'
	location.hash = STATE.lat + "/" + STATE.long + "/" + STATE.view

}

var loadDefaultLocationData = function() {
	navigator.geolocation.getCurrentPosition(loadDefaults)
}

var reverseHash = function() {
	hash = location.hash.substring(1)
	keyArray = hash.split('/')
	STATE.lat = keyArray[0]
	STATE.long = keyArray[1]
	STATE.view = keyArray[2]
	console.log(STATE)
}

var calcTime = function(timeString) {

	var localTimeString = timeString + STATE.timezone
	var dateString = new Date(timeString * 1000)
	return dateString

}

var meridianTime = function(number) {

	time = number % 12
	if (number === 0) {
		time = '12am'
	}

	else if (number === 12) {
		time = '12pm'
	}

	else if (number > 11) {
		time = time + 'pm'
	}
	
	else time = time + 'am'
	
	return time

}

var changeView = function() {
	
	STATE.view = this.className
	docBody.className = STATE.view
	location.hash = STATE.lat + '/' + STATE.long + '/' + STATE.view

}

var events = function() {
	currentBtn.addEventListener('click',changeView)
	hourlyBtn.addEventListener('click',changeView)
	dailyBtn.addEventListener('click',changeView)
}
events()

// MODELS

var LocationWeather = Backbone.Model.extend({
	url: function() {
		var url = STATE.baseURL + STATE.apiKey + '/' + STATE.lat + ',' + STATE.long + '?callback=?'
		return url

	
	},
	parse: function(rawData){
		var parsedData = rawData
		return parsedData;
	},
})


// VIEWS

var CurrentView = Backbone.View.extend({
	'bg': document.querySelector('#current'),
	'el': document.querySelector('#current .info'),
	'_render': function() {
		var stats = this.collection.attributes
		var weather = stats.currently
		docBody.className = STATE.view
		STATE.timezone = stats.timezone
		STATE.timezoneOffset = stats.offset
		
		console.log(weather)

		var sourceString = ""

		sourceString += '<p><span class="summary icon-' + weather.icon + '">' + weather.summary + '</span>'
		sourceString += '<span class="location">' + (STATE.location ? STATE.location : 'Your Location') + '</span>'
		sourceString += '<span class="temperature">' + Math.round(weather.temperature) + '</span>'
		sourceString += '<span class="felt">Felt: ' + Math.round(weather.apparentTemperature) + '</span></p>'
		
		this.el.innerHTML = sourceString
		this.bg.className = weather.icon
		// 
		console.log(STATE)

	},
	'initialize': function() {
		var boundRender = this._render.bind(this)
		this.collection.on("sync", boundRender)

	}
})
var HourlyView = Backbone.View.extend({
	'bg': document.querySelector('#hourly'),
	'el': document.querySelector('#hourly .info'),
	'_render': function() {
		var stats = this.collection.attributes
		var weather = stats.hourly.data
		docBody.className = STATE.view
		STATE.timezone = stats.timezone
		STATE.timezoneOffset = stats.offset

		console.log(weather)

		var sourceString = ""
			thisTemp = Math.round(weather[0].temperature),
			feltTemp = Math.round(weather[0].apparentTemperature),
			thisTime = meridianTime((calcTime(weather[0].time)).getHours())

		sourceString += '<div class="this_hour">'
		sourceString += '<p><span class="hour_time">' + thisTime + '</span>'
		sourceString += '<span class="summary icon-' + weather[0].icon + '">' + weather[0].summary + '</span>'
		sourceString += '<span class="location">' + (STATE.location ? STATE.location : 'Your Location') + '</span>'
		sourceString += '<span class="temperature">' + thisTemp + '</span>'
		sourceString += '<span class="felt">Felt: ' + feltTemp + '</span></p>'
		sourceString += '</div>'
		sourceString += '<div class="other_hours">'

		for ( var i = 1; i < 24; i++ ) {

			var thisTime = meridianTime((calcTime(weather[i].time)).getHours()),
				feltTemp = Math.round(weather[i].apparentTemperature),
				thisTemp = Math.round(weather[i].temperature)


			sourceString += '<div class="an_hour">'
			sourceString += '<div><span class="hour_time">' + thisTime + '</span></div>'
			sourceString += '<div><span class="summary icon-' + weather[i].icon + '">' + weather[i].summary + '</span></div>'
			sourceString += '<div><span class="temperature">' + thisTemp + '</span>'
			sourceString += '<span class="felt">Felt: ' + thisTemp + '</span></div>'
			sourceString += '</div>'

		}
		sourceString += '</div>'


		this.el.innerHTML = sourceString
		this.bg.className = weather[0].icon

	},
	'initialize': function() {
		var boundRender = this._render.bind(this)
		this.collection.on("sync", boundRender)

	}
})
var DailyView = Backbone.View.extend({
	'el': document.querySelector('#daily .temp'),
	'_render': function() {
		var stats = this.collection.attributes
		var weather = stats.daily.data
		docBody.className = STATE.view
		STATE.timezone = stats.timezone
		STATE.timezoneOffset = stats.offset

		console.log(weather)


		for ( var i = 0; i < 7; i++ ) {

		var thisDay = (calcTime(weather[i].time)).getDay(),
			thisTemp = Math.round(weather[i].temperatureMax)
		this.el.innerHTML += '<p>' + STATE.days[thisDay] + ':' + thisTemp + '</p>'
		
		}



	},
	'initialize': function() {
		var boundRender = this._render.bind(this)
		this.collection.on("sync", boundRender)

	}
})


// ROUTERS (CONTROLLERS)

var AppControl = Backbone.Router.extend({

	routes: {
		':lat/:long/current' : 'currentRoute',
		':lat/:long/hourly' : 'hourlyRoute',
		':lat/:long/daily' : 'dailyRoute',
		'*default' : 'defaultRoute'
	},
	currentRoute: function() {
		reverseHash()
		var currentWeather = new LocationWeather(),
			view = new CurrentView({
				collection: currentWeather
			})
			console.log('Running current')
		currentWeather.fetch()
	},
	hourlyRoute: function() {
		reverseHash()
		var hourlyWeather = new LocationWeather(),
			view = new HourlyView({
				collection: hourlyWeather
			})
			console.log('Running hourly')
		hourlyWeather.fetch()
	},
	dailyRoute: function() {
		reverseHash()
		var dailyWeather = new LocationWeather(),
			view = new DailyView({
				collection: dailyWeather
			})
			console.log('Running daily')
		dailyWeather.fetch()
	},
	defaultRoute: function() {
		loadDefaultLocationData()
	},
	initialize: function() {
		Backbone.history.start()
	}
})

var appControl = new AppControl