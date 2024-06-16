<?php

$moduleName = clearData($_POST['module'],'get');

// запрос на пересчитывание маршрутов
if (isset($_POST['form_id']) && $_POST['form_id'] == 'form_jsEditRoutes') {
    
    $datetime = time() + 10800;
    $datetime = date('Y-m-d H:i:s',$datetime);
    
    $data = null;
    
    if (!empty($_POST['numberBidsEdit'])) {
        $data = json_encode($_POST['numberBidsEdit'],true);
    }
    
    $add = db_query("INSERT INTO events (event_table,
    data,
    timestamp_start,
    status) VALUES ('run',
    '".$data."',
    '".$datetime."',
    0)","i");
    
    if (intval($add) > 0) {
        
        $text = 'Обработка';
        $percent = '0%';
        $percentInt = 0;
        $event = 'run';
        
        ob_start();
        include $_SERVER['DOCUMENT_ROOT'].'/backend/modules/'.$moduleName.'/includes/progress-bar.inc.php';
        $bar = ob_get_clean();
        
        exit($bar);
    }
}

// запрос на остановку пересчёта маршрутов
if (isset($_POST['form_id']) && $_POST['form_id'] == 'form_jsStopEditRoutes') {
    $add = db_query("INSERT INTO events (event_table,
    timestamp_start) 
    VALUES ('stop',
    '".date('Y-m-d H:i:s')."')","i");
    
    if (intval($add) > 0) {
        exit();
    }
}

// запрос на восстановление данных
if (isset($_POST['form_id']) && $_POST['form_id'] == 'form_jsGetDefault') {
    /*
    $tables = array('caravan_list',
       'track_points',
       'constant',
       'models',
       'models_metrics',
       'placement',
       'schedule',
       'time_intervals',
       'trace',
       'trace_intervals',
       'trace_raiting',
       'routes_names',
       'routes_rec',
       'routes_recursion',
       'routes_recursion_fast',
       'wish_list_parts',
       'constant',
       'edge',
       'points',
       'wish_list');
      */ 
    $tables = array('caravan_list',
    'track_points',
    'constant',
    'models',
    'models_metrics',
    'placement',
    'placement_init',
    'schedule',
    'y_schedule',
    'time_intervals',
    'trace',
    'trace_intervals',
    'trace_raiting',
    'routes_names',
    'routes_rec',
    'routes_recursion',
    'routes_recursion_fast',
    'wish_list',
    'wish_list_parts',
    'constant',
    'edge',
    'points',
    'wish_list',
    'sailing_section');
    
    foreach($tables as $tab) {
        $del = db_query("DROP TABLE ".$tab);
        $creat = db_query("CREATE TABLE u2671630_default.".$tab." LIKE u2671630_backup.".$tab);
        $add = db_query("INSERT INTO u2671630_default.".$tab." SELECT * FROM u2671630_backup.".$tab);
    }
    
    $datetime = time() + 10800;
    $datetime = date('Y-m-d H:i:s',$datetime);
    
    $add = db_query("INSERT INTO events (event_table,
    timestamp_start,
    status) VALUES ('phpbackup',
    '".$datetime."',
    1)","i");
    
    exit('ok');    
}

if (isset($_POST['form_id']) && $_POST['form_id'] == 'form_jsMapFilters') {
    
    $filter = null;
    $typeMap = 1;
    $model_id = 1;
    $imoVal = null;
    
    if (!empty($_POST['model_id'])) {
        $model_id = intval($_POST['model_id']);
    }
    
    if (!empty($_POST['typeMap'])) {
        $typeMap = intval($_POST['typeMap']);
    }
    
    // фильтр по кораблям
    if (!empty($_POST['ships'])) {
        
        $shipsList = null;
        
        foreach($_POST['ships'] as $k=>$v) {
            $shipsList .= $v.',';
            $imoVal .= '&imo='.$v;
        }
        
        $shipsList = trim($shipsList,',');
        
        // фильтруем маршруты по кораблям
        $filter .= " AND cl.imo IN (".$shipsList.") ";
        
    }
    // ----------------------------------------------------------------------------------
    
    // фильтр по классу корабля
    if (!empty($_POST['iceclass'])) {
        
        $classList = null;
        
        foreach($_POST['iceclass'] as $k=>$v) {
            $classList .= "'".$v."',";
        }
        
        $classList = trim($classList,',');
        
        // фильтруем маршруты по кораблям
        $filter .= " AND ss.iceclass IN (".$classList.") ";
        
    }
    // ----------------------------------------------------------------------------------
    
    // фильтр по номеру заявки
    if (!empty($_POST['numberBid'])) {
        $filter .= " AND wl.id IN (".implode(',',$_POST['numberBid']).") ";
    }
    // ----------------------------------------------------------------------------------
    
    // начальная и конечная точки маршрута
    // пункт отправления
    if (!empty($_POST['point_a'])) {
        
        $pointsAList = null;
        
        foreach($_POST['point_a'] as $k=>$v) {
            $pointsAList .= "'".$v."',";
        }
        
        $pointsA = trim($pointsAList,',');
        
        $filter .= " AND wl.point_a IN (".$pointsA.") ";
    }
    // ----------------------------------------------------------------------------------
    
    // пункт назначения
    if (!empty($_POST['point_b'])) {
        
        $pointsBList = null;
        
        foreach($_POST['point_b'] as $k=>$v) {
            $pointsBList .= "'".$v."',";
        }
        
        $pointsB = trim($pointsBList,',');
        
        $filter .= " AND wl.point_b IN (".$pointsB.") ";
    }
    // ----------------------------------------------------------------------------------
    
    // рейтинг маршрута
    if (!empty($_POST['rating'])) {
        $routesRating = implode(',',$_POST['rating']);
        $filter .= " AND tr.raiting IN (".$routesRating.") ";
    }
    
    
    include $_SERVER['DOCUMENT_ROOT'].'/backend/modules/'.$moduleName.'/includes/model.php';
   
    //$const = db_query("SELECT * FROM constant WHERE name='second_delay'");
    
    
    include $_SERVER['DOCUMENT_ROOT'].'/backend/modules/'.$moduleName.'/includes/map.inc.php';
    exit();
    
}