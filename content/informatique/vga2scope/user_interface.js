var windowObjectReference = null;
const windowFeatures = "resizable=yes,menubar=no,toolbar=no,location=no,status=no,scrollbars=no";
const square = [{"x": 25, "y": 25, "z": 50},
			    {"x": 25, "y": 75, "z": 50},
			    {"x": 75, "y": 75, "z": 50},
			    {"x": 75, "y": 25, "z": 50}];
			  
const heart = [
{ "x": 50, "y": 68.66666666666667, "z": 50 },
{ "x": 48.666666666666664, "y": 72.66666666666667, "z": 50 },
{ "x": 47.333333333333336, "y": 75.33333333333333, "z": 50 },
{ "x": 44.666666666666664, "y": 79.33333333333333, "z": 50 },
{ "x": 39.333333333333336, "y": 83.33333333333334, "z": 50 },
{ "x": 36.666666666666664, "y": 84.66666666666666, "z": 50 },
{ "x": 31.333333333333332, "y": 86, "z": 50 },
{ "x": 26, "y": 86, "z": 50 },
{ "x": 20.666666666666668, "y": 84.66666666666666, "z": 50 },
{ "x": 18, "y": 83.33333333333334, "z": 50 },
{ "x": 12.666666666666664, "y": 79.33333333333333, "z": 50 },
{ "x": 10, "y": 74, "z": 50 },
{ "x": 8.666666666666664, "y": 68.66666666666667, "z": 50 },
{ "x": 8.666666666666664, "y": 63.333333333333336, "z": 50 },
{ "x": 10, "y": 58, "z": 50 },
{ "x": 11.333333333333336, "y": 55.333333333333336, "z": 50 },
{ "x": 14, "y": 51.333333333333336, "z": 50 },
{ "x": 18, "y": 46, "z": 50 },
{ "x": 22, "y": 42, "z": 50 },
{ "x": 26, "y": 38, "z": 50 },
{ "x": 32.66666666666667, "y": 32.66666666666667, "z": 50 },
{ "x": 36.666666666666664, "y": 28.666666666666668, "z": 50 },
{ "x": 50, "y": 15.333333333333336, "z": 50 },
{ "x": 63.333333333333336, "y": 28.666666666666668, "z": 50 },
{ "x": 67.33333333333333, "y": 32.66666666666667, "z": 50 },
{ "x": 74, "y": 38, "z": 50 },
{ "x": 78, "y": 42, "z": 50 },
{ "x": 82, "y": 46, "z": 50 },
{ "x": 86, "y": 51.333333333333336, "z": 50 },
{ "x": 88.66666666666666, "y": 55.333333333333336, "z": 50 },
{ "x": 90, "y": 58, "z": 50 },
{ "x": 91.33333333333334, "y": 63.333333333333336, "z": 50 },
{ "x": 91.33333333333334, "y": 68.66666666666667, "z": 50 },
{ "x": 90, "y": 74, "z": 50 },
{ "x": 87.33333333333334, "y": 79.33333333333333, "z": 50 },
{ "x": 82, "y": 83.33333333333334, "z": 50 },
{ "x": 79.33333333333333, "y": 84.66666666666666, "z": 50 },
{ "x": 74, "y": 86, "z": 50 },
{ "x": 68.66666666666667, "y": 86, "z": 50 },
{ "x": 63.333333333333336, "y": 84.66666666666666, "z": 50 },
{ "x": 60.666666666666664, "y": 83.33333333333334, "z": 50 },
{ "x": 55.333333333333336, "y": 79.33333333333333, "z": 50 },
{ "x": 52.666666666666664, "y": 75.33333333333333, "z": 50 },
{ "x": 51.333333333333336, "y": 72.66666666666667, "z": 50 }
];

//heart.forEach((e)=>{e["x"]+=10;e["y"]+=10;})
		  

function preset(){
	points = heart;
	
	send();
}


function updateSettings(){
	settings["red"] = document.querySelector('input[name="red"]:checked').value;
	settings["green"] = document.querySelector('input[name="green"]:checked').value;
	settings["blue"] = document.querySelector('input[name="blue"]:checked').value;
	settings["x"] = document.getElementById("invert_x").checked;
	settings["y"] = document.getElementById("invert_y").checked;
	settings["z"] = document.getElementById("invert_z").checked;
	settings["gradient"] = document.getElementById("gradient").checked;
	
	send();
}


function openOutput() {
  if(windowObjectReference == null || windowObjectReference.closed)
    windowObjectReference = window.open("output.html", "VGA2scope", windowFeatures);
  else
    windowObjectReference.focus();
	
	send();
}
