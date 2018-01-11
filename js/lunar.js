// --- JavaScript ---
// Definició de variables i valors inicials
var gL = 	1.622; //gravetat de la lluna
var dt = 	0.016683;
var timer = 	null;
var timerFuel = null;

var g = gL;
var y = 74;	//altura (bottom: y%)
var v = 0;	//velocitat
var c = 100;	//combustible
var a = g;	//acceleració

var lat = null; 	// marcadors per cpanel
var vel = null;
var comb = null;
var coet = null;

var bpausa = null;	// marcadors per menú
var bplay = null;
var breinicia = null;
var bajuda = null;
var bconfig = null;

var modejoc = false;	// variable auxiliar per tal que el teclat/mouse actui només si estam jugant

var gIO = 1.81;		// variables CONFIG. NIVELLS (inicialment: fàcil)
var vlimit = 5;
var potencia = g;
var c_i = 100;
var nivell = 1;
var modificat = false;

window.onload = function(){

	// variables per marcadors del cpanel, botóns del menú, i pàgines auxiliars
	// panell
	lat= 	document.getElementById("latitud");
	vel= 	document.getElementById("velocitat");
	comb= 	document.getElementById("combustible");
	panell= document.getElementById("cpanel");
	//nau
	coet= 	document.getElementById("nau");
	imgcoet=document.getElementById("img-nau");
	// menú
	bpausa = document.getElementById("pausa");
	bplay = document.getElementById("play");
	breinicia = document.getElementById("reinicia");
	bajuda = document.getElementById("ajuda");
	bconfig = document.getElementById("configura");
	// pàgines d'informació i configuració
	paginfo = document.getElementById("ctxt");
	pagconf = document.getElementById("pconf")
	// botons i textos de configuració de nivell
	btnfacil = document.getElementById("mfacil");
	txtfacil = document.getElementById("pfacil");
	btnnormal = document.getElementById("mnormal");
	txtnormal = document.getElementById("pnormal");
	btndificil = document.getElementById("mdificil");
	txtdificil = document.getElementById("pdificil");

	// captura d'events al menú
	bpausa.onclick =	function(){pausar();};
	bplay.onclick =		function(){player();};
	breinicia.onclick =	function(){reiniciar();};
	bajuda.onclick =	function(){info();};
	bconfig.onclick =	function(){configurar();};
	// captura botons per modificar nivell
	btnfacil.onclick = 	function(){nfacil();};
	btnnormal.onclick = 	function(){nnormal();};
	btndificil.onclick = 	function(){ndificil();};

	// captura mouse
	document.onmousedown = function(){
		if (a==g) gasOn();
		else 	gasOff();
	};

	// captura el teclat
	document.onkeydown = gasOn;
	document.onkeyup = gasOff;

	// estètica de presentació	
	bpausa.style.display="none";
}
// Definició de funcions
// Motor de joc
function inicia(){
	bpausa.style.display="block";

	timer=setInterval(function(){ cinetica();},dt*1000); 

	modejoc=true;
}
function atura(){
	gasOff();
	modejoc=false;
	bpausa.style.display= "none";
	clearInterval(timer);
}
function recarga(){
	// recarregar valors inicials
	timer = null;
	timerFuel = null;

	y = 74;	// altura (bottom: y%)
	v = 0;	// velocitat
	c = c_i;// combustible
	a = g;	// acceleració

	coet.style.bottom = y+"%";
	imgcoet.src="img/nau.png";

	lat.innerHTML= y.toFixed(2);
	vel.innerHTML= v.toFixed(2);
	comb.innerHTML= c.toFixed(2);
}
// Dinámica
function cinetica(){
	v +=a*dt;	// moviment
	y -=v*dt;	// -----

	lat.innerHTML=y.toFixed(2); // actualitzar panell (dos decimals)
	vel.innerHTML=v.toFixed(2); // -----

	if (y>0)	coet.style.bottom = y+"%";
	else 		aterratge();
}

function gasOn(){
	if (modejoc && c>0) {
		a=-potencia;
		if (timerFuel==null) 	timerFuel=setInterval(function(){ actComb();}, 10);
		imgcoet.src="img/nau-gas.png";
	}
}
function gasOff(){
	if (modejoc) {
		a=g;
		clearInterval(timerFuel);
		timerFuel=null;
		imgcoet.src="img/nau.png";
	}
}
function actComb(){	
	c-=0.1;
	if (c<0) {
		c=0;
		gasOff();
	}
	comb.innerHTML=c.toFixed(2);
}
function aterratge(){

	atura();

	if (v>vlimit) 	imgcoet.src="img/explosio.gif";
	else 		imgcoet.src="img/nau-land.png";

	// Nombres en ordre (evitar decimals)
	y=0;
	v=0;
	coet.style.bottom = y+"%";
	lat.innerHTML= y.toFixed(2);
	vel.innerHTML= v.toFixed(2);

}
// Funcions de menú
function pausar(){
	atura();
	bplay.style.display= "block";
}
function player(){
	inicia();
	bplay.style.display= "none";
	bpausa.style.display= "block";
}
function reiniciar(){
	atura();
	recarga();
	bplay.style.display="block";
}
function info(){

	pausar();

	var imgprevia = imgcoet.src;

	imgcoet.src= "img/nau-land.png";
	coet.style.bottom= "0%";

	panell.style.display="none";
	bplay.style.display="none";
	breinicia.style.display="none";
	bconfig.style.display="none";
	paginfo.style.display="block";

	bajuda.onclick = function(){
		// Sortir de la pàgina d'ajuda
		paginfo.style.display="none";
		panell.style.display="block";
		breinicia.style.display="block";
		bconfig.style.display="block";
		imgcoet.src= imgprevia;
		coet.style.bottom= y+"%";

		if (y) bplay.style.display= "block";
		else bplay.style.display= "none";	// no mostrar botó PLAY si ja ha aterrat.

		bajuda.onclick = function(){info();};
	};
}
function configurar(){

	pausar();
	modificat = false;
	var imgprevia = imgcoet.src;

	imgcoet.src= "img/nau-land.png";
	coet.style.bottom= "0%";

	panell.style.display="none";
	bplay.style.display="none";
	breinicia.style.display="none";
	bajuda.style.display="none";

	pagconf.style.display="block";

	bconfig.onclick = function(){
		// Sortir de la pàgina d'ajuda
		pagconf.style.display="none";
		panell.style.display="block";
		breinicia.style.display="block";
		bajuda.style.display="block";
		imgcoet.src= imgprevia;
		coet.style.bottom= y+"%";

		if (y) bplay.style.display= "block";
		else bplay.style.display= "none";	// no mostrar botó PLAY si ja ha aterrat.

		if (modificat) recarga();
		bconfig.onclick = function(){configurar();};
	};

	// seleccionar nivell actual
	pagconfig();




}
// Actualitzar aspecte visual de la pàgina de configuració
function pagconfig(){

	switch(nivell){
		case 1: 
			txtnormal.style.display="none";
			btnnormal.style.border="outset #CCCCCC";
			txtdificil.style.display="none";
			btndificil.style.border="outset #CCCCCC";
			txtfacil.style.display="block";
			btnfacil.style.border="inset #FF9C00";
			break;
		case 2: 
			txtfacil.style.display="none";
			btnfacil.style.border="outset #CCCCCC";
			txtdificil.style.display="none";
			btndificil.style.border="outset #CCCCCC";
			txtnormal.style.display="block";
			btnnormal.style.border="inset #FF9C00";
			break;
		case 3: 
			txtfacil.style.display="none";
			btnfacil.style.border="outset #CCCCCC";
			txtnormal.style.display="none";
			btnnormal.style.border="outset #CCCCCC";
			txtdificil.style.display="block";
			btndificil.style.border="inset #FF9C00";
			break;
	}
}
// Configuració de Nivell
function nfacil(){
	g = gL;
	vlimit = 5;
	potencia = gL;
	c_i = 100;
	nivell = 1;
	modificat = true;
	pagconfig();
}
function nnormal(){
	g = gL;
	vlimit = 3;
	potencia = gL*0.9;
	c_i = 85;
	nivell = 2;
	modificat = true;
	pagconfig();
}
function ndificil(){
	g = gIO;
	vlimit = 3;
	potencia = gL*0.72;
	c_i = 65;
	nivell = 3;
	modificat = true;
	pagconfig();
}
