<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

session_start();

// variables needed from the news site, can be passed via POST or SESSION, whichever is more convenient
if (!isset($_SESSION['user'])) {
    echo json_encode(array(
        "success" => false,
    ));
    exit;
} else {
    $username = $_SESSION['user'];

    require 'connectDB.php';
    $stmt = $mysqli->prepare("INSERT INTO events (username,title, dateofevent,datetimeofevent,tag) VALUES (?,?,?,?,?)");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->bind_param('sssss', $username, $_POST['title'], $_POST['dateofevent'], $_POST['datetimeofevent'], $_POST['tag']);

    $stmt->execute();

    $stmt->close();

    //change
    $last_id = $mysqli->insert_id;
    if (isset($_POST['shareduser'])) {
        $stmt1 = $mysqli->prepare("INSERT INTO matching (username1,eventid1) VALUES (?,?)");
        $stmt1->bind_param('ss', $_POST['shareduser'], $last_id);
        $stmt1->execute();
        $stmt1->close();
        $stmt2 = $mysqli->prepare("INSERT INTO matching (username1,eventid1) VALUES (?,?)");
        $stmt2->bind_param('ss', $username, $last_id);
        $stmt2->execute();
        $stmt2->close();
        echo json_encode(array(
            "success" => true,
            "lastid"  => $last_id,
            "share"   => $_POST['shareduser'],
        ));
    }
}
