// Create the canvas for info board
var canvasInfo = document.querySelector("#info");
var ctxInfo = canvasInfo.getContext("2d");

// Create the canvas for game
var canvas = document.querySelector("#game-canvas");
var ctx = canvas.getContext("2d");
maxwidth = 512;
maxheight = 480;

// Info background image
var infoBgReady = false;
var infoBgImage = new Image();
infoBgImage.onload = function () {
	infoBgReady = true;
};
infoBgImage.src = "images/grass-background.png";

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Player object
class Player {
	static width = 32
	static height = 32
	constructor({position, velocity, image}) {
		this.position = position;
		this.velocity = velocity;
		this.image = image
	}
	
	draw() {
		ctx.drawImage(this.image, this.position.x, this.position.y)
	}

	move() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		this.draw()
	}
}

var playerImage = new Image(32, 32);
playerImage.src = 'images/hero.png'
const player = new Player({
	position: {
		x: 256,
		y: 256
	},
	velocity: {
		x: 0,
		y: 0
	},
	image: playerImage
})

// Monster object
class Monster {
	static width = 32
	static height = 32
	constructor({position, velocity, image}) {
		this.position = position
		this.velocity = velocity
		this.image = image
	}
	
	draw() {
		ctx.drawImage(this.image, this.position.x, this.position.y)
	}

	move() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		this.draw()
	}
}

var monsterImage = new Image(32, 32);
monsterImage.src = 'images/monster.png'
const monster = new Monster({
	position: {
		x: 32 + (Math.random() * (canvas.width - 96)),
		y: 32 + (Math.random() * (canvas.height - 96))
	},
	velocity: {
		x: 0,
		y: 0
	},
	image: monsterImage
})

// Tree object
class Tree {
	static width = 32
	static height = 32
	constructor({position, image }) {
		this.position = position;
		this.image = image
	}
	
	draw() {
		ctx.drawImage(this.image, this.position.x, this.position.y)
	}
}

function generateMap() {
	
	//Map of trees
	const map = [
		['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
		['X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
		['X', '-', 'X', '-', 'X', 'X', '-', 'X', 'X', '-', '-', 'X', '-', 'X', '-', 'X'],
		['X', '-', 'X', '-', '-', '-', '-', 'X', '-', '-', '-', 'X', '-', 'X', '-', 'X'],
		['X', '-', 'X', '-', 'X', '-', '-', 'X', 'X', 'X', '-', 'X', '-', '-', '-', 'X'],
		['X', '-', 'X', '-', 'X', '-', 'X', 'X', '-', '-', '-', 'X', '-', 'X', '-', 'X'],
		['X', '-', '-', '-', 'X', '-', '-', 'X', '-', '-', 'X', 'X', '-', 'X', 'X', 'X'],
		['X', 'X', 'X', 'X', 'X', '-', '-', 'X', '-', '-', '-', '-', '-', '-', '-', 'X'],
		['X', '-', '-', '-', '-', '-', 'X', 'X', '-', '-', '-', 'X', 'X', 'X', '-', 'X'],
		['X', '-', 'X', 'X', '-', '-', '-', '-', 'X', '-', '-', '-', '-', '-', '-', 'X'],
		['X', '-', '-', 'X', 'X', 'X', '-', '-', '-', '-', '-', 'X', 'X', 'X', '-', 'X'],
		['X', '-', '-', 'X', '-', 'X', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
		['X', '-', '-', '-', '-', '-', '-', 'X', 'X', '-', 'X', 'X', '-', 'X', '-', 'X'],
		['X', 'X', '-', 'X', '-', 'X', '-', 'X', 'X', '-', '-', '-', '-', '-', '-', 'X'],
		['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']
	]

	const treeImage = new Image()
	treeImage.src = 'images/single-tree.png'

	map.forEach((row, i) => {
		row.forEach((symbol, j) => {
			switch(symbol) {
				case 'X':
					trees.push(
						new Tree({
							position: {
								x: Tree.width*j,
								y: Tree.height*i
							},
							image: treeImage
						})
					)
					break
				case '-':
					respawnSpaces.push({
						x: 32*j,
						y: 32*i
					})
					break
			}
		})
	})
}

// Other objects
var monstersCaught = 0;

// Sound function
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// Handle keyboard controls
const keys = {
	up: {
		pressed: false
	},
	down: {
		pressed: false
	},
	left: {
		pressed: false
	},
	right: {
		pressed: false
	}
}

addEventListener("keydown", function (e) {
	switch (e.keyCode) {
		case 38:
			keys.up.pressed = true //going up
			break
		case 40: 
			keys.down.pressed = true //going down
			break
		case 37:
			keys.left.pressed = true //going left
			break
		case 39:
			keys.right.pressed = true //going right
			break
	}
}, false);

addEventListener("keyup", function (e) {
	switch (e.keyCode) {
		case 38:
			keys.up.pressed = false //going up
			player.velocity.y = 0
			break
		case 40: 
			keys.down.pressed = false //going down
			player.velocity.y = 0
			break
		case 37:
			keys.left.pressed = false //going left
			player.velocity.x = 0
			break
		case 39:
			keys.right.pressed = false //going right
			player.velocity.x = 0
			break
	}
}, false);

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

const directions = ['up','down','left','right']

// Reset the monster
var reset = function () {
	let randomPos = getRandomInt(respawnSpaces.length)
	monster.position.x = respawnSpaces[randomPos].x;
	monster.position.y = respawnSpaces[randomPos].y;
};

// Update game objects
var update = function () {
	// Catch monster success?
	if (
		player.position.x <= (monster.position.x + 32)
		&& monster.position.x <= (player.position.x + 32)
		&& player.position.y <= (monster.position.y + 32)
		&& monster.position.y <= (player.position.y + 32)
	) {
		++monstersCaught;
		monsterCaughtSound.play()
		//RESET THE POSITIONS OF THE MONSTER
		reset()
	}
};

// Draw everything
var render = function () {

	if (infoBgReady) {
		ctxInfo.drawImage(infoBgImage, 0, 0);
	}

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	trees.forEach((tree) => {
		tree.draw()

		//COLLISION DETECTION for player
		if (
			player.position.x + player.velocity.x < (tree.position.x + 24)
			&& tree.position.x < (player.position.x + player.velocity.x + 24)
			&& player.position.y + player.velocity.y < (tree.position.y + 24)
			&& tree.position.y < (player.position.y + player.velocity.y + 24)
		) {
			player.velocity.x = 0
			player.velocity.y = 0
		}

		//COLLISION DETECTION for monster
		if (
			monster.position.x + monster.velocity.x < (tree.position.x + 30)
			&& tree.position.x < (monster.position.x + monster.velocity.x + 30)
			&& monster.position.y + monster.velocity.y < (tree.position.y + 30)
			&& tree.position.y < (monster.position.y + monster.velocity.y + 30)
		) {
			monsterCollided = true
			monster.velocity.x = 0
			monster.velocity.y = 0
		}
	})
	player.move()
	monster.move()

	//SET PLAYER VELOCITY
	if (keys.up.pressed) {
		player.velocity.y = -playerSpeed
	}
	if (keys.down.pressed) {
		player.velocity.y = playerSpeed
	}
	if (keys.left.pressed) {
		player.velocity.x = -playerSpeed
	}
	if (keys.right.pressed) {
		player.velocity.x = playerSpeed
	}

	// ctxInfo.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
	// Score
	ctxInfo.fillStyle = "rgb(250, 250, 250)";
	ctxInfo.font = "20px Helvetica";
	ctxInfo.textAlign = "left";
	ctxInfo.textBaseline = "top";
	ctxInfo.fillText("Goblins caught: " + monstersCaught, 32, 32);
	// Time
	ctxInfo.fillStyle = "rgb(250, 250, 250)";
	ctxInfo.font = "20px Helvetica";
	ctxInfo.textAlign = "left";
	ctxInfo.textBaseline = "top";
	currentResult = (Date.now() - timeStarted)/1000;
	ctxInfo.fillText("Time played: " + currentResult + " seconds", 232, 32);
	//Best record

	if (bestResult !== 'TBD') {
		ctxInfo.fillText("Best result: " + bestResult + " seconds", 232, 64);
	} else {
		ctxInfo.fillText("Best result: " + bestResult, 156, 64);
	}
};

//Other constants and modifiers
const playerSpeed = 1;

//The main game loop
var main = function () {
	update();
	render();
	// Request animation
	window.animateId = requestAnimationFrame(main);

	//Winning conditions
	if (monstersCaught == 10) {
		gameIsWon()
	}
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//MUSIC SETUP
const backgroundMusic = new sound("sounds/background-music.wav");
const loseGameMusic = new sound("sounds/lose-game-music.wav");
const winGameMusic = new sound("sounds/win-game-music.wav")
const monsterCaughtSound = new sound("sounds/monster-caught.wav")

//GAME SETUP
var gameStarted = false
var timeStarted
var currentResult 
var bestResult = 'TBD'
var trees = []
var respawnSpaces = []
var possibleWays = []
var oldDirection
var monsterCollided = false

// Let's play this game!
function startGame() {
	if (!gameStarted) {
		gameStarted = true;
		timeStarted = Date.now()
		//play and auto loop the background music
		// backgroundMusic.play()
		document.querySelector('audio[src="sounds/background-music.wav"]').addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		})

		setInterval(function() {
			if (!monsterCollided) {
				possibleWays = directions
			} else {
				possibleWays = directions.filter((direction) => {
					return direction !== oldDirection
				})
				monsterCollided = false
			}
			let random = getRandomInt(possibleWays.length)
			let direction = possibleWays[random]
			switch (direction) {
				case 'up':
					monster.velocity.x = 0
					monster.velocity.y = -0.5
					oldDirection = 'up'
					break
				case 'down':
					monster.velocity.x = 0
					monster.velocity.y = 0.5
					oldDirection = 'down'
					break
				case 'left':
					monster.velocity.x = -0.5
					monster.velocity.y = 0
					oldDirection = 'left'
					break
				case 'right':
					monster.velocity.x = 0.5
					monster.velocity.y = 0	
					oldDirection = 'right'
					break	
			}
		},1200)
		monstersCaught = 0;
		player.position.x = canvas.width / 2;
		player.position.y = canvas.height / 2;

		trees = []
		respawnSpaces = []
		generateMap();
		reset();
		main();
	}
}

function stopGame() {
	if (gameStarted) {
		cancelAnimationFrame(window.animateId)
		ctx.fillStyle = "rgb(250, 255, 0)";
		ctx.font = "32px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Total monsters caught: " + monstersCaught, canvas.width/2, canvas.height/2);
		ctx.fillText("Your result: " + currentResult + " seconds", canvas.width/2, canvas.height/2 + 64);
		backgroundMusic.stop()
		loseGameMusic.play()
		gameStarted = false;

		printScoreBoard()
	}
}

function gameIsWon() {
	if (bestResult == 'TBD') {
		console.log('wtf')
		bestResult = currentResult
	} else if (currentResult < bestResult) {
		bestResult = currentResult
	}
	backgroundMusic.stop()
	winGameMusic.play()
	ctx.fillStyle = "rgb(250, 0, 0)";
	ctx.font = "32px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("You won!!!", canvas.width/2, canvas.height/2);
	ctx.fillText("Your result: " + currentResult + " seconds", canvas.width/2, canvas.height/2 + 64);
	
	ctxInfo.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
	ctxInfo.drawImage(infoBgImage, 0, 0);
	// Score
	ctxInfo.fillStyle = "rgb(250, 250, 250)";
	ctxInfo.font = "20px Helvetica";
	ctxInfo.textAlign = "left";
	ctxInfo.textBaseline = "top";
	ctxInfo.fillText("Goblins caught: " + monstersCaught, 32, 32);
	// Time
	ctxInfo.fillStyle = "rgb(250, 250, 250)";
	ctxInfo.font = "20px Helvetica";
	ctxInfo.textAlign = "left";
	ctxInfo.textBaseline = "top";
	currentResult = (Date.now() - timeStarted)/1000;
	ctxInfo.fillText("Time played: " + currentResult + " seconds", 232, 32);
	//Best record

	if (bestResult !== 'TBD') {
		ctxInfo.fillText("Best result: " + bestResult + " seconds", 232, 64);
	} else {
		ctxInfo.fillText("Best result: " + bestResult, 156, 64);
	}
	cancelAnimationFrame(window.animateId)
	gameStarted = false;
}