function fillEvents() {
  var weeks = currentMonth.getWeeks();
  for (var w in weeks) {
      var days = weeks[w].getDates();
      for (var d in days) {
          // You can see console.log() output in your JavaScript debugging tool, like Firebug,
          // WebWit Inspector, or Dragonfly.
          var daystr = days[d].toISOString();
          var yearmonthdate = daystr.substring(0, 10);

          var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
          xmlHttp.open("POST", "getEvent.php", false); // Starting a POST request (NEVER send passwords as GET variables!!!)
          xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
          xmlHttp.addEventListener("load", function(event) {
            var jsonData = JSON.parse(event.target.responseText);
            if (jsonData.success) {
              var br = document.createElement("br");
              var eventTitle = document.createElement("b");
              // eventTitle.appendChild(document.createTextNode(jsonData.title));
              eventTitle.appendChild(document.createTextNode(jsonData.title));
              document.getElementById(yearmonthdate).appendChild(br);
              document.getElementById(yearmonthdate).appendChild(eventTitle);
            }
          }, false);
          xmlHttp.send("date=yearmonthdate");
        }
      }

}
