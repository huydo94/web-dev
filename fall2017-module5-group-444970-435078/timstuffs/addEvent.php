<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

session_start();

// variables needed from the news site, can be passed via POST or SESSION, whichever is more convenient
if (!isset($_SESSION['user'])) {
  echo json_encode(array(
    "success"=>false,
  ));
  exit;
}
else {

require 'connectDB.php';
$stmt = $mysqli->prepare("INSERT INTO events (username,title, dateofevent,datetimeofevent,tag) VALUES (?,?,?,?,?)");
    if(!$stmt){
      printf("Query Prep Failed: %s\n", $mysqli->error);
      exit;
    }

    $stmt->bind_param('sssss',$username, $_POST['title'],$_POST['dateofevent'],$_POST['datetimeofevent'],$_POST['tag']);

    $stmt->execute();

    $stmt->close();
    echo json_encode(array(
        "success" => true,
    ));
  }
?>
