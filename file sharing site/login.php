<?php

$user = $_POST["username"];
$h = fopen("/home/huydo/.files/users.txt", "r");

if ($user == '') {
	echo "Username cannot be blank <br> <br>";
	echo "<a href='login.html'>Return to Login</a>";
	exit;
}

while (!feof($h)) {
	$line = fgets($h);
	if ($user == trim($line)) {
		$url = "/~huydo/view.php?user=" . $user;
		header('Location: ' . $url);
		exit;
	}
}

fclose($h);

echo "Invalid User <br> <br>";
echo "<a href='login.html'>Return to Login</a>";
?>
