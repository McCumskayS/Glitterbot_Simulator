//Rover robot front end object handler
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

class RoverSprite {
	//Creates the rover sprite and adds it to the map at the base location
	constructor(container, squareSize, mapRenderer, baseX, baseY) {
		this.texture = PIXI.Texture.fromImage('./sprites/rover.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.x = baseX * squareSize;
		this.sprite.y = baseY * squareSize;
		this.sprite.anchor.set(0.5, 0.5);
		this.container = container;
		this.mapRenderer = mapRenderer;
		this.roverTimeline = new TimelineLite();
		this.squareSize = squareSize;
		this.posx = baseX;
		this.posy = baseY;
		this.baseX = baseX;
		this.baseY = baseY;
		this.container.addChild(this.sprite);
		this.capacity = 5;
		this.animSpeed = 0.5;
		this.waiting = true;
		this.collectLitter = this.collectLitter.bind(this);
		this.battery = 1000;
		this.updateNotification = false;
	}

	//Follows a path of nodes!
	followPath(path) {
		console.log("from rover " + this.posx + this.posy);
		console.log(this.posx + this.posy);
		this.waiting = false;

		if(path.length <= 1){
			this.waiting = true;
		}

		for (let i = 1; i < path.length; i++) {
			var targetX = path[i][0];
			var targetY = path[i][1];

			console.log("battery: " + this.battery);

			this.roverTimeline.to(this.sprite, this.animSpeed,
				{x:this.squareSize*targetX, y:this.squareSize*targetY,
					onComplete:this.collectLitter, onCompleteParams: [this.posx, this.posy, targetX, targetY, path]});
		}
	}

	collectLitter(posx, posy, targetX, targetY, path){

		if(targetX == this.posx || targetY == this.posy) {
			this.battery = this.battery - 10;
		}
		else {
			this.battery = this.battery - 15;
		}

		posx = targetX;
		posy = targetY;
		this.posx = posx;
		this.posy = posy;



		if(posx === this.baseX && posy === this.baseY) {
			this.capacity = 5;
			this.battery = 1000;
		}

		if (this.capacity > 0) {
			console.log(posx+'-'+posy);
			if (this.mapRenderer.removeLitter(posx, posy)) {

				this.updateNotification = true;

				this.capacity = this.capacity - 1;
				console.log("litter collected, capacity remaining = " + this.capacity);
			}
		}
		else {
			console.log("rover full, returning to base");
		}

		if(posx == path[path.length-1][0] && posy == path[path.length-1][1])
		{
			this.waiting = true;
		}

	}

	//The functions below this line will be used by the operator in case of overriding
	//Check is rover can go over the next 'tile'
	/*isWalkable(x, y) {
		return grid[x][y].walkable;
	}

	moveRight() {
		if (this.isWalkable(this.posx+1, this.posy)) {
			this.posx += 1;
			TweenMax.to(this.sprite, this.animSpeed, {x:squareSize*grid[this.posx][this.posy].posx, onComplete:this.deleteLitter, onCompleteParams: [this.posx, this.posy]})
			console.log('('+this.posx+' - '+this.posy+')');
		} else {
			console.log("Can't go there\n");
		}
	}

	moveLeft() {
		if (this.isWalkable(this.posx-1, this.posy)) {
			this.posx -= 1;
			TweenMax.to(this.sprite, this.animSpeed, {x:squareSize*grid[this.posx][this.posy].posx, onComplete:this.deleteLitter, onCompleteParams: [this.posx, this.posy]})
			console.log('('+this.posx+' - '+this.posy+')');
		} else {
			console.log("Can't go there\n");
		}
	}

	moveUp() {
		if (this.isWalkable(this.posx, this.posy-1)) {
			this.posy -= 1;
			TweenMax.to(this.sprite, this.animSpeed, {y:squareSize*grid[this.posx][this.posy].posy, onComplete:this.deleteLitter, onCompleteParams: [this.posx, this.posy]})
			console.log('('+this.posx+' - '+this.posy+')');
		} else {
			console.log("Can't go there\n");
		}
	}

	moveDown() {
		if (this.isWalkable(this.posx, this.posy+1)) {
			this.posy += 1;
			TweenMax.to(this.sprite, this.animSpeed, {y:squareSize*grid[this.posx][this.posy].posy, onComplete:this.deleteLitter, onCompleteParams: [this.posx, this.posy]})
			console.log('('+this.posx+' - '+this.posy+')');
		} else {
			console.log("Can't go there\n");
		}
	}*/
}
