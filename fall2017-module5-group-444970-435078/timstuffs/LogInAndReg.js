$(function() { //shorthand document.ready function
    $('#login_form').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault(); //prevent form from submitting
        var data = $("#login_form :input").serializeArray();
        console.log(data[0].value);
        console.log(data); //use the console for debugging, F12 in Chrome, not alerts
        var username = data[0].value; // Get the username from the form
        var password = data[1].value; // Get the password from the form
        // Make a URL-encoded string for passing POST data:
        var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
        var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
        xmlHttp.open("POST", "passcheck.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
        xmlHttp.addEventListener("load", function(event) {
            var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
            if (jsonData.success) { // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
                alert("You've been Logged In!");
                var loginmsg = username + " logged in.";
                $("#loggedin").html(loginmsg);
                $("#loggedin").append("<br><button class='logout' onclick='logout()'> Log Out </button>")
                $("#loginandreg").replaceWith($("#loggedin"));
            } else {
                alert("You were not logged in.  " + jsonData.message);
            }
        }, false); // Bind the callback to the load event
        xmlHttp.send(dataString); // Send the data
    });
});
$(function() { //shorthand document.ready function
    $('#register_form').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault(); //prevent form from submitting
        var data = $("#register_form :input").serializeArray();
        console.log(data); //use the console for debugging, F12 in Chrome, not alerts
        var newUser = data[0].value; // Get the username from the form
        var newpsw = data[1].value; // Get the password from the form
        // Make a URL-encoded string for passing POST data:
        var dataString = "newUser=" + encodeURIComponent(newUser) + "&newpsw=" + encodeURIComponent(newpsw);
        var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
        xmlHttp.open("POST", "createUser.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
        xmlHttp.addEventListener("load", function(event) {
            var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
            if (jsonData.success) { // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
                alert(jsonData.message);
            } else {
                alert("Registration failed.  " + jsonData.message);
            }
        }, false); // Bind the callback to the load event
        xmlHttp.send(dataString); // Send the data
    });
});

function logout() {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("POST","logout.php",true);
      xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlHttp.addEventListener("load", function(event) {
        var HTMLloginandreg = document.createElement("div");
        HTMLloginandreg.setAttribute("id","loginandreg");

        var loginhere = document.createElement("p");
        var bold1 = document.createElement("b");
        bold1.appendChild(document.createTextNode("Login Here:"));
        loginhere.appendChild(bold1);
        var loginform = document.createElement("form");
        loginform.id="login_form";
        loginform.method="post";
        var br = document.createElement("br");

        var login_input = document.createElement("input");
        login_input.type="text";
        login_input.name="username";
        login_input.required = true;

        var login_psw = document.createElement("input");
        login_psw.type="password";
        login_psw.name="psw";
        login_psw.required = true;

        var signin = document.createElement("input");
        signin.type="submit";
        signin.value="Sign In";

        loginform.appendChild(document.createTextNode("Username: "));
        loginform.appendChild(login_input);
        loginform.appendChild(document.createTextNode("Password: "));
        loginform.appendChild(login_psw);


        var notregistered = document.createElement("p");
        var bold2 = document.createElement("b");
        bold2.appendChild(document.createTextNode("Not Registered?"));
        notregistered.appendChild(bold2);

        var regform = document.createElement("form");
        regform.id="register_form";
        regform.method="post";
        var br = document.createElement("br");

        var reg_input = document.createElement("input");
        reg_input.type="text";
        reg_input.name="newUser";
        reg_input.required = true;

        var reg_psw = document.createElement("input");
        reg_psw.type="password";
        reg_psw.name="newpsw";
        reg_psw.required = true;

        var signin = document.createElement("input");
        signin.type="submit";
        signin.name="action"
        signin.value="Create User";

        regform.appendChild(document.createTextNode("Username: "));
        regform.appendChild(login_input);
        regform.appendChild(document.createTextNode("Password: "));
        regform.appendChild(login_psw);

        HTMLloginandreg.appendChild(loginhere);
        HTMLloginandreg.appendChild(loginform);
        HTMLloginandreg.appendChild(notregistered);
        HTMLloginandreg.appendChild(regform);

        $("#loggedin").replaceWith(loginform);
        // $("#loggedin").replaceWith(HTMLloginandreg));
        // alert("Logged Out!");

      }, false); // Bind the callback to the load event
      xmlHttp.send(null);


}
