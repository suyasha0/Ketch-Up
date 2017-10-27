//Declare and intialize variables 
var canvas;
var currentFrame;

//tile variable
var grassL;
var grassM;
var grassR;
var platforms = [];

var platID = 0;
var platX;
var platY;
var platWidth;
var gapWidth;
var platNoise = 0;

//Tomato Variables 
var tomatoRunning = [];
var tomatoX = 50;
var tomatoHeight = 270;
var tomatoSpeed = 0;

//Potato Variables
var potatoImgs = [];
var potato;
var potatos = [];

//Succulent Variables
var succImgs = [];
var succ;
var succs = [];

//Walking potato (walkingPotato) variables
var walkingPotatoImgs = [];
var walkingPotato;
var walkingPotatos = [];

var startscreen, endscreen, pausescreen;
var cursorImg;

//game mode
var gameMode = 0;
var paused = false;

//Mic variable
var micInput;
var gravity = 1;
//var jump = false;

function initializeGame(){	//resets game variables
	paused = false;

	currentFrame = 0;

	tomatoHeight = 270;
	tomatoX = 50;

	platX = -50;	//first platform is off the screen because the first one shouldn't be rounded
	platY = 300;
	platWidth = 8;
	gapWidth = 150;
	platforms = [];
	succs = [];
	potatos=[];
	walkingPotatos=[];

	//set up the initial platforms
	platforms.push(new platformObj(platX, platY, platWidth, gapWidth));	//add the first platform

	//continue adding new platforms to the array until there are at least enough on screen
	while(platforms[platforms.length-1].platX + platforms[platforms.length-1].platWidth*50 + gapWidth <= 1000){
		platX = platforms[platforms.length-1].platX + platWidth*50 + gapWidth; 
		platY = map(noise(platNoise), 0, 1, 200, 450);
		platWidth = random(2, 6);
		gapWidth = random(100, 350);
		platforms.push(new platformObj(platX, platY, platWidth, gapWidth,false,platID));
		platID++;
		platNoise += 0.05;
	}
}

function preload() {
	//load tomato running gif 
	for (var i = 1; i < 25; i++){
		for (var j = 0; j < 2; j++){
			var fileName = "images/tomato_running/tomato"+i+".png";
			tomatoRunning.push(loadImage(fileName));
		}
	}

	//load bouncing potato
	for (var i = 1; i < 5; i++){
		for (var j = 0; j < 8; j++){
			var fileName = "images/enemies/potato/potato"+i+".png";
			potatoImgs.push(loadImage(fileName));
		}
	}

	//load walking potato
	for (var i = 1; i < 42; i++){
		for (var j = 0; j < 2; j++){
			var fileName = "images/enemies/potato_walk/potato_walk"+i+".png";
			walkingPotatoImgs.push(loadImage(fileName));
		}
	}

	//load succ
	for (var i = 1; i < 11; i++){
		for (var j = 0; j < 8; j++){
			var fileName = "images/enemies/succ/succ"+i+".png";
			succImgs.push(loadImage(fileName));
		}
	}

	//load screen images
	startscreen = loadImage("images/startscreen.png");
	endscreen = loadImage("images/gameoverscreen.png");
	pausescreen = loadImage("images/pausescreen.png");

	//load cursor graphic
	cursorImg = loadImage("images/fry.png");

	//load tile images
	grassL = loadImage("images/tiles/grassLeft.png");
	grassM = loadImage("images/tiles/grassMid.png");
	grassR = loadImage("images/tiles/grassRight.png");
}

function setup(){
	//create centered background
	noiseDetail(24);
	canvas = createCanvas(1000, 500);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);


	// var potatoPositioningX =630;
	// var potatoPositioningY =250;
	// for (let i =0; i <4; i++){
	// 	potato = new Tot(potatoPositioningX,potatoPositioningY,potatoImgs,332,332);
	// 	potatoPositioningX +=200;
	// 	potatos.push(potato);
	// }
	
	//original is 332 x 332 -> 300
	//actual size is 61 x 81 *300/332
	// var succPositioning =0;
	// for (let i =0; i <4; i++){
	// 	succ = new Spike(succPositioning,0,succImgs,90,110);
	// 	succPositioning += 90;
	// 	succs.push(succ);
	// }
	walkingPotato = new Tater(200,250,walkingPotatoImgs,-70,-105);
	//original is 280 x 420

	//audio input
	micInput = new p5.AudioIn();
	micInput.start(); //start listening for input from mic

	//no cursor
	noCursor();

	//set up initial game variables
	initializeGame();
}

function draw(){
	background(250);
	currentFrame += 1;
	
	if(paused){					//pause screen
		pauseScreen();
	}
	else{
		if (gameMode === 0){	//represents title screen
			startScreen();
		}
		if (gameMode === 1){	//represents game screen
			game();
		}
		if (gameMode === 2){	//represents game over screen
			gameOver();
		}
	}

	//show cursor at every screen except game screen
	if(paused || gameMode===0 || gameMode===2){
		image(cursorImg, mouseX, mouseY);
	}
}

function startScreen(){
	imageMode(CORNER);
	image(startscreen, 0, 0);

	//draw tomato running to the right
	imageMode(CENTER);
	image(tomatoRunning[currentFrame%tomatoRunning.length], 175, tomatoHeight+20, 160, 120);

	//draw succulent
	image(succImgs[currentFrame%succImgs.length], 820, 50);

	//draw enemy
	image(potatoImgs[0], 820, 320);
	//highlight start button if mouseover
	if(mouseX>=425 && mouseX<=583.5 && mouseY>=370 && mouseY<=443){
		noStroke();
		fill(255, 80);
		rect(417, 310, 160, 68, 20);
	}
}

function game(){
	//draw all platforms, they are constantly moving from the right to left at a rate of 2
	for (var i = 0; i < platforms.length; i++){
		platforms[i].display();
		platforms[i].platX -= 2;
		// if (platforms[i].enemy != undefined){ //has an enemy

		// }
	}

	//add more platforms if there is space on screen for one
	if(platforms[platforms.length-1].platX + platforms[platforms.length-1].platWidth*50 + gapWidth <= 1000){
		platX = platforms[platforms.length-1].platX + platWidth*50 + gapWidth; 
		platY = map(noise(platNoise), 0, 1, 200, 450);
		platWidth = random(2, 6);
		gapWidth = random(100, 350);
		platforms.push(new platformObj(platX, platY, platWidth, gapWidth,true,platID));
		platID++;
		platNoise += 0.5;
	}
	// HERE IS THE ONES AFTER THE INITIAL ONES SO HERE IS WHERE WE WANNA START GENERATING ENEMIES

	//platforms should be deleted from the array after they leave the screen
	if(platforms[0].platX + 50*platforms[0].platWidth + 40 <= 0){
		console.log("id",platforms[0].id);
		platforms.splice(0, 1);
	}

	//popping off succs
	if (succs[0] && succs[0].x+90 <=0){
		succs.splice(0,1);
	}

	//popping off potatos
	if (potatos[0] && potatos[0].x+65 <=0){
		potatos.splice(0,1);
	}

	if (walkingPotatos[0] && walkingPotatos[0].x+65 <=0){
		walkingPotatos.splice(0,1);
	}

	//get volume from mic (values b/w 0 and 1);
	var vol = micInput.getLevel();
	//console.log(vol);
	var threshold = 0.1;	//temporary threshold (easier to test at 0.1)
	if(vol > threshold){
		tomatoHeight -= 5;
		
	}
	if(tomatoHeight < 0){ //Placeholder for triangle
		fill(0);
		triangle(tomatoX-10, 10, tomatoX, 0, tomatoX + 10, 10);
	}

	//Tomato speed is added to tomato to move it horizontally
	tomatoX += tomatoSpeed;
	//Tomato height is affected by gravity
	tomatoHeight += gravity;

	//Tomato does not go below the platform height 
	//TODO: slightly glitchy? sometimes if tomato is part way through the platform it'll jerk back up I'm too tired to math
	//outer if is just like if between a platform
	if(platforms[0] && tomatoX >= platforms[0].platX+30 && platforms[0].platX + 50*platforms[0].platWidth > 0){

		if(platforms[0].platY <= tomatoHeight + 30){	//Tomato does not fall through platforms
		
			tomatoHeight = platforms[0].platY-30;
		}
		else if (tomatoHeight-30 < platforms[0].platY+50){	//Tomato does not go through platforms
		
			//tomatoHeight = platforms[0].platY+30;
		}
	}

	//Temporary: Tomato restarts at the left side of canvas
	if(tomatoX > width - 50){
		tomatoX = 50;
	}

	//game over if tomato falls below the screen
	if (tomatoHeight > 550){
		initializeGame();
		gameMode = 2;
	}

	//draw tomato running to the right
	imageMode(CENTER);

	image(tomatoRunning[currentFrame%tomatoRunning.length], tomatoX, tomatoHeight, 160, 120); //160 width, 120 height

	//walking potatoes
	//walkingPotato.display();
	for (let i = 0; i<walkingPotatos.length; i++){
		walkingPotatos[i].display();
		//when display, check platform ID for the left PLAt thing
		for (let j = 0; j<platforms.length; j++){
			if (walkingPotatos[i].platformIDAttached ==platforms[j].id){//if the IDs match aka its own platform
				//its centered but platforms arent
				if (walkingPotatos[i].x-35 <= platforms[j].platX){ //left side of platform
					walkingPotatos[i].xSpeed =1;
				}
				else if (walkingPotatos[i].x-35 >= platforms[j].platX +platforms[j].platWidth*50 ){ //right side of platform
					walkingPotatos[i].xSpeed =-1;
				}
				break; //done checking platforms, saves liek 1 check per thing so "optimized??"
			}
		}
		walkingPotatos[i].collisionTest();
	}
	
	//potatoes
	for (let i =0; i<potatos.length; i++){
		potatos[i].display();
		potatos[i].collisionTest();
	
	}

	imageMode(CORNER);
//succulents
	for (let i =0; i <succs.length; i++){
		succs[i].display();
		succs[i].collisionTest();
	}
}

function platformObj(platX, platY, platWidth, gapWidth,ya,id){
	this.platX = platX;			//the X position of the upper left corner of platform
	this.platY = platY;			//the Y position of the upper left corner of platform
	this.platWidth = platWidth;	//the width of the platform in blocks; each block is 50px
	this.gapWidth = gapWidth;	//the width of the empty space after the current platform
	this.id = id;
	if (ya){
		this.chanceOfEnemySpawn = random(50);
	} else{
		this.chanceOfEnemySpawn = 51;
	}
	//define function inside platform obj, just call it in the walkingpotato draw thing

	//generates enemies based on random numbers
	if(this.chanceOfEnemySpawn<15){ //walking potato?
		//TODO: generate an enemy between given platform's X and X+platWidth*50
		//imageMode(CORNER);
		var walkingPotato = new Tater(this.platX+(this.platWidth*50)- 70,this.platY - 52,walkingPotatoImgs,70,105,this.id);
		walkingPotatos.push(walkingPotato);
	}
	else if(this.chanceOfEnemySpawn<30){ //succ
		var platSucc;
		for (let i = 1;i<this.platWidth; i+=2){
			platSucc = new Spike(this.platX+(45*i),this.platY-180,succImgs,90,110);
			succs.push(platSucc);
		}
	}
	else if(this.chanceOfEnemySpawn<45){ //size potato
		var potato = new Tot(this.platX+(this.platWidth*50) - 50,this.platY - 80,potatoImgs,332,332);
		potatos.push(potato);	
	}

	this.display = function(){	//function for showing the platforms; first and last blocks are rounded 
		image(grassL, this.platX, this.platY, 50, 50);
		for (var i = 1; i < this.platWidth; i++){
			image(grassM, this.platX + 50*i, this.platY, 50, 50);
		}
		image(grassR, this.platX + 50*this.platWidth, this.platY, 50, 50);
	}
}

function Spike(xPos,yPos,obj,xSize,ySize) { //x and y are top left
//	constructor(xPos,yPos,obj,xSize,ySize){
	this.x = xPos;
	this.y = yPos;
	this.xSpeed = -2;
	this.ySpeed = 0;
	this.xSize = xSize;
	this.ySize = ySize;
	this.collide = false;
	

	this.display = function(){
		image(obj[currentFrame%obj.length], this.x, this.y, this.xSize, this.ySize);
		this.x += this.xSpeed;
	};
	this.collisionTest=function(){ //tomato 160 width, 120 height, centered
		//need to make it stop above succs
		if ((tomatoX+28)>=this.x && (tomatoX-28)<=(this.x+(this.xSize)) && (tomatoHeight+35)>=this.y && (tomatoHeight< this.y) ){
			// right of tom left plant, left of tom right plant, 	and bottom of tomato is below top of  plant, top of tomato is above plant
			tomatoHeight = this.y -35;
			//console.log("top of tomato this happens???");
		}


	//tall plant
		if ((tomatoHeight-23)<=(this.y+this.ySize) && (tomatoX+28)>=this.x && (tomatoX-28)<=(this.x+(this.xSize*50/110)) && (tomatoHeight+23)>this.y){
//collision with toamto, top of tomato vs bottom ,  right of tom left plant,  left of tomato right plant,				 bottom of tom below top of plant
			this.collide = true;
			gameMode = 2;
		//	console.log("collision with tall plant this happens???");
//60/110 is the short pot, 50/110 is the tall plant width
//87/120 is the short pot height
		}
	//short plant
		if ((tomatoHeight-23)<=(this.y+(this.ySize*87/120)) && (tomatoX+28)>=(this.x+(this.xSize*50/110)) && (tomatoX-28)<=(this.x+this.xSize) && (tomatoHeight+23)>this.y){
//collision with toamto, top of tomato vs bottom , 			 right of tom left plant,  				left of tomato right plant,				 bottom of tom below top of plant
			this.collide = true;
			gameMode = 2;
		//	console.log("collision with short plant this happens???");
		}
	}
}

function Tater(xPos,yPos,obj,xSize,ySize,id) { //potato with arms
	this.x = xPos;
	this.y = yPos;
	this.platformIDAttached = id; 
	this.xSpeed = -1;
	this.ySpeed = 0;
	this.xSize = xSize;
	this.ySize = ySize;
	this.collide = false;
	//update in display
	this.display = function(){
		image(obj[currentFrame%obj.length], this.x, this.y, this.xSize, this.ySize);
		this.x += (-2 + this.xSpeed );
	}
	this.collisionTest = function (){
		if ((tomatoHeight-23)<=(this.y+(this.ySize /2)) && (tomatoX+28)>=(this.x-(this.xSize/2)) && (tomatoX-28)<=(this.x+(this.xSize/2)) && (tomatoHeight+23)>this.y-(this.ySize/2)){
			this.collide = true;
			gameMode = 2;
		}
	}

}

function Tot(xPos,yPos,obj,xSize,ySize){ //no limbed potato
	this.x = xPos;
	this.y = yPos;
	this.xSpeed = -2;
	this.ySpeed = 0;
	this.xSize = xSize;
	this.ySize = ySize;
	this.collide = false;
	this.noiseOffset = random(0,1000);
	this.noise = map( noise(this.noiseOffset), 0, 1, 0, 1.5 );
	
	//update in display
	this.display = function(){
		this.noise = map( noise(this.noiseOffset), 0, 1, 0, 1 );
		image(obj[currentFrame%obj.length], this.x, this.y, this.xSize*this.noise, this.ySize*this.noise);
		this.noiseOffset+=0.01;
		this.x += this.xSpeed;
	}

	//original is 332 x 332 
	//actual size is 61 x 81 /332
	this.collisionTest = function(){
		//			top tomato				bottom potato			right tomato	 left potato 					left tomato   	   right potato 				bottom of tomato
		if ((tomatoHeight-23)<=(this.y+(this.ySize*this.noise *81/332 /2)) && (tomatoX+28)>=(this.x-(this.xSize*this.noise*61/331/2)) && (tomatoX-28)<=(this.x+(this.xSize*this.noise*61/331/2)) && (tomatoHeight+23)>this.y-(this.ySize*this.noise*81/332/2)){
			this.collide = true;
			gameMode = 2;
		}
	}
}


function gameOver(){
	image(endscreen, 0, 0);

	//highlight buttons if mouseover
	if(mouseX>=360.5 && mouseX<=483.5 && mouseY>=391 && mouseY<=408){
		noStroke();
		fill(250, 80);
		rect(360, 391, 160, 30, 20);
	}
	else if(mouseX>=538.4 && mouseX<=590.5 && mouseY>=391 && mouseY<=408){
		fill(250, 80);
		rect(538, 391, 130, 30, 20);
	}
}

function pauseScreen(){
	imageMode(CORNER);
	image(pausescreen, 0, 0);

	//highlight buttons if mouseover
	if(mouseX>=416 && mouseX<=536 && mouseY>=258 && mouseY<=285){
		noStroke();
		fill(250, 80);
		rect(416, 258, 160, 40, 20);
	}
	else if(mouseX>=437 && mouseX<=509.5 && mouseY>=336 && mouseY<=358){
		fill(250, 80);
		rect(437, 336, 160, 40, 20);
	}
}

function windowResized(){	//ensures the canvas remains centered
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
}

function mouseClicked(){
	if(paused){
		//if click resume, resume game
		if(mouseX>=416 && mouseX<=536 && mouseY>=258 && mouseY<=285){
			gameMode = 1;
			paused = false;
		}

		//if click quit button, go to home page
		else if(mouseX>=437 && mouseX<=509.5 && mouseY>=336 && mouseY<=358){
			gameMode = 0;
			paused = false;
		}
	}

	//if click start button, start game
	else if(gameMode===0){
		if(mouseX>=425 && mouseX<=583.5 && mouseY>=370 && mouseY<=443){
			initializeGame();
			gameMode = 1;
		}
	}

	else if(gameMode===2){
		//if click play again button, start new game
		if(mouseX>=360.5 && mouseX<=483.5 && mouseY>=391 && mouseY<=408){
			initializeGame();
			gameMode = 1;
		}

		//if click home button, go to start screen
		else if(mouseX>=538.4 && mouseX<=590.5 && mouseY>=391 && mouseY<=408){
			initializeGame();
			gameMode = 0;
		}
	}
}

function keyPressed(){
	//if spacebar pressed, pause game
	if(keyCode == 32 && gameMode==1){
		paused = true;
	}
}