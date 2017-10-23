//Declare and intialize variables 
var canvas;

var currentFrame = 0;
var tiles = [];

//Tomato Variables 
var tomatoRunning = [];
var tomatoX = 50;
var tomatoHeight = 250;
var tomatoSpeed = 3;

//Potato Variables
<<<<<<< HEAD
var potatoImgs = [];
var potato;


//Succulent Variables
var succImgs = [];
var succ;
=======
var potato = [];
var potatoWalking = [];
var succ = [];
>>>>>>> d51e3d5920388d7a804e4197b219a6920a31197c

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
			potatoWalking.push(loadImage(fileName));
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

}

function setup(){
	//create centered background
	canvas = createCanvas(1000, 500);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);

	potato = new Enemy(130,250,potatoImgs,300,300,1);
	succ = new Enemy(100,100,succImgs,90,110,2);


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
	game();
	/*
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
	}*/

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

	//Tomato does not go below the ground
	if(tomatoHeight >= 250){
		tomatoHeight = 250;
	}

	//GAME OVER 
	//TODO: If it touches enemy 
	if(tomatoHeight > height){	//if it falls pass the bottom of canvas
		gameMode = 2;
	}

	//draw tomato running to the right
	imageMode(CENTER);

	
	image(tomatoRunning[currentFrame%tomatoRunning.length], tomatoX, tomatoHeight, 160, 120);
<<<<<<< HEAD
	potato.display();
	succ.display();
	/*image(potato[currentFrame%potato.length], 130, 250, 300, 300);
	image(succ[Math.floor(currentFrame/2)%succ.length], 300,60, 90, 110);*/
=======
	image(potato[currentFrame%potato.length], 130, 250, 300, 300);
	image(potatoWalking[currentFrame%potatoWalking.length], 200, 250, 150, 120);
	image(succ[currentFrame%succ.length], 100, 60, 90, 110);
>>>>>>> d51e3d5920388d7a804e4197b219a6920a31197c
	
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
	//***TODO: reset all variables
	else if(gameMode===0){
		if(mouseX>=434.5 && mouseX<=583.5 && mouseY>=391 && mouseY<=443){
			gameMode = 1;
		}
	}

	else if(gameMode===2){

		//if click play again button, start new game
		//***TODO: reset all variables
		if(mouseX>=360.5 && mouseX<=483.5 && mouseY>=391 && mouseY<=408){
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

function Enemy(xPos,yPos,obj,xSize,ySize,rate){
	this.x = xPos;
	this.y = yPos;
	this.xSpeed = -3;
	this.ySpeed = 0;
	this.xSize = xSize;
	this.ySize = ySize;
	this.frameRate = rate

	this.display = function(){
		image(obj[Math.floor(currentFrame/this.frameRate)%obj.length], this.x, this.y, this.xSize, this.ySize);
	
		
		//image(succ[Math.floor(currentFrame/2)%succ.length], 100,60, 90, 110);*/
	};
}