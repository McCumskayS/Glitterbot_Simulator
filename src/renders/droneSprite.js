//Drone robot front end object handler
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

class DroneSprite {
	//Creates the rover sprite and adds it to the map at x:0;y:0
	constructor(row, column, mapGrid, squareSize, container) {
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
		this.width = row;
		this.height = column;
		//camera system parameters
		this.lens = 5;
		this.droneHeight = 4;
		this.searchLitter = this.searchLitter.bind(this);
	}

	//TODO boundry system!
	moveTo(path) {
		for (let i = 0; i < path.length; i++) {
			var targetX = path[i].posx;
			var targetY = path[i].posy;

			var distanceSquared = ((this.posx-targetX)^2) + ((this.posy-targetY)^2);
			distanceSquared = Math.abs(distanceSquared);
	    var distance = Math.sqrt(distanceSquared);
			var time = distance/this.animSpeed;
			this.droneTimeline.to(this.sprite, time, {x:this.squareSize*targetX, y:this.squareSize*targetY,
				onComplete:this.searchLitter, onCompleteParams: [this.posx, this.posy]});

			this.posx = targetX;
			this.posy = targetY;
			console.log("Drone: " +this.posx+"-"+this.posy);
		}
	}

	//A function that make the drone search litter in the surrounding area
	searchLitter(posx, posy) {
		console.log(posx+'-'+posy);
		var scanRadius = Math.sqrt((this.lens)^2 - (this.droneHeight)^2);
		for (let i = -scanRadius; i <= scanRadius; i++) {
			for (let j = -scanRadius; j <= scanRadius; j++) {
				//First check the boundary
				if (posx+i > this.width && posy+j > this.height) {
					continue;
				}
				else {
					var terrain = this.grid[posx+i][posy+j];

				}
			}
		}
	}




}
