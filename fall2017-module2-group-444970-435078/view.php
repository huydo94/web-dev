 <!DOCTYPE html>
 <html>
 <?php
session_start();
$_SESSION['user'] = $_GET["user"];
$dir = sprintf("/home/users/%s/files", $_SESSION['user']);

echo sprintf('<head> <title> Hello, %s </title> </head>', $_SESSION['user']);
?>

 <body>
 	<p> <b> Upload File: </b> </p>
 <form enctype="multipart/form-data" action="action.php" method="POST">
 	<p>
 		<input type="hidden" name="MAX_FILE_SIZE" value="2000000" />
 		<label for="uploadfile_input">Choose a file to upload:</label> <input name="uploadedfile" type="file" id="uploadfile_input" />
 	</p>
 	<p>
 		<input type="submit" name="act" value="Upload File" />
 	</p>
 </form>


 <form action="action.php" method="POST">
	<p> <b> Files in your directory: </b> </p>
 	<?php
if (is_dir($dir)) {
	foreach (glob($dir . '/*.*') as $file) {
		$name = ltrim($file, $dir);
		echo '<input type="radio" name="thefile" ';
		echo 'value= "' . $file . '">' . $name . ' <br>' . "\n";

		//<input type="radio" name="thefile" value="/home/huydo/files/a.txt">a.txt<br>
	}
}
?>

 	<input type="submit" name="act" value="View Selected File" />
 	<input type="submit" name="act" value="Delete Selected File" />


 </form>
<br> <br>

<input type="button" onclick="location.href='logout.php';" value="Sign Out" />

</body>
</html>
