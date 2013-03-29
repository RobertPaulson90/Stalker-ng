<?php

	include("db.php");
	
	$query = $mysqlConnection->query("SELECT * FROM players WHERE id > 0 ORDER BY timestamp LIMIT 1");
	$row = $query->fetch_array(MYSQLI_ASSOC);
	$timestamp = $row["timestamp"];
	$difference = time() - $timestamp;
	echo $difference;

	$data = "{\"version\":\"1.0.0\",\"datastreams\":[" .
	"{\"id\":\"Furthest\", \"current_value\":\"$difference\"}]}";
	echo $data;

	$chlead = curl_init();
	curl_setopt($chlead, CURLOPT_URL, "http://api.cosm.com/v2/feeds/121502");
	curl_setopt($chlead, CURLOPT_USERAGENT, 'Whatever/1.0');
	curl_setopt($chlead, CURLOPT_HTTPHEADER, array(
	        'Content-Type: application/json',
	        'Content-Length: ' . strlen($data),
	        "X-ApiKey: bGxaI1Ywqf0EERd7piytHk1PLHWSAKxSSWVpNEZBLy9lZz0g"));
	curl_setopt($chlead, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($chlead, CURLOPT_CUSTOMREQUEST, "PUT");
	curl_setopt($chlead, CURLOPT_POSTFIELDS,$data);
	curl_setopt($chlead, CURLOPT_SSL_VERIFYPEER, 0);
	$chleadresult = curl_exec($chlead);
	curl_close($chlead);

	echo "Data sent to server";
?>