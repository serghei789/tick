<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="content-type" content="text/html" />
	<title>Северный морской путь</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="stylesheet" type="text/css" href="<?=DOMAIN;?>/backend/lib/js/jquery/jquery-ui/jquery-ui.css">
    <link rel="stylesheet" href="<?=DOMAIN;?>/backend/lib/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="<?=DOMAIN;?>/backend/lib/js/bootstrap-select/bootstrap-select.min.css" />
    <link rel="stylesheet" href="<?=DOMAIN;?>/backend/lib/js/datepicker/datepicker3.css" />
    <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=0bf693a3-841a-4f92-b3cf-0ef545c8b18b"></script>
    
    <script type="text/javascript" src="<?=DOMAIN;?>/backend/lib/js/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="<?=DOMAIN;?>/backend/lib/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="<?=DOMAIN;?>/backend/lib/js/bootstrap-select/bootstrap-select.min.js"></script>
   
    <script src="<?=DOMAIN;?>/backend/lib/js/jquery/jquery-ui/jquery-ui.min.js"></script>
    <script src="<?=DOMAIN;?>/backend/lib/js/jquery/jquery-ui/jquery.ui.touch-punch.min.js"></script>
    
    
    <script src="<?=DOMAIN;?>/backend/lib/js/main.js"></script>
    
    <style>
    .form-control {
      -webkit-appearance: none;
      appearance: none;
      background-clip: padding-box;
      background-color: #fff;
      background-color: var(--bs-body-bg);
      border: 1px solid #dee2e6;
      border: var(--bs-border-width) solid var(--bs-border-color);
      border-radius: 0.375rem;
      border-radius: var(--bs-border-radius);
      color: var(--bs-body-color);
      display: block;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      padding: 0.375rem 0.75rem;
      transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
      width: 100%;
}
    
    .btn-light {
      --bs-btn-bg: #fff;
      --bs-btn-hover-bg: #fff; 
      --bs-btn-active-bg: #fff; 
      --bs-btn-border-color:var(--bs-border-color);  
   }
   
   .bootstrap-select .dropdown-toggle:focus {
     outline: none !important;
   }
   
   .btn-primary {
     background-color: #2c63f1 !important;
     border-color: #2c63f1 !important;
   }
   
   .btn-secondary {
     background-color: #f73164!important;
     border-color: #f73164!important;
   }
    
    .circle_layout {
   position: absolute;
   left: -4px;
   top: -4px;
   width: 8px;
   height: 8px;
   line-height: 8px;
   border-radius: 50%;
}

.circle_square {
   position: absolute;
   left: -4px;
   top: -4px;
   width: 8px;
   height: 8px;
   line-height: 8px;
   opacity: 0.4;
}

.ymaps-2-1-79-balloon {
    max-width: 40% !important;
    min-width: 300px;
    float: right !important;
}

.ymaps-2-1-79-balloon_layout_panel {
  right: 0 !important;
  bottom: 0;
  left: unset !important;
} 

.baloon_body {
    width: 100%;
}

.baloon_caravan_info {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 10px;
}

.baloon_img_div {
    width: 92%;
    height: 80px;
    overflow: hidden;
    margin-bottom: 10px;
}

.baloon_img_div img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.balloon_content {
    font-size: 14px;
    line-height: 25px;
}

.baloon_table {
    border-bottom: 1px solid #eee;
    margin-top: 10px;
}

.progressBarTextDiv {
    font-size: 14px; 
    padding-left: 10px;
    margin-top: -3px;
}

.loaderDiv {
    width: 100%;
    height: 550px;
    text-align: center;
}

.ui-slider.ui-slider-horizontal {
    background: #91cced;
    height:12px;
    border:none;
}
.ui-slider .ui-slider-handle {
    width: 40px;
    height: 40px;
    background: url(img/ship.svg) no-repeat;
    border: none;
    margin-top: -30px;
    margin-left: 0;
    border: none;
    cursor: pointer;
}

.ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, .ui-widget-header .ui-state-focus, .ui-button:hover, .ui-button:focus {
    outline: none;
}

.ui-slider .ui-slider-range {
    background: #2c63f1;
    height:12px;
}

.mapButtonsLoader {
    position: absolute; 
    top: 400px; 
    left: 40%;
}

.hidden {
    display: none;
}

.accordion-button:not(.collapsed) {
    background-color: transparent;
}

.progressBar {
    padding-right: 0 !important;
    padding-left: 0 !important;
}

.accordion {
  --bs-accordion-btn-padding-x: 1.25rem;
  --bs-accordion-btn-padding-y: 0.8rem !important;
}

.accordionHeaderText {
    font-size: 1.03rem !important;
    font-weight: 500 !important;
    color: #333738 !important;

}

</style>
    
</head>

<body>

<div style="width: 98%; margin: 0 auto;">

<div class="bd-example-snippet bd-code-snippet mb-5 border-0"><div class="bd-example m-0 border-0">
        <div class="accordion" id="accordionExample">
          <div class="accordion-item" style="border-top: none;">
            <div class="accordion-header">
              <div class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                <div class="row w-100">
                  <div class="col-md-4 accordionHeaderText">
                    Пересчёт маршрутов
                  </div>
                  <div class="col-md-8" style="margin-top: 5px;" id="jsEditRoutesStatus">
                    <?=$progressBar;?>
                  </div>
                </div>  
              </div>
            </div>
            <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                
                <div class="row">
                    <div class="col-md-6">
    
    <form method="post" action="" id="form_jsEditRoutes">
    
    <div class="row">
      <div class="col-md-6">
        <select class="selectpicker form-control mb-1" name="numberBidsEdit[]" multiple title="Номер заявки" aria-label="" data-live-search="true">
         <?if($bidsList!=false):?>
         <?foreach($bidsList as $val):?>
         <option value="<?=$val['id'];?>"><?=$val['id'];?></option>
         <?endforeach;?>
         <?endif;?>
         </select>
        
      </div>
      <div class="col-md-6">
        <input type="hidden" name="module" value="<?=$moduleName;?>" />
        <input type="hidden" name="component" value="" />
        <input type="hidden" name="ajaxLoad" value="jsEditRoutesStatus" />
        <input type="hidden" name="alert" value="" />
        <button class="send_form btn btn-primary w-100" id="jsEditRoutes">Пересчитать</button>
      </div>
    </div>
   </form>
  </div>
  
  <div class="col-md-3">
    <form method="post" action="" id="form_jsStopEditRoutes">
     <input type="hidden" name="module" value="<?=$moduleName;?>" />
     <input type="hidden" name="component" value="" />
     <button class="send_form btn btn-secondary w-100" id="jsStopEditRoutes">Стоп</button>
   </form>
  </div>
  <div class="col-md-3">
   <form method="post" action="" id="form_jsGetDefault">
     <input type="hidden" name="module" value="<?=$moduleName;?>" />
     <input type="hidden" name="component" value="" />
     <input type="hidden" name="selfRedirect" value="1" />
     <input type="hidden" name="alert" value="" />
     <button class="send_form btn btn-primary w-100" id="jsGetDefault">Восстановить данные</button>
   </form>
  </div>
                
                </div>
                
              </div>
            </div>
          </div>   
          
          <div class="accordion-item">
            <div class="accordion-header">
              <div class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                <div class="accordionHeaderText">
                Фильтры
                </div>
              </div>
            </div>
            <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                
                <form method="post" action="" id="form_jsMapFilters">    
<div class="row mt-2 mb-5">

  <div class="col-md-3 mb-3">
  <label class="form-label">Корабль</label>
  <select class="selectpicker form-control" name="ships[]" id="jsShipsImo" multiple title="Выбрать" aria-label="" data-live-search="true">
       <?if(!empty($shipsList)):?>
       <?foreach($shipsList as $imo=>$val):?>
       <option value="<?=$imo;?>"><?=$val;?></option>
       <?endforeach;?>
       <?endif;?>
  </select>
  </div>
  
  <div class="col-md-3 mb-3">
  <label class="form-label">Класс корабля</label>
  <select class="selectpicker form-control" name="iceclass[]" multiple title="Выбрать" aria-label="" data-live-search="true">
       <?if(!empty($iceclassArr)):?>
       <?foreach($iceclassArr as $key=>$val):?>
       <option value="<?=$val;?>"><?=$val;?></option>
       <?endforeach;?>
       <?endif;?>
  </select>
  </div>
  
  <div class="col-md-3 mb-3">
  <label class="form-label">Номер заявки</label>
  <select class="selectpicker form-control" name="numberBid[]" multiple title="Выбрать" aria-label="" data-live-search="true">
       <?if(!empty($numberBid)):?>
       <?foreach($numberBid as $key=>$val):?>
       <option value="<?=$val;?>"><?=$val;?></option>
       <?endforeach;?>
       <?endif;?>
  </select>
  </div>
  
  <div class="col-md-3 mb-3">
  <label class="form-label">Пункт отправления</label>
  <select class="selectpicker form-control" name="point_a[]" multiple title="Выбрать" aria-label="" data-live-search="true">
       <?if(!empty($pointA)):?>
       <?foreach($pointA as $key=>$val):?>
       <option value="<?=$val;?>"><?=$val;?></option>
       <?endforeach;?>
       <?endif;?>
  </select>
  </div>
  
  <div class="col-md-3">
  <label class="form-label">Пункт назначения</label>
  <select class="selectpicker form-control" name="point_b[]" multiple title="Выбрать" aria-label="" data-live-search="true">
       <?if(!empty($pointB)):?>
       <?foreach($pointB as $key=>$val):?>
       <option value="<?=$val;?>"><?=$val;?></option>
       <?endforeach;?>
       <?endif;?>
  </select>
  </div>
  
  <div class="col-md-3">
  <label class="form-label">Рейтинг маршрута</label>
  <select class="selectpicker form-control" name="rating[]" multiple title="Рейтинг маршрута" aria-label="">
       <?if(!empty($routesRating)):?>
       <?foreach($routesRating as $val):?>
       <option value="<?=$val['raiting'];?>"<?if($val['raiting']==1):?> selected=""<?endif;?>><?=$val['raiting'];?></option>
       <?endforeach;?>
       <?endif;?>
  </select>
  </div>
  
  <div class="col-md-3">
  <label class="form-label">Модель</label>
  <select class="form-control" name="model_id" id="jsFilterModelId">
      <?if($models!=false):?>
       <?foreach($models as $key=>$val):?>
       <option value="<?=$val['model_id'];?>"<?if($val['model_id']==1):?> selected=""<?endif;?>><?=$val['model_name'];?></option>
       <?endforeach;?>
      <?endif;?>
  </select>
  </div>
  
  <div class="col-md-3">
    <input type="hidden" name="module" value="<?=$moduleName;?>" />
    <input type="hidden" name="component" value="" />
    <input type="hidden" name="ajaxLoad" value="jsAjaxLoad" />
    <input type="hidden" name="showLoader" value="jsAjaxLoad" />
    <label class="form-label">&nbsp;</label>
    <button class="send_form btn btn-primary w-100" id="jsMapFilters">Показать</button>
  </div>

</div>
</form>
                
              </div>
            </div>
          </div>
          
               
        </div>
        </div></div>
        
<div id="jsAjaxLoad">
<?include $_SERVER['DOCUMENT_ROOT'].'/backend/modules/'.$moduleName.'/includes/map.inc.php';?>
</div> 

<form method="post" action="" id="form_jsShowRoutesTable" class="hidden">
     <input type="hidden" name="module" value="<?=$moduleName;?>" />
     <input type="hidden" name="component" value="" />
     <input type="hidden" name="model_id" id="jsModelId" value="<?=$model_id;?>" />
     <input type="hidden" name="raiting_id" id="jsRaitinglId" value="<?=$raiting_id;?>" />
     <input type="hidden" name="id_interval" id="jsIntervalId" value="<?=$minInterval;?>" />
     <input type="hidden" name="imo" id="jsImoList" value="" />
     <input type="hidden" name="ajaxLoad" value="jsAjaxRoutesTables" />
     <input type="hidden" name="alert" value="" />
     <button class="send_form" id="jsShowRoutesTable"></button>
</form>


<div id="jsMapButtonsLoader" class="hidden">
<img src="<?=DOMAIN;?>/backend/img/loading-wheel.gif" />
</div>

</div>
   
   <!-- 4. Подключить скрипт виджета "Bootstrap datetimepicker" -->
    <script type="text/javascript" src="<?=DOMAIN;?>/backend/lib/js/datepicker/bootstrap-datepicker5.js"></script>

    <script type="text/javascript">
    $('body').on('focus', '.jsDateTimepicker', function() {
        $(this).datepicker(
          {pickTime: false, 
          language: 'ru'
          });
    });
    </script> 
   
   
</body>
</html>