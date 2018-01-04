<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

session_start();

// variables needed from the news site, can be passed via POST or SESSION, whichever is more convenient

$eventid = $_POST['eventid']; //id number of event

require 'connectDB.php';
$stmt = $mysqli->prepare("UPDATE events SET title=?, dateofevent=?, datetimeofevent=?, tag=?  WHERE eventid=?");
    if(!$stmt){
      printf("Query Prep Failed: %s\n", $mysqli->error);
      exit;
    }

    $stmt->bind_param('ssssi',$_POST['title'],$_POST['dateofevent'],$_POST['datetimeofevent'],$_POST['tag'], $eventid);

    $stmt->execute();

    $stmt->close();
    echo json_encode(array(
        "success" => true,
    ));
    exit;
?>
