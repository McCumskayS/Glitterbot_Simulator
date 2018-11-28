class RoverSprite {
	//Creates the rover sprite and adds it to the map at x:0;y:0
	constructor() {
		this.texture = PIXI.Texture.fromImage('./sprites/rover.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		container.addChild(this.sprite);
		this.posx = 0;
		this.posy = 0;
		this.animSpeed = 0.5 //Default
	}

	//Follows a path of nodes!
	followPath(path) {
		for (let i = 0; i < path.length; i++) {
			if (path[i].posx > this.posx) {
				roverTimeline.to(this.sprite, this.animSpeed, {x:squareSize*grid[this.posx+1][this.posy].posx})
				this.posx += 1;
				console.log('('+this.posx+' - '+this.posy+')');
			} else if (path[i].posx < this.posx) {
				roverTimeline.to(this.sprite, this.animSpeed, {x:squareSize*grid[this.posx-1][this.posy].posx})
				this.posx -= 1;
				console.log('('+this.posx+' - '+this.posy+')');
			}
			if (path[i].posy > this.posy) {
				roverTimeline.to(this.sprite, this.animSpeed, {y:squareSize*grid[this.posx][this.posy+1].posy})
				this.posy += 1;
				console.log('('+this.posx+' - '+this.posy+')');
			} else if (path[i].posy < this.posy) {
				roverTimeline.to(this.sprite, this.animSpeed, {y:squareSize*grid[this.posx][this.posy-1].posy})
				this.posy -= 1;
				console.log('('+this.posx+' - '+this.posy+')');
			}
		}
	}

	isWalkable(x, y) {
		return grid[x][y].walkable;
	}

	moveRight() {
		if (this.isWalkable(this.posx+1, this.posy)) {
			TweenMax.to(this.sprite, this.animSpeed, {x:squareSize*grid[this.posx+1][this.posy].posx})
			this.posx += 1;
			console.log('('+this.posx+' - '+this.posy+')');
		} else {
			console.log("Can't go there\n");
		}
	}

	moveLeft() {
		if (this.isWalkable(this.posx-1, this.posy)) {
			TweenMax.to(this.sprite, this.animSpeed, {x:squareSize*grid[this.posx-1][this.posy].posx})
			this.posx -= 1;
			console.log('('+this.posx+' - '+this.posy+')');
		} else {
			console.log("Can't go there\n");
		}
	}

	moveUp() {
		if (this.isWalkable(this.posx, this.posy-1)) {
			TweenMax.to(this.sprite, this.animSpeed, {y:squareSize*grid[this.posx][this.posy-1].posy})
			this.posy -= 1;
			console.log('('+this.posx+' - '+this.posy+')');
		} else {
			console.log("Can't go there\n");
		}
	}

	moveDown() {
		if (this.isWalkable(this.posx, this.posy+1)) {
			TweenMax.to(this.sprite, this.animSpeed, {y:squareSize*grid[this.posx][this.posy+1].posy})
			this.posy += 1;
			console.log('('+this.posx+' - '+this.posy+')');
		} else {
			console.log("Can't go there\n");
		}
	}
}
