<table class="table table-bordered mt-1" style="font-size: 14px;">
      <thead>
    <tr>
      <th scope="col">Корабль</th>
      <th scope="col">Класс</th>
      <th scope="col">Время отправления</th>
      <th scope="col">Пункт отправления</th>
      <th scope="col">Время прибытия</th>
      <th scope="col">Пункт назначения</th>
      <th scope="col">Время</th>
      <th scope="col">Дистанция</th>
      <th scope="col">Скорость</th>
    </tr>
  </thead>
  <tbody>
    <?foreach($rt as $k=>$v):$distVal = round($v['distance']);?>
    <tr>
      <td><?=$v['name'];?></td>
      <td><?=$v['iceclass'];?></td>
      <td><?=date('d.m.Y H:i',strtotime($v['datetime_start']));?></td>
      <td><?=$v['point_a'];?></td>
      <td><?=date('d.m.Y H:i',strtotime($v['datetime_end']));?></td>
      <td><?=$v['point_b'];?></td>
      <td><?=round($v['time']);?> ч.</td>
      <td><?=number_format($distVal,0,'',' ');?> км.</td>
      <td><?=round( $distVal/round($v['time']), 2 );?> км/час</td>
    </tr>
    <?endforeach;?>
  </tbody>

</table>