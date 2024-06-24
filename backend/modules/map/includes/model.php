<?php
    $result = false;
    $routesTable = null;

     // для фильтров
    $pointA = array();
    $pointB = array();
    $routesRating = array();
    $iceclassArr = array();
    $numberBid = array();
    $models = false;
    $shipsList = array();
    $sailing = array();

    $uniqIntervals = array();
    $dateTimeIntervals = array();
    $intervalCoords = array();
    $tracking2 = array();
    $startRoutes = array();
    $startRoutes2 = array();
    $finishRoutes = array();
    $caravanInfo = array();
    $ships = array();
    
    $uniqIntervalsStart = array();
    $uniqIntervalsFinish = array();
    $trackingAllPoints = array();
    
    $progressBar = null;
    
    // для ползунка
    $minInterval = 0;
    $maxInterval = 0;
    
    $sql = "SELECT t.*, 
    ti.datetime_start, 
    ti.datetime_end, 
    wl.point_a, 
    wl.point_b, 
    wp.id, 
    wp.sailing,
    tr.raiting, 
    ss.name, 
    ss.iceclass, 
    ss.imo, 
    ss.map_icon, 
    s.model_id 
    FROM schedule as s 
    JOIN caravan_list as cl ON cl.caravan_id = s.caravan_id and cl.model_id = cl.model_id 
    INNER JOIN ships as ss ON ss.imo = cl.imo 
    INNER JOIN wish_list_parts as wp ON wp.caravan_id = cl.caravan_id AND wp.model_id = s.model_id AND wp.point_a = s.point_a AND wp.point_b = s.point_b AND wp.datetime_start = s.datetime_start
    INNER JOIN wish_list as wl ON wl.id = wp.id 
    INNER JOIN trace_intervals AS t ON t.caravan_id = cl.caravan_id 
    INNER JOIN time_intervals as ti ON ti.id = t.id_interval 
    INNER JOIN trace_raiting as tr ON tr.caravan_id = t.caravan_id AND tr.route_id = t.route_id AND tr.version = t.version 
    WHERE s.model_id=".$model_id." ".$filter." 
    ORDER BY t.id_interval, ss.iceclass";
   
    $intervals = db_query($sql);
 
    if ($intervals != false) {
        //include $_SERVER['DOCUMENT_ROOT'].'/backend/modules/'.$moduleName.'/includes/update_base.inc.php';
        //exit();
    
       $result = true;
      
      
      foreach($intervals as $in) {
        
        $uniqId = $in['caravan_id'].$in['route_id'].$in['version']; // уникальный идентификатор маршрута
        $intervalCoords[ $in['id_interval'] ][ $uniqId ] = $in['lat'].','.$in['lng']; // координаты маршрутов по каждому интервалу
        
        
        // для формы с фильтрами 
        $iceclassArr[ $in['iceclass'] ] = $in['iceclass'];  // список ледовых классов
        $shipsList[ $in['imo'] ] = $in['name'];  // список кораблей
        
        if (!empty($in['id'])) {
            $numberBid[ $in['id'] ] = $in['id']; // номер заявки
        } 
        
        if (!empty($in['point_a'])) {
            $pointA[ $in['point_a'] ] = $in['point_a']; // список точек отпраления
        }
        
        if (!empty($in['point_b'])) {
            $pointB[ $in['point_b'] ] = $in['point_b'];  // список точек назначения
        }
        // ----------------------------------------------------
      
        // информация по каравану
        if ($in['raiting'] != 1) {
            $in['map_icon'] = 'islands#greyStretchyIcon';
        }
    
        $caravanInfo[ $uniqId ] = array(
          'caravan_id' => $in['caravan_id'],
          'name' => $in['name'],
          'iceclass' => $in['iceclass'],
          'icon' => $in['map_icon'],
          'point_a' => $in['point_a'],
          'point_b' => $in['point_b']
        );
        // ----------------------------------------------------
        
        // интервалы для ползунков
        $uniqIntervals[ $in['id_interval'] ] = $in['id_interval'];
        
        // пока не помню для чего это
        if (empty($uniqIntervalsStart[ $uniqId ])) {
          $uniqIntervalsStart[ $uniqId ] = $in['id_interval'];
        }
        
        $uniqIntervalsFinish[ $uniqId ] = $in['id_interval'];
        // ----------------------------------------------------
        
        // начальные координаты каждого маршрута
        if (empty($startRoutes[ $uniqId ])) {
            $startRoutes[ $uniqId ] = '['.$in['lat'].','.$in['lng'].']';
         }
         
         if (empty($startRoutes2[ $uniqId ])) {
            $startRoutes2[ $uniqId ] = $in['lat'].','.$in['lng'];
         }
         
         $finishRoutes[ $uniqId ] = $in['lat'].','.$in['lng'];
         // ----------------------------------------------------
        
         // координаты всех маршрутов
         if (empty($tracking2[ $uniqId ])) {
            $tracking2[ $uniqId ] = '['.$in['lat'].','.$in['lng'].']';
         }
        
         else {
           $tracking2[ $uniqId ] .= ',['.$in['lat'].','.$in['lng'].']';
         }
         
         $trackingAllPoints[] = $in['lat'].':'.$in['lng'];
         // ----------------------------------------------------
         
         $sailing[ $uniqId ] = $in['sailing'];
        
    }    
    
    $trackingAllPoints = array_unique($trackingAllPoints); // оставляем только уникальные точки маршрутов
  
    $minInterval = min($uniqIntervals); // начальный номер интервала ползунка
    $maxInterval = max($uniqIntervals); // конечный номер интервала
    
    if (!empty($numberBid)) {
      ksort($numberBid);
    }
   
    // достаём дату время всех интервалов
    $dateIntervals = array();
    $dateIntervalsCalendar = array();
    $dateIntervalsEditIntput = array();
    
    $datesIntIce = array(
     '2022-03-01' => 1,
     '2022-03-10' => 1,
     '2022-03-17' => 1,
     '2022-03-24' => 1,
     '2022-03-31' => 1,
     '2022-04-02' => 1,
     '2022-04-07' => 1,
     '2022-04-14' => 1,
     '2022-04-21' => 1,
     '2022-04-28' => 1,
     '2022-05-05' => 1,
     '2022-05-12' => 1,
     '2022-05-19' => 1,
     '2022-05-26' => 1
    );
    
    $timeIntervals = db_query("SELECT * FROM time_intervals ORDER BY id"); 
    
    if ($timeIntervals != false) {
       foreach($timeIntervals as $b) {
          
          $intervalDate = date('d.m.Y',strtotime($b['datetime_start']));
          
          if (empty($dateIntervalsCalendar[ $intervalDate ])) {
             $dateIntervalsCalendar[ $intervalDate ] = $b['id'];
          }
          
          $dateIntervalsEditIntput[ $b['id'] ] = $intervalDate;
          
          if ($b['id'] == $minInterval) {
             $dateTimeIntervals[ $b['id'] ] = array('start' => date('Y-m-d',strtotime($b['datetime_start'])), 'end' => date('Y-m-d',strtotime($b['datetime_end'])));
          }
          
          $dateInt = substr($b['datetime_start'],0,10);
          
          if (empty($dateIntervals[ $b['id'] ]) && !empty($datesIntIce[ $dateInt ])) {
              $dateIntervals[ $b['id'] ] = $dateInt;
          }
       }
       
       $dateIntervals = array_unique($dateIntervals);    
    }
    
    // заполняем разрывы в интервалах
    for ($i=$minInterval;$i<=$maxInterval;$i++) {
    
        if (empty($uniqIntervals[$i])) {
            $uniqIntervals[$i] = 0;
        }
    }
    
    ksort($uniqIntervals);
    // ----------------------------------------------------
    
    // с какой даты начинается ползунок
    $minIntervalDate = date('d.m.Y', strtotime($dateTimeIntervals[ $minInterval ]['start']) );
    
    
    // все точки из которых строятся маршруты
    $iceclassReplace = array('Arc9(Arctic)','Arc9(Taimyr)');
    $points = db_query("SELECT * FROM y_points");
    
     // достаём список караванов и кораблей
    $sh = db_query("SELECT sh.*,
    iceclass_list.id 
    FROM ships AS sh 
    LEFT JOIN iceclass_list ON sh.iceclass = iceclass_list.iceclass 
    ORDER BY iceclass_list.id");
    
    foreach($sh as $in) {
        
        if ($in['iceclass'] == 'Arc9(Arctic)' || $in['iceclass'] == 'Arc9(Taimyr)') {
            $in['name'] = '&#128674; '.$in['name'];
        }
        
        $ships[ $in['imo'] ] = array(
          'iceclass_id' => $in['id'],
          'name' => $in['name'],
          'iceclass' => $in['iceclass'],
          'img' => DOMAIN.'/img/ai/ANIME/'.$in['img']
        );
    }
    
    $caravanListArr = array();
    $caravanListSort = array();
    $caravanListBaloon = array();

    $caravanList = db_query("SELECT * 
    FROM caravan_list 
    WHERE model_id=".$model_id);
  
    if ($caravanList != false) {
      foreach($caravanList as $cl) {
        $caravanListSort[ $cl['caravan_id'] ][] = array(
          'iceclass_id' => $ships[ $cl['imo'] ]['iceclass_id'],
          'imo' => $cl['imo']
        );
      }
      
    // сохраняем список кораблей в караване отсортированных по iceclass  
    foreach($caravanListSort as $caravan_id=>$val) {
         asort($val);
        
         foreach($val as $k=>$v) {
            
            $iceclass = str_replace($iceclassReplace,'ледокол',$ships[ $v['imo'] ]['iceclass']);
            
            $baloonTemplate = '<div class="row" style="--bs-gutter-x: 0;">'
            .'<div class="col-md-5 baloon_table">'
            .'<div class="baloon_img_div"><img src="'.$ships[ $v['imo'] ]['img'].'"></div>'
            .'</div>'
            .'<div class="col-md-7 balloon_content baloon_table">'
            .$ships[ $v['imo'] ]['name'].' - '.$iceclass
            .'<br>IMO: '.$v['imo'].'<br>'
            .'<a href="https://smpflot.ru/ship/'.$v['imo'].'" target="_blank">Страница судна</a>'
            .'</div>'
            .'<div>';
            
            if (empty($caravanListBaloon[ $caravan_id ])) {
               $caravanListBaloon[ $caravan_id ] = $baloonTemplate;
            }
            
            else {
               $caravanListBaloon[ $caravan_id ] .= $baloonTemplate;
            }
            
            if (empty($caravanListArr[ $caravan_id ])) {
               $caravanListArr[ $caravan_id ] = $ships[ $v['imo'] ]['name'];
            }
        
            else {
               $caravanListArr[ $caravan_id ] .= ', '.$ships[ $v['imo'] ]['name'];
            }
         }
      }
    }
    
    // ---------------------------------------------------------------------------------------
    
    
    // точки, замена полигонам
    $mapPolygonsJson = array(
      "type" => "FeatureCollection",
      "features" => array()
    );
    
    $mapPointsJson = array(
      "type" => "FeatureCollection",
      "features" => array()
    );
    
    
    $uniqPoints = array();
    $uniqPoints2 = array();
    $dateIntervalsPoints = array();
    $dateIntervalsPointsAll = array();
    $pointsColorsArr = array();
    $showPoints = array();
    
    $pointsColors = db_query("SELECT * FROM colors");
    
    foreach($pointsColors as $pc) {
      $pointsColorsArr[ $pc['id'] ] = $pc['color'];
    }
  
    $icePoints = db_query("SELECT lat_a, 
    lng_a,
    lat_b,
    lng_b,
    start_date,
    end_date,
    cohesion, 
    concat(col,'-',row) as id,
    round(10-10*cohesion/22) AS color_id 
    FROM square_ice  
    WHERE status=1");
    
    
    
    if ($icePoints != false) {
        foreach($icePoints as $b) {
            $uniqPoints[ $b['id'] ] = array('lat' => $b['lat_a'], 'lng' => $b['lng_a'], 'lat2' => $b['lat_b'], 'lng2' => $b['lng_b']);
        }
        
        foreach($icePoints as $b) {
          
          foreach($dateTimeIntervals as $interval_id=>$val) {
             if ($val['start'] >= $b['start_date'] && $val['end'] <= $b['end_date']) {
                $dateIntervalsPointsAll[ $interval_id ][ $b['id'] ] = array(
                  'color_id' => $b['color_id'],
                  'descr' => 'lat: '.$b['lat_a'].', lng: '.$b['lng_a'].', cohesion: '.$b['cohesion']
                );
             }
          }
          
          foreach( $dateIntervals as $interval_id=>$interval_date ) {
            if ($interval_date >= $b['start_date'] && $interval_date <= $b['end_date']) {
                 $dateIntervalsPoints[ $interval_id ][ $b['id'] ] = $b['color_id'];
                 $dateIntervalsPointsDescr[ $interval_id ][ $b['id'] ] = 'lat: '.$b['lat_a'].', lng: '.$b['lng_a'].', cohesion: '.$b['cohesion'];
            }
          }
        }
        
        //exit(print_r($dateIntervalsPoints));
        
       // перебираем массив с точками для изменения цвета и исключаем те, которые не меняют цвет с минимального и до максимального интервала
       $countSamePoints = array();
       $countColorIntervals = count($dateIntervalsPoints);
       foreach($dateIntervalsPoints as $interval_id=>$val) {
          foreach($val as $point_id=>$color_id) {
             if ($dateIntervalsPointsAll[ $minInterval ][ $point_id ]['color_id'] == $color_id) {
                if (empty($countSamePoints[$point_id])) {
                    $countSamePoints[$point_id] = 1;
                }
                
                else {
                    $countSamePoints[$point_id]++;
                }
                
             }
          }
       }  
       
       foreach($dateIntervalsPoints as $interval_id=>$val) {
          foreach($val as $point_id=>$color_id) {
             if ($countSamePoints[$point_id] == $countColorIntervals) {
                unset($dateIntervalsPoints[ $interval_id ][ $point_id ]);
             }
          }
       }  
     
        //exit(print_r($dateIntervalsPoints));
       // ------------------------------------------------------------------------------------------------           
       foreach($uniqPoints as $point_id=>$val) {
            foreach($trackingAllPoints as $key=>$coords) {
              $coord = explode(':',$coords);
              
              // вычисляем расстояие между точками
              $distance = round( distance($coord[0], $coord[1], $val['lat'], $val['lng']) );
                    
              if ($distance <=30) {
                 $showPoints[ $point_id ] = 1;
              } 
            }
        }
        
        foreach($showPoints as $point_id=>$v) {
             
          $color = '#808080';
          $descr = 'нет данных';
                        
          $polygon = array(
            array($uniqPoints[$point_id]['lat'], $uniqPoints[$point_id]['lng']),
            array($uniqPoints[$point_id]['lat'], $uniqPoints[$point_id]['lng2']),
            array($uniqPoints[$point_id]['lat2'], $uniqPoints[$point_id]['lng2']),
            array($uniqPoints[$point_id]['lat2'], $uniqPoints[$point_id]['lng'])
          );
                        
          if ($dateIntervalsPointsAll[ $minInterval ][ $point_id ]['color_id'] !== '') {
             $color = $pointsColorsArr[ $dateIntervalsPointsAll[ $minInterval ][ $point_id ]['color_id'] ];
          }

          if (!empty($dateIntervalsPointsAll[ $minInterval ][ $point_id ]['descr'])) {
             $descr = $dateIntervalsPointsAll[ $minInterval ][ $point_id ]['descr'];
          }
                       
          $mapPolygonsJson['features'][] = array(
            'type' => "Feature",
            'id' => $point_id,
            'options' => array('fillColor' => $color, 'strokeColor' => $color, 'opacity' => 0.5),
            'properties' => array('hintContent' => $descr),
            'geometry' => array(
              'type' => 'Polygon',
              'coordinates' => array($polygon)
            )
          );
                       
          $mapPointsJson['features'][] = array(
            'type' => "Feature",
            'id' => $point_id,
            'properties' => array('hintContent' => $descr),
            'options' => array('fillColor' => $color, 'strokeColor' => $color, 'opacity' => 0.6),
            'geometry' => array(
              'type' => 'Circle',
              'coordinates' => array( $uniqPoints[$point_id]['lat'], $uniqPoints[$point_id]['lng']),
              'radius' => 12500
            )
          );
        }
        
       $mapPolygonsJson = json_encode($mapPolygonsJson,true);
       $mapPointsJson = json_encode($mapPointsJson,true);
        
    }
    
    // достаём данные по таб. под картой
    $routesFilter = null;
    
    if (!empty($imoRoutesTable)) {
        
        if (preg_match('/,/',$imoRoutesTable)) {
            $routesFilter = " AND ss.imo IN (".$imoRoutesTable.") ";
        }
        
        else {
            $routesFilter = " AND ss.imo='".$imoRoutesTable."' ";
        }
        
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
    AND t.id_interval=".$minInterval." 
    ".$routesFilter."
    ORDER BY t.id_interval, wp.datetime_start ASC");
    
    if ($rt != false) {
        // подключаем шаблон таб. и заполняем его данными
        ob_start();
        include $_SERVER['DOCUMENT_ROOT'].'/backend/modules/map/includes/routesTable.inc.php';
        $routesTable = ob_get_clean();
    }
    
    
    
}