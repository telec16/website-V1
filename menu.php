<?php
if(isset($_GET['p']))
	$url = $_GET['p'];
else
	$url = "main";

$sp = explode("/", $url);
$name = end($sp);

//Make sure the name is valid (security issue)
if(preg_match('/^[\/a-zA-Z0-9\ _]+$/', $url) == false){
	$name="";
}

echo read_dir_content("./content", $name);

//Recursivly go through all dirs and put them in a list.
function read_dir_content($parent_dir, $hl_name, $depth = 0){
	
		$temp = "";
    if ($handle = opendir($parent_dir)) 
    {
        while (($file = readdir($handle)) !== false)
        {
						//Not a dir or a special one (files)
            if(in_array($file, array('.', '..', 'files'))) continue;
						
            if( is_dir($parent_dir . "/" . $file) ){
								$str_ctn = read_dir_content($parent_dir . "/" . $file, $hl_name, $depth+1);
								if($str_ctn != "") //Only for pretty code
									$temp .= "<li>" . $str_ctn . "</li>\n";
            }
        }
        closedir($handle);
    }
		
		$str_result = "";
    if($depth != 0) //We don't want the main dir
			$str_result = make_dir_cell($parent_dir, $hl_name);
    if($depth == 1) //Only for pretty code
			$str_result .= "\n";
		if($temp != "") //Only for pretty code
			$str_result .= "<ul>".$temp."</ul>\n";


    return $str_result;
}

function make_dir_cell($dir, $hl_name){
	//Retrieve small path from the full one
	$path = substr($dir, strpos(strtolower($dir), "content/")+strlen("content/"));
	
	if(file_exists("{$dir}/.title")){
		$name = file_get_contents("{$dir}/.title");
	}
	else{
		//Retrieve name from full path and upper case the first letter
		$name = ucfirst(substr($dir, strrpos($dir, "/")+strlen("/")));
	}
	
	$cell = "<a href=\"?p={$path}\">{$name}</a>";
	
	//Highlight
	$sp = explode("/", $dir);
	$name = end($sp);
	if($name == $hl_name)
		$cell = "<hl>{$cell}</hl>";
	
	return $cell;
}

?>