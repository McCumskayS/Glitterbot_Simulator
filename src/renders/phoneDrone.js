/**
* This is the class that handles the PhoneDrone.
*/
class PhoneDrone {
	/**
	  * Creates a new instance of phone drone sprite and sets x = 0 and y = 0
		* @constructor
		* @param {integer} squareSize - the size of each grid square
		* @param {object} container - the pixiJS object container
		* @return {PhoneDrone} an instance of the drone
	*/
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

	/**
	* function that moves the phonedrone in a specified x and y coordinate
	* @function
	* @param {Object[]} data - an array of coordinates objects
	*/
	moveTo(position) {
		if (this.waiting) {
			this.waiting = false;
			var targetX = position.y;
			var targetY = position.x;

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
	/**
	* function that changes the waiting state to true
	* @function
	*/
	makeTrue() {
		this.waiting = true;
	}
}
