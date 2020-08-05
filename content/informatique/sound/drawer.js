var inCnv, inCtx;
var outCnv, outCtx;
var drawing = false;
var prevX = 0, currX = 0;
var prevY = 0, currY = 0;

var xSize, ySize;
var lowScale, highScale;

function initCanvas(inName, outName) {
	inCnv = document.getElementById(inName);
	inCtx = inCnv.getContext("2d");
	
	outCnv = document.getElementById(outName);
	outCtx = outCnv.getContext("2d");
	
	xSize=inCnv.width;
	ySize=inCnv.height;
	
	wave = new Array(xSize);

	inCnv.addEventListener("mousemove", function (e) {
		findxy('move', e)
	}, false);
	inCnv.addEventListener("mousedown", function (e) {
		findxy('down', e)
	}, false);
	inCnv.addEventListener("mouseup", function (e) {
		findxy('up', e)
	}, false);
	inCnv.addEventListener("mouseout", function (e) {
		findxy('out', e)
	}, false);
	inCnv.addEventListener("onmouseover", function (e) {
		findxy('in', e)
	}, false);
	
	initCnv();
}

function initCnv(){	
	for(var x=0; x<xSize; x++)
		wave[x] = 0;
	
	drawArray(wave, inCtx);
	drawOutput();
}

function drawOutput(){
	reloadBuffer();
	outCnv.width = output.length;
	drawArray(output, outCtx);
}

function drawArray(arr, ctx) {
	w = arr.length;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, w, ySize);
	for(var x=0; x<w; x++){
		hue = (x/w)*360;
		ctx.fillStyle = "hsl("+hue+", 70%, 50%)";
		ctx.fillRect(x, arr[x]*-1*(ySize-1)/2+(ySize-1)/2-1, 2, 4);
	}
}

function setPoint(x, y){
	wave[x] = ((y+1)/(ySize-1)*2-1)*-1;
}
function setLine(fx, fy, tx, ty){
	for(var x=Math.min(fx, tx); x<=Math.max(tx, fx); x++){
		y = ((ty-fy)/(tx-fx)) * (x-fx) + fy
		setPoint(x, y);
	}
}

function findxy(res, e) {
	if (res == 'down' || res == 'in') {
		prevX = currX;
		prevY = currY;
		currX = e.clientX - inCnv.offsetLeft;
		currY = e.clientY - inCnv.offsetTop;

		drawing = true;
	}
	if (res == 'up' || res == 'out') {
		if(drawing)
			drawOutput();
		drawing = false;
	}
	if (res == 'move') {
		if (drawing) {
			prevX = currX;
			prevY = currY;
			currX = e.clientX - inCnv.offsetLeft;
			currY = e.clientY - inCnv.offsetTop;
			setLine(prevX, prevY, currX, currY);
			drawArray(wave, inCtx);
		}
	}
}
