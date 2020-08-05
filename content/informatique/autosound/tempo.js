var tempo = '8n';
var noteDuration = '8n';


function changeTempo(e){
	var tot_dur = document.querySelector("#tot_dur");
	var note_dur = document.querySelector("#note_dur");
	tot_dur.value = Math.min(tot_dur.value, note_dur.value);
	
	tempo = tot_dur.value+'n';
	noteDuration = note_dur.value+'n';
	
	loop.interval = Tone.Time(tempo).toSeconds();
}

function toggle(btn){
	if(btn.value == "Start"){
		btn.value = "Stop";
		Tone.Transport.start();
	} else {
		btn.value = "Start";
		Tone.Transport.stop();
	}
}


function tempoListeners(){
	document.querySelector('#tot_dur').addEventListener('change', changeTempo);
	document.querySelector('#note_dur').addEventListener('change', changeTempo);
	document.querySelector('#bpm').addEventListener('change', e => Tone.Transport.bpm.value = e.target.value);
}
