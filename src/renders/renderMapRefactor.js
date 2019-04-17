const socket = io();

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
		this.addLitter = this.addLitter.bind(this);
		this.drawGrid = this.drawGrid.bind(this);
		this.removeLitter = this.removeLitter.bind(this);
		this.moveDrone = this.moveDrone.bind(this);		
	}

	drawGrid() {
		for (var i = 0; i < this.row; i++) {
			this.grid[i] = [];
			this.litterArray[i] = [];
			this.litterArrayLocations[i] = [];
			for (var j = 0; j < this.col; j++) {
				if(j == this.baseX && i == this.baseY) {
					var terrain = new PIXI.Sprite(this.baseTexture);
					this.grid[i][j] = "base";
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
				terrain.anchor.set(0.5, 0.5);
				terrain.x = Math.floor(j % this.col) * this.squareSize;
				terrain.y = Math.floor(i % this.row) * this.squareSize;
				this.container.addChild(terrain);
				this.litterArray[i][j] = null;
				this.litterArrayLocations[i][j] = 0;//no litter
			}
		}
		this.roverSprite = new RoverSprite(this.container, this.squareSize, this, this.baseX, this.baseY);
		this.droneSprite = new DroneSprite(this.squareSize, this.container, this.baseX, this.baseY);
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

	moveDrone(x, y) {
		this.droneSprite.moveTo(x, y);
	}
}

function startRoutine(m) {
	console.log(m.roverSprite.posx);
	socket.emit("rover-frontEnd", {coordinates: {posx:m.roverSprite.posx, posy:m.roverSprite.posy, basex:m.baseX, basey:m.baseY},
		state: m.roverSprite.waiting, capacity:m.roverSprite.capacity, battery:m.roverSprite.battery});
	console.log("sending to the server");
	setTimeout(startRoutine, 5000, m);
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
	console.log
}

function dragStart(event) {
	this.parent.interactive = false;
		this.data = event.data;
		this.dragging = true;
}
function dragEnd() {
		this.dragging = false;
		this.data = null;
		this.parent.interactive = true;
}
function dragMove() {
		if (this.dragging)
		{
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x;
			this.position.y = newPosition.y;
		}
}

function addDraggableLitter(m) {
		var litter = new PIXI.Sprite(m.litterTexture);
		litter.interactive = true;
		litter.buttonMode = true;
		litter.anchor.set(0.5, 0.5);
		litter
			.on('mousedown', dragStart)
			.on('touchstart', dragStart)
			.on('mouseup', dragEnd)
			.on('mouseupoutside', dragEnd)
			.on('touchend', dragEnd)
			.on('touchendoutside', dragEnd)
			.on('mousemove', dragMove)
			.on('touchmove', dragMove);
		litter.x = -1 * m.squareSize;
		litter.y = m.squareSize;
		m.container.addChild(litter);
	}

function main() {
	const mapRenderer = new MapRenderer(container);
	mapRenderer.drawGrid();
	setButtons(mapRenderer);
	addDraggableLitter(mapRenderer);
	startRoutine(mapRenderer);
	randAddLitter(mapRenderer);
	updateUI(mapRenderer);

	socket.on('rover-frontEnd', function(data) {
		console.log(data);
		mapRenderer.moveRover(data);
	});

}

document.addEventListener('DOMContentLoaded', main);
