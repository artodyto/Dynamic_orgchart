let url ='http://58.69.15.211:8080/api/user/orgChart/?token=c1f22a6d7f7615cfd890c4507c1f231f';
 
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {



    $(function() {
      var hr_ar = {name: hr, title: ceo_pos};
      

      //console.log(cc);
    
      $.mockjax({
        url: '/orgchart/initdata',
        responseTime: 1000,
        contentType: 'application/json',
        responseText: {
          'name': ceo,
          'title': ceo_pos,
          'children': [
            { 'name': hr, 'title': hr_pos },
            { 'name': compt, 'title': compt_pos,
              'children': [
                { 'name': 'Tie Hua', 'title': 'senior engineer' },
                { 'name': 'Hei Hei', 'title': 'senior engineer',
                  'children': [
                    { 'name': 'Pang Pang', 'title': 'engineer' },
                    { 'name': 'Xiang Xiang', 'title': 'UE engineer' }
                  ]
                }
              ]
            },
            { 'name': 'Yu Jie', 'title': 'department manager' },
            { 'name': 'Yu Li', 'title': 'department manager' },
            { 'name': 'Hong Miao', 'title': 'department manager' },
            { 'name': 'Yu Wei', 'title': 'department manager' },
            { 'name': 'Chun Miao', 'title': 'department manager' },
            { 'name': 'Yu Tie', 'title': 'department manager' }
          ]
        }

      });


      $('#chart-container').orgchart({
        'data' : '/orgchart/initdata',
        'nodeContent': 'title'
      });

    });
 
        

        var i, 
       
        ceo_pos = "",
        hr,
        dop = "", dop_pos = "",
        sen_prog = "", sen_prog_pos = "",
        it_man = "", it_man_pos = "",
        acc_man = "", acc_man_pos = "",
        cos = "",
        cro = "";
        
        

        var myArr = JSON.parse(this.responseText);
        
        var ceo = myArr.list[0].first_name + " " + myArr.list[0].last_name,
        ceo_pos = myArr.list[0].position;

        var hr = myName(5),
        hr_pos = myPos(5);

        var compt = myName(11),
        compt_pos = myPos(11);


               console.log(myName(11));

function myName(employee_id) {
  var employee="";
  for (i in myArr.list) {
    if (myArr.list[i].employee_id == employee_id) {
    employee = myArr.list[i].first_name + " " + myArr.list[i].last_name; 
    }
  }
    return employee;
}

function myPos(employee_id) {
  var employee_pos="";
  for (i in myArr.list) {
    if (myArr.list[i].employee_id == employee_id) {
    employee_pos = myArr.list[i].position; 
    }
  }
    return employee_pos;
}

console.log(myPos(5));

function myChild(reporting_manager) {
  var child = "";
  for (i = 0; i < myArr.list.length; i++) {
   if (myArr.list[i].reporting_manager == reporting_manager) {
    child += "<br>" + myArr.list[i].first_name + " " + myArr.list[i].last_name + "<br>" + myArr.list[i].position + "<br>"+ "<br>";
    }
  }
    return child;
}



ceo = myName(1);
var ch = myChild(1);

console.log(ch);

  }
};
xmlhttp.open("POST", url, true);
xmlhttp.send();
