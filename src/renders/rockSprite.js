//Rock terrain object (front end)
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

class RockSprite extends TerrainSprite {
	constructor() {
		super();
		this.walkable = false;
		this.type = "Rock";
	}

	//Ovveride
	loadSprite() {
		this.texture = PIXI.Texture.fromImage('./sprites/rock.png');
		return this.texture;
	}
}
