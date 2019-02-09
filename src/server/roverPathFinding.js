//function that calculates the h for all the litters
function pathFindingEngine(litterArrayLocations, currentLocation, grid)  {
	console.log(litterArrayLocations.length);
	console.log(currentLocation);
	for (var i = 0; i < litterArrayLocations.length; i++) {
		//calculate heuristic
		var h = Math.sqrt(Math.pow((currentLocation.x - litterArrayLocations[i].x), 2)+
											Math.pow((currentLocation.y - litterArrayLocations[i].y), 2));
		console.log(h);
		//for each heuristic calcualte path
		aStar(h, grid, currentLocation);
		//return node array
		//this function then should return smalles node of path
	}
}

function aStar() {
	//open list
	var openList  = [];
	//closed list
	var closedList = [];
	//
}

module.exports = pathFindingEngine;
