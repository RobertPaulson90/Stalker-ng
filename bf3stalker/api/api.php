<?php
	$mysqlConnection = mysqli_connect("p:127.0.0.1","root","","stalker");

	$query = $mysqlConnection->query("SELECT data FROM players");

	$output = "{\"players\": [";
	while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
		if ($row["data"]) {
			$output .= $row["data"];
			$output .= ",";
		}
	}

	$output = rtrim($output, ",") . "]}";

	echo $output;
?>