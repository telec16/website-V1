var i = 0;
var previous = 0;
var current = 0;
var next = 0;


function init(){
	initNotes();
	initMatrix();
	
	listeners();
}

function listeners(){
	notesListeners();
	tempoListeners();
}


var loop = new Tone.Loop(function(time){
	previous = current;
	current = next;
	next = nextMarkov(current);
	
	synth.triggerAttackRelease(getNote(current), noteDuration, time)
	
	colorMatrix(previous, current, next);
	debug();
	
	i++;
}, tempo)

loop.start(0)


function debug(){
	document.querySelector('#tick').textContent = i.toFixed(2)
	document.querySelector('#time').textContent = Tone.context.currentTime.toFixed(2)	
	document.querySelector('#note').textContent = ""+current
	document.querySelector('#next').textContent = ""+next
}
