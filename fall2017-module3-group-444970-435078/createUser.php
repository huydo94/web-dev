<?php

$username = $_POST["newUser"];
$newpsw = $_POST["newpsw"];
?>

<?php
// Make sure you update all the  echo "<a href='newssite.php'>Return to Site</a>";
$username = trim($_POST["newUser"]);
if ((!preg_match('/^[a-z\d]{2,15}$/i', $username)) || (!preg_match('/^[a-z\d]{2,15}$/i', $newpsw))) {
	echo "<br> ERROR: Username/Password must contain only alphanumeric characters, between 2 to 15 characters long </br>";
	echo "<a href='login.php'>Return to Registration</a>";
	exit;
}

require 'connectDB.php';

$stmt = $mysqli->prepare("SELECT COUNT(*) FROM user WHERE username=?");

// Bind the parameter
$stmt->bind_param('s', $username);
$stmt->execute();

$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();

if ($cnt > 0){
	echo "Username already existed";
	echo "<a href='login.php'>Return to Registration</a>";
	exit;
}else{

	$stmt = $mysqli->prepare("insert into user (username, saltedhash) values (?, ?)");

	$saltedhash = password_hash("$newpsw", PASSWORD_BCRYPT);
	if(!$stmt){
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit;
	}

	$stmt->bind_param('ss', $username, $saltedhash);

	$stmt->execute();

	$stmt->close();

	echo "User Created <br><br>";
	echo "<a href='login.php'>Return to Login</a>";
}
?>