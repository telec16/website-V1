handler=null;
function timer(type){
	clearTimeout(handler);
	handler = setTimeout(change, 500, type);
}

var acc = 3;

function change(type){
	/*
	 * Initialize fields
	 */
	var H_div = document.getElementById("H");
	var R1_input = document.getElementById("R1");
	var R2_input = document.getElementById("R2");
	var C1_input = document.getElementById("C1");
	var C2_input = document.getElementById("C2");
	var Rf_input = document.getElementById("Rf");
	var K_input  = document.getElementById("K");
	var maxg_input  = document.getElementById("maxgain");
	var F0_input = document.getElementById("F0");
	var Q_input  = document.getElementById("Q");
	var serie_input = document.getElementById("serie");

	var lockR  = document.getElementById("lockR" ).checked;
	var lockRf = document.getElementById("lockRf").checked;
	var lockC  = document.getElementById("lockC" ).checked;

	//Canvas to draw the graph
	var ctx = document.getElementById("cnv").getContext("2d");

	//Change the schematic image
	var topo = document.getElementById("topology").value;
	document.getElementById("circuit").src = "./filter/"+topo+".png";

	//Get fields values
	var R1 = Math.abs(floatOf(R1_input, 10 )) * 1e3 ;
	var R2 = Math.abs(floatOf(R2_input, 10 )) * 1e3 ;
	var C1 = Math.abs(floatOf(C1_input, 4.7)) * 1e-9;
	var C2 = Math.abs(floatOf(C2_input, 4.7)) * 1e-9;
	var Rf = Math.abs(floatOf(Rf_input, 6.8)) * 1e3 ;
	var K  = Math.abs(floatOf(K_input , 2.8)) * 1e0 ;
	var F0 = Math.abs(floatOf(F0_input, 10 )) * 1e3 ;
	var Q  = floatOf(Q_input , 2)* 1e0 ;
	var w0 = 2*Math.PI*F0;
	var maxg = 3;


	/*
	 * Update configuration
	 */
	if(type == "config"){
		switch(topo){
			case "SKlp":
				Rf_input.disabled = true;
				document.getElementById("lockRf").disabled = true;
				if(!lockR && !lockC)
					H_div.innerHTML = "K/(1+(C2(R1+R2)+R1C1(1-K)).p+R1R2C1C2.p²)";
				if(lockR && !lockC)
					H_div.innerHTML = "K/(1+R(2.C2+C1(1-K)).p+C1C2(R.p)²)";
				if(!lockR && lockC)
					H_div.innerHTML = "K/(1+C(R2+R1(2-K)).p+R1R2(C.p)²)";
				if(lockR && lockC)
					H_div.innerHTML = "K/(1+RC(3-K).p+(RC.p)²)";
			break;
			case "SKhp":
				Rf_input.disabled = true;
				document.getElementById("lockRf").disabled = true;
				if(!lockR && !lockC)
					H_div.innerHTML = "K.p²/(1/(R1R2C1C2)+(R1(C1+C2)+R2C2(1-K))/(R1R2C1C2).p+p²)";
				if(lockR && !lockC)
					H_div.innerHTML = "K.p²/(1/(R²C1C2)+(C1+C2(2-K))/(RC1C2).p/(RC1C2)+p²)";
				if(!lockR && lockC)
					H_div.innerHTML = "K.p²/(1/(R1R2C²)+(2.R1+R2(1-K))/(R1R2C).p+p²)";
				if(lockR && lockC)
					H_div.innerHTML = "K.p²/(1/(RC)²+(3-K)/(RC).p+p²)";
			break;
			case "SKbp":
				Rf_input.disabled = false;
				document.getElementById("lockRf").disabled = false;
				if(!lockR && !lockC)
					H_div.innerHTML = "K/(R1C1).p/((R1+Rf)/(R1R2C1C2Rf)+(Rf(R1(C1+C2)+R2C2)+R1R2C2(1-K))/(R1R2C1C2Rf).p+p²)";
				if(lockR && !lockC && !lockRf)
					H_div.innerHTML = "K/(RC1).p/((R+Rf)/(R²C1C2Rf)+(Rf(C1+2.C2)+RC2(1-K))/(RC1C2Rf).p+p²)";
				if(lockR && !lockC && lockRf)
					H_div.innerHTML = "K/(RC1).p/(2/(R²C1C2)+(C1+C2(3-K))/(RC1C2).p+p²)";
				if(!lockR && lockC)
					H_div.innerHTML = "K/(R1C).p/((R1+Rf)/(R1R2C²Rf)+(Rf(2.R1+R2)+R1R2(1-K))/(R1R2CRf).p+p²)";
				if(lockR && lockC && !lockRf)
					H_div.innerHTML = "K/(RC).p/((R+Rf)/(R²C²Rf)+(3.Rf+R(1-K))/(RCRf).p+p²)";
				if(lockR && lockC && lockRf)
					H_div.innerHTML = "K/(RC).p/(2/(RC)²+(4-K)/(RC).p+p²)";
			break;
		}

		if(!lockR) {
			lockRf = document.getElementById("lockRf").checked = false;
			document.getElementById("lockRf").disabled = true;
		}
		if(lockRf)
			Rf_input.disabled = true;

		R2_input.disabled = lockR;
		C2_input.disabled = lockC;
	}


	/*
	 * Match the values
	 */
	if(lockR)  R2 = R1;
	if(lockRf) Rf = R1;
	if(lockC)  C2 = C1;

	/*
	 * Compute components
	 */
	if(type == "spec"){
		switch(topo){
			case "SKlp":
				if(!lockR)
					R1 = 1/(w0**2) * 1/(R2*C1*C2);
				else
					R1 = R2 = 1/(w0 * Math.sqrt(C1*C2));
				//R2 = 1/(w0**2) * 1/(R1*C1*C2);
				//C1 = 1/(w0**2) * 1/(R1*R2*C1);
				//C2 = 1/(w0**2) * 1/(R1*R2*C2);
				K = 1 - ( (1/(Q*w0) - C2*(R1+R2)) / (R1*C1) );
				maxg = 1 + C2*(R1+R2) / (R1*C1);
			break;
			case "SKhp":
				if(!lockR)
					R1 = 1/(w0**2) * 1/(R2*C1*C2);
				else
					R1 = R2 = 1/(w0 * Math.sqrt(C1*C2));
				K = 1 - ( (1/(Q*w0) - R1*(C1+C2)) / (R2*C2) );
				maxg = 1 + R1*(C1+C2) / (R2*C2);
			break;
			case "SKbp":
				if(!lockR)
					R1 = Rf/((w0**2) * (R2*C1*C2*Rf) - 1);
				else if(!lockRf)
					R1 = R2 = (1 + Math.sqrt(1+4*C1*C2*(Rf*w0)**2)) / (2*C1*C2*Rf*w0**2);
				else
					R1 = R2 = Rf = 1/(w0 * Math.sqrt(C1*C2/2));
				K = 1 - ( (1/(Q*w0/(R1+Rf)) - Rf*(R1*(C1+C2) + R2*C2)) / (R1*R2*C2) );
				maxg = 1 + Rf*(R1*(C1+C2) + R2*C2) / (R1*R2*C2);
			break;
		}
	}

	/*
	 * Get closest resistance serie
	 */
	if(type == "serie"){
		var s = floatOf(serie_input, 12);
		var serie = getResistorSerie(s);

		R1 = closestInList(serie, R1);
		R2 = closestInList(serie, R2);
		Rf = closestInList(serie, Rf);
	}

	/*
	 * Compute maximum gain
	 */
	switch(topo){
		case "SKlp":
			maxg = 1 + C2*(R1+R2) / (R1*C1);
		break;
		case "SKhp":
			maxg = 1 + R1*(C1+C2) / (R2*C2);
		break;
		case "SKbp":
			maxg = 1 + Rf*(R1*(C1+C2) + R2*C2) / (R1*R2*C2);
		break;
	}

	/*
	 * Compute spec
	 */
	if(type == "comp" || type == "config"){
		switch(topo){
			case "SKlp":
				w0 = 1/Math.sqrt(R1*R2*C1*C2);
				Q = 1/w0 * 1/(C2*(R1+R2) + R1*C1*(1-K));
			break;
			case "SKhp":
				w0 = 1/Math.sqrt(R1*R2*C1*C2);
				Q = 1/w0 * 1/(R1*(C1+C2) + R2*C2*(1-K));
			break;
			case "SKbp":
				w0 = Math.sqrt((R1+Rf)/(R1*R2*C1*C2*Rf));
				Q = (R1+Rf)/w0 * 1/(Rf*(R1*(C1+C2) + R2*C2) + R1*R2*C2*(1-K));
			break;
		}
	}


	/*
	 * Create the transfer function
	 */
	switch(topo){
		case "SKlp":
			//K/(1 + p/(Q*w0) + (p/w0)**2)
			fct = function(p) { return math.complex(K).div( p.div(w0).pow(2). add(p.div(Q*w0)). add(1) );}
		break;
		case "SKhp":
			//K*p**2/(p**2 + p*w0/Q + w0**2)
			fct = function(p) { return p.pow(2).mul(K).div( p.pow(2). add(p.mul(w0/Q)). add(w0**2) );}
		break;
		case "SKbp":
			//K*p/R1C1/(p**2 + p*w0/Q + w0**2)
			fct = function(p) { return p.mul(K/(R1*C1)).div( p.pow(2). add(p.mul(w0/Q)). add(w0**2) );}
		break;
	}

	/*
	 * Update fields (1/Infinity => NaN => 0)
	 */
	F0 = w0/(2*Math.PI);
	setValue(R1_input, (R1||0)* 1e-3, acc);
	setValue(R2_input, (R2||0)* 1e-3, acc);
	setValue(C1_input, (C1||0)* 1e9 , acc);
	setValue(C2_input, (C2||0)* 1e9 , acc);
	setValue(Rf_input, (Rf||0)* 1e-3, acc);
	setValue(K_input , (K ||0)* 1e0 , acc);
	setValue(F0_input, (F0||0)* 1e-3, acc);
	setValue(Q_input , (Q ||0)* 1e0 , acc);
	setFloat(maxg_input, maxg, acc);

	drawFct(ctx, fct, w0, 300, 230);
}


/*
 *  Draw a bode plot
 */
function drawFct(ctx, fct, w0, xSize, ySize){
	var p, gain;
	var Ca,Cg;
	var gmax, gmin;
	var fmax, fmin;
	fmin = 2*Math.PI*10; //10Hz
	fmax = (w0<200e3) ? 200e3:(w0+50e3); //~20kHz


	//Auto-set range
	for(Ca=0; Ca<xSize; Ca++){
		p = map(Ca, 0, xSize-1, Math.log10(fmin), Math.log10(fmax));
		p = math.complex('i').mul(Math.pow(10, p));
		gain = 20*Math.log10(fct(p).abs());

		//Setup min and max
		if(Ca==0){
			gmax=gain;
			gmin=gain;
		}
		else{
			gmax = Math.max(gmax, gain);
			gmin = Math.min(gmin, gain);
		}
	}
	gmax = Math.max(gmax, 20);
	gmin = Math.min(gmin, -80);


	//Actual drawing
		//Zero lines
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, xSize, ySize);
	ctx.fillStyle = "darkred";
	ctx.fillRect(0, ySize-map(0, gmin, gmax, 0, ySize-1)-1, xSize, 1);
	ctx.fillStyle = "darkblue";
	ctx.fillRect(0, ySize/2, xSize, 1);

		//Semi-Log scale
	for(Ca=0; Ca<xSize; Ca++){
		p = map(Ca, 0, xSize-1, Math.log10(fmin), Math.log10(fmax));
		p = math.complex('i').mul(Math.pow(10, p));
		H = fct(p);

		gain  = 20*Math.log10(H.abs());
		phase = Math.atan2(H.im, H.re);

		Cg = map(gain, gmin, gmax, 1, ySize-1);
		Cp = map(phase, -Math.PI, Math.PI, 1, ySize-1);

		ctx.fillStyle = "red";
		ctx.fillRect(Ca, ySize-Cg, 1, -1);
		ctx.fillStyle = "blue";
		ctx.fillRect(Ca, ySize-Cp, 1, -1);
	}

		//Min/Max
	ctx.fillStyle = "darkred";
	ctx.fillText(gmax.toPrecision(2), 5, 15);
	ctx.fillText(gmin.toPrecision(2), 5, ySize-5);
	ctx.fillStyle = "darkblue";
	ctx.fillText("π", xSize-15, 15);
	ctx.fillText("-π", xSize-15, ySize-5);
}


/*
 * Compute Q from the order and the topology
 */
function computeQ(){
	var tr_div = document.getElementById("resonances");
	var order_input = document.getElementById("order");
	var ripple_input = document.getElementById("ripple");

	var fun = document.getElementById("function").value;
	var order = Math.abs(floatOf(order_input, 2));
	var ripple = Math.abs(floatOf(ripple_input, 0));
	order = Math.max(2, order);

	//Clean up
	for(var td of [...tr_div.getElementsByTagName("td")]){
		tr_div.removeChild(td);
	}

	//Fill up
	for(var o=1; o<=order/2; o++){
		var Q = NaN;

		switch(fun){
			case "bessel":
				ripple_input.disabled = true;
				if(order == 2) Q = 1/(Math.sqrt(3));
			break;
			case "butterworth":
				ripple_input.disabled = true;
				var phi = Math.PI/(2*order) * (order + 2*o - 1);
				Q = 1/(-2*Math.cos(phi));
			break;
			case "chebychev":
				ripple_input.disabled = false;
				var Rdb = 10*Math.log10(ripple**2 + 1);
				var Q2 = {0.01: 0.7247, 0.1: 0.7673, 0.25: 0.8093, 0.5: 0.8638, 1: 0.9564, 3: 1.305};
				var key = closestKeyInList(Q2, Rdb);
				if(order == 2) Q = Q2[key];
			break;
		}

		var td = document.createElement("td");
		setFloat(td, Q, acc);
		tr_div.appendChild(td);
	}

	setValue(order_input, order||0, 0);
	setValue(ripple_input, ripple||0, 3);
}
