<?php
 $moduleName = clearData($_GET['mod'],'get');
 $imoVal = null;
 $start = microtime(true);
  
 $filter = null;
 $model_id = 1;
 
 $filter = " AND tr.raiting=1 ";
 
 // фильтры по get параметрам из url
 if (!empty($_GET['point_a']) && $_GET['point_a']!='null') {
    $get = urldecode($_GET['point_a']);
    $filter .= " AND wl.point_a='".$get."' ";
 }
 
 if (!empty($_GET['point_b']) && $_GET['point_b']!='null') {
    $get = urldecode($_GET['point_b']);
    $filter .= " AND wl.point_b='".$get."' ";
 }
 
  if (!empty($_GET['imo'])) {
    $get = clearData($_GET['imo'],'int');
    $filter .= " AND cl.imo='".$get."' ";
  }
  
  //exit($filter);
 // ------------------------------------------------------
 
 include $_SERVER['DOCUMENT_ROOT'].'/backend/modules/'.$moduleName.'/includes/model.php';
 
 $models = db_query("SELECT model_id, model_name FROM models ORDER BY model_id");
 $routesRating = db_query("SELECT DISTINCT raiting FROM trace_raiting WHERE raiting<=5");
 $const = db_query("SELECT * FROM constant WHERE name='second_delay'");
 
 // проверяем есть ли активные задания по пересчёту маршрутов
 $pr = db_query("SELECT progress, text 
  FROM events 
  WHERE event_table='run' 
  AND status=0 ORDER BY progress DESC LIMIT 1");
 
 if ($pr != false) {
    $text = 'Обработка';
    $percent = $pr[0]['progress'].'%';
    $percentInt = $pr[0]['progress'];
    
    if (!empty($pr[0]['text'])) {
        $percent .= ' - '.$pr[0]['text'];
    }
    
    $event = 'run';
    
    ob_start();
    include $_SERVER['DOCUMENT_ROOT'].'/backend/modules/'.$moduleName.'/includes/progress-bar.inc.php';
    $progressBar = ob_get_clean();
 }
 
 // вытаскиваем список заявок
 $bidsList = db_query("SELECT id FROM wish_list");