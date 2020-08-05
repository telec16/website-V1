var cycleButton;
var fcycleButton;
var imgInt;
var speed=100;

function stop(){
	cycleButton.setAttribute("disabled", "true");
	fcycleButton.setAttribute("disabled", "true");
	clearInterval(imgInt);
	
	running=false;
    
	updateImg();
}

function start(){
	if(running == false){
		cycleButton = document.getElementById("cycle");
		fcycleButton = document.getElementById("fcycle");
		
		out="";		//Out buffer
		stack = [];	//Stack
		DP = 0;		//Directionnal pointer 	(right, down, left, up)
		CC = 0;		//Codel Chooser			(left, right)
		IR = "_nop";//Instruction Register
		
		HC = 0;		//Horizontal Counter
		VC = 0;		//Vertical Counter
		FC = 0; 	//Fail Counter
		SR = 0;		//Size Register
		LR = [0, 0];//Left position register
		RR = [0, 0];//Right position register
		
		blocProperties(HC, VC);
		running=true;
		cycleButton.removeAttribute("disabled");
		fcycleButton.removeAttribute("disabled");
		imgInt = setInterval(updateImg, 500);
	}
	else
		stop();
}

function run(){
	cycle(false);
	if(running)
		setTimeout(run, speed);	
	updateImg();
}
function speedChange(div){
	speed = parseInt(div.value)||100;
}

function cycle(fast){
	if(running){
		if(FC>=8){
			stop();
		}
		else {
			var fail = !moveAndExecute();
			blocProperties(HC, VC);
			if(fail && fast)
				cycle(fast);
		}
	}
}

function execute(fromColor, toColor){
	var hF=0, lF=0;
	var hT=0, lT=0;
	
	if((fromColor != C.w) && (toColor != C.w))
	{
		for(var hue=0; hue<6; hue++){
			for(var lum=0; lum<3; lum++){
				if(fromColor == color_table[lum][hue]){
					lF = lum;
					hF = hue;
				}
				if(toColor == color_table[lum][hue]){
					lT = lum;
					hT = hue;
				}
			}
		}
	}
	
	var hueDiff = (6-hF+hT)%6;
	var lumDiff = (3-lF+lT)%3;
	
	IR = code[hueDiff][lumDiff];
	eval(IR + "();");
}

function moveAndExecute(){
	var x,y;
	if(CC){ //Right
		x = RR[0];
		y = RR[1];
	}else{ //Left
		x = LR[0];
		y = LR[1];
	}
	
	var fromColor = moveToNext(x, y);
	if(fromColor === false){ //Can't move
		FC++;
		if(FC%2)
			CC = 1-CC;
		else
			DP = (DP+1)%4;
		
		return false;
	}
	else{
		FC=0;
		execute(fromColor, img[VC][HC]); //Next op
		
		return true;
	}
}

function moveToNext(x, y){
	var xLen = img[0].length;
	var yLen = img.length;
	var fromColor = img[y][x];
	
	switch(DP){
	case 0: //Right
		x++;
		break;
		
	case 1: //Down
		y++;
		break;
		
	case 2: //Left
		x--;
		break;
		
	case 3: //Up
		y--;
		break;
	}
	
	if((x<0) || (y<0) || (x>=xLen) || (y>=yLen)){ //Out of bound
		return false;
	}
	if(img[y][x] == C.k){ //Wall
		return false;
	}
	/*if(img[y][x] == C.w){ //White
		return moveToNext(x, y);
	}*/
	
	VC = y;
	HC = x;
	
	return fromColor;
}


function blocProperties(x, y) {
	var xLen = img[0].length;
	var yLen = img.length;
	var counted = Array(yLen).fill(false).map(x => Array(xLen).fill(false));

	SR = 0;		//Size Register
	LR = [x, y];//Left position register
	RR = [x, y];//Right position register

	
	function setMax(x, y){
		switch(DP){
		case 0: //Right
			if((LR[0] < x) || ((LR[1] > y) && (LR[0] <= x))) 
				LR = [x, y];
			if((RR[0] < x) || ((RR[1] < y) && (RR[0] <= x))) 
				RR = [x, y];
			break;
			
		case 1: //Down
			if((LR[1] < y) || ((LR[0] < x) && (LR[1] <= y))) 
				LR = [x, y];
			if((RR[1] < y) || ((RR[0] > x) && (RR[1] <= y))) 
				RR = [x, y];
			break;
			
		case 2: //Left
			if((LR[0] > x) || ((LR[1] < y) && (LR[0] >= x))) 
				LR = [x, y];
			if((RR[0] > x) || ((RR[1] > y) && (RR[0] >= x))) 
				RR = [x, y];
			break;
			
		case 3: //Up
			if((LR[1] > y) || ((LR[0] > x) && (LR[1] >= y))) 
				LR = [x, y];
			if((RR[1] > y) || ((RR[0] < x) && (RR[1] >= y))) 
				RR = [x, y];
			break;
		}
	}
	
	function crawler(x, y, color){
	  if(img[y] && img[y][x]) {
		if(img[y][x] != color || counted[y][x])
		  return;
	  
		SR++;
		setMax(x, y);
		counted[y][x] = true;
		
		crawler(x, y+1, color);
		crawler(x, y-1, color);
		crawler(x-1, y, color);
		crawler(x+1, y, color);
	  }
	}
	
	crawler(x, y, img[y][x]);
}
