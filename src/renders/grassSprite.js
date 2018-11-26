class GrassSprite extends TerrainSprite {
	constructor() {
		super();
	}

	//Ovveride
	loadSprite() {
		this.texture = PIXI.Texture.fromImage('./sprites/grass.png');
		return this.texture;
	}
}
