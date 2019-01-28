//Rover robot front end object handler
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

class RoverSprite {
	//Creates the rover sprite and adds it to the map at x:0;y:0
	constructor() {
		this.texture = PIXI.Texture.fromImage('./sprites/rover.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		container.addChild(this.sprite);
		//posx, posy are the grid coordinates (To not confuse with x and y, which are the sprite coordinates)
		//TODO change into gridx, gridy in future
		this.posx = 0;
		this.posy = 0;
		this.animSpeed = 0.5 //Default
	}

	//Follows a path of nodes!
	followPath(path) {
		for (let i = 0; i < path.length; i++) {
			var targetX = path[i].posx;
			var targetY = path[i].posy;
			this.posx = targetX;
			this.posy = targetY;
			roverTimeline.to(this.sprite, this.animSpeed, {x:squareSize*targetX, y:squareSize*targetY, onComplete:this.deleteLitter, onCompleteParams: [this.posx, this.posy]});
		}
	}

	deleteLitter(posx, posy){
		var terrain;
		var litter;
		terrain = grid[posx][posy];
		//TODO fix posx and posy
		console.log(posx);
		console.log(posy);
		if(terrain.getTerrainLitter() == true)
		{
			console.log("found litter");
			litter = litterArray[posx][posy];
			container.removeChild(litter);
			terrain.setTerrainLitter(false);
		}
	}

	//The functions below this line will be used by the operator in case of overriding
	//Check is rover can go over the next 'tile'
	isWalkable(x, y) {
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
	}
}
