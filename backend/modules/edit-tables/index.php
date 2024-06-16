<?php
$body = $_GET['json']; //Получаем в $body json строку

if (empty($body)) {
    exit();
}

$body = urldecode($body);
$arr = json_decode($body, true); //Разбираем json запрос на массив в переменную $arr

// таблица, которую нужно обновить
$table = clearData($_GET['tab'], 'get');

$where = null;

// обновление таблицы
if ($arr['method'] == 'update') {

    $update = null;
    $list = null;

    foreach ($arr['data'] as $key => $val) {
        if ($key == 'id') {
            $where = " WHERE id=" . intval($val) . " LIMIT 1";
        }
        
        else if ($key == 'model_id') {
            $where = " WHERE model_id=" . intval($val) . " LIMIT 1";
        }
        
        else {
            
            if ($table == 'constant') {
               $update .= "WHEN ".$key." THEN '".clearData($val)."' ";
               $list .= $key.',';
            }
            
            else {
                $update .= clearData($key, 'get') . "='" . clearData($val) . "',";
            }
            
        }
    }
    
    $update = trim($update, ',');
    $sql = "UPDATE " . $table . " SET " . $update . $where;
    
    if ($table == 'constant') {
        
        $list = trim($list,',');
        
        $sql = "UPDATE constant
        SET value = CASE id
        ".$update."
        ELSE value 
        END
        WHERE id IN (".$list.")";
    }

    $query = db_query($sql, "u");

    if ($query == true) {
        exit('ok');
    } else {
        exit($query);
    }
}
// -----------------------------------------------

// добавление данных в таб.
if ($arr['method'] == 'create') {

    $fields = null;
    $values = null;

    foreach ($arr['data'] as $key => $val) {
        $fields .= $key.',';
        $values .= "'".clearData($val)."',";
    }

    $fields = trim($fields, ',');
    $values = trim($values, ',');
    $sql = "INSERT INTO ".$table." (".$fields.") VALUES (".$values.")";

    $query = db_query($sql, "i");
    
      if (intval($query) > 0) {
        exit('ok');
      }
        
      else {
        exit($query);
      }
}
// -----------------------------------------------

// удаление из таблицы
if ($arr['method'] == 'delete') {
    
    $id = intval($arr['data']['id']);
    
    $sql = "DELETE FROM ".$table." WHERE id=".$id." LIMIT 1";
    
    if ($table == 'models') {
        $sql = "DELETE FROM ".$table." WHERE model_id=".$id." LIMIT 1";
    }
    
    if ($id == 0) {
        exit();
    }

    $query = db_query($sql, "d");
    
      if ($query == true) {
       exit('ok');
      }
        
      else {
        exit($query);
      }
}