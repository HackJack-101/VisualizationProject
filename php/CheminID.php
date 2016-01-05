<?php

header('Content-type:application/json');
ini_set('memory_limit', '-1');

$id			 = intval($_GET['id']);
$filepath	 = 'cache/person' . $id . '.json';

if (!file_exists($filepath))
{
	require_once("ConnexionDB.php");
	$table		 = "parc";
	$statement	 = $dbh->prepare("SELECT * FROM " . $table . " WHERE id = " . $id." ORDER BY date");
	$statement->execute();

	$results = $statement->fetchAll(PDO::FETCH_ASSOC);
	$json	 = json_encode($results);
	file_put_contents($filepath, $json);
}
echo file_get_contents($filepath);
?>