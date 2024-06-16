<?php

$moduleName = clearData($_POST['module'],'get');

// таблица с кораблями под картой
if (isset($_POST['form_id']) && $_POST['form_id'] == 'form_jsShowRoutesTable') {
    
    $routesFilter = null;
    
    $raiting_id = $_POST['raiting_id'];
    $id_interval = intval($_POST['id_interval']);
    $model_id = intval($_POST['model_id']);
    $imo = null;
    
    if (!empty($_POST['imo'])) {
        $imo = clearData($_POST['imo']);
        $routesFilter = " AND ss.imo IN (".$imo.") ";
    }
    
    $rt = db_query("SELECT DISTINCT
    wp.point_a, 
    wp.datetime_start, 
    wp.point_b, 
    wp.datetime_end, 
    ss.name, 
    ss.iceclass,
    tr.distance/1000 AS distance, 
    (tr.time/3600) AS time, 
    (tr.distance/tr.time) AS speed 
    FROM schedule AS s 
    JOIN caravan_list as cl ON cl.caravan_id = s.caravan_id AND cl.model_id = cl.model_id 
    INNER JOIN ships as ss ON ss.imo = cl.imo 
    INNER JOIN wish_list_parts as wp ON wp.caravan_id = cl.caravan_id AND wp.model_id = s.model_id AND wp.point_a = s.point_a AND wp.point_b = s.point_b 
    AND wp.datetime_start = s.datetime_start 
    INNER JOIN trace_intervals AS t ON t.caravan_id = cl.caravan_id 
    INNER JOIN time_intervals as ti ON ti.id = t.id_interval 
    INNER JOIN trace_raiting as tr ON tr.caravan_id = t.caravan_id AND tr.route_id = t.route_id AND tr.version = t.version 
    WHERE s.model_id=".$model_id." 
    AND tr.raiting=".$raiting_id." 
    AND t.id_interval=".$id_interval." 
    ".$routesFilter."
    ORDER BY t.id_interval");
    
    if ($rt != false) {
        // подключаем шаблон таб. и заполняем его данными
        ob_start();
        include $_SERVER['DOCUMENT_ROOT'].'/backend/modules/map/includes/routesTable.inc.php';
        $routesTable = ob_get_clean();
        exit($routesTable);
    }
    
    exit('');
}


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
    $raiting_id = 1;
    $imoRoutesTable = null;
    
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
        $imoRoutesTable = $shipsList;
        
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