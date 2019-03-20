const socket = io();

class MapRenderer {
	constructor(container) {
		this.row = 50;
		this.col = 50;
		this.container = container;
		this.squareSize = 20;
		this.grid = [];
		this.litterArray = [];
		this.litterArrayLocations = [];
		this.grassTexture = PIXI.Texture.fromImage('./sprites/grass.png');
		this.rockTexture = PIXI.Texture.fromImage('./sprites/rock.png');
		this.litterTexture = PIXI.Texture.fromImage('./sprites/litter.png');
		this.roverSprite = null;
		this.droneSprite = null;

		// new features
		this.treeTexture = PIXI.Texture.fromImage('./sprites/tree.png');
		this.treeArray = [];
    
		this.addLitter = this.addLitter.bind(this);
		this.drawGrid = this.drawGrid.bind(this);
		this.removeLitter = this.removeLitter.bind(this);
		this.moveDrone = this.moveDrone.bind(this);

	}

	drawGrid() {
		for (var i = 0; i < this.row; i++) {
			this.grid[i] = [];
			this.litterArray[i] = [];
			this.treeArray[i] = [];	
			this.litterArrayLocations[i] = [];
			for (var j = 0; j < this.col; j++) {

				var num = Math.random();
				if (num > 0.03) {
					// add tree tp the map
					if (num > 0.99) {
						var terrain = new PIXI.Sprite(this.treeTexture);
						this.grid[i][j] = "tree";
						console.log('tree is initially placed at '+i+','+j);

					} else {
						var terrain = new PIXI.Sprite(this.grassTexture);
						this.grid[i][j] = "grass";
						}
				} else {
					var terrain = new PIXI.Sprite(this.rockTexture);
					this.grid[i][j] = "rock";
				}
				terrain.anchor.set(0.5, 0.5);
				terrain.x = Math.floor(j % this.col) * this.squareSize;
				terrain.y = Math.floor(i % this.row) * this.squareSize;
	      this.container.addChild(terrain);
				this.litterArray[i][j] = null;
				this.litterArrayLocations[i][j] = 0;//no litter
			}
		}

		this.roverSprite = new RoverSprite(this.grid, this.container, this.squareSize, this.litterArray);
		this.droneSprite = new DroneSprite(this.row, this.col, this.grid, this.squareSize, this.container, this.litterArray, this.treeArray);
		//test
		var litterSprite = new PIXI.Sprite(this.litterTexture);
		litterSprite.anchor.set(0.5, 0.5);
		litterSprite.x = Math.floor(2 % this.col) * this.squareSize;
		litterSprite.y = Math.floor(1 % this.row) * this.squareSize;
		this.litterArray[2][1] = litterSprite;
		this.litterArray[4][5] = litterSprite;
		this.container.addChild(litterSprite);

		//Sending grid array and litter array, to delete in the future
		socket.emit('grid-channel', {grid: this.grid, litter: this.litterArrayLocations});

	}

	addLitter() {
		//TODO: this function gets stuck in the while loop if there's not free spot to place new litter
		do {
			var row = Math.floor(Math.random()*(this.row));
			var col = Math.floor(Math.random()*(this.col));
		}
		while ((this.litterArray[row][col] != null) || (this.grid[row][col] == "rock"));
		var litterSprite = new PIXI.Sprite(this.litterTexture);
		litterSprite.anchor.set(0.5, 0.5);
		litterSprite.x = Math.floor(col % this.col) * this.squareSize;
		litterSprite.y = Math.floor(row % this.row) * this.squareSize;
		this.litterArray[row][col] = litterSprite; //tochange maybe
		this.litterArrayLocations[row][col] = 1;
		//test update the litter array on the server
		socket.emit('grid-channel', {grid: this.grid, litter: this.litterArrayLocations});
		this.container.addChild(litterSprite);
	}

	removeLitter(x, y) {
		if (this.litterArray[y][x] != null) {
			this.container.removeChild(this.litterArray[y][x]);
			delete this.litterArray[y][x];
			this.litterArrayLocations[y][x] = 0;
			socket.emit('grid-channel', {grid: this.grid, litter: this.litterArrayLocations});
			return true;
		}
		return false;
	}

	moveRover(path) {
		this.roverSprite.followPath(path);
	}

	moveDrone(position) {
		this.droneSprite.moveTo(position);
	}


}

function startRoutine(m) {
	console.log(m.roverSprite.posx);
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
  setTimeout(startRoutine, 5000, m);
}

function droneRoutine(m) {
	console.log(m.droneSprite.waiting)
	socket.emit('drone-frontEnd', {coordinates: {posx:m.droneSprite.posx, posy:m.droneSprite.posy},
		scanRadius: m.droneSprite.scanRadius, state:m.droneSprite.waiting, grid:m.grid});
		setTimeout(droneRoutine, 1000, m);

}

function setButtons(mapRenderer) {
	//Linking the litter generations button to the addLitter method
	const genLitterBtn = document.getElementById("litterBtn");
	genLitterBtn.addEventListener('click', mapRenderer.addLitter);
}

function randAddLitter(mapRenderer) {
	var timer = Math.floor(Math.random() * 10001) + 5000;
	mapRenderer.addLitter();
	setTimeout(randAddLitter, timer, mapRenderer);
	
}

function main() {
	const mapRenderer = new MapRenderer(container);
	mapRenderer.drawGrid();

	droneRoutine(mapRenderer);

	socket.on('drone-frontEnd', function(data) {
		mapRenderer.moveDrone(data);
		console.log('it works for drone to move!');

	setButtons(mapRenderer);
	startRoutine(mapRenderer);
	socket.on('rover-frontEnd', function(data) {
		console.log(data);
		mapRenderer.moveRover(data);
    randAddLitter(mapRenderer);
	});

}

document.addEventListener('DOMContentLoaded', main);
