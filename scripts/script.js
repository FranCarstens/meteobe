var currentWeather = function(weatherObj) {
	var weatherData = weatherObj,
		currentContainer = document.querySelector('#temp')
		currentContainer.innerHTML = weatherData.temperature
}



var dataHandler = function(weatherObj) {
	var weatherData = weatherObj
	currentWeather(weatherData.currently)


}



var dataRequest = function(positionObject) {

	var meteobeURL = 'https://api.darksky.net/forecast/bebcaaaee24ff81211d1700c0720964d/'

	var long = positionObject.coords.longitude,
	    lat = positionObject.coords.latitude

	var promise = $.getJSON(meteobeURL + lat + ',' + long)
	promise.then(dataHandler)

}

navigator.geolocation.getCurrentPosition(dataRequest)