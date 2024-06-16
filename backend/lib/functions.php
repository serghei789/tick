<?php
// функция построения квадрата
function getBoundingBox($lat,$lng,$distance) {

    $radius = 6371; // of earth in km

    // bearings - FIX   
    $due_north = deg2rad(0);
    $due_south = deg2rad(180);
    $due_east = deg2rad(90);
    $due_west = deg2rad(270);

    // convert latitude and longitude into radians 
    $lat_r = deg2rad($lat);
    $lon_r = deg2rad($lng);

    $northmost  = asin(sin($lat_r) * cos($distance/$radius) + cos($lat_r) * sin ($distance/$radius) * cos($due_north));
    $southmost  = asin(sin($lat_r) * cos($distance/$radius) + cos($lat_r) * sin ($distance/$radius) * cos($due_south));

    $eastmost = $lon_r + atan2(sin($due_east)*sin($distance/$radius)*cos($lat_r),cos($distance/$radius)-sin($lat_r)*sin($lat_r));
    $westmost = $lon_r + atan2(sin($due_west)*sin($distance/$radius)*cos($lat_r),cos($distance/$radius)-sin($lat_r)*sin($lat_r));


    $northmost = rad2deg($northmost);
    $southmost = rad2deg($southmost);
    $eastmost = rad2deg($eastmost);
    $westmost = rad2deg($westmost);

    // sort the lat and long so that we can use them for a between query        
    if ($northmost > $southmost) { 
        $lat1 = $southmost;
        $lat2 = $northmost;

    } else {
        $lat1 = $northmost;
        $lat2 = $southmost;
    }


    if ($eastmost > $westmost) { 
        $lon1 = $westmost;
        $lon2 = $eastmost;

    } else {
        $lon1 = $eastmost;
        $lon2 = $westmost;
    }
    
    $lat1 = str_replace(',','.',$lat1);
    $lat2 = str_replace(',','.',$lat2);
    $lon1 = str_replace(',','.',$lon1);
    $lon2 = str_replace(',','.',$lon2);
    
    
    $result = array(
      array($lat1, $lon1),
      array($lat1, $lon2),
      array($lat2, $lon2),
      array($lat2, $lon1)
    );
    
    //$result = '[[['.$lat1.','.$lon1.'],['.$lat1.','.$lon2.'],['.$lat2.','.$lon2.'],['.$lat2.','.$lon1.']]]';
    
    return $result;
}

function secondsToTime($seconds) {
    $dtF = new \DateTime('@0');
    $dtT = new \DateTime("@$seconds");
    return $dtF->diff($dtT)->format('%a д. %h ч.');
}

function distance($lat_1, $lon_1, $lat_2, $lon_2) {

    $radius_earth = 6371; // Радиус Земли

    $lat_1 = deg2rad($lat_1);
    $lon_1 = deg2rad($lon_1);
    $lat_2 = deg2rad($lat_2);
    $lon_2 = deg2rad($lon_2);

    $d = 2 * $radius_earth * asin(sqrt(sin(($lat_2 - $lat_1) / 2) ** 2 + cos($lat_1) * cos($lat_2) * sin(($lon_2 - $lon_1) / 2) ** 2));

    return $d;
}

function my_ucwords($str) {
    $s = explode(' ',$str);
    $text = null;
    
    foreach($s as $b) {
        if (empty($text)) {
            $text = mb_ucfirst($b);
        }
        
        else {
            $text .= ' '.mb_ucfirst($b);
        }
    }
    
    return $text;
}

// функция для рассчёта вхождения точки в полигон
function contains($point, $polygon) {
    
    if($polygon[0] != $polygon[count($polygon)-1])
        $polygon[count($polygon)] = $polygon[0];
    
    //exit(print_r($polygon));
    
    
    $j = 0;
    $oddNodes = false;
    $x = $point[1];
    $y = $point[0];
    $n = count($polygon);
    for ($i = 0; $i < $n; $i++)
    {
        $j++;
        if ($j == $n)
        {
            $j = 0;
        }
        if ((($polygon[$i][0] < $y) && ($polygon[$j][0] >= $y)) || (($polygon[$j][0] < $y) && ($polygon[$i][0] >=
            $y)))
        {
            if ($polygon[$i][1] + ($y - $polygon[$i][0]) / ($polygon[$j][0] - $polygon[$i][0]) * ($polygon[$j][1] -
                $polygon[$i][1]) < $x)
            {
                $oddNodes = !$oddNodes;
            }
        }
    }
    return $oddNodes;
}

function str_replace_once($search, $replace, $text){ 
   $pos = strpos($text, $search); 
   return $pos!==false ? substr_replace($text, $replace, $pos, strlen($search)) : $text; 
}


// высчитывание центральной точки среди нескольких точек
function centerCoor($coordArr) {
    
    $result = array();
    $lng = null;
    $lat = null;
    
    foreach($coordArr as $key=>$val) {
        $lng += $val['lng'];
        $lat += $val['lat'];
    }
    
    $lng = $lng / count($coordArr);
    $lat = $lat / count($coordArr);
    
    $result = array($lng,$lat);
    return $result;
}

function transformUtcDate($date,$time_zone) {
    
    $a = strtotime($date);
    $hours = $time_zone * 3600;
    $time = $a + $hours;
    
    return date('d.m.Y в H:i',$time); 
}

function mb_ucfirst($str, $encoding='UTF-8') {
        $str = mb_ereg_replace('^[\ ]+', '', $str);
        $str = mb_strtoupper(mb_substr($str, 0, 1, $encoding), $encoding).mb_substr($str, 1, mb_strlen($str), $encoding);
        return $str;
}

function clearData($data, $type = 'str')
{
    
    global $xc;

    switch ($type) {

        case 'str':
            return mysqli_real_escape_string( $xc['db'], trim(stripslashes(strip_tags($data))));
            break;
        
        case 'str2':
            return mysqli_real_escape_string( $xc['db'], trim(stripslashes($data)));
            break;
           
        case 'redactor':
            return stripslashes($data);
            break;

        case 'int':
            return preg_replace('/[^0-9]/', '', $data);
            break;

        case 'get':
            return preg_replace('/[^a-zA-Z0-9-_]/', '', $data);
            break;

        case 'guid':
            return preg_replace('/[^a-z0-9-]/', '', $data);
            break;

        case 'area':
            return preg_replace('/[^0-9\.]/', '', str_replace(',', '.', $data));
            break;

        case 'date':
            return preg_replace('/[^0-9-]/', '', $data);
            break;

        case 'domain':
            return preg_replace('/[^a-z0-9-\.]/', '', $data);
            break;
    }
}

function compress($buffer)
{
    $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
    $buffer = preg_replace('/\/\/.*\r\n/', '', $buffer);
    $buffer = str_replace(array(
        "\r\n",
        "\r",
        "\n",
        "\t",
        '  ',
        '    ',
        '    '), '', $buffer);
    return $buffer;
}


function is_mobile($agent) {
    $result = false;
    if (preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',
        $agent) || preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',
        substr($agent, 0, 4)))
        $result = true;

    return $result;
}

function lang_function($num, $word, $result = 1) {
    $num_1_a = array(1);
    $num_2_a = array(
        2,
        3,
        4);
    $words_a = array(
        'дом' => array(
            'дом',
            'дома',
            'домов'),
        'адрес' => array(
            'адрес',
            'адреса',
            'адресов'),
        'год' => array(
            'год',
            'года',
            'лет'));
    if ($result == 1) {
        if (substr($num, -2, 2) > 10 and substr($num, -2, 2) < 20) {
            return $num . ' ' . $words_a[$word][2];
        } else {
            if (in_array(substr($num, -1), $num_1_a))
                return $num . ' ' . $words_a[$word][0];
            elseif (in_array(substr($num, -1), $num_2_a))
                return $num . ' ' . $words_a[$word][1];
            else
                return $num . ' ' . $words_a[$word][2];
        }
    } elseif ($result == 2) {
        if (substr($num, -2, 2) > 10 and substr($num, -2, 2) < 20) {
            return $words_a[$word][2];
        } else {
            if (in_array(substr($num, -1), $num_1_a))
                return $words_a[$word][0];
            elseif (in_array(substr($num, -1), $num_2_a))
                return $words_a[$word][1];
            else
                return $words_a[$word][2];
        }
    }
}