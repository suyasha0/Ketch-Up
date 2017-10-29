//Declare and intialize variables 
var canvas;
var currentFrame;

//music variables
var music;

var font;

//tile variable
var grassL, grassM, grassR;
var platforms = [];

//platform variables
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
var walkingPotatoRImgs = [];
var walkingPotato;
var walkingPotatos = [];

//game state variables
var startscreen, endscreen, pausescreen;
var cursorImg;
var gameMode = 0;
var paused = false;
var score = 0;

//Mic variable
var micInput;
var gravity = 2.5;
var counter = 0;
var maxScream = 180; //3 seconds 

function initializeGame(){	//resets game variables
	paused = false;
	currentFrame = 0;	//reset frame
	tomatoHeight = 270;	//reset back to initial position
	tomatoX = 50;
	counter = 0;	//reset counter
	score = 0;		//reset score

	platX = -50;	//first platform is off the screen because the first one shouldn't be rounded
	platY = 300;
	platWidth = 8;
	gapWidth = 150;
	platforms = [];	//intialize arrays
	succs = [];
	potatos=[];
	walkingPotatos=[];

	textFont(font);

	//set up the initial platforms
	platforms.push(new PlatformObj(platX, platY, platWidth, gapWidth));	//add the first platform

	//continue adding new platforms to the array until there are at least enough on screen
	while(platforms[platforms.length-1].platX + platforms[platforms.length-1].platWidth*50 + gapWidth <= 1000){
		platX = platforms[platforms.length-1].platX + platWidth*50 + gapWidth; 
		platY = map(noise(platNoise), 0, 1, 200, 450);
		platWidth = random(2, 6);		//get random width for the platform 
		gapWidth = random(100, 350);	//get random width for the gap between platforms 
		platforms.push(new PlatformObj(platX, platY, platWidth, gapWidth,false,platID)); //push platform to array
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

	//load walking potato Right
	for (var i = 1; i < 42; i++){
		for (var j = 0; j < 2; j++){
			var fileName = "images/enemies/potato_walk/potato_walkR"+i+".png";
			walkingPotatoRImgs.push(loadImage(fileName));
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

	//load music
	music = loadSound("sounds/jangle.mp3");

	//load cursor graphic
	cursorImg = loadImage("images/fry.png");

	font = loadFont('images/jazztext.ttf');

	//load tile images
	grassL = loadImage("images/tiles/grassLeft.png");
	grassM = loadImage("images/tiles/grassMid.png");
	grassR = loadImage("images/tiles/grassRight.png");
}

function setup(){
	//create centered background
	noiseDetail(24);	//set noise to 24 to make more smooth
	canvas = createCanvas(1000, 500);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);	//position canvas with html
	
	//original is 332 x 332 -> 300
	//actual size is 61 x 81 *300/332
	walkingPotato = new Tater(200,250,walkingPotatoImgs,-70,-105);
	//original is 280 x 420

	//audio input
	micInput = new p5.AudioIn();
	micInput.start(); //start listening for input from mic

	//no cursor
	noCursor();

	music.setVolume(.2);

	//set up initial game variables
	initializeGame();
}

function draw(){
	background(250);	//set background color to light gray
	currentFrame += 1;	//increase the current frame by 1
	
	if(paused){					//pause screen
		pauseScreen();			//call pause screen function
	}
	else{
		if (gameMode === 0){	//represents title screen
			startScreen();		//call start screen function
		}
		if (gameMode === 1){	//represents game screen
			game();				//call game function
		}
		if (gameMode === 2){	//represents game over screen
			gameOver();			//call game over function
		}
	}

	//show cursor at every screen except game screen
	if(paused || gameMode===0 || gameMode===2){
		image(cursorImg, mouseX, mouseY);	//set the cursor to an image 
	}
}

//Function startscreen() - show the start screen
function startScreen(){
	imageMode(CORNER);	//left hand corner the image 
	image(startscreen, 0, 0);	//show the start screen as an image 

	//draw tomato running to the right
	imageMode(CENTER);	//center the image
	image(tomatoRunning[currentFrame%tomatoRunning.length], 175, tomatoHeight+20, 160, 120);

	if(!music.isPlaying()){
		music.play();
	}

	//get volume from mic (values b/w 0 and 1);
	var vol = micInput.getLevel();
	var threshold = 0.15;	//threshold for the volume(easier to test at 0.1)
	var mapVolume = map(vol, 0, 1, 5, 15);	//map volume to how high tomato jumps
	var mapGravity = map(vol, 0, 1, 2.5, 7.5);	//map gravity to how fast tomato should fall

	if(vol > threshold && tomatoHeight > 50){
		tomatoHeight -= mapVolume;
	}
	if(tomatoHeight<=250){
		tomatoHeight += mapGravity;
	}

	//draw succulent
	image(succImgs[currentFrame%succImgs.length], 820, 50);

	//draw enemies
	image(potatoImgs[0], 820, 320);
	image(walkingPotatoImgs[12], 900, 320, -70, -105);

	//highlight start button if mouseover
	if(mouseX>=432 && mouseX<=587 && mouseY>=370 && mouseY<=443){
		noStroke();		//no stroke
		fill(255, 80);	//set to white with opacity of 80
		rect(417, 310, 180, 73, 20);	//draw a rect 
	}
}

//Function game() - the game phase 
function game(){

	if(!music.isPlaying()){
		music.play();
	}

	//draw all platforms, they are constantly moving from the right to left at a rate of 2
	for (var i = 0; i < platforms.length; i++){ //each platform in array
		platforms[i].display();	//display each platform 
		platforms[i].platX -= 2;	
	}

	//add more platforms if there is space on screen for one
	if(platforms[platforms.length-1].platX + platforms[platforms.length-1].platWidth*50 + gapWidth <= 1000){
		platX = platforms[platforms.length-1].platX + platWidth*50 + gapWidth; 
		platY = map(noise(platNoise), 0, 1, 200, 450);
		platWidth = random(2, 6);
		gapWidth = random(100, 350);
		platforms.push(new PlatformObj(platX, platY, platWidth, gapWidth,true,platID));
		platID++;
		platNoise += 0.5;
	}
	// HERE IS THE ONES AFTER THE INITIAL ONES SO HERE IS WHERE WE WANNA START GENERATING ENEMIES

	//platforms should be deleted from the array after they leave the screen
	if(platforms[0].platX + 50*platforms[0].platWidth + 40 <= 0){
		platforms.splice(0, 1);
	}

	//popping off succs
	if (succs[0] && succs[0].x+90 <=0){
		succs.splice(0,1);
	}

	//popping off potato
	if (potatos[0] && potatos[0].x+65 <=0){
		potatos.splice(0,1);
	}

	//popping off walking potato
	if (walkingPotatos[0] && walkingPotatos[0].x+65 <=0){
		walkingPotatos.splice(0,1);
	}

	//get volume from mic (values b/w 0 and 1);
	var vol = micInput.getLevel();
	var threshold = 0.15;	//threshold for the volume(easier to test at 0.1)
	var mapVolume = map(vol, 0, 1, 5, 15);	//map volume to how high tomato jumps
	var mapGravity = map(vol, 0, 1, 2.5, 7.5);	//map gravity to how fast tomato should fall
	//check if there are platforms 
	if(platforms[0] && tomatoX+30 >= platforms[0].platX && platforms[0].platX + 50*platforms[0].platWidth >= tomatoX-30){
		if(vol > threshold && counter < maxScream){	//if scream is heard and tomato is on the canvas 
			if(platforms[0].platY+50 < tomatoHeight-23){	//check if the tomato passed platform 
				if(tomatoHeight-28 <= platforms[0].platY+50){ //check if tomato is below platform 
					tomatoHeight = platforms[0].platY+78;	//keep tomato under platform (cannot go through from bottom)
				}
				else{
					if(counter < maxScream){		//if tomato is in the canvas 
						tomatoHeight -= mapVolume;	//tomato jump
					}
				}				
			} 	//if not below platform 
			else{
				if(counter < maxScream){	//if tomato is not completely below platform 
						tomatoHeight -= mapVolume;	//let it jump up 
				}
			}

			if(tomatoHeight + 25 <= platforms[0].platY){	//Tomato does not fall through platforms
				if(tomatoHeight + 25 + gravity >= platforms[0].platY){ //check if tomato touched platform
					tomatoHeight = platforms[0].platY-25;	//keep tomato on top of platform 
				}
			}
			else{	//else if tomato did not hit a platform
				tomatoHeight += mapGravity;	//let it continue falling from gravity
			}	
		}
		else{	//if the tomato is moving down and not below the platform (on top)
			if(tomatoHeight + 25 <= platforms[0].platY){	//Tomato does not fall through platforms
				if(tomatoHeight + 25 + mapGravity >= platforms[0].platY){  //check if tomato is on platform 
					tomatoHeight = platforms[0].platY-25;	//keep tomato on top of platform
					score++;	//increase score if tomato is on top of platform running
				}
				else{ //if not on platform 
					tomatoHeight += mapGravity;	//tomato falls
				}
			}
			else{ 
				tomatoHeight += mapGravity;	//tomato falls
			}
		}
	}
	else{	//handle if the tomato is in a gap space
		if(vol > threshold){
			if(counter < maxScream){	//if within canvas
				tomatoHeight -= mapVolume;	//let it jump
			}
		}

		tomatoX += tomatoSpeed;		//Tomato speed is added to tomato to move it horizontally
		tomatoHeight += mapGravity;	//Tomato height is affected by gravity
	}

	if(tomatoHeight - 25 < 0){ 	//Checks if tomato is above the canvas
		fill(0);			//fill color of triangle to black
		textSize(12);		//set text size to 12
		triangle(tomatoX-10, 10, tomatoX, 0, tomatoX + 10, 10);	//draw a triangle pointing to tomato
		text(Math.abs(Math.floor(tomatoHeight)), tomatoX-10, 20);	//show the current height of tomato
		if(counter < maxScream){	//if counter is less than maxScream (3 seconds)
			counter++;	//increment counter 
		}
		//show the number of seconds remaining
		fill(255,0,0);	//set color to red
		textSize(15);	//set text size to 15
		//show the remaining seconds tomato can be above canvas 
		text("Seconds Remaining: "+Math.ceil((maxScream-counter)/60), width - 180, 15);	
	}
	
	if(tomatoHeight > 50){ //if the whole tomato is on the canvas 
		counter = 0;	//reset counter to 0
	}

	//game over if tomato falls below the screen
	if (tomatoHeight > 550){
		gameMode = 2;	//set gameMode to 2
	}

	fill(0);	//set color to black
	textSize(15);	//set text size to 15
	text("Score: " + score, 20, height - 15);	//show the score on the bottom left 
	
	//draw tomato running to the right
	imageMode(CENTER);	//center image
	image(tomatoRunning[currentFrame%tomatoRunning.length], tomatoX, tomatoHeight, 160, 120); //160 width, 120 height

	//walking potatoes
	for (let i = 0; i<walkingPotatos.length; i++){	//loop through walkingPotatoes array
		walkingPotatos[i].display();	//call the display function for each walkingPotato
		//when display, check platform ID for the left Plat thing
		for (let j = 0; j<platforms.length; j++){
			if (walkingPotatos[i].platformIDAttached ==platforms[j].id){//if the IDs match aka its own platform
				//its centered but platforms arent
				if (walkingPotatos[i].x-35 <= platforms[j].platX){ //if potato hits left side of platform
					walkingPotatos[i].xSpeed =1;	//set xSpeed to 1
					walkingPotatos[i].obj = walkingPotatoRImgs;	//switch the image to a potato walking to the right
				}
				else if (walkingPotatos[i].x-35 >= platforms[j].platX +platforms[j].platWidth*50 ){ //if potato hits right side of platform
					walkingPotatos[i].xSpeed =-1;	//set xSpeed to -1
					walkingPotatos[i].obj = walkingPotatoImgs;	//switch image to potota walking to the left 
				}
				break; //done checking platforms
			}
		}
		walkingPotatos[i].collisionTest();	//checks for collision for each walking potato
	}
	
	//potatoes
	for (let i =0; i<potatos.length; i++){ //for each potato in the array
		potatos[i].display();	//display each potato 
		potatos[i].collisionTest();	//check for collision
	}

	imageMode(CORNER);	//set image to left top corner 
	//succulents
	for (let i =0; i <succs.length; i++){	//for each succulent in array
		succs[i].display();	//display each succ
		succs[i].collisionTest();	//check for collision
	}
}

//PlatformObj class
function PlatformObj(platX, platY, platWidth, gapWidth,ya,id){
	//Properties
	this.platX = platX;			//the X position of the upper left corner of platform
	this.platY = platY;			//the Y position of the upper left corner of platform
	this.platWidth = platWidth;	//the width of the platform in blocks; each block is 50px
	this.gapWidth = gapWidth;	//the width of the empty space after the current platform
	this.id = id;				//the id of the platform 
	if (ya){	//if true 
		this.chanceOfEnemySpawn = random(50);	//chance of enemy spawning is 0 and up to 50
	} else{
		this.chanceOfEnemySpawn = 51;	//else, chance of enemy spawning is 51
	}

	//generates enemies based on random numbers
	if(this.chanceOfEnemySpawn<15){ //walking potato spawns if chance is less than 15
		//Create a new Tater object (walking potato)
		var walkingPotato = new Tater(this.platX+(this.platWidth*50)- 70,this.platY - 52,walkingPotatoImgs,70,105,this.id);
		walkingPotatos.push(walkingPotato); //add walkingPotato object to walkingPotatos array
	}
	else if(this.chanceOfEnemySpawn<30){ //succ spawns if chance is less than 30
		var platSucc;
		for (let i = 1;i<this.platWidth; i+=2){
			platSucc = new Spike(this.platX+(45*i),this.platY-180,succImgs,90,110); //create a new Spike object (succulent)
			succs.push(platSucc);	//add platSucc object to succs array
		}
	}
	else if(this.chanceOfEnemySpawn<45){ //size potato spawns if chance is less than 45
		//create a new Tot object (size potato)
		var potato = new Tot(this.platX+(this.platWidth*50) - 50,this.platY - 80,potatoImgs,332,332); 
		potatos.push(potato);	//add potato to potatos array
	}

	this.display = function(){	//function for showing the platforms; first and last blocks are rounded 
		image(grassL, this.platX, this.platY, 50, 50);
		for (var i = 1; i < this.platWidth; i++){
			image(grassM, this.platX + 50*i, this.platY, 50, 50);	//show the image 
		}
		image(grassR, this.platX + 50*this.platWidth, this.platY, 50, 50); //show the image
	}
}

//Spike class (Succulent)
function Spike(xPos,yPos,obj,xSize,ySize) { //x and y are top left
	//Properties
	this.x = xPos;			//set x to xPos
	this.y = yPos;			//set y to yPos
	this.xSpeed = -2;		//set xSpeed to -2
	this.ySpeed = 0;		//set ySpeed to 0
	this.xSize = xSize;		//set xSize to xSize
	this.ySize = ySize;		//set ySize to ySize
	this.collide = false;	//set collide to false
	
	//function display - displays the image
	this.display = function(){
		image(obj[currentFrame%obj.length], this.x, this.y, this.xSize, this.ySize);	//show animated succulent
		this.x += this.xSpeed;	//move succulent along the x position
	};
	//function collistionTest - checks if tomato collides with succulent 
	this.collisionTest=function(){ //tomato 160 width, 120 height, centered
		//need to make it stop above succs
		if ((tomatoX+28)>=this.x && (tomatoX-28)<=(this.x+(this.xSize)) && (tomatoHeight+35)>=this.y && (tomatoHeight< this.y) ){
			// right of tom left plant, left of tom right plant, 	and bottom of tomato is below top of  plant, top of tomato is above plant
			tomatoHeight = this.y -35;
		}

		//60/110 is the short pot, 50/110 is the tall plant width
		//87/120 is the short pot height

		//checks the taller plant for collision with tomato
		if ((tomatoHeight-23)<=(this.y+this.ySize) && (tomatoX+28)>=this.x && (tomatoX-28)<=(this.x+(this.xSize*50/110)) && (tomatoHeight+23)>this.y){
			// top of tomato vs bottom,  			  right of tom left plant,  	left of tomato right plant, 			bottom of tom below top of plant
			this.collide = true;	//collided is true
			gameMode = 2;	//switch to game over 
		}

		//checks the shorter plant for collision with tomato
		if ((tomatoHeight-23)<=(this.y+(this.ySize*87/120)) && (tomatoX+28)>=(this.x+(this.xSize*50/110)) && (tomatoX-28)<=(this.x+this.xSize) && (tomatoHeight+23)>this.y){
			//top of tomato vs bottom , 			 			right of tom left plant,  					  left of tomato right plant,		   bottom of tom below top of plant
			this.collide = true;	//collided is true
			gameMode = 2;	//switch to game over
		}
	}
}

//Tater class (walking potato)
function Tater(xPos,yPos,obj,xSize,ySize,id) { //potato with arms
	//Properties
	this.x = xPos;					//set x to xPos
	this.y = yPos;					//set y to yPos
	this.platformIDAttached = id; 	//set platformIDAttached to id
	this.xSpeed = -1;				//set xSpeed to -1
	this.ySpeed = 0;				//set ySpeed to 0
	this.xSize = xSize;				//set xSize to xSize
	this.ySize = ySize;				//set ySize to ySize
	this.collide = false;			//set collide to false
	this.obj = obj;					//set obj to obj
	
	//function display - show walking potato
	this.display = function(){
		image(this.obj[currentFrame%this.obj.length], this.x, this.y, this.xSize, this.ySize);
		this.x += (-2 + this.xSpeed ); //move potato
	}

	//function collisionTest - check if walking potato collided with tomato
	this.collisionTest = function (){
		if ((tomatoHeight-23)<=(this.y+(this.ySize /2)) && (tomatoX+28)>=(this.x-(this.xSize/2)) && (tomatoX-28)<=(this.x+(this.xSize/2)) && (tomatoHeight+23)>this.y-(this.ySize/2)){
			this.collide = true;	//collide is true
			gameMode = 2;	//switch to game over
		}
	}

}

//Tot class (size changing potato)
function Tot(xPos,yPos,obj,xSize,ySize){ //no limbed potato
	//Properties
	this.x = xPos;			//set x to xPos
	this.y = yPos;			//set y to yPos
	this.xSpeed = -2;		//set xSpeed to -2
	this.ySpeed = 0;		//set ySpeed to 0
	this.xSize = xSize;		//set xSize to xSize
	this.ySize = ySize;		//set ySize to ySize
	this.collide = false;	//set collide to false
	this.noiseOffset = random(0,1000);	//set noiseOffset to a random value b/w 0 and up to 1000
	this.noise = map( noise(this.noiseOffset), 0, 1, 0, 1.5 );	//map the noise 
	
	//function display - display the size potato
	this.display = function(){
		this.noise = map( noise(this.noiseOffset), 0, 1, 0, 1 );
		//changes size using noise 
		image(obj[currentFrame%obj.length], this.x, this.y, this.xSize*this.noise, this.ySize*this.noise);
		this.noiseOffset+=0.01;
		this.x += this.xSpeed;	//move potato
	}

	//original is 332 x 332 
	//actual size is 61 x 81 /332
	//function collisionTest - check if size potato collided with tomato
	this.collisionTest = function(){
			//top tomato		bottom potato								  right tomato	 left potato 								  left tomato   right potato 								 bottom of tomato  top potato
		if ((tomatoHeight-23)<=(this.y+(this.ySize*this.noise *81/332 /2)) && (tomatoX+28)>=(this.x-(this.xSize*this.noise*61/331/2)) && (tomatoX-28)<=(this.x+(this.xSize*this.noise*61/331/2)) && (tomatoHeight+23)>this.y-(this.ySize*this.noise*81/332/2)){
			this.collide = true;	//set collide to true
			gameMode = 2;	//game over 
		}
	}
}

//Function gameOver - the game over screen
function gameOver(){
	image(endscreen, 0, 0); //show endscreen image
	fill(255);	//set color to white
	textSize(70);	//set text size to 70
	words = ""+score;
	text(words, (width-textWidth(words))/2-10, height/2 + 58);	//show the final score 

	if(!music.isPlaying()){
		music.play();
	}

	image(potatoImgs[currentFrame%potatoImgs.length], 650, 100);
	
	//highlight buttons if mouseover
	if(mouseX>=360.5 && mouseX<=483.5 && mouseY>=391 && mouseY<=408){
		noStroke();	//no stroke
		fill(250, 80);	//set color to white with opacity 80
		rect(360, 391, 160, 30, 20); //draw rect
	}
	else if(mouseX>=538.4 && mouseX<=590.5 && mouseY>=391 && mouseY<=408){
		fill(250, 80);	//set color to white with opacity 80
		rect(538, 391, 130, 30, 20); //draw rect
	}
}

//Function pauseScreen() - pause the screen
function pauseScreen(){
	imageMode(CORNER);			//image mode is from top left
	image(pausescreen, 0, 0);	//show pause screen image

	music.stop();

	//highlight buttons if mouseover
	if(mouseX>=416 && mouseX<=536 && mouseY>=258 && mouseY<=285){
		noStroke();	//no stroke
		fill(250, 80);	//set color to white with opacity 80
		rect(416, 258, 160, 40, 20);	//draw rect
	}
	else if(mouseX>=437 && mouseX<=509.5 && mouseY>=336 && mouseY<=358){
		fill(250, 80);	//set color to white with opacity 80
		rect(437, 336, 160, 40, 20);	//draw rect
	}
}

//Function windowResized() - resize the cavnas 
function windowResized(){	//ensures the canvas remains centered
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
}

//Function mouseClicked() - check if mouse has been clicked once 
function mouseClicked(){

	console.log(mouseX);
	if(paused){	//if game is paused 
		//if click resume, resume game
		if(mouseX>=416 && mouseX<=536 && mouseY>=258 && mouseY<=285){
			gameMode = 1;	//set gameMode to 1
			paused = false;	//set paused to false
		}

		//if click quit button, go to home page
		else if(mouseX>=437 && mouseX<=509.5 && mouseY>=336 && mouseY<=358){
			gameMode = 0;	//set gameMode to 0
			paused = false;	//set paused to false 
		}
	}

	//if click start button, start game
	else if(gameMode===0){
		if(mouseX>=432 && mouseX<=587 && mouseY>=370 && mouseY<=443){
			initializeGame();	//call initializeGame which resets all variables
			gameMode = 1;	//set gameMode to 1
		}
	}

	else if(gameMode===2){	//if game over screen 
		//if click play again button, start new game
		if(mouseX>=360.5 && mouseX<=483.5 && mouseY>=391 && mouseY<=408){
			initializeGame();	//call initializeGame which resets all variables
			gameMode = 1;		//set gameMode to 1 
		}

		//if click home button, go to start screen
		else if(mouseX>=533.4 && mouseX<=585.5 && mouseY>=391 && mouseY<=408){
			initializeGame();	//call initializeGame which resets all variables
			gameMode = 0;		//set gameMode to 0
		}
	}
}

//Function keyPressed() - check if key has been pressed once 
function keyPressed(){
	//if spacebar pressed, pause game if player is playing game 
	if(keyCode == 32 && gameMode==1){
		paused = true;	//pause is set to true
	}
}