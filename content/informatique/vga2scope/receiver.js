var bc = new BroadcastChannel('vga2scope');
var settings = {};
var points = [];


bc.onmessage = (messageEvent) => {
	settings = messageEvent.data["settings"];
	points = messageEvent.data["points"];
	
	updateCanvas();
}


function askData(){
	bc.postMessage("data?");
}

