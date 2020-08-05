<?php
if(isset($_GET['p']))
	$page = $_GET['p'];
else
	$page = "main";

$sp = explode("/", $page);
$name = end($sp);

//Make sure the name is valid (security issue)
if(preg_match('/^[\/a-zA-Z0-9\ _]+$/', $page) == false){
	$url = "./error.php?c=403&p=UNAUTHORIZED";
}
else
{
	if($page != "main")
		$url = "./content/{$page}/{$name}.html";
	else
		$url = "./content/{$page}.html";

	if( ! file_exists($url)){
		if( file_exists("./content/{$page}")){
			$url = "lazy.php?p={$page}";
		}
		else{
			$url = "./error.php?c=404&p={$url}";
		}
	}
}

echo '"'.$url.'"';

?>