let url ='http://58.69.15.211:8080/api/user/orgChart/?token=c1f22a6d7f7615cfd890c4507c1f231f';
 
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);

myArr.list.map(function(item) {
  return { name: item.first_name };
})

myArr.list.map(function(item) {
  retun { title: item.position };
})

console.log(myArr.list[0].position);
  }
};
xmlhttp.open("POST", url, true);
xmlhttp.send();
