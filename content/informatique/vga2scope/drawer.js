var cnv = null, ctx = null;
var xSize = 0, ySize = 0;

function init(){
	cnv = document.getElementById("output");
	ctx = cnv.getContext("2d");
	
	window.addEventListener( 'resize', onResize, false );
	cnv.addEventListener("click", fullscreen, false);
	onResize();
	
	askData();
}

function updateCanvas(){
	var length = xSize*Math.floor(ySize/points.length);
	
	var grd = ctx.createLinearGradient(0, 0, 0, ySize);
	for(var p=0; p<points.length; p++){
		var x = (p*length)%xSize;
		var y = (p*length)/xSize;
		var l = length - (xSize-x);
		var h = Math.floor(l/xSize);
		l -= h*xSize;
		
		
		if(settings["gradient"]){
			grd.addColorStop(p/points.length, getColor(points[p]));
		} else {
			ctx.fillStyle = getFilling(p, -1);
			ctx.fillRect(x, y, xSize-x, 1);
			
			ctx.fillStyle = getFilling(p, h);
			if(h != 0)
				ctx.fillRect(0, y+1, xSize, h);
			
			ctx.fillStyle = getFilling(p, 0);
			ctx.fillRect(0, y+h+1, l, 1);
		}
	}
	if(settings["gradient"]){
		grd.addColorStop(1, getColor(points[0]));
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, xSize, ySize);
	}
}

function previousPoint(p){
	var l = points.length;
	return points[(l+p-1)%l];
}
function nextPoint(p){
	var l = points.length;
	return points[(p+1)%l];
}

function getFilling(p, size){
	if(settings["gradient"]){
		if(size > 0){
			var grd = ctx.createLinearGradient(0, 0, 0, size);
			grd.addColorStop(0, getColor(points[p]));
			grd.addColorStop(1, getColor(nextPoint(p)));
			return grd;
		} else if(size < 0) {
			return getColor(points[p]);
		} else {
			return getColor(nextPoint(p));
		}
	} else {
		return getColor(points[p]);
	}
}

function getColor(point){
	
	var r = ( 255 + (point[settings["red"  ]]*2.55) * (settings[settings["red"  ]] ? -1:1) ) % 255;
	var g = ( 255 + (point[settings["green"]]*2.55) * (settings[settings["green"]] ? -1:1) ) % 255;
	var b = ( 255 + (point[settings["blue" ]]*2.55) * (settings[settings["blue" ]] ? -1:1) ) % 255;
	
	return "rgb("+r+","+g+","+b+")";
}

function onResize(){
	xSize = cnv.width  = window.innerWidth;
	ySize = cnv.height = window.innerHeight;
	
	updateCanvas();
}

function fullscreen(){
	if(cnv.webkitRequestFullScreen)
	   cnv.webkitRequestFullScreen();
	else
	 cnv.mozRequestFullScreen();      
}
