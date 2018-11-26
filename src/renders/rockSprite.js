class RockSprite extends TerrainSprite {
	constructor() {
		super();
		this.walkable = false;
	}

	//Ovveride
	loadSprite() {
		this.texture = PIXI.Texture.fromImage('./sprites/rock.png');
		return this.texture;
	}
}
