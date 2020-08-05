function startFileListener(id){
  document.getElementById(id).addEventListener('change', onFileSelect, false);
}

function onFileSelect(evt) {
	var f = evt.target.files[0];
		
	p = new Image();
	p.src = (window.URL || window.webkitURL).createObjectURL(f);
	p.onload = function(){
		createImgArray(p);
		//reset
		start();
		stop();
	}
}

function createImgArray(p){
	var size=prompt("Codel size (pixel) ?")||"11";
	size=(parseInt(size)||11);
	
	w = Math.floor(p.width/size);
	h = Math.floor(p.height/size);
	
	var cnv = document.createElement('canvas');
	var ctx = cnv.getContext('2d');
	cnv.width = p.width;
	cnv.height = p.height;
	ctx.drawImage(p, 0, 0);
	
	img = Array(h).fill(C.w).map(x => Array(w).fill(C.w));
	var smallC = {};
	for(color in C){
		smallC[color] = "#" + C[color].slice(1).match(new RegExp('.{1,2}', 'g')).map(x => x.slice(0,1)).join('');
	}
	console.log(smallC);
	for(var x=0; x<w; x++){
		for(var y=0; y<h; y++){
			var pp = ctx.getImageData((x+.5)*size, (y+.5)*size, 1, 1).data;
			var col = ((pp[0] & 0xF0) << 4) + (pp[1] & 0xF0) + (pp[2] >> 4);
			var hex = ("#" + ("000" + (col).toString(16)).slice(-3)).toUpperCase();
			console.log(hex);
			for(color in smallC){
				if(hex == smallC[color])
					img[y][x] = C[color];
			}
		}
	}
}

/*
var col = (pp[0] << 16) + (pp[1] << 8) + pp[2];
var hex = ("#" + ("000000" + (col).toString(16)).slice(-6)).toUpperCase();
function hex2int(hex){
	return parseInt(hex.slice(1), 16);
}

function colorNear(C, hex){
	var min = parseFloat("+inf");
	var nearest = C.w;
	
	for(color in C){
		var diff = Math.abs(hex2int(C[color])-col);
		console.log(C[color]+">"+hex2int(C[color])+"-"+col+" = "+diff);
		if(diff < min){
			min = diff;
			nearest = C[color];
		}
	}
	return nearest;
}

*/