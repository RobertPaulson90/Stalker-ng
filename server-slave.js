'use strict';
/*jshint node:true*/

var util = require('util'),
	exec = require('child_process').exec,
	cheerio = require('cheerio'),
	http = require('http'),
	child,
	game = "bf3",
	baseUrl = "http://battlelog.battlefield.com";

function getPlayer (playerName, playerAlias, playerPlatform, game, playerType, playerUrl, callback) {
	child = exec(util.format('curl --socks5 127.0.0.1:9050 %s/%s/user/%s', baseUrl, game, playerName),
		function (curlError, data, stderr) {
			var error = "",
				gone = false,
				result = {
					name: 			(playerAlias ? playerName + " " + playerAlias : playerName),
					platform: 		playerPlatform,
					battlelog: 		util.format("%s/%s/%s", baseUrl, game, playerName),
					type: 			playerType,
					url: 			playerUrl,
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

function sendPlayer (data, callback) {

	var post_data = JSON.stringify(data);

	var post_options = {
		host: "127.0.0.1",
		port: 80,
		path: "/bf3/server-master.php",
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length
		}
	};

	var post_req = http.request(post_options, function(res) {
	res.setEncoding('utf8');
		res.on('data', function (chunk) {
			callback(chunk);
		});
	});

	// write parameters to post body
	post_req.write(post_data);
	post_req.end();
}

function findPlayer (callback) {
	var options = {
		host: '127.0.0.1',
		port: 80,
		path: '/bf3/server-master.php'
	};

	http.get(options, function(res) {
		console.log("Got response: " + res.statusCode);

		res.on("data", function(chunk) {
			callback(JSON.parse(chunk));
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

function loop () {
	console.log("Finding a new player...");
	findPlayer(function (playerData) {
		console.log("Found player!");
		console.log("Querying Battlelog...");
		getPlayer(playerData.name, playerData.alias, playerData.platform, playerData.game, playerData.type, playerData.url, function (error, result) {
			console.log("Got response from Battlelog!");
			console.log("PLAYER: " + playerData.name);
			console.log(error, result);
			console.log("Sending player...");
			sendPlayer(result, function (response) {
				console.log("Player sent!");
				console.log(response);

				loop();
			});
		});
	});
};

loop();


