<div id="jsProgressBarHtml" class="row">
<div class="col-md-4 progress progressBar">
  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="<?=$percentInt;?>" aria-valuemin="0" aria-valuemax="100" style="width: <?=$percentInt;?>%"></div>
</div>
<div class="col-md-8 progressBarTextDiv"><?=$text;?> <?=$percent;?></div>
</div>
<script type="text/javascript">
  $(document).ready(function(){
     
     var text = '<?=$text;?>';
    
     setInterval( function() {
       $.ajax({
        type: "GET",
        url: "https://arcflot.ru/backend/index.php?mod=progress&event=<?=$event;?>",
        cache: false,
        contentType: false,
        processData: false,
        success: function (data){
            if (data == '-1') {
                $('#jsEditRoutesStatus').html('');
                window.location.reload();
                return false;
            }
            
            else {
                var myArr = $.parseJSON(data);
                var progressText = myArr['percent']+'%';
                
                if (myArr[1] != '') {
                  progressText += ' - ' + myArr['text'];
                }
                    
                $('#jsProgressBarHtml').html('<div class="col-md-4 progress progressBar"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+myArr['percent']+'" aria-valuemin="0" aria-valuemax="100" style="width: '+myArr['percent']+'%"></div></div><div class="col-md-8 progressBarTextDiv">'+text+' '+progressText+'</div>'); 
            }
        }
      });       
     }, 5000 );
     
     setInterval( function() {
       $.ajax({
        type: "GET",
        url: "https://arcflot.ru/backend/index.php?mod=logs",
        cache: false,
        contentType: false,
        processData: false,
        success: function (data){
           $('#jsAjaxLoadLogs').html(data); 
        }
      });       
     }, 1000 );
  });
</script>