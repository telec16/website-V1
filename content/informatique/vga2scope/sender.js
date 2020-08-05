var bc = new BroadcastChannel('vga2scope');
var settings = {};
var points = [];

function send(){
	var data = {"settings": settings, "points": points};
	bc.postMessage(data);
}


bc.onmessage = (messageEvent) => {
	if(messageEvent.data == "data?")
		send();
}

