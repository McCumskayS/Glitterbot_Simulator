//Grass terrain object (front end)
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

class GrassSprite extends TerrainSprite {
	constructor() {
		super();
		this.type = "Grass";
	}

	//Ovveride
	loadSprite() {
		this.texture = PIXI.Texture.fromImage('./sprites/grass.png');
		return this.texture;
	}
}
