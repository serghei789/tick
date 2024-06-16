<div id="polzunok" class="mt-2 mb-3"></div>

<div class="row">
  <div class="col-md-2"><button class="jsPlayAnimation btn btn-primary w-100" data-status="1">Старт</button></div>
  <div class="col-md-2">
    <input type="text" name="intervalDate" id="jsShowDateInMap" value="<?=$minIntervalDate;?>" class="form-control jsDateTimepicker" />
  </div>
</div>

<form class="hidden">
<input type="hidden" id="objectManager" value="0" />
<input type="hidden" id="pointsColorManager" value="0" />
</form>

<div class="mt-2" id="map" style="width:100%; height: 550px;"></div>

<div class="w-100">
<iframe frameborder="0" src="https://datalens.yandex/bxp95u8cxmuuz?id_interval=<?=$minInterval;?>&model_id=<?=$model_id;?><?=$imoVal;?>" id="jsFrame" width="100%" height="2000px"></iframe>
</div>

<script type="text/javascript">
       list={};
       points={};
       icePoints={};
       icePolygons={};
       
       ymaps.ready(init);
 
        function init () {
            var myMap = new ymaps.Map('map', {
                    center: [70.466207,106.171875],
                    zoom: 3,
                    controls: ['zoomControl']
                }, {searchControlProvider: 'yandex#search', 
                 balloonPanelMaxMapArea: 'Infinity',
                 balloonMinHeight: 530});
                 
                 
                 <?if($result == true):?>
                 
                 var mapPolygonsJson = <?=$mapPolygonsJson;?>;
                 var mapPointsJson = <?=$mapPointsJson;?>;
                 
                 // Макет кнопки должен отображать поле data.content
                // и изменяться в зависимости от того, нажата кнопка или нет.
                 var buttonLayout = ymaps.templateLayoutFactory.createClass(
                    '<div class="btn btn-primary">' +
                    '$[data.content]' +
                    '</div>'
                 ),
                 
                 buttons = {
                 
                    polygons: new ymaps.control.Button({
                       data: {content: "Полигоны"}
                     }, {
                     layout: buttonLayout
                     }),
                     
                     pointsColor: new ymaps.control.Button({
                       data: {content: "Точки"}
                     }, {
                     layout: buttonLayout
                     })
                 };
                 
                  // создаем событие нажатия на кнопку
                  buttons.polygons.events.add('press', function () {
                     //$('#jsMapButtonsLoader').removeClass('hidden').addClass('mapButtonsLoader');
                     
                     if ($('#objectManager').val() == 0) {

                        if ($('#pointsColorManager').val() == 1) {
                            objectManagerPoints.removeAll();
                            $('#pointsColorManager').val(0);
                        }
                        
                        objectManager = new ymaps.ObjectManager();
                        myMap.geoObjects.add(objectManager);
                        objectManager.add(mapPolygonsJson);
                        $('#objectManager').val(1);
                        
                       //$('#jsMapButtonsLoader').removeClass('mapButtonsLoader').addClass('hidden');
                     }
                     
                     else {
                        objectManager.removeAll();
                        $('#objectManager').val(0);
                     }
                 });
                 
                 // создаем событие нажатия на кнопку
                  buttons.pointsColor.events.add('press', function () {
                     
                     if ($('#pointsColorManager').val() == 0) {
                        
                        if ($('#objectManager').val() == 1) {
                            objectManager.removeAll();
                            $('#objectManager').val(0);
                        }
                        
                        objectManagerPoints = new ymaps.ObjectManager();
                        myMap.geoObjects.add(objectManagerPoints);
                        objectManagerPoints.add(mapPointsJson);
                        $('#pointsColorManager').val(1);
                     }
                     
                     else {
                        objectManagerPoints.removeAll();
                        $('#pointsColorManager').val(0);
                     }
                 });
            
                 // добавляем на карту созданные кнопки
                for (var key in buttons) {
                  if (buttons.hasOwnProperty(key)) {
                    myMap.controls.add(buttons[key]);
                  }
                }
                
                <?if($points!=false):?>
                var pointsArr = <?=json_encode($points,true);?>;
                
                $.each(pointsArr, function(i,values) {
                    
                var descr = '';  
                
                if (values['name'] != '') {
                    descr = values['point_name'] + ' (lng: '+values['longitude']+', lat: '+values['latitude']+')';
                }
                
                else {
                    descr = 'lng: '+values['longitude']+', lat: '+values['latitude'];
                }
                
                var circleLayout = ymaps.templateLayoutFactory.createClass('<div class="circle_layout" style="background-color: green;"></div>');

                points[ values['point_id'] ] = new ymaps.Placemark([values['latitude'],values['longitude']], {
                   hintContent: descr
                 },{
                    iconLayout: circleLayout,
                    iconShape: {
                    type: 'Circle',
                    coordinates: [0, 0],
                    radius: 25
                    }
                 });

                 myMap.geoObjects.add(points[values['point_id']]);	
                 points[values['point_id']].geometry.setCoordinates([values['latitude'],values['longitude']]);
                });
                <?endif;?>
                
                var tracking = <?=json_encode($tracking2,true);?>;
                var startRoutes = <?=json_encode($startRoutes,true);?>;
                var caravanInfo = <?=json_encode($caravanInfo,true);?>;
                var caravanList = <?=json_encode($caravanListArr,true);?>;
                var caravanListBaloon = <?=json_encode($caravanListBaloon,true);?>;
                var intervalCoords = <?=json_encode($intervalCoords,true);?>;
                
                             
               $.each(tracking, function(uniqId,v) {
                  
                 var coords = JSON.parse('['+v+']');
                 var geometry = coords,
                 properties = {
                     hintContent: ""
                 },
                 options = {
                 draggable: false,
                 strokeColor: '#2b6ed1',
                 strokeWidth: 3,
                 strokeStyle: 'dash'
                 },
			     
                 polylineArr = new ymaps.Polyline(geometry, properties, options);
                 myMap.geoObjects.add(polylineArr);
                 
                 var startCoords =  JSON.parse(startRoutes[uniqId]);
                 
                         
                 list[uniqId] = new ymaps.Placemark(startCoords,{
	                      iconContent: caravanList[ caravanInfo[uniqId]['caravan_id'] ],
                          balloonContentHeader: '<h5>Караван №'+caravanInfo[uniqId]['caravan_id']+'</h5>',
                          balloonContentBody: '<div class="baloon_body"><div class="baloon_caravan_info">Маршрут: '+caravanInfo[uniqId]['point_a']+' - '+caravanInfo[uniqId]['point_b']+'</div>' + caravanListBaloon[ caravanInfo[uniqId]['caravan_id'] ]+'</div>'
                         },
                         {
                            preset: caravanInfo[uniqId]['icon']
                        });
                        
                        if (intervalCoords[<?=$minInterval?>][uniqId] == undefined) {
                             list[uniqId].options.set('visible', false);
                        }
                        
                        myMap.geoObjects.add(list[uniqId]);	
                        list[uniqId].geometry.setCoordinates(startCoords);
                        
               });
               

       // функция, которая производит изменения на карте  
       
       var dateIntervalPoints = <?=json_encode($dateIntervalsPoints,true);?>;
       var intervalPointsColor = <?=json_encode($pointsColorsArr,true);?>; 
       var dateIntervalsPointsDescr = <?=json_encode($dateIntervalsPointsDescr,true);?>;
       var dateIntervalsCalendar = <?=json_encode($dateIntervalsCalendar,true);?>;
       var dateIntervalsEditIntput = <?=json_encode($dateIntervalsEditIntput,true);?>
        
       function changeMap(selection) {
          
          if (intervalCoords[selection] != undefined) {

              $.each(list, function(i,coords) {
                if (intervalCoords[selection][i] == undefined) {
                  list[i].options.set('visible', false);
                }
              });
              
              $.each(intervalCoords[selection], function(i,coords) {
            
                if (list[i].options.get('visible') === false) {
                    list[i].options.set('visible', true);
                }

                var test = {};
                test = coords.split(",");
                list[i].geometry.setCoordinates([test[0],test[1]]);
             });
              
          }
          
          else {
             $.each(list, function(i,coords) {
                list[i].options.set('visible', false);
             });
          }
          
          if (dateIntervalPoints[selection] != undefined && $('#objectManager').val() == 1) {
            $.each(dateIntervalPoints[selection], function(polygon_id,color_id) {
                objectManager.objects.setObjectOptions(polygon_id, {fillColor: intervalPointsColor[ color_id ], strokeColor: intervalPointsColor[ color_id ]});
            });
          }
          
          if (dateIntervalPoints[selection] != undefined && $('#pointsColorManager').val() == 1) {
            $.each(dateIntervalPoints[selection], function(polygon_id,color_id) {
                objectManagerPoints.objects.setObjectOptions(polygon_id, {fillColor: intervalPointsColor[ color_id ], strokeColor: intervalPointsColor[ color_id ]});
                objectManagerPoints.objects.setObjectProperties(polygon_id, {hintContent: dateIntervalsPointsDescr[selection][polygon_id]});
            });
          }
          
          if (dateIntervalsEditIntput[selection] != undefined) {
             $('input[name="intervalDate"]').val(dateIntervalsEditIntput[selection]);
          }
       }
       
       // функция, для обновления данных в iframe
       function changeIframe(selection) {
          var frameUrl = 'https://datalens.yandex/bxp95u8cxmuuz?id_interval='+selection+'&model_id=<?=$model_id;?><?=$imoVal;?>';
          $('#jsFrame').attr('src',frameUrl); 
       }

       $("#polzunok").slider({
         min: <?=$minInterval;?>,
         max: <?=$maxInterval;?>,
         step: 1,
         animate: "fast",
         range: "min",
         stop: function( event, ui ) { 
            changeIframe(ui.value);
         },
         slide: function( event, ui ) { 
            changeMap(ui.value);
         }
       });
       
       $('body .jsPlayAnimation').on('click',   function() {
           var tt = $(this);
           var status = tt.attr('data-status');
           var intID = tt.attr('data-interval');
           
           if (status == 1) { 
             var intervalId = setInterval( function() {
                 // получаем текущее значение ползунка
                 var selection = $("#polzunok").slider( "value" );
                 
                 if (selection == <?=$maxInterval;?>) {
                    clearInterval(intervalId);
                    
                    var selection2 = $("#polzunok").slider( "value" );
                    changeIframe(selection2);
                    
                    tt.text('Старт').attr('data-status','1');
                    return false;
                 }
                 
                 selection = selection + 1;
                 
                 //устанавливаем новое значение ползунка
                 $('#polzunok').slider('option', 'value', selection);
                 
                 // производим изменения на карте
                 changeMap(selection); 
               }, 100 );
               
               tt.text('Стоп').attr('data-status','2');
               tt.attr('data-interval',intervalId);
               
               // подгружаем таб. со всеми кораблями
               var frameUrl = 'https://datalens.yandex/bxp95u8cxmuuz?model_id=<?=$model_id;?>';
               $('#jsFrame').attr('src',frameUrl); 
           }
       
           if (status == 2) { 
               clearInterval(intID);
            
               var selection2 = $("#polzunok").slider( "value" );
               changeIframe(selection2);

               tt.text('Старт').attr('data-status','1');
           }
          
       });
       
        $('body #jsShowDateInMap').on('change', function() {
           var tt = $(this);
           var intervalDate = tt.val();
           var interval_id = dateIntervalsCalendar[ intervalDate ];
           
           if (interval_id != undefined) {
             // устанавливаем новое значение ползунка
             $('#polzunok').slider('option', 'value', interval_id);
             // производим изменения на карте
             changeMap(interval_id);
             // меняем дашборд под картой
             changeIframe(interval_id);
           }
       });
        <?endif;?>
    }
    
    
   </script>