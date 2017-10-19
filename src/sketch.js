var canvas;
var currentFrame = 0;
var tomatoRunning = [];
var tomatoHeight = 250;

var startscreen, endscreen, pausescreen;
var glove;

//game mode
var gameMode = 0;
var paused = false;

function preload() {
	//load tomato running gif 
	for (var i = 1; i < 25; i++){
		for (var j = 0; j < 2; j++){
			var fileName = "images/tomato_running/tomato"+i+".png";
			tomatoRunning.push(loadImage(fileName));
		}
	}

	//load screen images
	startscreen = loadImage("images/startscreen.png");
	endscreen = loadImage("images/gameoverscreen.png");
	pausescreen = loadImage("images/pausescreen.png");

	//load cursor graphic
	glove = loadImage("images/fry.png");

}

function setup(){
	//create centered background
	canvas = createCanvas(1000, 500);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);

	noCursor();
}

function draw(){
	background(250);

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
		image(glove, mouseX, mouseY);
	}
}

function startScreen(){

	imageMode(CORNER);
	image(startscreen, 0, 0);

	//draw tomato running to the right
	imageMode(CENTER);
	currentFrame += 1;
	if (currentFrame >= tomatoRunning.length) {
	    currentFrame = 0;
	}
	image(tomatoRunning[currentFrame], 175, tomatoHeight+20, 160, 120);

	//highlight start button if mouseover
	if(mouseX>=434.5 && mouseX<=583.5 && mouseY>=391 && mouseY<=443){
		noStroke();
		fill(255, 80);
		rect(417, 310, 160, 68, 20);
	}


}

function game(){
	//draw tomato running to the right
	imageMode(CENTER);
	currentFrame += 1;
	if (currentFrame >= tomatoRunning.length) {
	    currentFrame = 0;
	}
	image(tomatoRunning[currentFrame], 50, tomatoHeight, 160, 120);
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