<!DOCTYPE html>
<html>
<head>
        <title>Results</title>

</head>
<body>

<?php
$x = $_GET["x"];
$y = $_GET["y"];
$op = $_GET["operation"];

if (trim($x) == "" || trim($y) == "" || $op == "") {
	echo "Missing field. Enter x,y and the operation.";
} else {
	switch ($op) {
	case 'add':
		$out = $x + $y;
		echo "$x + $y = $out";
		break;
	case 'sub':
		$out = $x - $y;
		echo "$x - $y = $out";
		break;
	case 'mul':
		$out = $x * $y;
		echo "$x * $y = $out";
		break;
	case 'div':
		if ($y == 0) {
			echo "Error: Division by 0.";
		} else {
			$out = $x / $y;
			echo "$x / $y = $out";
		}
		break;
	default:
		break;
	}
}
?>

</body>
</html>

