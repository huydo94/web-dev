<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

$date = $_POST['date'];
session_start();

if (!isset($_SESSION['user'])) {
  exit;
}
else {
$username = $_SESSION['user'];
require 'connectDB.php';

$stmt = $mysqli->prepare("SELECT eventid,title,tag,datetimeofevent FROM events WHERE username=? AND dateofevent=? ORDER BY datetimeofevent ASC");
$stmt->bind_param('ss',$username,$date);
$rows = array();

$stmt->execute();
$result = $stmt->get_result();

while($r = $result->fetch_assoc()) {
    $rows[] = $r;
}
$stmt->close();

echo json_encode($rows);

}
 ?>
