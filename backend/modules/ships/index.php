<?php

$ships = array();
$where = null;

if (!empty($_GET['imo'])) {
    $where = " WHERE imo='".clearData($_GET['imo'],'int')."' LIMIT 1";
}

$a = db_query("SELECT * FROM ships".$where);

if ($a != false) {

    $historyArr = array();
    $history = db_query("SELECT * FROM history GROUP BY imo ORDER BY date_bd DESC");
    
    if ($history != false) {
        foreach($history as $h) {
            $historyArr[ $h['imo'] ] = array(
              'lat' => $h['lat_real'],
              'lng' => $h['lng_real'],
              'kurs' => $h['kurs'],
              'speed' => $h['speed'],
              'eta' => $h['eta'],
              'date' => $h['date']
            );
        }
    }
    
    $i = 0;
    foreach($a as $b) {
        $ships[$i] = array(
         'imo' => $b['imo'],
         'name' => $b['name'],
         'speed' => $b['speed'],
         'iceclass' => $b['iceclass'],
         'icebreaker' => $b['icebreaker'],
         'prompt' => $b['prompt'],
         'img' => $b['img'],
         'max_speed' => $b['max_speed'],
         'length' => $b['length'],
         'width' => $b['width'],
         'flag' => $b['flag'],
         'type' => $b['type'],
         'draft' => $b['draft'],
         'tonnage' => $b['tonnage'],
         'color' => $b['color']
        );
        
        if (!empty($historyArr[ $b['imo'] ])) {
            $ships[$i]['lat'] = $historyArr[ $b['imo'] ]['lat'];
            $ships[$i]['lng'] = $historyArr[ $b['imo'] ]['lng'];
            $ships[$i]['kurs'] = $historyArr[ $b['imo'] ]['kurs'];
            $ships[$i]['history_speed'] = $historyArr[ $b['imo'] ]['speed'];
            $ships[$i]['placement_timestamp'] = $historyArr[ $b['imo'] ]['eta'];
            $ships[$i]['history_date'] = $historyArr[ $b['imo'] ]['date'];
        }
        
        $i++;
    }    
    
    $json = json_encode($ships,true);
    exit($json);
    
}