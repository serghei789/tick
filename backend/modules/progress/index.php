<?php

$event = clearData($_GET['event'],'get');

$a = db_query("SELECT progress, text 
  FROM events 
  WHERE event_table='".$event."' 
  AND status=0 ORDER BY progress DESC LIMIT 1");
  
if ($a == false) {
    echo '-1';
    exit();
}

$arr = array(
 'percent' => $a[0]['progress'],
 'text' => $a[0]['text']
);

$json = json_encode($arr,true);

exit($json);