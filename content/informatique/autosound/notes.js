const defaultNote = 'A';
var notes = ['C', 'D', 'E', 'G', 'A'];
var octave = 3;
const noteValidation = RegExp("^[A-G][#b]?[-+]*$");

//Add a cell at the end of the table
function addNote(){
	var t = document.querySelector("#notes");
	var tr = t.childNodes[0];
	appendNote(tr, defaultNote);
	addState();
	
	refreshNotes();
}

//Remove the last cell of the table
function delNote(){
	var t = document.querySelector("#notes");
	var tr = t.childNodes[0];
	tr.deleteCell(tr.childElementCount-1);
	delState();
	
	refreshNotes();
}

//Create the table
function initNotes(){
	var t = document.querySelector("#notes");
	var tr = document.createElement("tr");
	
	notes.forEach((n) => {
		appendNote(tr, n);
	});
	t.appendChild(tr);
	
	document.querySelector('#octave').value = octave;
}

//Load the table into the notes list
function refreshNotes(){
	var t = document.querySelector("#notes");
	var tr = t.childNodes[0];
	
	notes = [];
	tr.childNodes.forEach((td) => {
		var n = td.childNodes[0].value;
		if(!noteValidation.test(n)) n = td.childNodes[0].value = defaultNote;
		notes.push(n);
	});
	
	initMatrix();
}

//Create a new cell and append it in the row
function appendNote(tr, note){
	var td = document.createElement("td");
	var inp = document.createElement("input");
	inp.type = "text";
	inp.value = note;
	inp.addEventListener('change', e => refreshNotes());
	
	td.appendChild(inp);
	tr.appendChild(td);
}

//Get a proper note from an index
function getNote(idx){
	var n = notes[idx];
	var i = n.length-1;
	var o = octave;
	
	while(['+', '-'].includes(n[i])){
		if(n[i] == '+') o++;
		if(n[i] == '-') o--;
		i--;
	}
	n = n.substring(0, i+1);
	
	return n+o;
}


function notesListeners(){
	document.querySelector('#octave').addEventListener('change', e => octave = e.target.value);
}
