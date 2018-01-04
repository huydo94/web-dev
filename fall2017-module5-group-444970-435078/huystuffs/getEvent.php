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

//change 
$stmt = $mysqli->prepare("SELECT eventid,title,tag,datetimeofevent,username FROM events WHERE username=? AND dateofevent=? ORDER BY datetimeofevent ASC");
$stmt->bind_param('ss',$username,$date);
$rows = array();

$stmt->execute();
$result = $stmt->get_result();

while($r = $result->fetch_assoc()) {
    $rows[] = $r;
}
$stmt->close();

$stmt1 = $mysqli->prepare("SELECT eventid,title,tag,datetimeofevent,username FROM events INNER JOIN matching ON events.eventid = matching.eventid1 WHERE matching.username1=? AND dateofevent=? ORDER BY datetimeofevent ASC");
if (!$stmt1) {
        echo json_encode(array(
            "success" => false,
        ));
        exit;
    }

$stmt1->bind_param('ss',$username,$date);

$stmt1->execute();
$result1 = $stmt1->get_result();

while($r1 = $result1->fetch_assoc()) {
    $rows[] = $r1;
}
$stmt1->close();


echo json_encode($rows);

}
 ?>
