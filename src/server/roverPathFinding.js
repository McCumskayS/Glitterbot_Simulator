//function that calculates the h for all the litters
var PF = require('pathfinding');

function pathFindingEngine(litterArrayLocations, currentLocation, grid, capacity, baseX, baseY)  {
	var shortestPath = [];
	var length = 1000000; //for now test
	
	if (capacity == 0) {
		for (var k = 0; k < litterArrayLocations.length; k++) {
			for (var l = 0; l < litterArrayLocations[k].length; l++) {
				if(k == baseY && l == baseX) {
					litterArrayLocations[k][l] = 1;
				}
				else {
					litterArrayLocations[k][l] = 0;
				}
			}
		}
	}
	
	
	for (var i = 0; i < litterArrayLocations.length; i++) {
		for (var j = 0; j < litterArrayLocations[i].length; j++) {
			if (litterArrayLocations[i][j] == 1) {
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
				litterArrayLocations[i][j] = 0;
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
			if (grid[i][j] == "grass" || grid[i][j] == "base") {
				temp[i][j] = 0;
			} else {
				temp[i][j] = 1;
			}
		}
	}
	return temp;
}

module.exports = pathFindingEngine;
