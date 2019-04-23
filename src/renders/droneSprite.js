/**
* This is the Drone Sprite Class
*/
class DroneSprite {
	/**
	  *	Creates the drone sprite and adds it to the map at x:0 y:0
		* @constructor
		* @param {integer} row - the number of rows of the map where the drone will be placed
		* @param {integer} column - the number of columns of the map where the drone will be placed
		* @param {2Darray} mapGrid - the 2D array that rapresents the map
		* @param {number} squareSize - the size of each cell of the map in pixels
		* @param {object} container - the pixiJS object container
		* @param {2Darray} litterArray - the 2D array that holds the positions of the litters
		* @param {2Darray} treeArray - the 2D array that holds the positiions of the trees
		* @param {integer} baseX - this X location of the base on the map
		* @param {integer} baseY - this Y location of the base on the map
		* @return {DroneSprite} an instance of the drone
	*/
	constructor(row, column, mapGrid, squareSize, container, litterArray, treeArray, baseX, baseY) {
		this.texture = PIXI.Texture.fromImage('./sprites/drone.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.x = baseX * squareSize;
		this.sprite.y = baseY * squareSize;
		this.sprite.anchor.set(0.5, 0.5);
		this.container = container;
		this.container.addChild(this.sprite);
		this.posx = baseX;
		this.posy = baseY;
		this.animSpeed = 2;
		this.squareSize = squareSize;
		this.droneTimeline = new TimelineLite();
		this.battery = 100;
		//add new parameters
		this.grid = mapGrid;
		this.width = column;
		this.height = row;
		//camera system parameters
		this.lens = 5;
		this.droneHeight = 4;
		this.scanRadius = 5;
		this.litterArray = litterArray;
		this.treeArray = treeArray;
		this.searchLitter = this.searchLitter.bind(this);
		this.waiting = true;
		this.landed = false;
	}

	/**
	* function that moves the rover in a specified x and y coordiante
	* @function
	* @param {Object[]} data - an array of coordinates objects
	*/
	moveTo(data) {
			if (this.waiting && this.landed == false) {
				this.waiting = false;
				var path = data;
				for (var i = 0; i < path.length; i++) {
					var targetX = path[i][0];
					var targetY = path[i][1];

					var distanceSquared = ((this.posx-targetX)^2) + ((this.posy-targetY)^2);
					distanceSquared = Math.abs(distanceSquared);
			    var distance = Math.sqrt(distanceSquared);
					if (this.posx == 0 && this.posy == 0) {
						this.searchLitter(this.posx, this.posy);
					}
					this.posx = targetX;
					this.posy = targetY;
					this.droneTimeline.to(this.sprite, 1/this.animSpeed, {x:this.squareSize*targetX, y:this.squareSize*targetY});

					this.searchLitter(this.posx, this.posy);

					console.log("Drone: " +this.posx+"-"+this.posy);
				}
			}
	}

/**
* function that searches the surroundings of the drone for any litter and trees.
* @function
* @param {integer} posx - x position of the drone.
* @param {integer} posy - y position of the drone.
* @returns {(2Darray|integer|integer)} updated treeArray if tree is found or x and y positions of the litter if litter is found.
*/
	searchLitter(posx, posy) {
		//testting waiting boolean
		this.waiting = true;
		console.log(posx+'-'+posy);
		for (let i = -this.scanRadius; i <= this.scanRadius; i++) {
			for (let j = -this.scanRadius; j <= this.scanRadius; j++) {
				//First check the boundary
				if (posx+i >= this.width || posy+j >= this.height || posx+i < 0 || posy+j < 0) {
					continue;
				}
				else {
					//check whether there is a litter in the terrain
					if (this.litterArray[posy+j][posx+i] != null) {
						socket.emit('litter-channel', {x:posx+i, y:posy+j});
						//console.log('litter candidate location: '+(posx+i)+' '+(posy+j));
					}
					// check whether there is a tree
					if (this.grid[posy+j][posx+i] == "tree") {
						this.treeArray[posy+j][posx+i] = 1;
						socket.emit('treeArray', this.treeArray);
					}
				}
			}
		}
	}
}
