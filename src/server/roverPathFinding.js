//function that calculates the h for all the litters
var PF = require('pathfinding');

function pathFindingEngine(litterArrayLocations, currentLocation, grid, capacity)  {
	var shortestPath = [];
	var arrayForLoop = [];
	var length = 1000000; //for now test
	
	if (capacity == 0) {
		arrayForLoop[0] = [];
		arrayForLoop[0][0] = 1;
	}
	else {
		arrayForLoop = litterArrayLocations;
	}
	
	for (var i = 0; i < arrayForLoop.length; i++) {
		for (var j = 0; j < arrayForLoop[i].length; j++) {
			if (arrayForLoop[i][j] == 1) {
				var temp = transformGrid(grid);
				var gridCopy = new PF.Grid(temp);
				var finder = new PF.AStarFinder({
					allowDiagonal: true
				});
				var path = finder.findPath(currentLocation.x, currentLocation.y, j, i, gridCopy);
				if (path.length < length) {
					shortestPath = path;
					length = path.length;
				}
				arrayForLoop[i][j] = 0;
			}
		}
	}
	return shortestPath;
}

function transformGrid(grid) {
	var temp = [];
	for (var i = 0; i < grid.length; i++) {
		temp[i] = [];
		for (var j = 0; j < grid[i].length; j++) {
			if (grid[i][j] == "grass") {
				temp[i][j] = 0;
			} else {
				temp[i][j] = 1;
			}
		}
	}
	return temp;
}

module.exports = pathFindingEngine;
