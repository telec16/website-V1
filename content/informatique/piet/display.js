var divImg;

function updates(Stack, Out, Reg, Img, File){
	updateStack(Stack);
	uptdateOut(Out);
	updateRegisters(Reg);
	divImg=Img;
	startFileListener(File);
}

function updateStack(div){
	el = document.getElementById(div);
	
	var table="";
	for(var i=stack.length-1; i>=0; i--){
		table += "<tr><td>" + stack[i].toString() + "</td><td>" + String.fromCharCode(stack[i]) + "</td></tr>";
	}
	el.innerHTML=table;
	
	setTimeout(updateStack, 100, div);
}

function updateRegisters(div){
	el = document.getElementById(div);
	
	var arrows = ["&rarr;", "&darr;", "&larr;", "&uarr;"];
	
	var table="";
	table += "<tr><td>running</td><td><span style='color: "+(running?"green":"red")+";'>" + running + "</span></td></tr>";
	table += "<tr><td>IR</td><td>" + IR + "</td></tr>";
	table += "<tr><td>DP</td><td>" + arrows[DP] + "</td></tr>";
	table += "<tr><td>CC</td><td>" + arrows[(1-CC)*2] + "</td></tr>";
	table += "<tr><td>HC</td><td>" + HC + "</td></tr>";
	table += "<tr><td>VC</td><td>" + VC + "</td></tr>";
	table += "<tr><td>FC</td><td>" + FC + "</td></tr>";
	table += "<tr><td>SR</td><td>" + SR + "</td></tr>";
	table += "<tr><td>LR</td><td>" + LR + "</td></tr>";
	table += "<tr><td>RR</td><td>" + RR + "</td></tr>";
	el.innerHTML=table;
	
	setTimeout(updateRegisters, 100, div);
}

function uptdateOut(div){
	el = document.getElementById(div);
	el.innerHTML=out;
	
	setTimeout(uptdateOut, 100, div);
}

function updateImg(){
	var cnv = document.getElementById(divImg);
	var ctx = cnv.getContext("2d");
	
	var xSize=cnv.width;
	var ySize=cnv.height;
	
	var xLen = img[0].length;
	var yLen = img.length;
	
	var q = Math.min(xSize / xLen, ySize / yLen);
	
	ctx.clearRect(0, 0, xSize, ySize);
	
	for(var y=0; y<yLen; y++){
		for(var x=0; x<xLen; x++){
			ctx.fillStyle = img[y][x];
			ctx.fillRect(x*q, y*q, q, q);
		}
	}
	drawCircle(ctx, q, LR[0], LR[1], "#8080F0", false);
	drawCircle(ctx, q, RR[0], RR[1], "#F08080", true);
	drawPointer(ctx, q, HC, VC, "#888888");
}

function drawCircle(ctx, q, x, y, color, invert){
	var qAngle = 2*Math.PI/10;
	ctx.strokeStyle = color;
	ctx.lineCap = "butt";
	ctx.lineWidth = q/16;
	for(var angle=invert?qAngle:0; angle<2*Math.PI; angle += qAngle*2){
		ctx.beginPath();
		ctx.arc((x+.5)*q, (y+.5)*q, q/4, angle, angle+qAngle);
		ctx.stroke();
	}
}

function drawPointer(ctx, q, x, y, color){
	var angle = DP*Math.PI/2 + (2*CC-1)*Math.PI/8;
	ctx.strokeStyle = color;
	ctx.lineCap = "round";
	ctx.lineWidth = q/16;
	ctx.beginPath();
	ctx.moveTo((x+.5)*q, (y+.5)*q);
	ctx.lineTo((x+.5+.5*Math.cos(angle))*q, (y+.5+.5*Math.sin(angle))*q);
	ctx.stroke();
}
