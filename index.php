<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<meta name="title" content="ADL, some cool projects !">
	<meta name="description" content="A place where I talk about my projects and try to explain them the best I can">
	<meta name="keywords" content="Electronic,Programming,Electronique,Programmation,Maths,DIY,C,JavaScript,HTML,PHP,Java">
	<meta name="author" content="telec16">
	
	<title>
	<?php include("title.php"); ?>
	</title>
	
	<link rel="stylesheet" type="text/css" href="/styleRoot.css">
	<link rel="stylesheet" type="text/css" href="/styleADL.css">
	
	<?php
	if(isset($_GET['p']))
		$url = $_GET['p'];
	else
		$url = "main";
	?>
</head>

<body>
	<div class="main">
	
		<div class="border">
			<div class="menu">
			<h1>Menu</h1>
				<div class="fill">
				<?php include("menu.php"); ?>
				</div>
			</div>
			
			<div class="files">
			<h1>Fichiers</h1>
				<div class="fill">
				<?php include("files.php"); ?>
				</div>
			</div>
		</div>
		
		<div class="content">
			<iframe src=<?php include("content.php"); ?> class="frame">
			</iframe>
			<div>
				<div class="footerLeft">
				<a href="http://telec16.fr">ADL</a>, by telec - 
				<a href="mailto:admin@telec16.fr%3E?subject=Au%20sujet%20de%20votre%20site%20web">Envoyez moi un mail !</a>
				</div>
				<div class="footerRight">
				<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Licence Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/80x15.png" /></a>Cette œuvre est mise à disposition selon les termes de la <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Licence Creative Commons</a>.
				</div>
			</div>
		</div>
	</div>
</body>
</html>
