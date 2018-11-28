class TerrainSprite {
	constructor() {
		//Setup
		this.squareSize = 20; //Pixels
		this.loadSprite();
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		container.addChild(this.sprite);
		this.posx = 0;
		this.posy = 0;

		//Fields
		this.walkable = true;
	}

	loadSprite() {
		this.texture = PIXI.Texture.fromImage('./sprites/square_1.png');
		return this.texture;
	}

	getPositionX() {
		return this.posx;
	}

	getPositionY() {
		return this.posy;
	}
}
