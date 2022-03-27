// Create the canvas
var canvas = document.querySelector("#game-canvas");
var ctx = canvas.getContext("2d");
maxwidth = 512;
maxheight = 480;

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
	constructor({position, velocity, image}) {
		this.position = position
		this.width = 32
		this.height = 32
		this.velocity = velocity
		this.image = image
	}
	
	draw() {
		ctx.drawImage(this.image, this.position.x, this.position.y)
	}

	update() {
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
		['X', '-', '-', 'X', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'X'],
		['X', '-', 'X', 'X', '-', 'X', 'X', 'X', 'X', '-', '-', 'X', 'X', '-', '-', 'X'],
		['X', '-', 'X', '-', '-', '-', 'X', '-', '-', '-', '-', 'X', '-', 'X', '-', 'X'],
		['X', '-', 'X', '-', '-', '-', '-', '-', '-', '-', '-', 'X', '-', '-', '-', 'X'],
		['X', '-', 'X', '-', 'X', 'X', 'X', '-', '-', '-', 'X', 'X', '-', 'X', '-', 'X'],
		['X', '-', '-', '-', '-', 'X', '-', '-', '-', '-', 'X', 'X', '-', 'X', 'X', 'X'],
		['X', 'X', '-', 'X', '-', 'X', '-', 'X', '-', '-', '-', '-', '-', 'X', '-', 'X'],
		['X', '-', '-', 'X', '-', '-', '-', '-', '-', '-', '-', 'X', 'X', 'X', '-', 'X'],
		['X', '-', 'X', 'X', '-', '-', '-', '-', 'X', '-', '-', '-', '-', '-', '-', 'X'],
		['X', '-', '-', 'X', 'X', '-', '-', 'X', 'X', 'X', '-', 'X', 'X', 'X', '-', 'X'],
		['X', '-', '-', 'X', '-', 'X', '-', '-', '-', '-', '-', 'X', '-', '-', '-', 'X'],
		['X', '-', '-', '-', '-', '-', '-', 'X', '-', '-', 'X', 'X', '-', 'X', '-', 'X'],
		['X', 'X', '-', '-', '-', 'X', '-', 'X', '-', '-', '-', '-', '-', '-', '-', 'X'],
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
			player.velocity.y = -playerSpeed
			keys.up.pressed = true //going up
			break
		case 40: 
			player.velocity.y = playerSpeed
			keys.down.pressed = true //going down
			break
		case 37:
			player.velocity.x = -playerSpeed
			keys.left.pressed = true //going left
			break
		case 39:
			player.velocity.x = playerSpeed
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
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	trees.forEach((tree) => {
		tree.draw()

		//COLLISION DETECTION
		if (
			player.position.x + player.velocity.x < (tree.position.x + 24)
			&& tree.position.x < (player.position.x + player.velocity.x + 24)
			&& player.position.y + player.velocity.y < (tree.position.y + 24)
			&& tree.position.y < (player.position.y + player.velocity.y + 24)
		) {
			player.velocity.x = 0
			player.velocity.y = 0
		}
	})
	player.move()

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
	monster.draw()

	
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);

	//Time
	currentResult = (Date.now() - timeStarted)/1000;
	document.querySelector('#time-played').innerText = currentResult;
};

//Other constants and modifiers
const playerSpeed = 1.2;

//The main game loop
var main = function () {
	update();
	render();
	// Request animation
	window.animateId = requestAnimationFrame(main);

	//Winning conditions
	if (monstersCaught == 20) {
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
var previousResults = []
var maximumResult = 10;
var trees = []
var respawnSpaces = []

// Let's play this game!
function startGame() {
	if (!gameStarted) {
		gameStarted = true;
		timeStarted = Date.now()
		//play and auto loop the background music
		backgroundMusic.play()
		document.querySelector('audio[src="sounds/background-music.wav"]').addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		})

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
	previousResults.push(currentResult)
	backgroundMusic.stop()
	winGameMusic.play()
	ctx.fillStyle = "rgb(250, 0, 0)";
	ctx.font = "32px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("You won!!!", canvas.width/2, canvas.height/2);
	ctx.fillText("Your result: " + currentResult + " seconds", canvas.width/2, canvas.height/2 + 64);
	cancelAnimationFrame(window.animateId)
	gameStarted = false;

	printScoreBoard()
}

function printScoreBoard() {
	document.querySelector('#result-list').innerHTML = '';
	previousResults.sort()
	previousResults = previousResults.slice(0,10)
	previousResults.forEach(result => {
		let el = document.createElement('li')
		el.innerText = result + ' seconds';
		document.querySelector('#result-list').appendChild(el); 
	})
}