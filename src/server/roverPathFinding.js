//function that calculates the h for all the litters
var PF = require('pathfinding');

function pathFindingEngine(litterArrayLocations, currentLocation, grid, gridCoordinates)  {
	var shortestPath = [];
	var length = 1000000; //for now test
	for (var i = 0; i < litterArrayLocations.length; i++) {
		for (var j = 0; j < litterArrayLocations[i].length; j++) {
			if (litterArrayLocations[i][j] == 1) {
				var temp = transformGrid(grid, gridCoordinates);
				var gridCopy = new PF.Grid(temp);
				var finder = new PF.AStarFinder({
					allowDiagonal: true
				});
				var path = finder.findPath(currentLocation.x, currentLocation.y, j, i, gridCopy);
				if (path.length < length) {
					shortestPath = path;
					length = path.length;
				}
				//litterArrayLocations[i][j] = 0;
			}
		}
	}

	return shortestPath;
}

function transformGrid(grid, gridCoordinates) {
	var temp = [];
	for (var i = 0; i < grid.length; i++) {
		temp[i] = [];
		for (var j = 0; j < grid[i].length; j++) {
			if (grid[i][j] == "grass") {
				temp[i][j] = 0;
			} else {
				temp[i][j] = 1;
			}
			if(j == gridCoordinates.x && i == gridCoordinates.y){
				temp[i][j] = 1;
			}
		}
	}
	return temp;
}

module.exports = pathFindingEngine;
