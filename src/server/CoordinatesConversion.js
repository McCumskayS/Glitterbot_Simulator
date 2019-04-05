function calculateWidth(startPos, endPos, maxX) {
	console.log("Endpos long " + endPos.long + " - Startpos Long " + startPos.long + " - Maxmimum X " + maxX);
	let width = Math.abs((endPos.long - startPos.long)) / maxX
	console.log("NOTICE ME SENPAI!!!! WIDTH " + width);
	return width
}

function calculateHeight(startPos, endPos, maxY) {
	let height = Math.abs((endPos.lat - startPos.lat)) / maxY
	console.log("NOTICE MY HEIGHT SENPAI!!!! " + height);
	return height
}

function mapOnGrid(startPos, pos, width, height) {
	let deltaX = Math.abs(pos.longitude - startPos.long)
	let deltaY = Math.abs(pos.latitude - startPos.lat)
	deltaX = deltaX / width
	deltaY = deltaY / height
	console.log(deltaX + " - " + deltaY)
}

module.exports = {calculateWidth, calculateHeight, mapOnGrid}
