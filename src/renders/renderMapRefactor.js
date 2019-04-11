const socket = io();
var count = 0;

class MapRenderer {
	constructor(container) {
		this.row = 20;
		this.col = 30;
		this.container = container;
		this.squareSize = 20;
		this.baseX = 15;
		this.baseY = 10;
		this.grid = [];
		this.litterArray = [];
		this.litterArrayLocations = [];
		this.grassTexture = PIXI.Texture.fromImage('./sprites/grass.png');
		this.rockTexture = PIXI.Texture.fromImage('./sprites/rock.png');
		this.litterTexture = PIXI.Texture.fromImage('./sprites/litter.png');
		this.baseTexture = PIXI.Texture.fromImage('./sprites/base.png');
		this.roverSprite = null;
		this.droneSprite = null;
		//phone drone stuff
		this.phoneDrone = null;

		// new features
		this.treeTexture = PIXI.Texture.fromImage('./sprites/tree.png');
		this.treeArray = [];

		this.addLitter = this.addLitter.bind(this);
		this.drawGrid = this.drawGrid.bind(this);
		this.removeLitter = this.removeLitter.bind(this);
		this.moveDrone = this.moveDrone.bind(this);
		this.movePhoneDrone = this.movePhoneDrone.bind(this);


	}

	drawGrid() {
		for (var i = 0; i < this.row; i++) {
			this.grid[i] = [];
			this.litterArray[i] = [];
			this.treeArray[i] = [];
			this.litterArrayLocations[i] = [];

			for (var j = 0; j < this.col; j++) {
				if(j == this.baseX && i == this.baseY) {
					var terrain = new PIXI.Sprite(this.baseTexture);
					this.grid[i][j] = "base";
        } else {
           var num = Math.random();
				if (num > 0.03) {
					// add trees to the map
					if (num > 0.94 && i != 0 && j != 0) {
						var terrain = new PIXI.Sprite(this.treeTexture);
						this.grid[i][j] = "tree";
						count = count + 1;
						console.log('count value : '+count);
						console.log('tree position x: ' + j);
						console.log('tree position y: ' + i);
		      } else {
						var terrain = new PIXI.Sprite(this.grassTexture);
						this.grid[i][j] = "grass";
					}
				} else {
					var num = Math.random();
					if (num > 0.03) {
						var terrain = new PIXI.Sprite(this.grassTexture);
						this.grid[i][j] = "grass";
					} else {
						var terrain = new PIXI.Sprite(this.rockTexture);
						this.grid[i][j] = "rock";
					}
				}

       }

				terrain.anchor.set(0.5, 0.5);
				terrain.x = Math.floor(j % this.col) * this.squareSize;
				terrain.y = Math.floor(i % this.row) * this.squareSize;
				this.container.addChild(terrain);
				this.litterArray[i][j] = null;
				this.treeArray[i][j] = 0;
			}
		}

		this.roverSprite = new RoverSprite(this.container, this.squareSize, this, this.baseX, this.baseY);
		this.droneSprite = new DroneSprite(this.row, this.col, this.grid, this.squareSize, this.container, this.litterArray, this.treeArray, this.baseX, this.baseY);
		this.phoneDrone = new PhoneDrone(this.squareSize, this.container);
		socket.emit('grid-channel', {grid: this.grid, litter: this.litterArrayLocations});
	}

	addLitter() {
		//TODO: this function gets stuck in the while loop if there's not free spot to place new litter
		do {
			var row = Math.floor(Math.random()*(this.row));
			var col = Math.floor(Math.random()*(this.col));
		}
		while ((this.litterArray[row][col] != null) || (this.grid[row][col] == "rock") || (this.grid[row][col] == "tree"));
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

	moveDrone(data) {
		this.droneSprite.moveTo(data);
	}

	movePhoneDrone(data) {
		this.phoneDrone.moveTo(data);
	}

}

function startRoutine(m) {

	console.log(m.roverSprite.posx);
	socket.emit("rover-frontEnd", {coordinates: {posx:m.roverSprite.posx, posy:m.roverSprite.posy, basex:m.baseX, basey:m.baseY},
		state: m.roverSprite.waiting, capacity:m.roverSprite.capacity, battery:m.roverSprite.battery});
	console.log("sending to the server");
  setTimeout(startRoutine, 2000, m);
}

function droneRoutine(m) {
	console.log(m.droneSprite.waiting)
	socket.emit('drone-frontEnd', {coordinates: {posx:m.droneSprite.posx, posy:m.droneSprite.posy},
		scanRadius: m.droneSprite.scanRadius, state:m.droneSprite.waiting, grid:m.grid});
		setTimeout(droneRoutine, 5000, m);
}

function updateUI(m) {
	document.getElementById("roverDisplay").innerHTML = "X: " + m.roverSprite.posx + " Y: " + m.roverSprite.posy + " Capacity: " + m.roverSprite.capacity + " | Battery Remaining: " + m.roverSprite.battery;
	document.getElementById("droneDisplay").innerHTML = "X: " + m.droneSprite.posx + " Y: " + m.droneSprite.posy;
	setTimeout(updateUI, 100, m);
}

function setButtons(mapRenderer) {
	//Linking the litter generations button to the addLitter method
	const genLitterBtn = document.getElementById("litter");
	genLitterBtn.addEventListener('click', mapRenderer.addLitter);
}

function randAddLitter(mapRenderer) {
	var timer = Math.floor(Math.random() * 20001) + 10000;
	mapRenderer.addLitter();
	setTimeout(randAddLitter, timer, mapRenderer);
}

function batteryLevel(){
	document.getElementByClassName("span_3").innerHTML = this.roverSprite.battery;
}

function main() {
	const mapRenderer = new MapRenderer(container);
	mapRenderer.drawGrid();
	// the aim is to scan the area before it starts exploration
	mapRenderer.moveDrone([[0,0]]);

	droneRoutine(mapRenderer);

	socket.on('phone', function(data) {
		console.log('received data for the phone drone');
		mapRenderer.movePhoneDrone(data);
	});

	socket.on('drone-frontEnd', function(data) {
		for (let i = 0; i < data.length; i++) {
			console.log(data[i]);
		}
		mapRenderer.moveDrone(data);
   });

	setButtons(mapRenderer);
	startRoutine(mapRenderer);
	randAddLitter(mapRenderer);
	updateUI(mapRenderer);

	socket.on('rover-frontEnd', function(data) {
		console.log(data);
		mapRenderer.moveRover(data);
	});
}

document.addEventListener('DOMContentLoaded', main);
