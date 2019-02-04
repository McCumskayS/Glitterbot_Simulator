PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
const socket = io();

class MapRenderer {
	constructor() {
		this.row = 25;
		this.col = 70;
		this.container = new PIXI.Container();
		this.squareSize = 20;
		this.grid = [];
		this.litterArray = [];
		this.app = new PIXI.Application({
		    width: this.col*this.squareSize,
		    height: this.row*this.squareSize,
		    antialias: false,
		    transparent: true,
		    resolution: 1,
				view: document.getElementById("map-canvas"),
		});
		this.app.renderer.autoResize = true;
		this.app.stage.addChild(this.container);
		this.container.pivot.x = this.container.width/2;
		this.container.pivot.y = this.container.height/2;
		this.container.x = 10;
		this.container.y = 10;
		this.container.interactive = true;
		this.addMapInteraction();
		this.roverSprite = null;
		this.droneSprite = null;
	}

	drawGrid() {
		for (var i = 0; i < this.col; i++) {
			this.grid[i] = [];
			for (var j = 0; j < this.row; j++) {
				var num = Math.random();
				if (num > 0.03) {
					var terrain = new GrassSprite(this.squareSize);
				} else {
					var terrain = new RockSprite(this.squareSize);
				}
				terrain.posx = i;
				terrain.posy = j;
				terrain.sprite.x = Math.floor(i % this.col) * this.squareSize;
				terrain.sprite.y = Math.floor(j % this.row) * this.squareSize;
	      this.container.addChild(terrain.sprite);
				this.grid[i][j] = terrain;
			}
		}
		this.roverSprite = new RoverSprite(this.grid, this.container, this.squareSize);
		this.droneSprite = new DroneSprite(this.squareSize, this.container);
		//Adding a litter for testing purposes
		var terrainWithLitter = this.grid[2][1];
		terrainWithLitter.spawnLitter(this.container);
		this.litterArray.push(terrainWithLitter);
	}

	addLitter() {
		do {
			var numRow = Math.floor(Math.random()*(this.row));
			var numCol = Math.floor(Math.random()*(this.col));
			var terrain = this.grid[numCol][numRow];
		}
		while ((terrain.getTerrainLitter() == true) || (terrain.getTerrainType() == "Rock"));
		var terrain = this.grid[numCol][numRow];
		terrain.spawnLitter();
		this.litterArray.push(terrain);
	}

	addMapInteraction() {
		this.container
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
	}

	moveRover(path) {
		if (this.roverSprite == null) {
			console.log(null);
			return;
		}
		this.roverSprite.followPath(path);
	}
}

function startRoutine(m) {
	socket.emit("rover-frontEnd", {coordinates: {posx:m.roverSprite.posx, posy:m.roverSprite.posy},
		state: m.roverSprite.waiting});
	console.log("sending to the server");
	socket.on('rover-frontEnd', function(data) {
		m.moveRover(data);
	});
}

function main() {
	var mapRenderer = new MapRenderer();
	mapRenderer.drawGrid();
	startRoutine(mapRenderer);
	//setInterval(function(){mapRenderer.startRoutine();}, 1000);
}

document.addEventListener('DOMContentLoaded', main);
