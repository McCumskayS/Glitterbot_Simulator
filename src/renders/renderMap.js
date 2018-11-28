//Setup
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var canvas = document.getElementById("test-canvas");
var roverTimeline = new TimelineLite();
var droneTimeline = new TimelineLite();
const row = 30;
const col = 50;
const container = new PIXI.Container();
const squareSize = 20;
const grid = [];
const app = new PIXI.Application({
    width: (col*squareSize),
    height: (row*squareSize),
    antialias: true,
    transparent: true,
    resolution: 1,
		view: document.getElementById("test-canvas"),
	}
);
app.renderer.autoResize = true;
app.stage.addChild(container);

drawGrid();
container.x = (app.screen.width - container.width) / 2;
container.y = (app.screen.height - container.height) / 2;

path = [
	{posx: 1, posy:0},
  {posx: 2, posy:0},
	{posx: 2, posy:1},
  {posx: 3, posy:1},
]

//Add drone & rover on the grid/map
var roverSprite = new RoverSprite();
var droneSprite = new DroneSprite();

//TODO: FIND A WAY TO LET ANIMATION FINISH
roverSprite.followPath(path);
droneSprite.moveTo(10, 5);
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
			terrain.sprite.x = (i % col) * squareSize;
			terrain.sprite.y = Math.floor(j % row) * squareSize;
			grid[i][j] = terrain;
		}
	}
}
