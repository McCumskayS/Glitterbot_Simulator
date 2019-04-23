/**
* js file that handles all PhoneDrone conversions.
*/

/**
* Calculates the width of the grid depending on start and end position of the PhoneDrone
* @function
* @param {Integer} startPos - start position of the PhoneDrone.
* @param {Integer} endPos - end position of the PhoneDrone.
* @param {Integer} maxX - maximum width of the grid.
*/
function calculateWidth(startPos, endPos, maxX) {
	let width = Math.abs((endPos.long - startPos.long)) / maxX
	return width
}

/**
* Calculates the height of the grid depending on start and end position of the PhoneDrone
* @function
* @param {Integer} startPos - start position of the PhoneDrone.
* @param {Integer} endPos - end position of the PhoneDrone.
* @param {Integer} maxY - maximum height of the grid.
* @returns {integer} calculated width.
*/
function calculateHeight(startPos, endPos, maxY) {
	let height = Math.abs((endPos.lat - startPos.lat)) / maxY
	return height
}

/**
* Calculates the current x and y of the PhoneDrone depending on its longitude and latitude values.
* @function
* @param {Integer} startPos - start position of the PhoneDrone.
* @param {Integer} pos - end position of the PhoneDrone.
* @param {Integer} width - width of the grid.
* @param {Integer} height - height of the grid.
* @returns {Object} calculated width and height.
*/
function mapOnGrid(startPos, pos, width, height) {
	let deltaX = Math.abs(pos.long - startPos.long)
	let deltaY = Math.abs(pos.lat - startPos.lat)
	deltaX = deltaX / width
	deltaY = deltaY / height
	console.log(deltaX + " - " + deltaY)
	return {x: deltaX, y: deltaY}
}

module.exports = {calculateWidth, calculateHeight, mapOnGrid}
