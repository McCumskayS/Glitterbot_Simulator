//Rover robot front end object handler
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

class RoverSprite {
	//Creates the rover sprite and adds it to the map at x:0;y:0
	constructor(container, squareSize, mapRenderer) {
		this.texture = PIXI.Texture.fromImage('./sprites/rover.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		this.container = container;
		this.mapRenderer  = mapRenderer;
		this.roverTimeline = new TimelineLite();
		this.squareSize = squareSize;
		this.container.addChild(this.sprite);
		this.posx = 0;
		this.posy = 0;
		this.animSpeed = 0.5;
		this.waiting = true;
		this.collectLitter = this.collectLitter.bind(this);
	}

	//Follows a path of nodes!
	followPath(path) {
		this.waiting = false;
		for (let i = 0; i < path.length; i++) {
			var targetX = path[i][0];
			var targetY = path[i][1];
			this.posx = targetX;
			this.posy = targetY;
			this.roverTimeline.to(this.sprite, this.animSpeed,
				{x:this.squareSize*targetX, y:this.squareSize*targetY,
					onComplete:this.collectLitter, onCompleteParams: [this.posx, this.posy]});
		}
		this.waiting = true;
	}

	collectLitter(posx, posy){
		console.log(posx+'-'+posy);
		if (this.mapRenderer.removeLitter(posx, posy)) {
			console.log("litter collected");
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
