<?php
if(isset($_GET['p']))
	$url = $_GET['p'];
else
	$url = "main";

//Make sure the name is valid (security issue)
if(preg_match('/^[\/a-zA-Z0-9\ _]+$/', $url) == false){
	echo "Noop.";
}
else{
	
	if(file_exists("./content/{$url}/.title")){
		//Retrieve name from file
		$name = file_get_contents("./content/{$url}/.title");
	}
	else{
		//Retrieve name from path and upper case the first letter
		$sp = explode("/", $url);
		$name = ucfirst(end($sp));
	}
	
	echo "ADL - {$name}";
}

?>
