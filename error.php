<link rel="stylesheet" type="text/css" href="/styleADL.css">
<?PHP
if(isset($_GET['p']))
	$url = "with ".$_GET['p'];
else
	$url = "here";

if(isset($_GET['c']))
	$code = $_GET['c'];
else
	$code = "418";

$error = "{$code} error: there is a problem {$url} !";

echo "<error>";
echo "{$error}</br>";
echo "<a href='mailto:admin@telec16.fr>?subject=Une%20erreur%20&agrave%20signaler...&body={$error}%0d%0a'>Signaler l'erreur</a>";
echo "</error>";
?>