function calculateWidth(startPos, endPos, maxX) {
	let width = Math.abs((endPos.long - startPos.long)) / maxX
	return width
}

function calculateHeight(startPos, endPos, maxY) {
	let height = Math.abs((endPos.lat - startPos.lat)) / maxY
	return height
}

function mapOnGrid(startPos, pos, width, height) {
	let deltaX = Math.abs(pos.long - startPos.long)
	let deltaY = Math.abs(pos.lat - startPos.lat)
	deltaX = deltaX / width
	deltaY = deltaY / height
	console.log(deltaX + " - " + deltaY)
}

module.exports = {calculateWidth, calculateHeight, mapOnGrid}
