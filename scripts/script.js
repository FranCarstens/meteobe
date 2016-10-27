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
	'el': document.querySelector('#current .temp'),
	'_render': function() {
		var stats = this.collection.attributes
		var weather = stats.currently
		docBody.className = STATE.view
		STATE.timezone = stats.timezone
		STATE.timezoneOffset = stats.offset
		this.el.innerHTML = Math.round(weather.temperature)
		console.log(STATE)

	},
	'initialize': function() {
		var boundRender = this._render.bind(this)
		this.collection.on("sync", boundRender)

	}
})
var HourlyView = Backbone.View.extend({
	'el': document.querySelector('#hourly .temp'),
	'_render': function() {
		var stats = this.collection.attributes
		var weather = stats.hourly.data
		docBody.className = STATE.view
		STATE.timezone = stats.timezone
		STATE.timezoneOffset = stats.offset

		console.log(weather)

		for ( var i = 0; i < 24; i++ ) {

			var thisTime = (calcTime(weather[i].time)).getHours(),
				thisTemp = Math.round(weather[i].temperature)
			this.el.innerHTML += '<p>' + thisTime + ':' + thisTemp + '</p>'

		}

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