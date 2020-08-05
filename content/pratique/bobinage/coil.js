var type;
var length;
var width;
var height;
var diameter;
var wire;
var litz;
var turns;

var round_div;
var rect_div;

var length_out;
var layers_out;
var turn_layer_out;


function start(){
	type = document.getElementById("selectType");
	length = document.getElementById("length");
	width = document.getElementById("width");
	height = document.getElementById("height");
	diameter = document.getElementById("diam");
	wire = document.getElementById("wire");
	litz = document.getElementById("litz");
	turns = document.getElementById("turns");
	
	round_div = document.getElementById("round");
	rect_div = document.getElementById("rect");
	
	length_out = document.getElementById("Ltot_O");
	layers_out = document.getElementById("layers_O");
	turn_layer_out = document.getElementById("Nlayer_O");
}

function onChange(bypass)
{
	switch(type.value){
			case "round":
				round.style["display"] = "initial";
				rect.style["display"] = "none";
			break;
			case "rect":
				round.style["display"] = "none";
				rect.style["display"] = "initial";
			break;
	}
	
	bypass = bypass || false;
	if(document.getElementById("autoChange").checked || bypass){
		//First results
		var d = floatOf(wire);
		
		var accuracy = parseInt(document.getElementById("prec").value);
		
		setFloat(layers_out, N    , accuracy);
	}
}