var canvas;
var currentFrame = 0;
var tomatoRunning = [];
var tomatoHeight = 250;

//game mode
var gameMode = 1;
var paused = false;

function preload() {
	//load tomato running gif 
	for (var i = 1; i < 25; i++){
		var fileName = "/images/tomato_running/tomato"+i+".png";
		tomatoRunning.push(loadImage(fileName));
	}

}

function setup(){
	//create centered background
	canvas = createCanvas(1000, 500);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);

}

function draw(){
	background(255);

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

}

function game(){
	//draw tomato running to the right
	imageMode(CENTER);
	image(tomatoRunning[currentFrame], 250, tomatoHeight);
}

function gameOver(){

}

function windowResized(){
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
}