class RoverSprite {
	//Creates the rover sprite and adds it to the map at x:0;y:0
	constructor() {
		this.texture = PIXI.Texture.fromImage('./sprites/drone_2.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		container.addChild(this.sprite);
		this.posx = 0;
		this.posy = 0;
		this.animSpeed = 0.5 //Default
	}

	//Follows a path of nodes!
	// TODO: WORKS ONLY WITH A CONSECUTIVE NODE PATH!!
	followPath(path) {
		for (let i = 0; i < path.length; i++) {
			if (path[i].x > this.posx+1) {
				this.moveRight();
			} else if (path[i].x < this.posx) {
				this.moveLeft();
			}
			if (path[i].y > this.posy) {
				this.moveDown();
			} else if (path[i].y < this.posy) {
				this.moveUp();
			}
		}
	}

	isWalkable(x, y) {
		return grid[x][y].walkable;
	}

	moveRight() {
		if (this.isWalkable(this.posx+1, this.posy)) {
			animSprite = () => {
				this.sprite.x += this.animSpeed;
				if (this.sprite.x >= squareSize*grid[this.posx+1][this.posy].posx) {
						ticker.stop();
						this.posx += 1;
						console.log('('+this.posx+' - '+this.posy+')');
				}
			}
			ticker.start();
		} else {
			console.log("Can't go there\n");
		}
	}

	moveLeft() {
		if (this.isWalkable(this.posx-1, this.posy)) {
			animSprite = () => {
				this.sprite.x -= this.animSpeed;
				if (this.sprite.x <= squareSize*grid[this.posx-1][this.posy].posx) {
						ticker.stop();
						this.posx -= 1;
						console.log('('+this.posx+' - '+this.posy+')');
				}
			}
			ticker.start();
		} else {
			console.log("Can't go there\n");
		}
	}

	moveUp() {
		if (this.isWalkable(this.posx, this.posy-1)) {
			animSprite = () => {
				this.sprite.y -= this.animSpeed;
				if (this.sprite.y <= squareSize*grid[this.posx][this.posy-1].posy) {
						ticker.stop();
						this.posy -= 1;
						console.log('('+this.posx+' - '+this.posy+')');
				}
			}
			ticker.start();
		} else {
			console.log("Can't go there\n");
		}
	}

	moveDown() {
		if (this.isWalkable(this.posx, this.posy+1)) {
			animSprite = () => {
				this.sprite.y += this.animSpeed;
				if (this.sprite.y >= squareSize*grid[this.posx][this.posy+1].posy) {
						ticker.stop();
						this.posy += 1;
						console.log('('+this.posx+' - '+this.posy+')');
				}
			}
			ticker.start();
		} else {
			console.log("Can't go there\n");
		}
	}
}
