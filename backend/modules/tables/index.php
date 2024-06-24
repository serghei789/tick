<?php
$table = $_GET['tab'];
$order = null;

if ($table == 'constant') {
    $order = " ORDER BY id";
}

$tab = db_query("SELECT * FROM ".$table.$order);

if ($tab != false) {
  $json = json_encode($tab,true);
  exit($json);
} 