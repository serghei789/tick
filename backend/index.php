<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

date_default_timezone_set("UTC"); // Устанавливаем часовой пояс по Гринвичу
header('Content-Type: text/html; charset=utf-8'); // устанавливаем кодировку
setlocale(LC_ALL, 'ru_RU', 'ru_RU.UTF-8', 'ru', 'russian');

require_once $_SERVER['DOCUMENT_ROOT'] . "/backend/config.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/backend/lib/db.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/backend/lib/functions.php";

if (isset($_POST['action']) && $_POST['action'] == 'ajax' && !empty($_POST['module'])) {
    if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/backend/modules/' . clearData($_POST['module'], 'get') . '/ajax.php')) {
      require_once $_SERVER['DOCUMENT_ROOT'] . '/backend/modules/' . clearData($_POST['module'], 'get') . '/ajax.php';
    }
    
    exit();
}

// если в url не указано название модуля, то по умолчанию загружается модуль главной страницы
if (empty($_GET['mod']))
    $xc['module'] = 'main';
    
else
    $xc['module'] = clearData($_GET['mod'], 'get');
// ---------------------------------------------------------------------------------------------------------------------

// если указанный в url модуль не существует, то по умолчанию загружается модуль главной страницы
if (!file_exists($_SERVER['DOCUMENT_ROOT'] . '/backend/modules/' . $xc['module'] .'/index.php')) {
      $xc['module'] = 'main';
}
// ---------------------------------------------------------------------------------------------------------------------

if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/backend/modules/' . $xc['module'] . '/index.php')) {
    require_once $_SERVER['DOCUMENT_ROOT'] . '/backend/modules/' . $xc['module'] . '/index.php';
}

if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/backend/modules/' . $xc['module'] . '/tmp.inc.php') && filesize($_SERVER['DOCUMENT_ROOT'] . '/backend/modules/' . $xc['module'] . '/tmp.inc.php') > 0) {
    require_once $_SERVER['DOCUMENT_ROOT'] . '/backend/modules/' . $xc['module'] . '/tmp.inc.php';
}
    
?>