const socket = io();

class MapRenderer {
	constructor(container) {
		this.row = 50;
		this.col = 50;
		this.container = container;
		this.squareSize = 20;
		this.grid = [];
		this.litterArray = [];
		this.grassTexture = PIXI.Texture.fromImage('./sprites/grass.png');
		this.rockTexture = PIXI.Texture.fromImage('./sprites/rock.png');
		this.litterTexture = PIXI.Texture.fromImage('./sprites/litter.png');
		this.roverSprite = null;
		this.droneSprite = null;
		this.moveDrone = this.moveDrone.bind(this);

		// new features
		this.treeTexture = PIXI.Texture.fromImage('./sprites/tree.png');
		this.treeArray = [];
	}

	drawGrid() {
		for (var i = 0; i < this.col; i++) {
			this.grid[i] = [];
			this.litterArray[i] = [];
			for (var j = 0; j < this.row; j++) {
				var num = Math.random();
				if (num > 0.03) {
					// add tree tp the map
					if (num > 0.99) {
						var terrain = new PIXI.Sprite(this.treeTexture);
						this.grid[i][j] = "tree";
					} else {
						var terrain = new PIXI.Sprite(this.grassTexture);
						this.grid[i][j] = "grass";
						}
				} else {
					var terrain = new PIXI.Sprite(this.rockTexture);
					this.grid[i][j] = "rock";
				}
				terrain.anchor.set(0.5, 0.5);
				terrain.x = Math.floor(i % this.col) * this.squareSize;
				terrain.y = Math.floor(j % this.row) * this.squareSize;
	      this.container.addChild(terrain);
				this.litterArray[i][j] = null;
			}
		}
		this.roverSprite = new RoverSprite(this.grid, this.container, this.squareSize, this.litterArray);
		this.droneSprite = new DroneSprite(this.row, this.col, this.grid, this.squareSize, this.container, this.litterArray);
		//test
		var litterSprite = new PIXI.Sprite(this.litterTexture);
		litterSprite.anchor.set(0.5, 0.5);
		litterSprite.x = Math.floor(2 % this.col) * this.squareSize;
		litterSprite.y = Math.floor(1 % this.row) * this.squareSize;
		this.litterArray[2][1] = litterSprite;
		this.litterArray[4][5] = litterSprite;
		this.container.addChild(litterSprite);
	}

	addLitter() {
		do {
			var row = Math.floor(Math.random()*(this.row));
			var col = Math.floor(Math.random()*(this.col));
		}
		while ((this.litterArray[col][row] != null) || (this.grid[col][row] == "rock"));
		var litterSprite = new PIXI.Sprite(this.litterTexture);
		litterSprite.anchor.set(0.5, 0.5);
		litterSprite.x = Math.floor(col % this.col) * this.squareSize;
		litterSprite.y = Math.floor(row % this.row) * this.squareSize;
		this.litterArray[col][row] = litterSprite;
		this.container.addChild(litterSprite);
	}

	moveRover(path) {
		this.roverSprite.followPath(path);
	}

	moveDrone(position) {
		this.droneSprite.moveTo(position);
	}

	addTree(posx, posy) {
		treeArray[posy][posx] == 1;
	}

}

function startRoutine(m) {
	socket.emit("rover-frontEnd", {coordinates: {posx:m.roverSprite.posx, posy:m.roverSprite.posy},
		state: m.roverSprite.waiting});
	// send the location of the drone to the server
	console.log('scanRadius:'+ m.droneSprite.scanRadius);
/*
	socket.emit('drone-frontEnd', {coordinates: {posx:m.droneSprite.posx, posy:m.droneSprite.posy},
		scanRadius: m.droneSprite.scanRadius});
*/
	console.log("sending to the server");

	socket.on('rover-frontEnd', function(data) {
		m.moveRover(data);
	});

	console.log("sending drone location to the server");
	// receive scanning path from the server

}

function droneRoutine(m) {
	console.log(m.droneSprite.waiting)
	socket.emit('drone-frontEnd', {coordinates: {posx:m.droneSprite.posx, posy:m.droneSprite.posy},
		scanRadius: m.droneSprite.scanRadius, state:m.droneSprite.waiting});
		setTimeout(droneRoutine, 1000, m);
}

function main() {
	const mapRenderer = new MapRenderer(container);
	mapRenderer.drawGrid();

	droneRoutine(mapRenderer);

	socket.on('drone-frontEnd', function(data) {
		mapRenderer.moveDrone(data);
		console.log('it works for drone to move!');
	});

	socket.on('tree-location', function(data) {
		var x = data.coordinates.posx;
		var y = data.coordinates.posy;
		mapRenderer.addTree(x,y);
	})


}

document.addEventListener('DOMContentLoaded', main);
