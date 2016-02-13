var Get = require('./my_modules/get_weather.js');
var Set = require('./my_modules/set_weather.js');

Get.getWeather("沖縄県", "本島中南部", function(weather) {
	//console.log(weather);

	Set.setToday(weather.today);
	Set.setTommorow(weather.tommorow);
	Set.setAllLED();
});

