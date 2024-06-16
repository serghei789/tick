<?php
$gant = db_query("SELECT s.model_id,
UNIX_TIMESTAMP(s.datetime_start)*1000 as start,
CASE when UNIX_TIMESTAMP(s.datetime_end)=0 then UNIX_TIMESTAMP(s.datetime_start)*1000 else UNIX_TIMESTAMP(s.datetime_end)*1000+3600000 end as end,
point_a AS point_begin, 
point_b AS point_end, smile, name, 'task' as type,
 ships.speed_m_s,
 tr.distance, 
tr.time, 
CASE when UNIX_TIMESTAMP(s.datetime_end)=0 THEN 0 ELSE ROUND(tr.distance/tr.time/ships.speed_m_s*100) END as progress, 
iceclass AS ice_class,
 color, 

CASE when icebreaker = 1 THEN CONCAT(s.caravan_id, '-', 'icebreaker')
ELSE CONCAT(s.caravan_id, '-', ships.imo)
END as id,
CASE when icebreaker = 1 THEN '' ELSE CONCAT(s.caravan_id, '-', 'icebreaker') end as  dependencies,
0 as priority 
FROM schedule as s 
JOIN caravan_list on caravan_list.caravan_id=s.caravan_id 
JOIN ships on ships.imo=caravan_list.imo 
JOIN trace_raiting as tr WHERE raiting=1 and tr.caravan_id=s.caravan_id
and s.datetime_end<>0
order by s.datetime_start, s.caravan_id ASC, icebreaker DESC");

  if ($gant != false) {
    $json = json_encode($gant,true);
    exit($json);
  } 