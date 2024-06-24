<?php

$tables = array('caravan_list',
    'track_points',
    'constant',
    'ships',
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