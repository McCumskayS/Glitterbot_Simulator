

class DroneSprite {
	//Creates the rover sprite and adds it to the map at x:0;y:0
	constructor(row, column, mapGrid, squareSize, container, litterArray, treeArray) {
		this.texture = PIXI.Texture.fromImage('./sprites/drone.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		this.container = container;
		this.container.addChild(this.sprite);
		this.posx = 0;
		this.posy = 0;
		this.animSpeed = 2;
		this.squareSize = squareSize;
		this.droneTimeline = new TimelineLite();
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

	}

	//TODO boundry system!
	moveTo(data) {
			// var targetX = position.coordinates.posx;
			// var targetY = position.coordinates.posy;
			//
			// var distanceSquared = ((this.posx-targetX)^2) + ((this.posy-targetY)^2);
			// distanceSquared = Math.abs(distanceSquared);
	    // var distance = Math.sqrt(distanceSquared);
			// var time = distance/this.animSpeed;
			// this.droneTimeline.to(this.sprite, time, {x:this.squareSize*targetX, y:this.squareSize*targetY,
			// 	onComplete:this.searchLitter, onCompleteParams: [this.posx, this.posy]});
			//
			// this.posx = targetX;
			// this.posy = targetY;
			// console.log("Drone: " +this.posx+"-"+this.posy);
			// this.waiting = true;
			if (this.waiting) {
				this.waiting = false;
				var path = data;
				for (var i = 0; i < path.length; i++) {
					var targetX = path[i][0];
					var targetY = path[i][1];

					var distanceSquared = ((this.posx-targetX)^2) + ((this.posy-targetY)^2);
					distanceSquared = Math.abs(distanceSquared);
			    var distance = Math.sqrt(distanceSquared);
					var time = distance/this.animSpeed;
					if (this.posx == 0 && this.posy == 0) {
						this.searchLitter(this.posx, this.posy);
					}
					this.posx = targetX;
					this.posy = targetY;

					this.droneTimeline.to(this.sprite, time, {x:this.squareSize*targetX, y:this.squareSize*targetY,
						onComplete:this.searchLitter, onCompleteParams: [this.posx, this.posy]});

					this.searchLitter(this.posx, this.posy);

					console.log("Drone: " +this.posx+"-"+this.posy);
				}
			}
	}

	//A function that make the drone search litter in the surrounding area
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
					//console.log('litter candidate location: '+(posx+i)+' '+(posy+j));
					if (this.litterArray[posy+j][posx+i] != null) {
						socket.emit('litter-channel', {x:posx+i, y:posy+j});
					}
					// check whether there is a tree
					if (this.grid[posy+j][posx+i] == "tree") {
						this.treeArray[posy+j][posx+i] = 1;
						socket.emit('treeArray', this.treeArray);
						//console.log('卡拉斯打开撒娇的撒');
					}
				}
					//console.log("scanradius i" + i + "scanradius j" + j);
			}

		}
	}



}
