function addEvent(selected) {

  document.getElementById("submitAdd").addEventListener("click", function(){
      var title = document.getElementById("addTitle").value;
      var tag = document.getElementById("addTag").value;
      var dateofevent = document.getElementById("addDay").value;
      var hour = document.getElementById("addHour").value;
      console.log(hour);
      var min = document.getElementById("addMin").value;
      console.log(min);
      // if ((hour>23) || (hour<0)||(!Number.isInteger(Number(hour)))) {
      //   alert ("Hour needs to be an Integer between 0 and 23");
      //   return;
      // }
      // else if ((min>59) || (min<0)||(!Number.isInteger(Number(min)))) {
      //   alert ("Minute needs to be an Integer between 0 and 59");
      //   return;
      // }
      // else {
        var datetimeofevent = dateofevent + " " + document.getElementById("addHour").value +":"+document.getElementById("addMin").value+":00";
        var dataString ="title=" + encodeURIComponent(title) +"&dateofevent=" + encodeURIComponent(dateofevent) + "&datetimeofevent=" + encodeURIComponent(datetimeofevent) +"&tag=" + encodeURIComponent(tag);
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST","addEvent.php", true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.addEventListener("load", function(event) {
          var jsonData = JSON.parse(event.target.responseText);
          console.log(jsonData);
          if (jsonData.success) {
            alert("Event Added!");
          }
          else {
            alert("You must login to add Events");
          }
        }, false);
        xmlHttp.send(dataString);
      // }
      }, false);
}

function submitEdit(id) {
  document.getElementById("submitEdit").addEventListener("click", function(){
    var dataString = getEventValues(id);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST","editEvent.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event) {
      var jsonData = JSON.parse(event.target.responseText);
      console.log(jsonData);
      if (jsonData.success) {
        alert("Successfully Updated!");
      }
    }, false);
    xmlHttp.send(dataString);
  }, false);
}


function submitDelete(id) {
  document.getElementById("submitDelete").addEventListener("click", function(){
    var dataString = "id=" + encodeURIComponent(id);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST","deleteEvent.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event) {
      var jsonData = JSON.parse(event.target.responseText);
      console.log(jsonData);
      if (jsonData.success) {
        alert("Successfully Deleted!");
      }
      else {
        alert("Delete failed");
      }
    }, false);
    xmlHttp.send(dataString);
  }, false);
}
