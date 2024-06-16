<?php

$data = array();
$clear = array(',',',');

$a = db_query("SELECT id, lat, lng 
 FROM history 
 WHERE real_val=0");
 
if ($a != false) {
    foreach($a as $b) {
        
        // очищаем значения координат от букв
        $lat = clearData( str_replace($clear,'.',$b['lat']), 'area');
        $lng = clearData( str_replace($clear,'.',$b['lng']), 'area');
        
        if ($lat > 0 && $lat <= 200) {
            $data[ $b['id'] ] = array(
              'lat' => $lat,
              'lng' => $lng
            );
        }
        
        if ($lat >= 1000 && $lat <= 200000) {
            
            $lat = $lat / 100;
            $lng = $lng / 100;
            
            $lat = str_replace($clear,'.',$lat);
            $lng = str_replace($clear,'.',$lng);
            
            $data[ $b['id'] ] = array(
              'lat' => $lat,
              'lng' => $lng
            );
        }
    }
    
    foreach($data as $id=>$val) {
        $upd = db_query("UPDATE history 
        SET lat_real='".$val['lat']."',
        lng_real='".$val['lng']."',
        real_val=1 
        WHERE id=".$id." 
        LIMIT 1","u");
        
        if ($upd != true) {
            echo $id.'<br>';
        }
    }
    
    
    
}
exit();
//exit( print_r($data) );


/*
require_once $_SERVER['DOCUMENT_ROOT'] . "/lib/phpQuery.php";

for($i=2;$i<=46;$i++) {
    $htmlContent = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/files/pars/'.$i.'.html');
    
    $pq = phpQuery::newDocument($htmlContent);
    $tab = $pq->find('.table-responsive')->html();
    
    $pq2 = phpQuery::newDocument($tab);
    
    $data['table'] = array();
 
    $entry = $pq2->find('table tr');
    foreach ($entry as $row) {
	  $row = pq($row);
	  //$name = $row->find('td:eq(0)')->text();
	  $name_ship = $row->find('td:eq(1)')->text();
      $imo = $row->find('td:eq(2)')->text();
      $lat = $row->find('td:eq(3)')->text();
      $lng = $row->find('td:eq(4)')->text();
      $kurs = $row->find('td:eq(5)')->text();
      $speed = $row->find('td:eq(6)')->text();
      $eta = $row->find('td:eq(7)')->text();
      $date = $row->find('td:eq(8)')->text();
      
      if ($name_ship != 'Название судна') {
        
        $add = db_query("INSERT INTO history (
        name_ship,
        imo,
        lat,
        lng,
        kurs,
        speed,
        eta,
        date,
        date_bd) VALUES (
        '".clearData($name_ship,'str2')."',
        '".trim($imo)."',
        '".clearData($lat,'str2')."',
        '".clearData($lng,'str2')."',
        '".trim($kurs)."',
        '".clearData($speed,'str2')."',
        '".clearData($eta,'str2')."',
        '".trim($date)."',
        '".date('Y-m-d',strtotime(trim($date)))."'
        )", "i");
        
        if (intval($add) == 0) {
            echo $i.' '.$name_ship.' '.$date.'<br>';
        }
      }
	  
    }
 
    //print_r($data['table']);
    
    
    
    //exit();
}
*/