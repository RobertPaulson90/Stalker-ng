<?php
include("raven.php");

$type = $_SERVER['REQUEST_METHOD'];
if ($type == "GET") {
	function queryDB ($lastId) {
		include('db.php');

		// Check connection
		if (mysqli_connect_errno($mysqlConnection))
		{
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$query = $mysqlConnection->query("SELECT id, alias, name, platform, game, type, url FROM players WHERE id > $lastId ORDER BY id LIMIT 1");
		if ($query->num_rows > 0) {
			return $query->fetch_array(MYSQLI_ASSOC);
		} else {
			return false;
		}
	}

	function output ($data) {
		echo json_encode($data);
	}

	$lastId = file_get_contents("lastId.txt");

	$result = queryDB($lastId);

	if ($result !== false) {
		output($result);
		$nextId = $result["id"];
	} else {
		$result = queryDB(0);
		output($result);
		$nextId = 1;
	}

	file_put_contents("lastId.txt", $nextId);
} else if ($type == "POST") {
	include('db.php');

	$client_name = "not defined";

	if (isset($_SERVER["Client-Name"])) {
		$client_name = mysqli_real_escape_string($mysqlConnection, $_SERVER["Client-Name"]);
	}

	$data = file_get_contents('php://input');
	$name = mysqli_real_escape_string($mysqlConnection, trim(preg_replace("/\([^)]+\)/","",json_decode($data)->n)));
	$data = mysqli_real_escape_string($mysqlConnection, $data);
	$timestamp = time();

	if ($name != "" && $data != "") {
		$mysqlConnection->query("UPDATE players SET data='$data', timestamp='$timestamp', counter=counter+1, client_name='$client_name' WHERE name='$name'");
		echo "OK";
	} else {
		echo "ERROR";
	}

}
?>