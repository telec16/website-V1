var volume = 1.0;
var baseFrequency = 440;
var wave = [0];
var output = [0];

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const sampleRate = audioCtx.sampleRate;


function resample(wave, numSamples){
	reWave = new Array(numSamples);
	scale = wave.length/numSamples;
	for(var i=0; i<numSamples; i++){
		reWave[i] = wave[Math.floor(i*scale)];
		reWave[i] = Math.min(Math.max(-1, reWave[i]), +1);
	}
	
	return reWave
}


var outputBuffer;

function reloadBuffer(){
	const numSamples = Math.floor(sampleRate/baseFrequency);
	outputBuffer = audioCtx.createBuffer(1, numSamples, sampleRate);

	output = resample(wave, numSamples);
	var nowBuffering = outputBuffer.getChannelData(0);
	for (var i = 0; i < outputBuffer.length; i++) {
		nowBuffering[i] = volume * output[i];
	}
	
	reloadSourceBuffer();
}


var source;

function playSound(){
	source = audioCtx.createBufferSource();
	source.onended = playSound;
	source.buffer = outputBuffer;
	source.connect(audioCtx.destination);

	source.loop=true;
	source.start();
}

function reloadSourceBuffer(){
	if(source != undefined)
		source.loop=false;
}


reloadBuffer();
playSound();
