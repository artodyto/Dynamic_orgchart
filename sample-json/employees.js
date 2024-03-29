 init();
    var params = {'token':token,'active':1};
    var arr = [];
    var orgObj = [];
    var listData = '';
    var arrText = '';
    var chart;
    $.ajax({
        url: DEV_API_URL+"user/orgChart",
        type: 'post',
        data: params,
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
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
        //display initial layouts first
        var inArr = [];
        var dataArr = [];
        $.each(json['list'],function(key,val){
            if(val['reporting_manager'] != null && val['reporting_manager'] != "null" && val['reporting_manager'] != NaN){
              dataArr.push(val['employee_id']);
            }
        });
        setTimeout(function(){
          $.each(json['list'],function(key,val){
             if($.inArray(val['reporting_manager'],dataArr) >= 0){
                if(val['reporting_manager']==105)console.log(val['reporting_manager']);
                var eppScore = 0;
                $.each(json['eppList'],function(eppKey,eppVal){
                    if(eppVal['employee_id'] == val['employee_id']) {
                        eppScore = eppVal['epp_score'];
                    }
                });
                if(key == 0){
                    var temp = '{ "id": "1","position":"'+val['position']+'",';
                    temp += '"employee_type": "'+val['employee_type']+'",';
                    temp += '"role": "'+val['role']+'",';
                    temp += '"eppScore": "'+eppScore+'",';
                    if(val['profile_image'] != null || val['profile_image'] != ""){
                      temp += '"img": "'+DEV_API_URL+'view/uploads/'+val['profile_image']+'",';
                    }else{
                      temp += '"img": "/rts_lms_web/public/images/RTS-robot-male.png",';
                    }
                    temp += '"employee_id": "'+appendZeros(val['employee_id'])+'",';
                    temp += '"name": "'+val['first_name'] + " " + val['last_name']+'" }';
                    arrText = temp;
                } else {
                    var temp = ',{ "id": "'+val['employee_id']+'",';
                    temp += '"pid": "'+val['reporting_manager']+'",';
                    if(val['profile_image'] != null || val['profile_image'] != ""){
                      temp += '"img": "'+DEV_API_URL+'view/uploads/'+val['profile_image']+'",';
                    }else{
                      temp += '"img": "/rts_lms_web/public/images/RTS-robot-male.png",';
                    }
                    temp += '"position": "'+val['position']+'",';
                    temp += '"employee_type": "'+val['employee_type']+'",';
                    temp += '"role": "'+val['role']+'",';
                    temp += '"eppScore": "'+eppScore+'",';
                    temp += '"employee_id": "'+appendZeros(val['employee_id'])+'",';
                    temp += '"name": "'+val['first_name'] + " " + val['last_name']+'" }';
                    arrText += temp;
                    //arrText += ',{ "id": "'+val['employee_id']+'", "employee_id": "'+appendZeros(val['employee_id'])+'", "name": "'+val['first_name'] + " " + val['last_name']+'" }';
                   // arrText += ',{ "id": '+val['employee_id']+',"position":"Employee", "pid": '+val['reporting_manager']+', "employee_id": "'+appendZeros(val['employee_id'])+'", "name": "'+val['first_name'] + " " + val['last_name']+'" }';
                }
             }
          });
          console.log(dataArr);



          
          OrgChart.templates.ana.size = [240, 180];
          OrgChart.templates.ana.node = '<rect x="0" y="0" width="240" height="180" stroke="#fff"/>';
          OrgChart.templates.ana.img_0 = '<image preserveAspectRatio="xMidYMid slice" xlink:href="{val}" x="85" y="25" width="70" height="70"></image>';
          OrgChart.templates.ana.field_0 = '<text class="field_0"  style="font-size: 15px;" fill="#ffffff" x="120" y="130" text-anchor="middle">{val}</text>';
          OrgChart.templates.ana.field_2 = '<text class="field_2"  style="font-size: 13px;" fill="#ffffff" x="120" y="150" text-anchor="middle">{val}</text>';
         


          var arrNode = [];
          chart = new OrgChart(document.getElementById("orgchart"), {
              lazyLoading: true,
              enableSearch: false,
              toolbar: false,
              showYScroll: BALKANGraph.scroll.visible, 
              showXScroll: BALKANGraph.scroll.visible, 
              mouseScrool: BALKANGraph.action.yScroll,
              layout: BALKANGraph.tree,
              scaleInitial: BALKANGraph.match.width,
              nodeMouseClick: BALKANGraph.action.none,
              nodeBinding: {
                  field_0: "name",
                  field_2: "position",
                  img_0: "img",
              },
              collapse: {
                  level: 2,
                  allChildren: true
              },
              onClick: function (sender, node) {
                  window.location = "./profile/"+node.id;
              },
              onExpCollClick: function (sender, action, id, ids) {
                  //your code goes here 
                  
                  var node_id = $("g[node-id="+id+"]");
                  var node_level = node_id.attr("level");
                  
                  if(action == 0){
                    //hide
                    chart.center(id);
                    
                    $(".node").each(function(index,value){
                      if(id == $(this).attr("node-id") || "1" == $(this).attr("node-id")){

                      } else arrNode.push($(this).attr("node-id"));  
                    });
                    chart.collapse(1,arrNode);
                    chart.expand(id,ids);
                  }else {
                    //show
                    //console.log(arrNode);
                    chart.collapse(id,ids);
                    chart.expand(id,arrNode);
                    arrNode = [];
                    //chart.collapse(id,arrNode);
                  }
                  chart.center(id);
                  //chart.fit();
                  return false;
                  //return false; to cancel the default expand collapse logic
              },
              nodes: JSON.parse("["+arrText+"]")
          });


          $("#orgchart a").hide();
          //chart.highlightNode();
          chart.center(logged_in_user);
          //$("#orgchart div").remove();
          //chart.zoom(2);
        },1000);
        //console.log(dataArr);
    }).fail(function (e) {
        // Do something
    });
    function init(){
        //update screensize of org chart container
        $("#orgchart").height((window.innerHeight-150)+"px");
        //search functionality
        $(".rts-search-bar input").keyup(function(event){
             var listSearch = chart.find($(this).val());
             chart.center(listSearch[0]['id']);
        });
    }

    function tileGenerator(list){
        $.each(list,function(key,val){
            var inArr = [];
            var tiles = '';
            if(val['reporting_manager'] != 0 && val['reporting_manager'] != 1 && ($(".rts-emp-tiles[emp_id='"+val['employee_id']+"']").length == 0)){
                tiles = "<div class='rts-employees'>";
                tiles += empTIles(val);
                //tiles += "<div class='rts-emp-first'>"+empTIles(val)+"</div>";
                tiles += "<div class='rts-members' reporting_manager='"+val['employee_id']+"'></div>";
                tiles += "</div>";
                if($(".rts-departments[reporting_manager='"+val['reporting_manager']+"']").length > 0){
                    $(".rts-departments[reporting_manager='"+val['reporting_manager']+"']").append(tiles);
                }
                if($(".rts-members[reporting_manager='"+val['reporting_manager']+"']").length > 0){
                    $(".rts-members[reporting_manager='"+val['reporting_manager']+"']").append(tiles);
                }
            } //else tileGenerator(list);
        });
    }


    function empTIles(data){
        var tile = "<div class='rts-emp-tiles' emp_id='"+data['employee_id']+"' reporting_manager='"+data['reporting_manager']+"'>";
            tile += appendZeros(data['employee_id'])+" "+data['first_name'] + " " + data['last_name'];
            tile += "</div>";
        return tile;
    }

    function appendZeros(value){
      var zero = '';
      if(value < 10) zero = 'RTS - 000'+value;
      else if(value < 100) zero = 'RTS - 00'+value;
      else if(value < 1000) zero = 'RTS - 0'+value;
      else {
        zero = value;
      }
      return zero;
    }


function loadRole(){
    $.ajax({
      url: DEV_API_URL+"/reference/source",
      type : 'POST',
      data : {token:token,filter:'role'},
      dataType: 'html',
      async: true,
      crossDomain: true,
      contentType: "application/x-www-form-urlencoded", 
      beforeSend: function () {
        
      },
      success : function(data){
        
        var res = JSON.parse(data);
        if(res.status == 200){
            
            let result=res['data'];
            let html='';
            $.each(result,function(index,value){
                html+=`<option value=${value.id}>${value.name}</option>`;
            });

            $("#role").html(`<select id="role_id">${html}</select>`);
            $("#role_id").select2({width: '100%'});
        }

      }
    });

}

function loadDepartment(){

    $.ajax({
      url: DEV_API_URL+"/reference/source",
      type : 'POST',
      data : {token:token,filter:'department'},
      dataType: 'html',
      async: true,
      crossDomain: true,
      contentType: "application/x-www-form-urlencoded", 
      beforeSend: function () {
        
      },
      success : function(data){
        
        var res = JSON.parse(data);
        if(res.status == 200){
            
            let result=res['data'];
            let html='';
            $.each(result,function(index,value){
                html+=`<option value=${value.id}>${value.name}</option>`;
            });

            $("#deparment").html(`<select id="department_id">${html}</select>`);
            $("#department_id").select2({width: '100%'});
        }

      }
    });

}


function loadEmployeeStatus(){

    $.ajax({
      url: DEV_API_URL+"/reference/source",
      type : 'POST',
      data : {token:token,filter:'employeestatus'},
      dataType: 'html',
      async: true,
      crossDomain: true,
      contentType: "application/x-www-form-urlencoded", 
      beforeSend: function () {
        
      },
      success : function(data){
        
        var res = JSON.parse(data);
        if(res.status == 200){
            
            let result=res['data'];
            let html='';
            $.each(result,function(index,value){
                html+=`<option value=${value.id}>${value.name}</option>`;
            });

            $("#EmpStatus").html(`<select id="employee_status">${html}</select>`);
            $("#employee_status").select2({width: '100%'});

        }

      }
    });

}

function loadEmployeeType(){

    $.ajax({
      url: DEV_API_URL+"/reference/source",
      type : 'POST',
      data : {token:token,filter:'employeetype'},
      dataType: 'html',
      async: true,
      crossDomain: true,
      contentType: "application/x-www-form-urlencoded", 
      beforeSend: function () {
        
      },
      success : function(data){
        
        var res = JSON.parse(data);
        if(res.status == 200){
            
            let result=res['data'];
            let html='';
            $.each(result,function(index,value){
                html+=`<option value=${value.id}>${value.name}</option>`;
            });

            $("#EmpType").html(`<select id="employee_type">${html}</select>`);
            $("#employee_type").select2({width: '100%'});
        }

      }
    });

}

function loadJobTitles(){
    
    $.ajax({
      url: DEV_API_URL+"/reference/source",
      type : 'POST',
      data : {token:token,filter:'jobtitle'},
      dataType: 'html',
      async: true,
      crossDomain: true,
      contentType: "application/x-www-form-urlencoded", 
      beforeSend: function () {
        
      },
      success : function(data){

        var res = JSON.parse(data);
        if(res.status == 200){
            
            let result=res['data'];
            let html='';
            $.each(result,function(index,value){
                html+=`<option value=${value.employee_id}>${value.name}</option>`;
            });

            $("#JobTitles").html(`<select id="job_titles_id">${html}</select>`);
            $("#job_titles_id").select2({width: '100%'});
        }

      }
    });

}

function loadJobPosition(){

    $.ajax({
      url: DEV_API_URL+"/reference/source",
      type : 'POST',
      data : {token:token,filter:'jobpositions'},
      dataType: 'html',
      async: true,
      crossDomain: true,
      contentType: "application/x-www-form-urlencoded", 
      beforeSend: function () {
        
      },
      success : function(data){

        var res = JSON.parse(data);
        if(res.status == 200){
            
            let result=res['data'];
            let html='';
            $.each(result,function(index,value){
                html+=`<option value=${value.id}>${value.positionname}</option>`;
            });

            $("#JobPosition").html(`<select id="job_positions_id">${html}</select>`);
            $("#job_positions_id").select2({width: '100%'});
        }

      }
    });

}

function loadEmployees() {

    $.ajax({
      url: DEV_API_URL+"/reference/users",
      type : 'POST',
      data : {token:token},
      dataType: 'html',
      async: true,
      crossDomain: true,
      contentType: "application/x-www-form-urlencoded", 
      beforeSend: function () {
        
      },
      success : function(data){

        var res = JSON.parse(data);
        if(res.status == 200){
            
            let result=res['data'];
            let html='';
            $.each(result,function(index,value){
                html+=`<option value=${value.id}>${value.last_name+','+value.first_name}</option>`;
            });

            $("#Reporting").html(`<select id="reporting_manager">${html}</select>`);
            $("#reporting_manager").select2({width: '100%'});

            $("#Approval").html(`<select id="approval_manager">${html}</select>`);
            $("#approval_manager").select2({width: '100%'});

        }

      }
    });

}
 console.log(data);
