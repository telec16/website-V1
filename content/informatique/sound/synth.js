var masterVolume = 1.0;
const notes = {"q":  261.63, "s":293.66, "d":329.63, "f":349.23, "g":392.00, "h":440.0, "j":493.88, "z":277.18, "e":311.13, "t":369.99, "y":415.30, "u":466.16}
var keyDown = null;

function initSynth(){
	document.addEventListener("keydown", event => {
	  if (event.isComposing || event.keyCode === 229) {
		return;
	  }
	  setNote(event.key);
	});
	document.addEventListener("keyup", event => {
	  if (event.isComposing || event.keyCode === 229) {
		return;
	  }
	  clearNote(event.key);
	});
}

function setNote(k){
	if(k in notes && keyDown != k){
		baseFrequency = notes[k];
		volume = masterVolume;
		keyDown = k;
		drawOutput();
	}
}

function clearNote(k){
	if(keyDown == k){
		volume = 0;
		keyDown = null;
		reloadBuffer();
	}
}