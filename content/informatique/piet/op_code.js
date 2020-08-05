/** Constants **/
var var_size=256;
var C = {	lr: "#FFC0C0",
			ly: "#FFFFC0",
			lg: "#C0FFC0",
			lc: "#C0FFFF",
			lb: "#C0C0FF",
			lm: "#FFC0FF",
			 r: "#FF0000",
			 y: "#FFFF00",
			 g: "#00FF00",
			 c: "#00FFFF",
			 b: "#0000FF",
			 m: "#FF00FF",
			dr: "#C00000",
			dy: "#C0C000",
			dg: "#00C000",
			dc: "#00C0C0",
			db: "#0000C0",
			dm: "#C000C0",
			 w: "#FFFFFF",
			 k: "#000000"};

var color_table = [ [C.lr, C.ly, C.lg, C.lc, C.lb, C.lm],
					[C. r, C. y, C. g, C. c, C. b, C. m],
					[C.dr, C.dy, C.dg, C.dc, C.db, C.dm] ];

/** Mnemonique **/
var code = [["_nop",		"_push", 		"_pop"],
			["_add",		"_substract",	"_multiply"],
			["_divide",		"_mod",			"_not"],
			["_greater",	"_pointer",		"_switch"],
			["_duplicate",	"_roll",		"_in_nb"],
			["_in_chr",		"_out_nb",		"_out_chr"]];

/** Registers **/
var running=false;
var out="";		//Out buffer
var img = [];

var stack = [];	//Stack
var DP = 0;		//Directionnal pointer 	(right, down, left, up)
var CC = 0;		//Codel Chooser			(left, right)
var IR = "_nop";//Instruction Register

var HC = 0;		//Horizontal Counter
var VC = 0;		//Vertical Counter
var FC = 0; 	//Fail Counter
var SR = 0;		//Size Register
var LR = [0, 0];//Left position register
var RR = [0, 0];//Right position register


/** Stack manipulation **/
function _push(r){
	if(r != undefined)
		stack.push((r%var_size)||0);
	else
		stack.push((SR%var_size)||0);
}

function _pop(){
	return stack.pop()||0;
}

/** Arithmetical operation **/
function _add(){
	var a=_pop();
	var b=_pop();
	var r=(a+b)%var_size;
	_push(r);
}

function _substract(){
	var a=_pop();
	var b=_pop();
	var r=(b-a)%var_size;
	_push(r);
}

function _multiply(){
	var a=_pop();
	var b=_pop();
	var r=(a*b)%var_size;
	_push(r);
}

function _divide(){
	var a=_pop();
	var b=_pop();
	var r=(Math.floor(b/a))%var_size;
	_push(r);
}

function _divide(){
	var a=_pop();
	var b=_pop();
	var r=(Math.floor(b/a))%var_size;
	_push(r);
}

function _mod(){
	var a=_pop();
	var b=_pop();
	var r=(b%a)%var_size;
	_push(r);
}

/** Bit operation **/
function _not(){
	var a=_pop();
	var r=!a;
	_push(r);
}

function _greater(){
	var a=_pop();
	var b=_pop();
	var r=b>a;
	_push(r);
}

/** Flow **/
function _nop(){
}

function _pointer(){
	var a=_pop();
	DP += a;
	DP %= 4;
}

function _switch(){
	var a=_pop();
	CC += a;
	CC %= 2;
}

/** Memory manipulation **/
function _duplicate(){
	var a=_pop();
	_push(a);
	_push(a);
}

//a>0 => Top to bottom, a<0 => Bottom to top
function _roll(){
	var a=_pop();
	var b=_pop();
	var temp_stack = [];
	var temp = 0;
	
	for(var j=0; j<Math.abs(a); j++)
	{
		if(a>0) temp = _pop();
		for(var i=0; i<(b-1); i++)
			temp_stack.push(_pop());
		if(a<0) temp = _pop();
		
		if(a>0) _push(temp);
		for(var i=0; i<(b-1); i++)
			_push(temp_stack.pop());
		if(a<0) _push(temp);
	}
}
/* To much advanced
function _roll(){
	var a=_pop();
	var b=_pop();
	var s=stack.splice(-b);
	a -= s.length * Math.floor(a / s.length);
	[].push.apply(s, s.splice(0, a));
	[].push.apply(stack, s);
}*/

/** IO **/
function _in_nb(){
	var a=prompt("IN (number)")||"0";
	a=parseInt(a)||0;
	_push(a);
}

function _in_chr(){
	var a=prompt("IN (character)")||"a";
	a = a.charCodeAt(0);
	_push(a);
}

function _out_nb(){
	var a=_pop();
	out += a.toString();
}

function _out_chr(){
	var a=_pop();
	out += String.fromCharCode(a);
}


