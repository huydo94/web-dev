<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json


session_start();

if (!isset($_SESSION['user'])) {
  exit;
}
else {
$username = $_SESSION['user'];
$date = $_POST['date'];
$tag = $_POST['tag'];
require 'connectDB.php';

$stmt = $mysqli->prepare("SELECT eventid,title,tag,datetimeofevent FROM events WHERE username=? AND dateofevent=? AND tag=? ORDER BY datetimeofevent ASC");
$stmt->bind_param('sss',$username,$date,$tag);
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
