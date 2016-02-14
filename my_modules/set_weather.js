var GPIO = require('onoff').Gpio;

var si = new GPIO(17, 'out');
var rck = new GPIO(27, 'out');
var sck = new GPIO(22, 'out');

// today: 0-6, 6-12, 12-18, 18-24, tommorow: 0-6, 6-12, 12-18, 18-24
var today_green = {"00-06": 0, "06-12": 0, "12-18": 0, "18-24": 0};	// 10% - 30%
var today_yello = {"00-06": 0, "06-12": 0, "12-18": 0, "18-24": 0};	// 40% - 70%
var today_red   = {"00-06": 0, "06-12": 0, "12-18": 0, "18-24": 0};	// 80% - 100%
var tommorow_green = {"00-06": 0, "06-12": 0, "12-18": 0, "18-24": 0};	// 10% - 30%
var tommorow_yello = {"00-06": 0, "06-12": 0, "12-18": 0, "18-24": 0};	// 40% - 70%
var tommorow_red   = {"00-06": 0, "06-12": 0, "12-18": 0, "18-24": 0};	// 80% - 100%


function exit() {
	//console.log("called exit()");

	si.unexport();
	rck.unexport();
	sck.unexport();

	process.exit();
}

var shift_rck = function() {
	rck.writeSync(1);
	rck.writeSync(0);
}

var shift_sck = function() {
	sck.writeSync(1);
	sck.writeSync(0);
}

module.exports.setAllLED = function(weather) {
	//console.log(today_green);
	//console.log(today_yello);
	//console.log(today_red);
	//console.log(tommorow_green);
	//console.log(tommorow_yello);
	//console.log(tommorow_red);

	for (var key in today_green) {
		//console.log("shift[" + key + "] is (" + today_green[key] + ")");
		si.writeSync(today_green[key]);
		shift_sck();
	}
	for (var key in tommorow_green) {
		//console.log("shift[" + key + "] is (" + tommorow_green[key] + ")");
		si.writeSync(tommorow_green[key]);
		shift_sck();
	}

	for (var key in today_yello) {
		//console.log("shift[" + key + "] is (" + today_yello[key] + ")");
		si.writeSync(today_yello[key]);
		shift_sck();
	}
	for (var key in tommorow_yello) {
		//console.log("shift[" + key + "] is (" + tommorow_yello[key] + ")");
		si.writeSync(tommorow_yello[key]);
		shift_sck();
	}

	for (var key in today_red) {
		//console.log("shift[" + key + "] is (" + today_red[key] + ")");
		si.writeSync(today_red[key]);
		shift_sck();
	}
	for (var key in tommorow_red) {
		//console.log("shift[" + key + "] is (" + tommorow_red[key] + ")");
		si.writeSync(tommorow_red[key]);
		shift_sck();
	}

	shift_rck();
};

module.exports.setToday = function(weather) {
	for (var key in weather) {
		//console.log(weather[key].hour + ": " + weather[key].rainfallchance);

		if (weather[key].rainfallchance == 0) {
			today_green[weather[key].hour] = 0;
			today_yello[weather[key].hour] = 0;
			today_red[weather[key].hour] = 0;
		} else if (10 <= weather[key].rainfallchance && weather[key].rainfallchance < 40) {
			today_green[weather[key].hour] = 1;
			today_yello[weather[key].hour] = 0;
			today_red[weather[key].hour] = 0;
		} else if (40 <= weather[key].rainfallchance && weather[key].rainfallchance < 80) {
			today_green[weather[key].hour] = 1;
			today_yello[weather[key].hour] = 1;
			today_red[weather[key].hour] = 0;
		} else if (80 <= weather[key].rainfallchance && weather[key].rainfallchance < 100) {
			today_green[weather[key].hour] = 1;
			today_yello[weather[key].hour] = 1;
			today_red[weather[key].hour] = 1;
		}
	}
};

module.exports.setTommorow = function(weather) {
	for (var key in weather) {
		//console.log(weather[key].hour + ": " + weather[key].rainfallchance);

		if (weather[key].rainfallchance == 0) {
			tommorow_green[weather[key].hour] = 0;
			tommorow_yello[weather[key].hour] = 0;
			tommorow_red[weather[key].hour] = 0;
		} else if (10 <= weather[key].rainfallchance && weather[key].rainfallchance < 40) {
			tommorow_green[weather[key].hour] = 1;
			tommorow_yello[weather[key].hour] = 0;
			tommorow_red[weather[key].hour] = 0;
		} else if (40 <= weather[key].rainfallchance && weather[key].rainfallchance < 80) {
			tommorow_green[weather[key].hour] = 1;
			tommorow_yello[weather[key].hour] = 1;
			tommorow_red[weather[key].hour] = 0;
		} else if (80 <= weather[key].rainfallchance && weather[key].rainfallchance < 100) {
			tommorow_green[weather[key].hour] = 1;
			tommorow_yello[weather[key].hour] = 1;
			tommorow_red[weather[key].hour] = 1;
		}
	}
};


process.on('SIGINT', exit);

