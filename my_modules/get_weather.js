var http = require('http');
var parseString = require('xml2js').parseString;

var url = 'http://www.drk7.jp/weather/xml/47.xml'

module.exports.getWeather = function(target_pref, target_area, cb) {
	if (target_pref === undefined) {
		target_pref = "沖縄県";
	}

	if (target_area === undefined) {
		target_area = "本島中南部";
	}

	http.get(url, function(res){
		var ret = {};
		var body = '';
		res.setEncoding('utf8');

		res.on('data', function(chunk){
			body += chunk;
		});

		res.on('end', function(res){
			parseString(body, function (err, result) {
				for (var pref_key in result.weatherforecast.pref) {
					var pref = result.weatherforecast.pref[pref_key];
					if (pref.$.id != target_pref) {
						continue;
					}
					//console.log(pref.$.id);
					ret.pref = pref.$.id;

					for (var area_key in pref.area) {
						var area = pref.area[area_key];
						if (area.$.id != target_area) {
							continue;
						}
						//console.log(area.$.id);
						ret.area = area.$.id;

						for (var info_key in area.info) {
							var info = area.info[info_key];
							var now = new Date();
							var today = (now.getFullYear() + "/" + ('0' + (now.getMonth() + 1)).slice(-2) + "/" + ('0' + now.getDate()).slice(-2));
							var tommorow = (now.getFullYear() + "/" + ('0' + (now.getMonth() + 1)).slice(-2) + "/" + ('0' + (now.getDate() + 1)).slice(-2));
							if (info.$.date != today && info.$.date != tommorow) {
								continue;
							} else if (info.$.date == today) {
								ret.today = [];
							} else {
								ret.tommorow = [];
							}
							//console.log(info.$.date);

							for (var rain_key in info.rainfallchance) {
								var rain = info.rainfallchance[rain_key];

								for (var period_key in rain.period) {
									var period = rain.period[period_key];
									//console.log(period.$.hour + " : " + period._);
									if (info.$.date == today) {
										ret.today.push({"hour": period.$.hour, "rainfallchance": period._});
									} else {
										ret.tommorow.push({"hour": period.$.hour, "rainfallchance": period._});
									}

								}

							}
						}
					}
				}

				cb(ret);

			});

		});
	}).on('error', function(e){
		console.log(e.message); //エラー時
	});
};

