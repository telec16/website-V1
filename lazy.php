<!DOCTYPE html>
<html lang="fr">
<head>
	
	<meta charset="UTF-8">
	
	<link rel="stylesheet" type="text/css" href="/styleADL.css">
	
	<?php
	if(isset($_GET['p']))
		$url = $_GET['p'];
	else
		$url = "";
	
	//Make sure the name is valid (security issue)
	if(!preg_match('/^[\/a-zA-Z0-9\ _]+$/', $url)){
		$url = "";
	}
	
	if($url == ""){
		$url = "./content";
	}
	else{
		$url = "./content/{$url}";
	}
	?>
</head>

<body>
	<h2>Has it seems that the devop is too lazy too make a proper main page, here is the webpage list of this section : </h2>
	<?php
	
	function read_file_content($dir)
	{
		$str_result="";
		
		if ($handle = opendir($dir)) 
		{
			while (($file = readdir($handle)) !== false)
			{
				//Not a file or a special one
				if(in_array($file, array('.', '..'))) continue;
				
				$path = $dir . "/" . $file;
				if( ! is_dir($path) ){
					$path_parts = pathinfo($path);
					$ext = $path_parts['extension'];
					$name = $path_parts['basename'];
					
					if(in_array(strtolower($ext), ["html", "php", "htm", "xhtml"]))
						$str_result .= "<li><a href=\"{$path}\">{$name}</a></li>\n";
				}
			}
			closedir($handle);
		}
		
		if($str_result != "")
			$str_result = "<ul class='showed'>{$str_result}</ul>";
		
		return $str_result;
	}
	
	
	$pages = read_file_content($url);
	
	if($pages == "")
		$pages = "Or not... He didn't even make the effort of putting some content !";
	
	echo $pages;
	?>
</body>
</html>
