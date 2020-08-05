function makeFile() 
{
	var name= document.getElementById('name').value;
	var device = document.getElementById('device').value;
	var out = document.getElementById('outText');
	
	var space = 33;
	var nbPins=240;
	var pins = {
				bar:{0:153, 1:152, 2:151, 3:149, 4:148, 5:147, 6:146, 7:144},
				seg1:{0:117, 1:111, 2:119, 3:114, 4:113, 5:116, 6:115, 7:118},
				seg2:{0:131, 1:120, 2:133, 3:127, 4:126, 5:129, 6:128, 7:132},
				dip:{0:163, 1:162, 2:161, 3:159, 4:158, 5:157, 6:156, 7:154},
				swi:{1:143, 2:142, 3:141, 4:139, 5:138, 6:137, 7:136, 8:134},
				bp:{9:110, 10:109},
				clk:{0:91}
				};
	var reserved = {
					CONF_DONE:[2],
					nCEO:[3],
					nCE:[178],
					nSTATUS:[60],
					nCONFIG:[121],
					TCK:[1],
					TDO:[4],
					TDI:[177],
					TMS:[58],
					TRST:[59],
					MSEL1:[123],
					MSEL0:[124],
					DATA0:[180],
					DCLK:[179],
					VCCINT:[5,16,27,37,47,57,67,77,89,96,112,122,130,140,150,160,170,189,205,224],
					GNDINT:[10,22,32,42,52,69,85,90,91,92,93,104,125,135,145,155,165,176,197,210,211,212,216,232]
					};
	//console.log(pins["bar"]["5"]);
	
	//Set filename
	document.getElementById('title').innerHTML=name+".pin";
	
	//Make the file !
	outText.value = "N.C. = No Connect. This pin has no internal connection to the device.\n\
VCCINT = Dedicated power pin, which MUST be connected to VCC (5.0 volts).\n\
VCCIO = Dedicated power pin, which MUST be connected to VCC (5.0 volts).\n\
GNDINT = Dedicated ground pin or unused dedicated input, which MUST be connected to GND.\n\
GNDIO = Dedicated ground pin, which MUST be connected to GND.\n\
RESERVED = Unused I/O pin, which MUST be left unconnected.\n\
\n\
----------------------------------------------------------------------------\n\
\n\
CHIP "+name+" ASSIGNED TO AN "+device+"\n";

	for(var pin=1; pin<=nbPins; pin++)
	{
		var pinInfo=getPinInfo(pins, pin);
		if(pinInfo[0] != null && pinInfo[1] != null)
		{
			var pinTitle = getChildByName(document.getElementById(pinInfo[0]), pinInfo[1]).value;
			if(pinTitle == "")
				pinTitle = "RESERVED";
			outText.value+=fillWithSpaces(pinTitle, space)+": "+pin+"\n";
		}
		else
		{
			var spec = searchForValue(reserved, pin);
			if(spec == null)
				spec = "RESERVED";
			outText.value+=fillWithSpaces(spec, space)+": "+pin+"\n";
		}
	}
	
}

var timeout;
function onChange() 
{
	if (timeout != null) {
		clearTimeout(timeout);
	}
	timeout = setTimeout("makeFile()", 500);
}


function getPinInfo(pins, pin)
{
	for (var cat in pins) 
	{
		if (cat === 'length' || !pins.hasOwnProperty(cat)) continue;
		
		var innerArray = pins[cat];
		
		for (var num in innerArray) 
		{
			if (num === 'length' || !innerArray.hasOwnProperty(num)) continue;
			
			if(innerArray[num] == pin)
				return [cat, num];			
		}
	}
	
	return [null, null];
}

