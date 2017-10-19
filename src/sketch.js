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
		for (var j = 0; j < 2; j++){
			var fileName = "images/tomato_running/tomato"+i+".png";
			tomatoRunning.push(loadImage(fileName));
		}
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

}

function game(){
	//draw tomato running to the right
	imageMode(CENTER);
	currentFrame += 1;
	if (currentFrame >= tomatoRunning.length) {
	    currentFrame = 0;
	}
<<<<<<< HEAD
	image(tomatoRunning[currentFrame], 50, tomatoHeight, 160, 120);
=======
	image(tomatoRunning[currentFrame], 500, tomatoHeight);
>>>>>>> 1f8868d23d461a395740e2b0be5d459beca8f574
}

function gameOver(){

}

function windowResized(){
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
}