//Declare and intialize variables 
var canvas;

var currentFrame = 0;

//tile variable
var grassL;
var grassM;
var grassR;
var grassHeight = 300;
var grassWidth = 7;
var gapWidth = 3; 
var platformHeight = 300;	//work in progress leave me alone

//Tomato Variables 
var tomatoRunning = [];
var tomatoX = 50;
var tomatoHeight = 270;
var tomatoSpeed = 3;

//Potato Variables
var potatoImgs = [];
var potato;

//Succulent Variables
var succImgs = [];
var succ;
var succs = [];

//Walking potato (walkingPotato) variables
var walkingPotatoImgs = [];
var walkingPotato;

var startscreen, endscreen, pausescreen;
var cursorImg;

//game mode
var gameMode = 0;
var paused = false;

//Mic variable
var micInput;
var gravity = 1;
//var jump = false;

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

	//load tile
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

	potato = new Tot(630,250,potatoImgs,332,332);
	//original is 332 x 332 -> 300
	//actual size is 61 x 81 *300/332
	var succPositioning =0;
	for (let i =0; i <11; i++){
		succ = new Spike(succPositioning,0,succImgs,90,110);
		succPositioning += 90;
		succs.push(succ);
	}
	walkingPotato = new Enemy(200,250,walkingPotatoImgs,150,120);


	//audio input
	micInput = new p5.AudioIn();
	micInput.start(); //start listening for input from mic

	//no cursor
	noCursor();
}

function draw(){
	background(250);
	currentFrame += 1;
	//console.log(currentFrame);
	
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

	//highlight start button if mouseover
	if(mouseX>=434.5 && mouseX<=583.5 && mouseY>=391 && mouseY<=443){
		noStroke();
		fill(255, 80);
		rect(417, 310, 160, 68, 20);
	}
}

function game(){

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

	//Temporary: Tomato restarts at the left side of canvas
	if(tomatoX > width - 50){
		tomatoX = 50;
	}

	//Tomato does not go below the platform height
	if(currentHeight !== 0 && tomatoHeight >= currentHeight-30){
		tomatoHeight = currentHeight-30;
	}

	//game over if tomato falls below the screen
	if (tomatoHeight > 500){
		gameMode = 2;
	}

	//GAME OVER 
	//TODO: If it touches enemy 
	if(tomatoHeight > height){	//if it falls pass the bottom of canvas
		gameMode = 2;
	}

	//draw tomato running to the right
	imageMode(CENTER);

	//tomato body is 282 by 234
	//actual image 800 by 600 
	//scaled down by 5 so 282 > 56, 234 > 46
	image(tomatoRunning[currentFrame%tomatoRunning.length], tomatoX, tomatoHeight, 160, 120); //160 width, 120 height

	potato.display();
	potato.collisionTest();
	walkingPotato.display();

	imageMode(CORNER);

	// image(potato[currentFrame%potato.length], 130, 250, 300, 300);
	// image(potatoWalking[currentFrame%potatoWalking.length], 200, 250, 150, 120);
	// image(succ[currentFrame%succ.length], 100, 60, 90, 110);

	for (let i =0; i <11; i++){
		succs[i].display();
		succs[i].collisionTest();
	}

	drawPlatforms();
}

function drawPlatforms(){ //work in progress leave me alone

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

function initializeGame(){	//resets game variables
	grassHeight = 270;
	grassWidth = 7;
	gapWidth = 3; 

	tomatoHeight = 270;
	paused = false;
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

function windowResized(){
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
		if(mouseX>=434.5 && mouseX<=583.5 && mouseY>=391 && mouseY<=443){
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

class Enemy {
	constructor(xPos,yPos,obj,xSize,ySize){
		this.x = xPos;
		this.y = yPos;
		this.xSpeed = -3;
		this.ySpeed = 0;
		this.xSize = xSize;
		this.ySize = ySize;
		this.collide = false;
	
		this.display = function(){
			image(obj[currentFrame%obj.length], this.x, this.y, this.xSize, this.ySize);
		};
	}
}

class Spike extends Enemy { //90 width, 110 height, 0,0 is top left corner
	constructor (xPos,yPos,obj,xSize,ySize){
		super(xPos,yPos,obj,xSize,ySize);
	}
	collisionTest(){ //tomato 160 width, 120 height, centered
		//var tomatoX = 50;
		//var tomatoHeight = 250;
		//tomato body is 282 by 234
	//actual image 800 by 600 scled to 160,120
	//scaled down by 5 so 282 > 56, 234 > 46

	//tall plant
		if ((tomatoHeight-23)<=(this.y+this.ySize) && (tomatoX+28)>=this.x && (tomatoX-28)<=(this.x+(this.xSize*50/110)) && (tomatoHeight+23)>this.y){
//collision with toamto, top of tomato vs bottom ,  right of tom left plant,  left of tomato right plant,				 bottom of tom below top of plant
			this.collide = true;
			gameMode = 2;
//60/110 is the short pot, 50/110 is the tall plant width
//87/120 is the short pot height
		}
	//short plant
		if ((tomatoHeight-23)<=(this.y+(this.ySize*87/120)) && (tomatoX+28)>=(this.x+(this.xSize*50/110)) && (tomatoX-28)<=(this.x+this.xSize) && (tomatoHeight+23)>this.y){
//collision with toamto, top of tomato vs bottom , 			 right of tom left plant,  				left of tomato right plant,				 bottom of tom below top of plant
			this.collide = true;
			gameMode = 2;
		}
	}
}

class Tater extends Enemy { //potato with arms

}

function Tot(xPos,yPos,obj,xSize,ySize){ //no limbed potato
	this.x = xPos;
	this.y = yPos;
	this.xSpeed = -3;
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
	}

	//original is 332 x 332 
	//actual size is 61 x 81 /332
	this.collisionTest = function(){
		//			top tomato				bottom potato			right tomato	 left potato 					left tomato   	   right potato 				bottom of tomato
		if ((tomatoHeight-23)<=(this.y+(this.ySize*this.noise *81/332 /2)) && (tomatoX+28)>=(this.x-(this.xSize*this.noise*61/331/2)) && (tomatoX-28)<=(this.x+(this.xSize*this.noise*61/331/2)) && (tomatoHeight+23)>this.y-(this.ySize*this.noise*81/332 /2)){
			this.collide = true;
			gameMode = 2;
		}
	}
}
