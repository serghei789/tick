<?php
$points = array();
$points2 = array();

$a = db_query("SELECT DISTINCT point_a FROM routes_names");
 
if ($a != false) {
    foreach($a as $b) {
        $points['point_a'][] = $b['point_a'];
    }
}

$a = db_query("SELECT DISTINCT point_b FROM routes_names");
 
if ($a != false) {
    foreach($a as $b) {
        $points['point_b'][] = $b['point_b'];
    }
}


$a = db_query("SELECT * FROM routes_names");

if ($a != false) {
    foreach($a as $b) {
        foreach($points['point_a'] as $k=>$v) {
            if ($v == $b['point_a']) {
                $points2['points_a'][ $v ][] = $b['point_b'];
            }
        }
        
        foreach($points['point_b'] as $k=>$v) {
            if ($v == $b['point_b']) {
                $points2['points_b'][ $v ][] = $b['point_a'];
            }
        }
    }
}

if (!empty($points2)) {
    $json = json_encode($points2,true);
    exit($json);
}