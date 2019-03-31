function calculateWidth(startPos, endPos, maxX) {
	let width = Math.abs((endPos.long - startPos.long)) / maxX
	return width
}

function calculateHeight(startPos, endPos, maxY) {
	let height = Math.abs((endPos.lat - startPos.lat)) / maxY
	return height
}

module.exports = {calculateWidth, calculateHeight}
