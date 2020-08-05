function add() 
{
	var what = document.getElementById("addField").value;
	
	var div = document.createElement("div");
	var parentDiv = document.getElementById(what);
	
	switch(what)
	{
		case "lib":
			div.innerHTML='<select onchange="onChange();" name="libName">\
					   <option value="" disabled selected hidden>Nom</option>\
					   <option value="ieee.std_logic_1164.all">1164</option>\
					   <option value="ieee.std_logic_unsigned.all">Unsigned</option>\
					</select>';
		break;
		
		case "pin":
			div.innerHTML='<input type="text" onkeydown="onChange();" name="pinName"/>\
			<select onchange="onChange();" name="pinDir">\
			<option value="" disabled selected hidden>Sens</option>\
			<option value="OUT">OUT</option>\
			<option value="IN">IN</option>\
			<option value="BUFFER">BUFFER</option>\
			</select>\
			<select onchange="onChange();uploadOptions(this);" name="pinType">\
			<option value="" disabled selected hidden>Type</option>\
			<option value="STD_LOGIC">Logique</option>\
			<option value="STD_LOGIC_VECTOR&">Vecteur MSB->LSB</option>\
			<option value="STD_LOGIC_VECTOR">Vecteur LSB->MSB</option>\
			</select>\
			<input type="number" value="0" onchange="onChange();" min="0" hidden="true" name="pinMin"/>\
			<input type="number" value="3" onchange="onChange();" min="0" hidden="true" name="pinMax"/>';
		break;
		
		case "proc":
			div.innerHTML='<input type="text" onkeydown="onChange();" name="procName"/>\
			<input type="text" onkeydown="onChange();" name="procList"/>';
		break;
		
		case "comp":
			div.innerHTML='<input type="text" onkeydown="onChange();" name="compName"/>';
		break;
		
		case "sig":
			div.innerHTML='<input type="text" onkeydown="onChange();" name="sigName"/>\
			<select onchange="onChange();" name="sigDir">\
			<option value="" disabled selected hidden>Sens</option>\
			<option value="OUT">OUT</option>\
			<option value="IN">IN</option>\
			<option value="BUFFER">BUFFER</option>\
			</select>';
		break;
		
		default:
			div.innerHTML='WIP';
		break;
	}
	div.innerHTML += ' <input type="button" value="Supprimer" onclick="onChange();del(this);"/>';
	
	parentDiv.appendChild(div);
	
	return;
}

function del(elem)
{
	elem.parentNode.parentNode.removeChild(elem.parentNode);
}


function uploadOptions(where) 
{
	var div = where.parentNode;
	var type = getChildByName(div, "pinType");
	var min = getChildByName(div, "pinMin");
	var max = getChildByName(div, "pinMax");
	
	if(type.value != "STD_LOGIC")
	{
		min.removeAttribute("hidden");
		max.removeAttribute("hidden");
	}
	else
	{
		min.setAttribute("hidden", "true");
		max.setAttribute("hidden", "true");
	}
}

var timeout;
function onChange() 
{
	if (timeout != null) {
		clearTimeout(timeout);
	}
	timeout = setTimeout("upload()", 500);
}
