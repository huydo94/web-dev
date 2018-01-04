var currentMonth = new Month(2017, 9); // October 2017
document.addEventListener("DOMContentLoaded", updateCalendar(), false);
// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event) {
    currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
}, false);
document.getElementById("prev_month_btn").addEventListener("click", function(event) {
    currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
}, false);

function updateCalendar() {
    var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById("monthyear").textContent = mL[currentMonth.month] + ", " + currentMonth.year;
    var calTablebody = document.getElementById("calTable").getElementsByTagName("tbody")[0];
    while (calTablebody.firstChild) {
        calTablebody.removeChild(calTablebody.firstChild);
    }
    var weeks = currentMonth.getWeeks();
    for (var w in weeks) {
        var days = weeks[w].getDates();
        // days contains normal JavaScript Date objects.
        var newrow = calTablebody.insertRow();
        //alert("Week starting on "+days[0]);
        for (var d in days) {
            // You can see console.log() output in your JavaScript debugging tool, like Firebug,
            // WebWit Inspector, or Dragonfly.
            var td = newrow.insertCell();
            var daystr = days[d].toISOString();
            var theday = daystr.substring(8, 10);
            td.appendChild(document.createTextNode(theday)); //insert the date into the cell as text
            td.setAttribute("class", "eventcell");
            var yearmonthdate = daystr.substring(0, 10);
            td.setAttribute("id", yearmonthdate); //set id of each cell to its year-month-date
            //console.log(yearmonthdate);

        }
    }
    // fillEvents();
    listenforCellClick(); // you can see the id of the cell you clicked on in the browser console
}

function listenforCellClick() {
    $(document).ready(function() {
        $(".eventcell").click(function() {
          var selected = $(this).attr('id');
          console.log(selected);  // you can see the id of the cell you clicked on in the browser console
          var dateForAddEvent = document.getElementById("addDay");
          dateForAddEvent.value = selected;
          document.getElementById("addHour").value = 12;
          document.getElementById("addMin").value = 34;
          genEvent(selected);
          // addEvent(selected);
        });
        });
}
function genEvent(selected) {
    var eventEls = document.getElementsByClassName("eventList")[0];
    while (eventEls.firstChild){
      eventEls.removeChild(eventEls.firstChild);
    }

    var eventsForDay = document.getElementsByClassName("eventList")[0];
    var eventHeader = document.createElement("h3");
    eventHeader.appendChild(document.createTextNode("Events for "+selected+": "));
    eventsForDay.appendChild(eventHeader);

    var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "getEvent.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
    xmlHttp.addEventListener("load", function(event) {
      var jsonData = JSON.parse(event.target.responseText);
      console.log(jsonData);
      for (var i=0; i<jsonData.length;i++) {
        var eventdata = jsonData[i];
        var event1 = document.createElement("div");
        event1.setAttribute("class", "event");
        event1.setAttribute("id",eventdata["eventid"]);
        
        var event1datetime = document.createElement("span");
        event1datetime.appendChild(document.createTextNode("Time: "+eventdata["datetimeofevent"].substring(11,16)));
        event1datetime.appendChild(document.createTextNode("  , created by: "+eventdata["username"]));
        var event1title = document.createElement("b");
        event1title.appendChild(document.createTextNode("Title: "+eventdata["title"]));
        


        event1.appendChild(event1datetime);
        event1.appendChild(document.createElement("br"));
        event1.appendChild(event1title);
        event1.addEventListener("click", selEvent,false);
        
        eventsForDay.appendChild(event1);
        eventsForDay.appendChild(document.createElement("br"));
      }
    }, false);
    var dataString = "date=" + encodeURIComponent(selected);
    xmlHttp.send(dataString);

}

function selEvent() {
  var eventID = $(this).attr('id');
  console.log(eventID);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST","prefillEditBox.php", true);
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlHttp.addEventListener("load", function(event) {
    var jsonData = JSON.parse(event.target.responseText);
    console.log(jsonData);
    if (jsonData.success) {
      var title = jsonData.title;
      var datetime = jsonData.datetimeofevent;
      var tag = jsonData.tag;
      refillEventDetails(eventID,title,datetime,tag);
      // submitDelete(eventID);
    }
  }, false);
  var dataString = "eventid=" + encodeURIComponent(eventID);
  xmlHttp.send(dataString);
}

function refillEventDetails(id,title,datetime,tag) {
  var year = datetime.substring(0,4);
  var month = datetime.substring(5,7);
  var day = datetime.substring(8,10);
  var hour = datetime.substring(11,13);
  var minute = datetime.substring(14,16);
  var dateofevent = year+"-"+month+"-"+day;
  var datetimeofevent = dateofevent + " " + hour + ":" +minute+ ":00";

  $("#editTitle").val(String(title));
  $("#editTag").val(String(tag));
  $("#editYear").val(Number(year));
  $("#editMonth").val(Number(month));
  $("#editDay").val(Number(day));
  $("#editHour").val(Number(hour));
  $("#editMin").val(Number(minute));
  $("#eventid").val(Number(id));
}

$(function() { //shorthand document.ready function
    $('#edit_Event').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault(); //prevent form from submitting
        var data = $("#edit_Event :input").serializeArray();
        console.log(data); //use the console for debugging, F12 in Chrome, not alerts
        var id = data[7].value;
        var edited_dateofevent = data[1].value + "-" + data[2].value + "-" + data[3].value;

        if (document.activeElement.getAttribute('value')=="Delete") {
              var dataString = "id=" + encodeURIComponent(id);
              var xmlHttp = new XMLHttpRequest();
              xmlHttp.open("POST","deleteEvent.php", true);
              xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
              xmlHttp.addEventListener("load", function(event) {
                var jsonData = JSON.parse(event.target.responseText);
                console.log(jsonData);
                if (jsonData.success) {
                  alert("Successfully Deleted!");
                  genEvent(edited_dateofevent)
                }
                else {
                  alert("Delete failed");
                }
              }, false);
              xmlHttp.send(dataString);
        }
        else {
              var edited_title = data[0].value;
              var edited_datetimeofevent = edited_dateofevent + " " + data[4].value + ":" + data[5].value + ":00";
              var edited_tag = data[6].value;
              var dataString = "title=" + encodeURIComponent(edited_title) + "&dateofevent=" + encodeURIComponent(edited_dateofevent) + "&datetimeofevent=" + encodeURIComponent(edited_datetimeofevent) + "&tag=" + encodeURIComponent(edited_tag) + "&eventid=" + encodeURIComponent(id);

              var xmlHttp = new XMLHttpRequest();
              // Make a URL-encoded string for passing POST data:
              xmlHttp.open("POST", "editEvent.php", true);
              xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
              xmlHttp.addEventListener("load", function(event) {
                  var jsonData = JSON.parse(event.target.responseText);
                  console.log(jsonData);
                  if (jsonData.success) {
                      alert("Successfully Updated!");
                      genEvent(edited_dateofevent);
                  }
              }, false);
              xmlHttp.send(dataString);
            }
    });
});

function getEventValues(id) {
  var title = document.getElementById("editTitle").value;
  var tag = document.getElementById("editTag").value;
  var dateofevent = document.getElementById("editYear").value + "-" + document.getElementById("editMonth").value + "-" + document.getElementById("editDay").value;
  var datetimeofevent = dateofevent + " " + document.getElementById("editHour").value +":"+document.getElementById("editMin").value+":00";
  console.log(title); console.log(tag); console.log(dateofevent); console.log(datetimeofevent);console.log(id);
  var dataString ="title=" + encodeURIComponent(title) +"&dateofevent=" + encodeURIComponent(dateofevent) + "&datetimeofevent=" + encodeURIComponent(datetimeofevent) +"&tag=" + encodeURIComponent(tag) + "&eventid=" + encodeURIComponent(id);
  return dataString;
}

$(function() { //shorthand document.ready function
    $('#newEventForm').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault(); //prevent form from submitting
        var data = $("#newEventForm :input").serializeArray();
        console.log(data); //use the console for debugging, F12 in Chrome, not alerts
        var addTitle = data[0].value;
        var addDateofevent = data[1].value;
        var addDatetimeofevent = addDateofevent + " " + data[2].value + ":" + data[3].value + ":00";
        var addTag = data[4].value;
        
        var shareduser = data[5].value;

        //change here
        var dataString = "title=" + encodeURIComponent(addTitle) + "&dateofevent=" + encodeURIComponent(addDateofevent) + "&datetimeofevent=" + encodeURIComponent(addDatetimeofevent) + "&tag=" + encodeURIComponent(addTag) +"&shareduser="+encodeURIComponent(shareduser);

        var xmlHttp = new XMLHttpRequest();
        // Make a URL-encoded string for passing POST data:
        xmlHttp.open("POST", "addEvent.php", true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.addEventListener("load", function(event) {
            var jsonData = JSON.parse(event.target.responseText);
            console.log(jsonData);
            if (jsonData.success) {
                alert("Successfully Added!");
                genEvent(addDateofevent);
            }
        }, false);
        xmlHttp.send(dataString);
    });
});

// $(function() { //shorthand document.ready function
//     $('#selectTag').on('submit', function(e) { //use on if jQuery 1.7+
//         e.preventDefault(); //prevent form from submitting
//         var data = $("#selectTag :input").serializeArray();
//         console.log(data); //use the console for debugging, F12 in Chrome, not alerts
//
//         var tagValue = document.activeElement.getAttribute('value');
//         var dataString = "tag=" + encodeURIComponent(tagValue);
//
//         var xmlHttp = new XMLHttpRequest();
//         // Make a URL-encoded string for passing POST data:
//         xmlHttp.open("POST", "filterEvent.php", true);
//         xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//         xmlHttp.addEventListener("load", function(event) {
//             var jsonData = JSON.parse(event.target.responseText);
//             console.log(jsonData);
//             if (jsonData.success) {
//                 alert("Filter Applied");
//             }
//         }, false);
//         xmlHttp.send(dataString);
//     });
// });

$(function() {
  $('#Work').on('click',function() {
    var button = document.getElementById("Work");
    document.getElementById("Food").classList.remove("bold");
    document.getElementById("Fun").classList.remove("bold");
    document.getElementById("Other").classList.remove("bold");
    button.classList.toggle("bold");
  });
  $('#Food').on('click',function() {
    var button = document.getElementById("Food");
    document.getElementById("Work").classList.remove("bold");
    document.getElementById("Fun").classList.remove("bold");
    document.getElementById("Other").classList.remove("bold");
    button.classList.toggle("bold");
  });
  $('#Fun').on('click',function() {
    var button = document.getElementById("Fun");
    document.getElementById("Food").classList.remove("bold");
    document.getElementById("Work").classList.remove("bold");
    document.getElementById("Other").classList.remove("bold");
    button.classList.toggle("bold");
  });
  $('#Other').on('click',function() {
    var button = document.getElementById("Other");
    document.getElementById("Food").classList.remove("bold");
    document.getElementById("Fun").classList.remove("bold");
    document.getElementById("Work").classList.remove("bold");
    button.classList.toggle("bold");
  });
});
