<?php
if(isset($_GET['p']))
	$url = $_GET['p'];
else
	$url = "main";

//Make sure the name is valid (security issue)
if(($url != "main") && (preg_match('/^[\/a-zA-Z0-9\ _]+$/', $url))){
	echo "<ul>".read_file_content("./content/".$url)."</ul>";
}

function read_file_content($dir)
{
	$str_result="";
	
	if( is_dir($dir . "/files") )
		$dir = $dir . "/files";
	
	if ($handle = opendir($dir)) 
	{
		while (($file = readdir($handle)) !== false)
		{
			//Not a file or a special one
			if(in_array($file, array('.', '..'))) continue;
			if($file[0] == ".") continue;
			
			if( ! is_dir($dir . "/" . $file) ){
				$str_result .= "<li>" . make_file_cell($dir . "/" . $file) . "</li>\n";
			}
		}
		closedir($handle);
	}
	
	return $str_result;
}

function make_file_cell($dir)
{
	$path_parts = pathinfo($dir);
	$ext = $path_parts['extension'];
	$name = $path_parts['basename'];
	
	$src = get_img_src($ext);
	
	$cell = "<a href=\"{$dir}\"><img src=\"{$src}\" alt=\"{$name}\" title=\"{$name}\"/>{$name}</a>";
	
	return $cell;
}

function get_img_src($ext)
{
	$ext = strtolower($ext);
	
	$replace = ['img'=>['jpg', 'png', 'gif', 'dxf'],
				'txt'=>['txt', 'doc', 'docx', 'odt']];
	
	foreach($replace as $key=>$exts){
		if(in_array($ext, $exts))
			$ext = $key;
	}
	
	if( ! file_exists("./ext_img/".$ext.".png") )
		$ext = "unknown";
	
	$src = "./ext_img/".$ext.".png";
	return $src;
}

?>