// Set up!
var a_canvas = document.getElementById("a");
var context = a_canvas.getContext("2d");
var xSize=a_canvas.width;
var ySize=a_canvas.height;

var flakes = [];
var isTheOnlyOneAwake = false;
var TheOnlyOneColorIs;

var runningFct;


//makeMeACircle(200,95,10);
//clearMeACircle(200,100,5);

//drawMyShape();
addFlake();
actualize();


function actualize(){
	var i;
	var x,y;
	var size = flakes.length;
	
	clearTheseShapes();
	
	for(i=0; i<size; i++)
	{
		x=flakes[i][0];
		y=flakes[i][1];
		context.fillStyle = flakes[i][2];
		
		makeMeACircle(x,y,5);
	}
	
	if(isTheOnlyOneAwake)
		drawTheOnlyOne(Math.random()*(xSize-80)+40,Math.random()*(ySize-80)+40);
	
	setTimeout(actualize, 1);
}

function addFlake(color){
    var x=Math.floor(Math.random()*xSize);
    var y=Math.floor(Math.random()*ySize*0.1);
    var max = ySize-Math.floor(Math.random()*floor(x));
    
    var flakeNumber = flakes.length;
	
	flakes.push([x,y]);
	
    var sub = setInterval(manageFlake, 10);
    function manageFlake()
    {
        if (y >= max)
			clearInterval(sub);
        else 
			y++;
		
		flakes[flakeNumber]=[x,y, color || "#FFFFFF"];
    }
	
	if(color == undefined)
		runningFct=setTimeout(addFlake, 500);
}

function makeMeACircle(x,y,r){
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI);
	context.closePath();
	context.fill();
}

function clearTheseShapes(){
	context.clearRect(0, 0, xSize, ySize);
}

function invokeTheOnlyOne(color){
	if(isTheOnlyOneAwake)
		alert("it can be only one Only One invoked at a time");
	else
	{
		isTheOnlyOneAwake=true;
		TheOnlyOneColorIs = color;
	}
}

function drawTheOnlyOne(x,y){
	// Draw the face
	context.fillStyle = TheOnlyOneColorIs;
	context.beginPath();
	context.arc(x, y, 40, 0, 2*Math.PI);
	context.closePath();
	context.fill();
	context.lineWidth = 2;
	context.stroke();
	context.fillStyle = "black";

	// Draw the left eye
	context.beginPath();
	context.arc(x-20, y-10, 5, 0, 2*Math.PI);
	context.closePath();
	context.fill();

	// Draw the right eye
	context.beginPath();
	context.arc(x+19, y-10, 5, 0, 2*Math.PI);
	context.closePath();
	context.fill();

	// Draw the mouth
	context.beginPath();
	context.arc(x, y+5, 26, Math.PI, 2*Math.PI, true);
	context.closePath();
	context.fill();
}

function floor(x){
	if(x<72)
		return ((263-234)/72)*x+37;
	else if(x>396)
		return ((251-300)/(500-396))*(x-396)+49;
	else
		return ((234-251)/(396-72))*(x-72)+66;
}

/*
function drawMyShape(){
    var x=Math.random()*xSize;
    var y=Math.random()*ySize*0.1;
    var max = ySize-Math.random()*ySize*0.25;
    
    var sub = setInterval(manageShape, 10);
        
    function manageShape()
    {
        if (y >= max)
        {
            clearInterval(sub);
        }
        else 
        {
			clearMeACircle(x,y-1,5);
            makeMeACircle(x,y,5);
            
            y++;
        }
    }
	
	runningFct=setTimeout(drawMyShape, 500);
}

function clearMeACircle(x,y,r){
	r+=1;
	context.save();
	context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
	context.closePath();
    context.clip();
	context.clearRect(x - r - 1, y - r - 1, r * 2 + 2, r * 2 + 2);
	context.restore();
}*/


function flushFlakes(){
	flakes = [];
}

function addOneFlake(){
	addFlake(document.getElementById('color').value);
}

function addTheRandomOneFlake(){
	addFlake('#'+Math.floor(Math.random()*16777215).toString(16));
}

function addTheOnlyOneFlake(){
	invokeTheOnlyOne(document.getElementById('color').value);
}

function StopTheseFuckingFlakes(){
	clearInterval(runningFct);
}