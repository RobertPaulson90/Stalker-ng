<?php
	include("../db.php");
	include("../raven.php");

	$queryString = "select client_name, count(*) from players where client_name IS NOT NULL group by client_name";
	$query = $mysqlConnection->query($queryString);

	$output = array();
	while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
		$output[] = array($row["client_name"], $row["count(*)"]);
	}
	$outputWrapper = array("data" => $output);
	echo json_encode($outputWrapper, JSON_NUMERIC_CHECK);
?>