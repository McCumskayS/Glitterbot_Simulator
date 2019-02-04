//Litter terrain object (front end)
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

class LitterSprite{
	constructor(squareSize){
		this.squareSize = squareSize; //Pixels
		this.loadSprite();
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
	}

	loadSprite() {
		this.texture = PIXI.Texture.fromImage('./sprites/litter.png');
		return this.texture;
	}
}
