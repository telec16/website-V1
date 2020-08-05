var markov = [
	[ 5, 50, 10, 20, 15],
	[15,  5, 50, 10, 20],
	[20, 15,  5, 50, 10],
	[10, 20, 15,  5, 50],
	[50, 10, 20, 15,  5]
];

//Create the table
function initMatrix(){
	var lt = document.querySelector("#matrix");
	//Remove table content
	var t = lt.cloneNode(false);
	lt.parentNode.replaceChild(t, lt);
	
	//Notes header
	var tr = document.createElement("tr");
	tr.appendChild(document.createElement("td"));
	notes.forEach((n) => {
		var td = document.createElement("th");
		td.textContent = n;
		tr.appendChild(td);
	});
	t.appendChild(tr);
	
	markov.forEach((rows, idx) => {
		var tr = document.createElement("tr");
		
		//Notes header
		var td = document.createElement("th");
		td.textContent = notes[idx];
		tr.appendChild(td);
		
		rows.forEach((p) => {
			var td = document.createElement("td");
			var inp = document.createElement("input");
			inp.type = "number";
			inp.step = "1";
			inp.min = "0";
			inp.value = p;
			inp.addEventListener('change', e => refreshMatrix());
			
			td.appendChild(inp);
			tr.appendChild(td);
		});
		t.appendChild(tr);
	});
}

//Load the table into the Markov array
function refreshMatrix(){
	var t = document.querySelector("#matrix");
	
	markov = [];
	t.childNodes.forEach((tr, idx) => {
		if(idx > 0){ //Ignore the header
			var prob = []
			tr.childNodes.forEach((td, idx) => {
				if(idx > 0){ //Ignore the header
					var p = td.childNodes[0].value;
					prob.push(parseFloat(p));
				}
			});
			markov.push(prob);
		}
	});
}

function colorMatrix(prev, curr, next){
	var t = document.querySelector("#matrix");
	
	var prevInp = t.childNodes[prev+1].childNodes[curr+1].childNodes[0];  //Ignore the header
	var inp = t.childNodes[curr+1].childNodes[next+1].childNodes[0];  //Ignore the header
	prevInp.style.backgroundColor = "";
	inp.style.backgroundColor = "lime";
	
	t.childNodes[prev+1].childNodes[0].style.backgroundColor = "";
	t.childNodes[0].childNodes[curr+1].style.backgroundColor = "";
	t.childNodes[curr+1].childNodes[0].style.backgroundColor = "forestgreen";
	t.childNodes[0].childNodes[next+1].style.backgroundColor = "greenyellow";
}

function addState(idx){
	var len = markov.length + 1;
	idx = Math.min(Math.max(0, idx||len), len-1);
	var pidx = (idx-1+markov.length)%markov.length;
	
	markov.splice(idx, 0, [markov[pidx][0]].concat(markov[pidx]));
	for(var i=0; i<markov.length; i++){
		if(i != idx)
			markov[i].splice(idx, 0, markov[(i-1+markov.length)%markov.length][pidx]);
	}
	
	initMatrix();
}

function delState(idx){
	idx = Math.min(Math.max(0, idx||markov.length), markov.length-1);
	for(var i=0; i<markov.length; i++)
		markov[i].splice(idx, 1);
	markov.splice(idx, 1);
	
	initMatrix();
}

//Get a random index from the previous one
function nextMarkov(start){
	const sum = markov[start].reduce((a,b)=>a+b);
	const rnd = Math.random()*sum;
	var acc = 0;
	for(var idx=0; idx<markov[start].length; idx++){
		acc += markov[start][idx];
		if(rnd <= acc) return idx;
	}
}
