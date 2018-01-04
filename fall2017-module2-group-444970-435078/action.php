<?php
session_start();
$action = $_POST['act'];
$filename = $_POST['thefile'];
$loc = "view.php?user=" . $_SESSION['user'];

if ($action == 'View Selected File') {
// Now we need to get the MIME type (e.g., image/jpeg).  PHP provides a neat little interface to do this called finfo.
	$finfo = new finfo(FILEINFO_MIME_TYPE);
	$mime = $finfo->file($filename);
// Finally, set the Content-Type header to the MIME type of the file, and display the file.
	header("Content-Type: " . $mime);
	if ($mime != '') {
		header('Content-Disposition: filename="' . basename($filename) . '"');
	}
	readfile($filename);
}

//needed to chmod 0777 files
if ($action == 'Delete Selected File') {
	unlink($filename);
	header("Location: " . $loc);
	exit;
}

if ($action == 'Upload File') {
	// Get the filename and make sure it is valid
	$uploadedfilename = basename($_FILES['uploadedfile']['name']);
	if (!preg_match('/^[\w_\.\-]+$/', $uploadedfilename)) {
		echo "Invalid filename";
		exit;
	}

	$full_path = sprintf("/home/users/%s/files/%s", $_SESSION['user'], $uploadedfilename);

	if (move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $full_path)) {
		header("Location: " . $loc);
		exit;
	} else {
		header("Location: " . $loc);
		exit;
	}
}

?>
