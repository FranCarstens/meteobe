// # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// #                                                       #
// #  ***** ***** ****     *    ****  ****  ***** ****  *  #
// #  *     *     *   *   * *   *   * *   * *     *   * *  #
// #  ***** *     ****   *   *  ****  ****  ***   *   * *  #
// #      * *     *  *   *****  *     *     *     *   *    #
// #  ***** ***** *   * *     * *     *     ***** ****  *  #
// #                                                       #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

// SCRAPPED: My model is constantly loading before the location data is returned. It's driving me nuts. This feels like a total mess. So I'm deleting it all literally starting from scratch. Not feeling like I'm learning anyting at the moment. Mostly just running around in circles.






// * Create 3 views: Current, Hourly, Daily
// * Load each view on a has change

// MASTER OBJECT
// I'm not sure if this is the best practise, but it comes in handy. Maybe there is a better way to handle this data.
var globalKeys = {
		'apikey'		: 'bebcaaaee24ff81211d1700c0720964d',
		'days'			: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	},
	STATE = {
		'views'			: 'current',
		'lat'			: '',
		'long'			: '',
		'timezone'		: '',
		'timeOffset'	: ''
	},
	currentBtn = document.querySelector('#current_button'),
	hourlyBtn = document.querySelector('#hourly_button'),
	dailyBtn = document.querySelector('#daily_button'),
	docBody = document.querySelector('body')

// UTILITIES

// Get current location

var getLocationParams = function() {

	var locationParams = navigator.geolocation.getCurrentPosition(writeLocationData)
	return locationParams

}




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

// URL Builder

var buildURL = function() {
	var baseURL = 'https://api.darksky.net/forecast/',
	    lat = STATE.lat,
	    long = STATE.long,
	    meteobeURL = baseURL + ' ' + STATE.apikey + '/' + lat + ',' + long + '?callback=?'
	    console.log(meteobeURL)
	return meteobeURL
}

var writeLocationData = function(locationObject) {
	STATE.lat = locationObject.coords.longitude
	STATE.long = locationObject.coords.latitude
	return(buildURL())
}

var getApiURL = function(locationObject) {
	console.log(locationObject)
	var locationObj = locationObject
	writeLocationData(locationObj)
}



// MODELS

var weatherObject = Backbone.Collection.extend({
	url: getApiURL()
})




// VIEWS

var viewNow = function(inputObject) {

	console.log(inputObject)

}




// CONTROL

// create the hash controller using Backbone library
var Controller = Backbone.Router.extend({

	// create the hash routes required for the project using Backbone's built in "routes" method
	// keys matching methods
	routes: {
		'now': 'nowHandler',
		'hourly': 'hourlyHandler',
		'daily': 'dailyHandler',
		'*default': 'defaultHandler'
	},
	// create the handler for #now
	nowHandler: function() {
		console.log("now")
	},
	// create the handler for #hourly
	hourlyHandler: function() {
		console.log("hourly")
	},
	// create the handler for #daily
	dailyHandler: function() {
		console.log("daily")
	},
	defaultHandler: function() {
		
		var locationData = getLocationParams

		console.log(locationData)


	},
	initialize: function() {
		Backbone.history.start()
	}

})


var controller = new Controller()