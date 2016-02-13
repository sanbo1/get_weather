var http = require('http');
var cronJob = require('cron').CronJob;
var time = require("time");

var Get = require('./my_modules/get_weather.js');
var Set = require('./my_modules/set_weather.js');

// cron 実行時間
var cronTime = "0 0 */6 * * *";		// 6時間毎
//var cronTime = "*/10 * * * * *";		// 10秒毎

var updateWeather = function() {
	Get.getWeather("沖縄県", "本島中南部", function(weather) {
		Set.setToday(weather.today);
		Set.setTommorow(weather.tommorow);
		Set.setAllLED();
	})
};

// Node を継続させるためのダミーサーバ
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

function exit() {
	console.log("called exit()");

	job.stop();

	process.exit();
};


updateWeather();

var job = new cronJob({
	//実行したい日時 or crontab書式
	cronTime: cronTime

	//指定時に実行したい関数
	, onTick: function() {
		updateWeather();
	}

	//ジョブの完了または停止時に実行する関数
	/*
	, onComplete: function() {
		console.log('onComplete!')
	}
	*/

	// コンストラクタを終する前にジョブを開始するかどうか
	, start: true

	//タイムゾーン
	, timeZone: "Asia/Tokyo"
})

process.on('SIGINT', exit);

