<?php
	$dbh = new PDO('pgsql:host=localhost port=5432 dbname=Visu user=admin password=admin') or die ("connection failed");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>