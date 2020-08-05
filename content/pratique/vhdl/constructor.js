function upload()
{
	/* Constants */
	var lib = "LIBRARY ieee;"
	var libHeader = "USE ";
	var libFooter = ";";
	var pinHeader = "PORT( ";
	var pinFooter = ");";
	var entityHeader = "ENTITY &name IS";
	var entityFooter = "END &name;";
	var archHeader = "ARCHITECTURE arch_&name OF &name IS";
	var archMiddle = "BEGIN";
	var archFooter = "END arch_&name;";
	var processHeader = "&name  : PROCESS (&list)\nBEGIN";
	var processFooter = "END PROCESS &name;";
	var componentHeader = "COMPONENT &name\nPORT(";
	var componentFooter = ");\nEND COMPONENT;";
	
	var component = "U&num : &name PORT MAP(...);";
	var signal = "SIGNAL &name : &dir;";
	var pin = "&name : &dir &type";
	var pinVecT = " (&i TO &j)";
	var pinVecDT = " (&i DOWNTO &j)";
	
	/* Others */
	var name = document.getElementById('name').value;
	var outText=document.getElementById('outText');
	var Div;
	var Value;
	var childs;
	
	var i;
	
	//Replacement
	entityHeader = entityHeader.replace(/&name/g, name);
	entityFooter = entityFooter.replace(/&name/g, name);
	archHeader = archHeader.replace(/&name/g, name);
	archFooter = archFooter.replace(/&name/g, name);
	
	outText.innerHTML="--Auto generated output\n";
	//Libraries
	Div=document.getElementById('lib');
	childs=getChildsByTagName(Div, 'DIV');
	
	outText.innerHTML+=lib+"\n";
	for(i=0; i<childs.length; i++)
	{
		Div=childs[i];
		var libName=getChildByName(Div, "libName");
		if(libName.value != "")
			outText.innerHTML+=libHeader+libName.value+libFooter+"\n";
	}
	outText.innerHTML+="\n";
	
	//Pin+Entity
	Div=document.getElementById('pin');
	childs=getChildsByTagName(Div, 'DIV');
	
	outText.innerHTML+=entityHeader+"\n"+pinHeader+"\n";
	for(i=0; i<childs.length; i++)
	{
		Div=childs[i];
		var pinName=getChildByName(Div, "pinName");
		var pinDir=getChildByName(Div, "pinDir");
		var pinType=getChildByName(Div, "pinType");
		var pinMin=getChildByName(Div, "pinMin");
		var pinMax=getChildByName(Div, "pinMax");
		
		Value=pin;
		if(pinName.value != "" && pinDir.value != "" && pinType.value !="")
		{
			Value = Value.replace("&name", pinName.value);
			Value = Value.replace("&dir", pinDir.value);
			Value = Value.replace("&type", pinType.value.replace("&", ""));
			if(pinType.value == "STD_LOGIC_VECTOR")
				Value+=pinVecT.replace("&i", pinMin.value).replace("&j", pinMax.value);
			else if(pinType.value == "STD_LOGIC_VECTOR&")
				Value+=pinVecDT.replace("&i", pinMin.value).replace("&j", pinMax.value);
			
			outText.innerHTML+=Value;
			if(i<(childs.length-1))
				outText.innerHTML+=";";
			outText.innerHTML+="\n";
		}
	}
	outText.innerHTML+=pinFooter+"\n"+entityFooter+"\n\n";
	
	//Arch
	outText.innerHTML+=archHeader+"\n\n";
	
	//Component
	Div=document.getElementById('comp');
	childs=getChildsByTagName(Div, 'DIV');
	
	for(i=0; i<childs.length; i++)
	{
		Div=childs[i];
		var compName=getChildByName(Div, "compName");
		
		if(compName.value != "")
			outText.innerHTML+=componentHeader.replace("&name", compName.value)+"\n\n"+componentFooter+"\n";
	}
	outText.innerHTML+="\n";
	
	//Signal
	Div=document.getElementById('sig');
	childs=getChildsByTagName(Div, 'DIV');
	
	for(i=0; i<childs.length; i++)
	{
		Div=childs[i];
		var sigName=getChildByName(Div, "sigName");
		var sigDir=getChildByName(Div, "sigDir");
		
		if(sigName.value != "")
			outText.innerHTML+=signal.replace("&name", sigName.value).replace("&dir", sigDir.value)+"\n";
	}
	outText.innerHTML+="\n";
	
	//Arch
	outText.innerHTML+=archMiddle+"\n";
	
	//Component
	Div=document.getElementById('comp');
	childs=getChildsByTagName(Div, 'DIV');
	
	for(i=0; i<childs.length; i++)
	{
		Div=childs[i];
		var compName=getChildByName(Div, "compName");
		
		if(compName.value != "")
			outText.innerHTML+=component.replace("&name", compName.value).replace("&num", i)+"\n";
	}
	outText.innerHTML+="\n";
	
	//Process
	Div=document.getElementById('proc');
	childs=getChildsByTagName(Div, 'DIV');
	
	for(i=0; i<childs.length; i++)
	{
		Div=childs[i];
		var procName=getChildByName(Div, "procName");
		var procList=getChildByName(Div, "procList");
		
		if(procName.value != "" && procList.value != "")
		{
			outText.innerHTML+=processHeader.replace("&name", procName.value).replace("&list", procList.value)+"\n\n"+processFooter.replace("&name", procName.value)+"\n";
		}
	}
	outText.innerHTML+="\n";
	
	//Arch
	outText.innerHTML+=archFooter+"\n";
	
	
}

