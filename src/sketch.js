var canvas;
var currentFrame = 0;
var tomatoRunning = [];
var tomatoHeight = 250;

var startscreen, endscreen, pausescreen;

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

}

function setup(){
	//create centered background
	canvas = createCanvas(1000, 500);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);

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
}

function pauseScreen(){
	image(pausescreen, 0, 0);
}

function windowResized(){
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
}