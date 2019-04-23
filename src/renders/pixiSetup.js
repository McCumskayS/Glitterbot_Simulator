PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
const container = new PIXI.Container();
const app = new PIXI.Application({
		width: 800,
		height: 400,
		antialias: false,
		transparent: true,
		resolution: 1,
		view: document.getElementById("map-canvas"),
		backgroundColor : 0x1099bb,
});
app.renderer.autoResize = true;
app.stage.addChild(container);
container.pivot.x = container.width/2;
container.pivot.y = container.height/2;
container.x = 10;
container.y = 10;
container.interactive = true;
container
			 .on('pointerdown', onDragStart)
			 .on('pointerup', onDragEnd)
			 .on('pointerupoutside', onDragEnd)
			 .on('pointermove', onDragMove);


/**
	* This function handles the beginning of the drag for the map
	* @function
	* @param {event} event - the mouse event on screen
*/
function onDragStart(event) {
	this.data = event.data;
	var position = this.data.getLocalPosition(this);
	this.pivot.set(position.x, position.y)
		//keep this in case stuff breaks
		//this.position.set(position.x, position.y)
	this.dragging = true;
}

/**
	* This function handles what happens when the drag ends
	* @function
*/
function onDragEnd() {
	document.body.style.cursor = 'auto';
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
}

/**
	* This function handles what happens during the drag
	* @function
*/
function onDragMove() {
	if (this.dragging) {
		document.body.style.cursor = 'move';
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.set(newPosition.x, newPosition.y);
	}
}
