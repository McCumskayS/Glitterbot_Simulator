//function that calculates the h for all the litters
var PF = require('pathfinding');

function pathFindingEngine(litterArrayLocations, currentLocation, grid, gridCoordinates, capacity, baseX, baseY, battery)  {
	var shortestPath = [];
	var length = 1000000; //for now test
	var foundPath = 0;

	if (capacity == 0) {
		var temp = transformGrid(grid, gridCoordinates);
		var gridCopy = new PF.Grid(temp);
		var finder = new PF.AStarFinder({
					allowDiagonal: true
				});
		return(finder.findPath(currentLocation.x, currentLocation.y, baseX, baseY, gridCopy));
	}


	for (var i = 0; i < litterArrayLocations.length; i++) {
		for (var j = 0; j < litterArrayLocations[i].length; j++) {
			if (litterArrayLocations[i][j] == 1) {
				console.log('阿什顿就撒的：'+ gridCoordinates.x);
				var temp = transformGrid(grid, gridCoordinates);

				var gridCopy = new PF.Grid(temp);
				var finder = new PF.AStarFinder({
					allowDiagonal: true
				});
				var path = finder.findPath(currentLocation.x, currentLocation.y, j, i, gridCopy);
				var gridBatteryCopy = new PF.Grid(temp);

				if (path.length < length) {
					console.log("j val : " + j + " i val: " + i + " base x : " + baseX + " base y : " + baseY);
					var basePath = finder.findPath(j, i, baseX, baseY, gridBatteryCopy);
					var	batteryToBase = pathBatteryUse(basePath);
					if ((batteryToBase + pathBatteryUse(path)) <= battery) {
						shortestPath = path;
						length = path.length;
						foundPath = 1;
					}
				}

				litterArrayLocations[i][j] = 0;

		}
		}
	}
	if (foundPath == 0) {
		var temp = transformGrid(grid, gridCoordinates);
		var gridCopy = new PF.Grid(temp);
		var finder = new PF.AStarFinder({
					allowDiagonal: true
				});
		return(finder.findPath(currentLocation.x, currentLocation.y, baseX, baseY, gridCopy));
	} else {
		return shortestPath;
	}
}

function transformGrid(grid, gridCoordinates) {
	var temp = [];
	for (var i = 0; i < grid.length; i++) {
		temp[i] = [];
		for (var j = 0; j < grid[i].length; j++) {
			if (grid[i][j] == "grass" || grid[i][j] == "base") {
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

function pathBatteryUse(path) {
	var batteryUse = 0;
	for (var i = 1; i < path.length; i++) {
		var x = path[i][0];
		var y = path[i][1];
		var prevX = path[i-1][0];
		var prevY = path[i-1][1];
		if(x == prevX || y == prevY) {
			batteryUse = batteryUse + 10
		}
		else {
			batteryUse = batteryUse + 15;
		}
	}
	return batteryUse;
}

module.exports = pathFindingEngine;
