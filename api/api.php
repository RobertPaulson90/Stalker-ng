<?php
	include("db.php");

	$game = $_GET['game'];
	if ($game === "bf3" || $game === "bf4") {
		$game = mysqli_real_escape_string($game);
		$query = $mysqlConnection->query("SELECT data FROM players WHERE game='$game' AND id > 0");

		$output = "{\"players\": [";
		while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
			if ($row["data"]) {
				$output .= $row["data"];
				$output .= ",";
			}
		}

		$output = rtrim($output, ",") . "]}";

		echo $output;
	} else {
		echo "No game selected!";
	}
?>