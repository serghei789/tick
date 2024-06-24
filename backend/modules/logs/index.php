<?php

// вытаскиваем логи пересчёта моделей
$logsHtml = null;

$logs = db_query("SELECT * FROM logs ORDER BY id DESC LIMIT 100");

if ($logs!=false) {
    foreach($logs as $log) {
        $logsHtml .= '<div>'.$log['time'].' '.$log['progress'].' % '.$log['text'].'</div>';
    }
}
    
exit($logsHtml);