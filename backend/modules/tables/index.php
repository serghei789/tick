<?php
$table = $_GET['tab'];
$tab = db_query("SELECT * FROM ".$table);

if ($tab != false) {
  $json = json_encode($tab,true);
  exit($json);
} 