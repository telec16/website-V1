const presets = ["zero", "sinus", "triangle", "triangle80", "sawtooth", "square"];

function setPreset(name){
	p = document.getElementById(name);
	for(preset of presets){
		var opt = document.createElement('option');
		opt.appendChild( document.createTextNode(preset) );
		opt.value = preset; 
		p.appendChild(opt); 
	}
}

function loadPreset(preset){
	switch(preset.value){
		case "square":
			for(var x=0; x<xSize; x++)
				wave[x] = x<xSize/2 ? -1:1;
		break;
		case "sinus":
			for(var x=0; x<xSize; x++)
				wave[x] = Math.sin(2*Math.PI*x/xSize);
		break;
		case "triangle":
			for(var x=0; x<xSize; x++)
				wave[x] = ( x<xSize*.5 ? (x/xSize/.5) : (1-(x-xSize*.5)/xSize/.5) )*2-1;
		break;
		case "triangle80":
			for(var x=0; x<xSize; x++)
				wave[x] = ( x<xSize*.8 ? (x/xSize/.8) : (1-(x-xSize*.8)/xSize/.2) )*2-1;
		break;
		case "sawtooth":
			for(var x=0; x<xSize; x++)
				wave[x] = x/xSize*2-1;
		break;
		
		case "zero":
		default:
			initCnv();
		break;
	}
	
	drawArray(wave, inCtx);
	drawOutput();
}

function refreshVolume(vol){
	masterVolume = volume = Math.pow(10, parseInt(vol.value)/20);
	reloadBuffer();
}
function refreshFrequency(freq){
	baseFrequency = parseInt(freq.value);
	drawOutput();
}
function refreshSize(size){
	xSize = inCnv.width = parseInt(size.value);
	wave = resample(wave, xSize);
	drawArray(wave, inCtx);
	drawOutput();
}

