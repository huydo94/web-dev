$(function() { //shorthand document.ready function
    $('#edit_Event').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault(); //prevent form from submitting
        var data = $("#edit_Event :input").serializeArray();
        console.log(data); //use the console for debugging, F12 in Chrome, not alerts
        var edited_title = data[0].value;
        var edited_dateofevent = data[1].value + "-" + data[2].value + "-" + data[3].value;
        var edited_datetimeofevent = edited_dateofevent + " " + data[4].value + ":" + data[5].value + ":00";
        var edited_tag = data[6].value;
        var id = data[7].value;
        var dataString = "edited_title=" + encodeURIComponent(edited_title) + "&edited_dateofevent=" + encodeURIComponent(edited_dateofevent) + "&edited_datetimeofevent=" + encodeURIComponent(edited_datetimeofevent) + "&edited_tag=" + encodeURIComponent(edited_tag) + "&eventid=" + encodeURIComponent(id);
        
        var xmlHttp = new XMLHttpRequest();
        // Make a URL-encoded string for passing POST data:
        xmlHttp.open("POST", "editEvent.php", true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.addEventListener("load", function(event) {
            var jsonData = JSON.parse(event.target.responseText);
            console.log(jsonData);
            if (jsonData.success) {
                alert("Successfully Updated!");
            }
        }, false);
        xmlHttp.send(dataString);
    });
});