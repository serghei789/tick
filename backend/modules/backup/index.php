<?php
$tab = clearData($_GET['tab'],'get');
    
$del = db_query("DROP TABLE ".$tab);
$creat = db_query("CREATE TABLE u2671630_default.".$tab." LIKE u2671630_backup.".$tab);
$add = db_query("INSERT INTO u2671630_default.".$tab." SELECT * FROM u2671630_backup.".$tab);
    
exit('ok');    