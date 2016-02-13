var GPIO = require('onoff').Gpio;

var si = new GPIO(17, 'out');
var rck = new GPIO(27, 'out');
var sck = new GPIO(22, 'out');
var sclr = new GPIO(18, 'out');

function exit() {
	console.log("called exit()");

	si.unexport();
	rck.unexport();
	sck.unexport();
	sclr.unexport();

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

var shift_reset = function() {
	sclr.writeSync(0);
	sclr.writeSync(1);
}

//shift_reset();

var led_green = [1, 1, 1, 1, 1, 1, 1, 1];
var led_yello = [1, 1, 1, 1, 1, 1, 1, 1];
var led_red   = [1, 1, 1, 1, 1, 1, 1, 1];

for (var key in led_green) {
	console.log("shift[" + key + "] is (" + led_green[key] + ")");
	si.writeSync(led_green[key]);
	shift_sck();
}
for (var key in led_yello) {
	console.log("shift[" + key + "] is (" + led_yello[key] + ")");
	si.writeSync(led_yello[key]);
	shift_sck();
}
for (var key in led_red) {
	console.log("shift[" + key + "] is (" + led_red[key] + ")");
	si.writeSync(led_red[key]);
	shift_sck();
}

shift_rck();

process.on('SIGINT', exit);

