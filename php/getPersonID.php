<?php
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
require_once("ConnexionDB.php");
$statement = $dbh->prepare("SELECT DISTINCT id FROM " . $table);
$statement->execute();

$results = $statement->fetchAll(PDO::FETCH_NUM);

$json = json_encode($results);
echo $json;
?>