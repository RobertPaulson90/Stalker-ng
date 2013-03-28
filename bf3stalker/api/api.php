<?php
	include("db.php");

	$query = $mysqlConnection->query("SELECT data FROM players WHERE id > 0");

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