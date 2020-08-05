var input, output;
var ctxIn, ctxOut;
var ctxX, ctxY;
var X, Y;
var xSize, ySize;
var progress;

var hueWheel;

var sanitizedX;
var sanitizedY;
var dim;
var Zdim;
var isStopped = false;

/*
 * Initialize constant elements
 */
function start(){
	input = document.getElementById("input");
	ctxIn = input.getContext("2d");
	output = document.getElementById("output");
	ctxOut = output.getContext("2d");
	
	ctxX = document.getElementById("showX").getContext("2d");
	ctxY = document.getElementById("showY").getContext("2d");
	
	X = document.getElementById("X");
	Y = document.getElementById("Y");
	
	progress = document.getElementById("progress");
	
	refreshValues();
	drawOut();
}

/*
 * Refresh variable elements
 */
function refreshValues(){
	/*input.width = input.scrollWidth;
	input.height = input.scrollHeight;
	output.width = output.scrollWidth;
	output.height = output.scrollHeight;*/
	xSize=input.width;
	ySize=input.height;
	
	//Cut out unecessary char to prevent attacks with eval()
	sanitizedX = X.value;//.replace(/[^()xy\d\.^\/*+-]/g, '');
	sanitizedY = Y.value;//.replace(/[^()xy\d\.^\/*+-]/g, '');
	
	dim = [
	parseFloat(document.getElementById('minX').value) || 0,
	parseFloat(document.getElementById('maxX').value) || 0,
	parseFloat(document.getElementById('minY').value) || 0,
	parseFloat(document.getElementById('maxY').value) || 0,
	parseFloat(document.getElementById('step').value) || 5,
	parseFloat(document.getElementById('mag').value) || 1];
	Zdim = [
	parseFloat(document.getElementById('minZx').value) || 0,
	parseFloat(document.getElementById('maxZx').value) || 0,
	parseFloat(document.getElementById('minZy').value) || 0,
	parseFloat(document.getElementById('maxZy').value) || 0];
	
	progress.max = Math.floor((xSize-1)/dim[4]) * dim[4];
	progress.value = 0;
}

/*
 * Draw the output canvas (called from user)
 */
function drawOut(){
	refreshValues();
	clearCanvas(ctxOut);
	drawHueCircle(ctxOut, dim[5]);
	drawAxes(ctxOut, Zdim, 10);
}

/*
 * Draw the input canvas (called from the user)
 */
function drawGraph(){
	refreshValues();
	
	var x,y;
	var Cx,Cy;
	var Ox,Oy;
	
	clearCanvas(ctxIn);
	isStopped = false;
	
	//This weird loop is needed to not hang up
	var xLoop = function(Cx){
	if((Cx>=xSize) || isStopped){
	drawAxes(ctxIn, dim, 10);
	return;}
	
		for(Cy=0; Cy<ySize; Cy+=dim[4]){
			//Get the real coordinates
			x = map(Cx, 0, xSize-1, dim[0], dim[1]);
			y = map(Cy, 0, ySize-1, dim[2], dim[3]);
			
			//Pass them through the functions
			Ox = eval(sanitizedX);
			Oy = eval(sanitizedY);
			
			//Retrieve canvas coordinates
			COx = map(Ox, Zdim[0], Zdim[1], 0, xSize-1);
			COy = map(Oy, Zdim[2], Zdim[3], 0, ySize-1);
			
			//Draw it !
			ctxIn.fillStyle = hueWheel[Math.floor(COx)][Math.floor(ySize-COy-1)];
			ctxIn.fillRect(Cx, ySize-Cy-1, dim[4], -dim[4]);
		}
		
		progress.value = Cx;
		setTimeout(function(){xLoop(Cx + dim[4]);}, 0);
	}
	
	xLoop(0);
}

/*
 * Draw a single function  (called from the user)
 */
function drawFct(fctName){
	refreshValues();
	
	var ctx = (fctName=="X") ? ctxX : ctxY;
	var fct = (fctName=="X") ? sanitizedX : sanitizedY;
	
	var x,y,z;
	var Cx,Cy;
	var max, min, zero;
	
	//Auto-set range
	for(Cx=0; Cx<xSize; Cx++){
	for(Cy=0; Cy<ySize; Cy++){
		x = map(Cx, 0, xSize-1, dim[0], dim[1]);
		y = map(Cy, 0, ySize-1, dim[2], dim[3]);
		
		z = eval(fct);
		
		//Setup min and max
		if((Cx==0) && (Cy==0)){
			max=z;
			min=z;
			zero=Math.abs(z);
		}
		else{
			max = Math.max(max, z);
			min = Math.min(min, z);
			zero = Math.min(zero, Math.abs(z));
		}
	}
	}
	zero = zero + .01 * (Math.max(Math.abs(max), Math.abs(min)) - zero);
	console.log("M:" +Math.max(Math.abs(max), Math.abs(min))+" Z:"+zero);
	//Update fields
	document.getElementById('minZ'+fctName.toLowerCase()).value = ""+Math.round(min, 2);
	document.getElementById('maxZ'+fctName.toLowerCase()).value = ""+Math.round(max, 2);
	
	//Actual drawing
	for(Cx=0; Cx<xSize; Cx++){
	for(Cy=0; Cy<ySize; Cy++){
		x = map(Cx, 0, xSize-1, dim[0], dim[1]);
		y = map(Cy, 0, ySize-1, dim[2], dim[3]);
		
		z = eval(fct);
		var l = ((z-min)/(max-min))*255 |0;
		
		//The best way would be a flood algorithm and test if the line size is, 
		//in at least one of the two directions, less than a pixel width constant
		//Or a gradient. But I don't like them.
		if(((-zero)<z) && (z<zero)){
			var rgb = hsvToRgb(120, 1, l/255);
			ctx.fillStyle = "rgb("+rgb[0]+", "+rgb[1]+", "+rgb[2]+")";
		}
		else
			ctx.fillStyle = "rgb("+l+", "+l+", "+l+")";
		ctx.fillRect(Cx, ySize-Cy-1, 1, -1);
	}
	}
	
	drawAxes(ctx, dim, 10, "darkblue", "red");
}

/*
 * Draw a hue wheel on a canvas.
 * The value can be attenuated by a magnitude of mag
 */
function drawHueCircle(ctx, mag){
	var maxRadius = Math.sqrt(xSize*xSize/4 + ySize*ySize/4);
	var x, y;
	
	hueWheel = new Array();
	
	for(var Cx=0; Cx<xSize; Cx++){
		hueWheel[Cx] = new Array();
		
		for(var Cy=0; Cy<ySize; Cy++){
			x = Cx - xSize/2;
			y = Cy - ySize/2;
			
			var radius = Math.sqrt(x*x + y*y);
			var angle = (Math.atan2(x,y) + 2*Math.PI) % (2*Math.PI);
			
			var hue = 180*angle/Math.PI;
			var val = 1-Math.pow(1-(radius/maxRadius), mag);
			
			var rgb = hsvToRgb(hue, 1, val);
			
			hueWheel[Cx][ySize-Cy-1] = "rgb("+rgb[0]+", "+rgb[1]+", "+rgb[2]+")";
			
			ctx.fillStyle = hueWheel[Cx][ySize-Cy-1];
			ctx.fillRect(Cx, ySize-Cy-1, 1, -1);
		}
	}
}

function drawCircle(ctx, x,y,r,c){
	ctx.fillStyle = c || "white";
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
}

function drawLine(ctx, xs, ys, xl, yl,c){
	ctx.strokeStyle = c || "black";
	ctx.beginPath();
	ctx.moveTo(xs,ys);
	ctx.lineTo(xl,yl);
	ctx.closePath();
	ctx.stroke();
}
function drawAxes(ctx, d, step, cb, cf){
	
	var Cx=map(0, d[0], d[1], 0, xSize-1);
	var Cy=ySize-1-map(0, d[2], d[3], 0, ySize-1);
	
	drawLine(ctx, 0,Cy, xSize,Cy, cb);
	drawLine(ctx, Cx,0, Cx,ySize, cb);
	
	//Get the step simple (one digit) value based on dimensions
	var stepValueX = parseFloat(((d[1]-d[0])/step).toPrecision(1));
	var stepValueY = parseFloat(((d[3]-d[2])/step).toPrecision(1));
	//Transform this value into canvas coordinate
	var stepSizeX = map(stepValueX + d[0], d[0], d[1], 0, xSize-1);
	var stepSizeY = map(stepValueY + d[2], d[2], d[3], 0, ySize-1);
	
	//Start to draw from the center (0, 0)
	for(var x=Cx - stepSizeX*Math.ceil(Cx/stepSizeX); x<=xSize; x+=stepSizeX)
		drawCircle(ctx, x, Cy, 1, cf);
	for(var y=Cy - stepSizeY*Math.ceil(Cy/stepSizeY); y<=ySize; y+=stepSizeY)
		drawCircle(ctx, Cx, y, 1, cf);
	
	ctx.font="white 20px Georgia";
	ctx.fillText(stepValueX,Cx+stepSizeX,Cy-3);
	ctx.fillText(stepValueY,Cx+3,Cy-stepSizeY);
}

function clearAll(){
	clearCanvas(ctxIn);
	clearCanvas(ctxOut);
}
function clearCanvas(ctx){
	ctx.clearRect(0, 0, xSize, ySize);
}
function stop(){
	isStopped = true;
}

function examples(number){
	switch(number){
		case 1:
		document.getElementById('minX').value = ""+(-15);
		document.getElementById('maxX').value = ""+(15);
		document.getElementById('minY').value = ""+(-15);
		document.getElementById('maxY').value = ""+(15);
		document.getElementById('minZx').value = ""+(0);
		document.getElementById('maxZx').value = ""+(200);
		document.getElementById('minZy').value = ""+(-10);
		document.getElementById('maxZy').value = ""+(10);
		document.getElementById('step').value = ""+(1);
		document.getElementById('mag').value = ""+(10);
		X.value = "x*x+y*y";
		Y.value = "y";
		break;
		case 2:
		document.getElementById('minX').value = ""+(-10);
		document.getElementById('maxX').value = ""+(10);
		document.getElementById('minY').value = ""+(-10);
		document.getElementById('maxY').value = ""+(10);
		document.getElementById('minZx').value = ""+(-20);
		document.getElementById('maxZx').value = ""+(20);
		document.getElementById('minZy').value = ""+(-20);
		document.getElementById('maxZy').value = ""+(20);
		document.getElementById('step').value = ""+(1);
		document.getElementById('mag').value = ""+(5);
		X.value = "x-y";
		Y.value = "x+y";
		break;
		case 3:
		document.getElementById('minX').value = ""+(-10);
		document.getElementById('maxX').value = ""+(10);
		document.getElementById('minY').value = ""+(-10);
		document.getElementById('maxY').value = ""+(10);
		document.getElementById('minZx').value = ""+(-10);
		document.getElementById('maxZx').value = ""+(10);
		document.getElementById('minZy').value = ""+(-10);
		document.getElementById('maxZy').value = ""+(10);
		document.getElementById('step').value = ""+(1);
		document.getElementById('mag').value = ""+(5);
		X.value = "x+1";
		Y.value = "y+1";
		break;
	}
}

/*
 * Clip val with fmin/max, then
 * Map val from f to t
 */
function map(val, fMin, fMax, tMin, tMax){
	val = (val<fMin) ? fMin:((val>fMax) ? fMax:val); //Clip
	return ((val-fMin)/(fMax-fMin))*(tMax-tMin)+tMin; //Map
}

function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
     
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(1, s));
    v = Math.max(0, Math.min(1, v));
     
    if(s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }
     
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
     
    return [
        Math.round(r * 255), 
        Math.round(g * 255), 
        Math.round(b * 255)
    ];
}