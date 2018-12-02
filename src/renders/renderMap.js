//Main Js file! Handles everything related to the visual aspects of the simulation
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

//Setup
const canvas = document.getElementById("map-canvas");
const socket = io();
var roverTimeline = new TimelineLite();
var droneTimeline = new TimelineLite();
const row = 25;
const col = 50;
const container = new PIXI.Container();
const squareSize = 20;
const grid = [];
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
			if (num > 0.01) {
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

//Used for nice pixel scaling
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
////////////////////////////////
//TESTS
container.pivot.x = container.width/2;
container.pivot.y = container.height/2;
container.interactive = true;
//container.buttonMode = true;

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
var defaultScaleX = container.scale.x;
var defaultScaleY = container.scale.y;
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
