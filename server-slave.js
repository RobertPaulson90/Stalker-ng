'use strict';
/*jshint node:true*/

var util = require('util'),
	exec = require('child_process').exec,
	cheerio = require('cheerio'),
	child,
	game = "bf3",
	baseUrl = "http://battlelog.battlefield.com";

function getPlayer (playerName, playerPlatform, game, callback) {
	child = exec(util.format('curl --socks5 127.0.0.1:9050 %s/%s/user/%s', baseUrl, game, playerName),
		function (curlError, data, stderr) {
			var error = "",
				gone = false,
				result = {
					name: 			playerName,
					platform: 		playerPlatform,
					battlelog: 		util.format("%s/%s/%s", baseUrl, game, playerName),
					status: 		"No",
					playing: 		false,
					success: 		false,
					serverUrl: 		"", 
					serverTitle: 	""
				};

			if (data == "") {
				error = "Error while getting: " + playerName;
			} else {
				var $ = cheerio.load(data);

				$(".common-playing-link a").map(function(i, el) {
					// this === el
					result.serverUrl = baseUrl + $(this).attr("href");
					result.serverTitle = $(this).attr("title");
					result.status = "Playing";
					result.playing = true;
					result.success = true;
				});

				$("a[href='/bf3/user/{$username}/'].base-avatar-status-overlay-online").map(function() {
					result.status = "Online";
				});

				$("div.base-middle-error").map(function(i, el) {
					gone = true;
				});

				if (gone) {
					error = "Player is gone: " + playerName;
				}

				if (curlError !== null) {
			 		console.log('exec error: ' + error);
				}
			}

			callback(error, result);
		}
	);
}


getPlayer("Airbager", "PC", game, function (error, result) {
	console.log("PLAYER: Airbager");
	console.log(error, result);
});

getPlayer("fredeffl", "PC", game, function (error, result) {
	console.log("PLAYER: fredeffl");
	console.log(error, result);
});

getPlayer("fucksdsdsdadasdasd", "PC", game, function (error, result) {
	console.log("PLAYER: fucksdsdsdadasdasd");
	console.log(error, result);
});