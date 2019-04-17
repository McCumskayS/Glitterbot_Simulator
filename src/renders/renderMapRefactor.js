const socket = io();
var count = 0;

/*
* Class to render front end interface and manage all front end elements.
*/

class MapRenderer {
/**
	*	Initialises the map, drones, rovers and textures for the map.
	* @constructor
	* @param {object} container - the pixiJS object container
**/

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

/**
* Draws the grid to the front end, adding rocks and trees randomly. Also makes new instances of the rover, drone and phone drone.
* @function
* @returns {2Darray} grid array and litterArrayLocations array sent to the server
**/

	drawGrid() {
		for (var i = 0; i < this.row; i++) {
			this.grid[i] = [];
			this.litterArray[i] = [];
			this.treeArray[i] = [];
			this.litterArrayLocations[i] = [];

		for (var j = 0; j < this.col; j++) {
			if (j == this.baseX && i == this.baseY) {
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
						var terrain = new PIXI.Sprite(this.rockTexture);
						this.grid[i][j] = "rock";
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

/**
* Adds litter onto a random location on the map.
* @function
* @returns {2Darray} grid array and litterArrayLocations array sent to the server
**/
	addLitter() {
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

/**
* Removes a litter at an x and y location on the grid.
* @function
* @param {integer} x - x location on the grid.
* @param {integer} y - y location on the grid.
* @returns {2Darray} grid array and litterArrayLocations array sent to the server
**/
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

/**
* Calls rover function "followPath" on the path passed in.
* @function
* @param {Object[]} path - array of coordiante objects.
**/
	moveRover(path) {
		this.roverSprite.followPath(path);
	}

	/**
	* Calls drone function "moveTo" on the path passed in.
	* @function
	* @param {Object[]} path - array of coordiante objects.
	**/
	moveDrone(data) {
		this.droneSprite.moveTo(data);
	}

	/**
	* Calls phoneDrone function "moveTo" on the path passed in.
	* @function
	* @param {Object[]} path - array of coordiante objects.
	**/
	movePhoneDrone(data) {
		this.phoneDrone.moveTo(data);
	}

}

/**
* Emits rover status to the server every 2000ms
* @function
* @param {MapRenderer} m - current instance of MapRenderer class.
**/
function startRoutine(m) {

	console.log(m.roverSprite.posx);
	socket.emit("rover-frontEnd", {coordinates: {posx:m.roverSprite.posx, posy:m.roverSprite.posy, basex:m.baseX, basey:m.baseY},
		state: m.roverSprite.waiting, capacity:m.roverSprite.capacity, battery:m.roverSprite.battery});
	console.log("sending to the server");
  setTimeout(startRoutine, 2000, m);
}

/**
* Emits drone status to the server every 5000ms
* @function
* @param {MapRenderer} m - current instance of MapRenderer class.
**/
function droneRoutine(m) {
	console.log(m.droneSprite.waiting)
	socket.emit('drone-frontEnd', {coordinates: {posx:m.droneSprite.posx, posy:m.droneSprite.posy},
		scanRadius: m.droneSprite.scanRadius, state:m.droneSprite.waiting, grid:m.grid});
		setTimeout(droneRoutine, 5000, m);
}

/**
* Updates the UI whenever called.
* @function
* @param {MapRenderer} m - current instance of MapRenderer class.
**/
function updateUI(m) {
	document.getElementById("roverDisplay").innerHTML = "X: " + m.roverSprite.posx + " Y: " + m.roverSprite.posy + " Capacity: " + m.roverSprite.capacity + " | Battery Remaining: " + m.roverSprite.battery;
	document.getElementById("droneDisplay").innerHTML = "X: " + m.droneSprite.posx + " Y: " + m.droneSprite.posy;
	setTimeout(updateUI, 100, m);
}

/**
* Setup for the litter button so that it adds a litter whenever it is clicked.
* @function
* @param {MapRenderer} mapRenderer - current instance of MapRenderer class.
**/
function setButtons(mapRenderer) {
	//Linking the litter generations button to the addLitter method
	const genLitterBtn = document.getElementById("litter");
	genLitterBtn.addEventListener('click', mapRenderer.addLitter);
}

/**
* Randomly adds litter onto the map at a random time.
* @function
* @param {MapRenderer} mapRenderer - current instance of MapRenderer class.
**/
function randAddLitter(mapRenderer) {
	var timer = Math.floor(Math.random() * 20001) + 10000;
	mapRenderer.addLitter();
	setTimeout(randAddLitter, timer, mapRenderer);
}

/**
* Setup for the rover battery levels to be displayed on frontend.
* @function
**/
function batteryLevel(){
	document.getElementByClassName("span_3").innerHTML = this.roverSprite.battery;
}

/**
* Main function that is called before everything else. Calls all the apppriote methods to display all front end elements on screen and
* sets up all socket listeners to handle any emits from the server.
* @function
**/
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
