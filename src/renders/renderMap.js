//Setup
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
let canvas = document.getElementById("test-canvas");
const row = 30;
const col = 50;
const container = new PIXI.Container();
const squareSize = 20;
const grid = [];
const ticker = new PIXI.ticker.Ticker();
const app = new PIXI.Application({
    width: (col*20),
    height: (row*20),
    antialias: true,
    transparent: true,
    resolution: 1,
		view: document.getElementById("test-canvas"),
	}
);
app.renderer.autoResize = true;
app.stage.addChild(container);
ticker.stop();
ticker.add(delta => animSprite(delta));

drawGrid();
//Shell function for the PIXI.ticker in order to have  different animations
var animSprite = function() {}
container.x = (app.screen.width - container.width) / 2;
container.y = (app.screen.height - container.height) / 2;

path = [
	{x: 1, y:0},
	{x: 2, y:0},
	{x: 2, y:1},
]

var roverSprite = new RoverSprite();

//TODO: FIND A WAY TO LET ANIMATION FINISH
roverSprite.followPath(path);

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
