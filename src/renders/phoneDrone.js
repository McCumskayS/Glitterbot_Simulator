class PhoneDrone {
	//Creates the rover sprite and adds it to the map at x:0;y:0
	constructor(squareSize, container) {
		this.texture = PIXI.Texture.fromImage('./sprites/phone_drone.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		this.container = container;
		this.container.addChild(this.sprite);
		this.posx = 0;
		this.posy = 0;
		this.animSpeed = 2;
		this.squareSize = squareSize;
		this.phoneDroneTimeline = new TimelineLite();
		this.waiting = true;

		this.moveTo = this.moveTo.bind(this);
		this.makeTrue = this.makeTrue.bind(this);
	}

	//TODO boundry system!
	moveTo(position) {
		if (this.waiting) {
			this.waiting = false;
			var targetX = position.x;
			var targetY = position.y;

			var distanceSquared = ((this.posx-targetX)^2) + ((this.posy-targetY)^2);
			distanceSquared = Math.abs(distanceSquared);
	    var distance = Math.sqrt(distanceSquared);
			var time = distance/this.animSpeed;
			this.phoneDroneTimeline.to(this.sprite, time, {x:this.squareSize*targetX, y:this.squareSize*targetY,
				onComplete: this.makeTrue});

			this.posx = targetX;
			this.posy = targetY;
			console.log("Drone: " +this.posx+"-"+this.posy);
		}
	}

	makeTrue() {
		this.waiting = true;
	}
}
