<?php
$file_handle = fopen('players.txt', 'rb');
$players = array();

while (!feof($file_handle) ) {
	$line_of_text = fgets($file_handle);
	$parts = explode(';', $line_of_text);
	if ($parts[0] !== "Removed") {
		if (trim($parts[3]) == 'DICE') {
			$parts[3] = 'http://dice.se';
		}
		$players[trim($parts[0])] = array('platform' => trim($parts[1]), 'type' => trim($parts[2]), 'url' => trim($parts[3]), 'alias' => trim($parts[4]));
	}
	unset($line_of_text);
}

fclose($file_handle);
unset($file_handle);

foreach ($players as $player => $info) {
	$name = ($info['alias'] ? "$player ({$info['alias']})" : $player);
	$type = $info['type'];
	$url = $info['url'];
	$platform =$info['platform'];
	$game = "bf3";

	$mysqlConnection = mysqli_connect("p:127.0.0.1","root","","stalker");

	$query = $mysqlConnection->query("INSERT INTO players (name, type, url, platform, game) VALUES ('$name', '$type', '$url', '$platform', '$game')");
}
?>