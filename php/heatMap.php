<?php

header('Content-type:application/json');
ini_set('memory_limit', '-1');

$day = intval($_GET['day']);
switch ($day)
{
	case 2:
		$table	 = "saturday";
		break;
	case 3:
		$table	 = "sunday";
		break;
	default:
		$table	 = "friday";
		break;
}
$filepath = 'cache/heatMap' . ucfirst($table) . '.json';

if (!file_exists($filepath))
{
	require_once("ConnexionDB.php");
	$statement = $dbh->prepare("SELECT x,y FROM " . $table);
	$statement->execute();

	$results = $statement->fetchAll(PDO::FETCH_ASSOC);

	$map	 = array();
	$maxHeat = 0;
	foreach ($results as $entry)
	{
		if (empty($map[$entry["x"]]))
			$map[$entry["x"]]				 = array();
		if (empty($map[$entry["x"]][$entry["y"]]))
			$map[$entry["x"]][$entry["y"]]	 = 0;
		$map[$entry["x"]][$entry["y"]] ++;
		if ($map[$entry["x"]][$entry["y"]] > $maxHeat)
			$maxHeat						 = $map[$entry["x"]][$entry["y"]];
	}
	$output		 = new stdClass();
	$output->max = $maxHeat;
	$output->map = $map;
	$json		 = json_encode($output);
	file_put_contents($filepath, $json);
}
echo file_get_contents($filepath);
