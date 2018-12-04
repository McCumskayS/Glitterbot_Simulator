//Base terrain object, creates a terrain and adds it to the container
//Also sets the grid coordinates
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

class TerrainSprite {
	constructor() {
		//Setup
		this.squareSize = 20; //Pixels
		this.loadSprite();
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		this.posx = 0;
		this.posy = 0;
		this.walkable = true;
		this.litter = false;
	}

	loadSprite() {
		this.texture = PIXI.Texture.fromImage('./sprites/placeholder.png');
		return this.texture;
	}

	setTerrainLitter(){
		this.litter = true;
	}

	getTerrainLitter(){
		return this.litter;
	}
}
