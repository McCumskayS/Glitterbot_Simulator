//Drone robot front end object handler
//Authors: Zain Ali, Asad Mahmood
//Date: 21/11/2018

class DroneSprite {
	//Creates the rover sprite and adds it to the map at x:0;y:0
	constructor() {
		this.texture = PIXI.Texture.fromImage('./sprites/drone.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		container.addChild(this.sprite);
		this.posx = 0;
		this.posy = 0;
		this.animSpeed = 2 //Default
	}

	//TODO boundry system!
	//TODO Send updates to server after movement
	moveTo(targetX, targetY) {
		var distanceSquared = ((this.posx-targetX)^2) + ((this.posy-targetY)^2);
		distanceSquared = Math.abs(distanceSquared);
    var distance = Math.sqrt(distanceSquared);
		var time = distance/this.animSpeed;
		droneTimeline.to(this.sprite, time, {x:squareSize*targetX, y:squareSize*targetY});
		this.posx = targetX;
		this.posy = targetY;
		console.log("Drone: " +this.posx+"-"+this.posy);
	}
}
