//Main Js file! Handles everything related to the visual aspects of the simulation
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

//Setup
const canvas = document.getElementById("map-canvas");
const genLitterBtn = document.getElementById("litterBtn");
const socket = io();
var roverTimeline = new TimelineLite();
var droneTimeline = new TimelineLite();
const row = 25;
const col = 50;
const container = new PIXI.Container();
const squareSize = 20;
const grid = [];
const litterArray = [];
const app = new PIXI.Application({
    width: 1000,
    height: 600,
    antialias: false,
    transparent: true,
    resolution: 1,
		view: document.getElementById("map-canvas"),
	}
);
app.renderer.autoResize = true;
app.stage.addChild(container);

drawGrid();
generateLitterArray();
//Center container
container.x = (app.screen.width) / 2;
container.y = (app.screen.height) / 2;

//Add drone & rover on the grid/map
var roverSprite = new RoverSprite();
var droneSprite = new DroneSprite();

//Reads path from server and moves the roverSprite
function roverPath(path) {
	roverSprite.followPath(path);
}
socket.on('rover-frontEnd', roverPath);
//Reads path from server and moves the droneSprite
function dronePath(coordinates) {
  droneSprite.moveTo(coordinates.x, coordinates.y)
}
socket.on('drone-frontEnd', dronePath);

//Creating square sprites and add them to the 2D array 'grid'
function drawGrid() {
	for (var i = 0; i < col; i++) {
		grid[i] = [];
		for (var j = 0; j < row; j++) {
			var num = Math.random();
			if (num > 0.03) {
				var terrain = new GrassSprite(i, j, col, row);
			} else {
				var terrain = new RockSprite(i, j, col, row);
			}
			terrain.posx = i;
			terrain.posy = j;
			terrain.sprite.x = Math.floor(i % col) * squareSize;
			terrain.sprite.y = Math.floor(j % row) * squareSize;
      container.addChild(terrain.sprite);
			grid[i][j] = terrain;
		}
	}
}

function generateLitterArray(){
  for (var i = 0; i < col; i++) {
    litterArray[i] = [];
    for (var j = 0; j < row; j++) {
    }
  }
}

//function for generating litter
  genLitterBtn.addEventListener('click', function(action){

    //generate random value between 0 and amount of rows/cols
    var numRow = Math.floor(Math.random()*(row));
    var numCol = Math.floor(Math.random()*(col));
    //get terrain from array
    var terrain = grid[numCol][numRow];

    //keep getting new terrain col and row until you find one that doesn't already contain a litter
    //TODO : Fix while loop getting stuck once the screen is full of litter
    while ((terrain.getTerrainLitter() == true) || (terrain.getTerrainType() == "Rock"))
    {
      var numRow = Math.floor(Math.random()*(row));
      var numCol = Math.floor(Math.random()*(col));
      var terrain = grid[numCol][numRow];
    }
    //generate a new litter instance
    var litter = new LitterSprite();
    //get terrain from grid
    var terrain = grid[numCol][numRow];

    //
    litter.sprite.x = Math.floor(numCol % col) * squareSize;
    litter.sprite.y = Math.floor(numRow % row) * squareSize;

    //set terrain litter to be true
    terrain.setTerrainLitter(true);
    container.addChild(litter.sprite);
    litterArray[numCol][numRow] = litter.sprite;
  });


//Used for nice pixel scaling
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

//Setting pivot for the container
container.pivot.x = container.width/2;
container.pivot.y = container.height/2;
container.interactive = true;

//Set various interaction for the container, mouse+touchscreen
container
       .on('pointerdown', onDragStart)
       .on('pointerup', onDragEnd)
       .on('pointerupoutside', onDragEnd)
       .on('pointermove', onDragMove);

function onDragStart(event) {
  this.data = event.data;
  var position = this.data.getLocalPosition(this);
  this.pivot.set(position.x, position.y)
    //keep this in case stuff breaks
    //this.position.set(position.x, position.y)
  this.dragging = true;
}

function onDragEnd() {
  document.body.style.cursor = 'auto';
  this.alpha = 1;
  this.dragging = false;
  this.data = null;
}

function onDragMove() {
  if (this.dragging) {
    document.body.style.cursor = 'move';
    var newPosition = this.data.getLocalPosition(this.parent);
    this.position.set(newPosition.x, newPosition.y);
  }
}

//TEMPORARY: Used for having a default zoom level
//TODO set MAX zoom level
var defaultScaleX = container.scale.x;
var defaultScaleY = container.scale.y;

//Canvas zoom event listener
canvas.addEventListener("wheel", function(event) {
  if (event.deltaY < 0) {
    container.scale.x += 0.05;
    container.scale.y += 0.05;
  }
  if (event.deltaY > 0) {
    if ((container.scale.x - 0.05) >= defaultScaleX) {
      container.scale.x -= 0.05;
      container.scale.y -= 0.05;
    }
  }
});
