<?php
// variables needed from the news site, can be passed via POST or SESSION, whichever is more convenient

$eventid = "2";
$title = "Do";
$tag = "greetings";
$dateofevent = "2017-10-24";
$datetimeofevent = "2017-10-24 04:05:00";

require 'connectDB.php';
$stmt = $mysqli->prepare("UPDATE events SET title=?, dateofevent=?, datetimeofevent=?, tag=?  WHERE eventid=?");
    if(!$stmt){
      printf("Query Prep Failed: %s\n", $mysqli->error);
      exit;
    }

    $stmt->bind_param('ssssi',$title,$dateofevent,$datetimeofevent,$tag, $eventid);

    $stmt->execute();

    $stmt->close();


    $eventid = "1";
    $title = "Meeting";
    $tag = "now";
    $dateofevent = "2017-10-24";
    $datetimeofevent = "2017-10-24 03:05:00";



    $stmt = $mysqli->prepare("UPDATE events SET title=?, dateofevent=?, datetimeofevent=?, tag=?  WHERE eventid=?");
        if(!$stmt){
          printf("Query Prep Failed: %s\n", $mysqli->error);
          exit;
        }

        $stmt->bind_param('ssssi',$title,$dateofevent,$datetimeofevent,$tag, $eventid);

        $stmt->execute();

        $stmt->close();
    exit;
?>
