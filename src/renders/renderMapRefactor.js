const socket = io();

class MapRenderer {
	constructor(container) {
		this.row = 100;
		this.col = 100;
		this.container = container;
		this.squareSize = 20;
		this.grid = [];
		this.litterArray = [];
		this.grassTexture = PIXI.Texture.fromImage('./sprites/grass.png');
		this.rockTexture = PIXI.Texture.fromImage('./sprites/rock.png');
		this.litterTexture = PIXI.Texture.fromImage('./sprites/litter.png');
		this.roverSprite = null;
		this.droneSprite = null;
		this.addLitter = this.addLitter.bind(this);
	}

	drawGrid() {
		for (var i = 0; i < this.col; i++) {
			this.grid[i] = [];
			this.litterArray[i] = [];
			for (var j = 0; j < this.row; j++) {
				var num = Math.random();
				if (num > 0.03) {
					var terrain = new PIXI.Sprite(this.grassTexture);
					this.grid[i][j] = "grass";
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
		this.roverSprite = new RoverSprite(this.grid, this.container, this.squareSize, this);
		this.droneSprite = new DroneSprite(this.squareSize, this.container);
		//test
		var litterSprite = new PIXI.Sprite(this.litterTexture);
		litterSprite.anchor.set(0.5, 0.5);
		litterSprite.x = Math.floor(2 % this.col) * this.squareSize;
		litterSprite.y = Math.floor(1 % this.row) * this.squareSize;
		this.litterArray[2][1] = litterSprite;
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

	removeLitter(x, y) {
		if (this.litterArray[x][y] != null) {
			this.container.removeChild(this.litterArray[x][y]);
			delete this.litterArray[x][y];
			return true;
		}
		return false;
	}

	moveRover(path) {
		this.roverSprite.followPath(path);
	}

	moveDrone(x, y) {
		this.droneSprite.moveTo(x, y);
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

function setButtons(mapRenderer) {
	//Linking the litter generations button to the addLitter method
	const genLitterBtn = document.getElementById("litterBtn");
	genLitterBtn.addEventListener('click', mapRenderer.addLitter);
}

function main() {
	const mapRenderer = new MapRenderer(container);
	mapRenderer.drawGrid();
	setButtons(mapRenderer);
	setInterval(startRoutine, 5000, mapRenderer);
}

document.addEventListener('DOMContentLoaded', main);
