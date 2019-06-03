<?php get_header(); ?>


<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>

<body>
  <body>

<div style="width:100%; height:700px;" id="tree"/>

<script>

    let url ='http://58.69.15.211:8080/api/user/orgChart/?token=c1f22a6d7f7615cfd890c4507c1f231f';
    //let url = '/wordpress/wordpress/wp-content/themes/sample-json/js/data.json'
 
 var listData = '';
 var arrText = '';
 
 $.ajax({
    url: url,
    type: 'POST',
    xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt) {
            if (evt.LengthComputable) {
                var percentComplete = evt.loader / evt.total;
                $('.progress .progress-bar').css({
                    width: percentComplete * 100 + '%'
                });
                if (percentComplete === 1) {
                }
            }
        }, false);
        return xhr;
    },
 }).done(function (e) {
    var json = JSON.parse(e);
    var row = '';
//console.log(json);
var inArr = [];
var dataArr = [];
$.each(json['list'],function(key,val){
    if (val['reporting_manager'] != null && val['reporting_manager'] != "null" && val['reporting_manager'] != NaN){
        dataArr.push(val['employee_id']);
    }
});
setTimeout(function(){
    $.each(json['list'],function(key,val){
        if($.inArray(val['reporting_manager'],dataArr) >= 0){

            var eppScore = 0;
            $.each(json['eppList'],function(eppKey, eppVal){
                if(eppVal['employee_id'] == val['employee_id']) {
                    eppScore = eppVal['epp_score'];
                }
            });
            if(key == 0){
                var temp = '{ "id": "1", "title":"' + val['position']+'",'; 
                    temp += '"name": "'+val['first_name'] + " " + val['last_name']+'" }';
                    arrText = temp;
            } else {
                var temp = ',{ "id": "'+val['employee_id']+'", "title": "' + val['position']+'",';
                    temp += '"pid": "' + val['reporting_manager']+'",';
                    temp += '"name": "'+val['first_name'] + " " + val['last_name']+'" }';
                    arrText += temp; 
            }
        }
    });
console.log(arrText)


  var chart = new OrgChart(document.getElementById("tree"), {
            template: "isla",
            enableSearch: true,
            nodeBinding: {
                field_0: "title",
                field_1: "name"
            },
            collapse: {
                  level: 2,
                  allChildren: true
              },
            nodes: JSON.parse("["+arrText+"]")
        });
    })
})
    
</script>

<?php get_footer(); ?>