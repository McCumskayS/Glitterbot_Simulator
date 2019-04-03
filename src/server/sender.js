const engine = require('./roverPathFinding.js')
const droneEngine = require('./dronePathFinding.js')

var scanRadius = 0;
var grid = [];
// 0 for left and 1 for right
var direction = 'right'
var prevDirection = 'left'
var treeArray = [];

var utilityArray = [];

var litterArrayLocations = [];
var roverX;
var roverY;
var width;
var height;

var count = 0;

function sender(io) {

	// test to know whtat the AStar function returns if failing to move to the target
	// var PF = require('pathfinding');
	// var Grid = new PF.Grid(5,5);
	// for (var i = 0; i < 5; i++) {
	// 	Grid.setWalkableAt(i, 3, false);
	// }
	// var finder = new PF.AStarFinder({
	// 	allowDiagonal: false
	// });
	//
	// var path = finder.findPath(0, 0, 4, 4, Grid);
	// console.log('what the function would return failure: '+path.length);

	 // var set = [[1,2], [3,4], [5,6], [7,8]];
	 // console.log(set[0][0]);

	//When a client connect display message on console


	io.on('connection', function(socket){
	  console.log('a user connected');

		socket.on('rover-frontEnd', function(data) {

			roverX = data.coordinates.posx;
			roverY = data.coordinates.posy;
			var path = engine(litterArrayLocations, {x:roverX, y:roverY}, grid);
			//console.log(path);
			if (data.state != false) {
				socket.emit('rover-frontEnd', path);
			}
		});

    socket.on('grid-channel', function(data) {
			grid = data.grid;
			litterArrayLocations = data.litter;
			height = grid.length;
		//	console.log('the height of the grid: '+grid.length);
			width = grid[0].length;
		//	console.log('the width of the grid: '+grid[0].length);

			// initialize the utilityArray for the first time it sends the information of grid map
			if (count == 0) {
				treeArray = initializeTreeArray();
				createUtility();
				// initialize the grid map
				// grid = droneEngine.initialisation(height, width);
				console.log('successfully initialize grid');
				count = 2;
			}
		});

		// copy tre array from front end to back end
		socket.on('treeArray', function(data) {
			treeArray = data.slice();
			// console.log('tree array updated: '+treeArray);
		});

		//receive the location of the drone and send back the path
		socket.on('drone-frontEnd', function(data) {
			// console.log(data.state)
			// console.log(data.coordinates.posx+"-"+data.coordinates.posy);
			scanRadius = data.scanRadius;
			// console.log('scan radius: ' + scanRadius);

			// var newdata = routinePath(data.coordinates.posx, data.coordinates.posy, scanRadius, direction, prevDirection);
			// direction = newdata.direction;
			// prevDirection = newdata.prevDirection;
			// if (data.state != false){
			// 	socket.emit('drone-frontEnd', newdata);
			// }

			var targets = checkTrees(data.coordinates.posx, data.coordinates.posy, scanRadius);
			console.log('the length of targets array: '+ targets.length);

			var currentLocation = {x: data.coordinates.posx, y: data.coordinates.posy};
			//console.log('before engine check the length: '+grid.length);
			var newdata = droneEngine.engine(currentLocation, targets, grid, direction);
			direction = newdata.direction;
			var path = newdata.path;

			console.log('the length of the drone path is: '+path.length);

			if (data.state != false) {
				socket.emit('drone-frontEnd', path);
			}
		});

		// receive
		socket.on('litter-channel', function(data) {
			//console.log('x:'+data.x+'  y:'+data.y);
		});


  });
}

function createUtility() {
	for (var i = 0; i < height; i++) {
		utilityArray[i] = 0;
		for (var j = 0; j < width; j++) {
			if (grid[i][j] == 'tree') {
				utilityArray[i][j] = -1;
			} else {
				utilityArray[i][j] = 0;
			}
		}
	}
}

// move drone to the next position
// returns both the path to the target and updated grid
function moveDrone(posx, posy) {
	// check trees
	var targets = checkTrees(posx, posy, scanRadius);
	if (targets.length != 0) {
		currentLocation = {x: posx, y: posy};
		var data = droneEngine.pathFindingEngine(treeArray, currentLocation, target, grid, direction);
		return data;
	} else {
		// start using utility function to set new target
	}

}

// a function that checks the scanning area and returns positions that can be the target
function checkTrees(posx, posy, scanRadius) {
	var targets = [];
	console.log('print tree array before check trees: \n');
	for (var i = 0; i < treeArray.length; i++) {
		console.log(treeArray[i]+'\n');
	}
	//console.log('print tree array before check trees: \n'+ treeArray);
	for (var i = -scanRadius; i <= scanRadius; i++) {
		for (var j = -scanRadius; j <= scanRadius; j++) {
			if (posx+i >= width || posy+j >= height || posx+i < 0 || posy+j < 0) {
					continue;
			} else if (treeArray[posy+j][posx+i] != 1) {
				targets.push([posx+i,posy+j]);

				console.log('the target x: '+(posx+i)+'  the target y: '+(posy+j));
			}
		}
	}

	return targets;
}

 //initialize treeArray to be a 2D array/
 function initializeTreeArray() {
 	var trees = [];
 	var treesArray = [];
 	for (var j = 0; j < height; j++) {
 		trees[j] = 0;
 	}
 	for (var i = 0; i < width; i++) {
 		treesArray[i] = trees;
 	}
 	return treesArray;
 }

// function routinePath(posx, posy, scanRadius, direction, prevDirection) {
//
// 	console.log('from server: '+posx+'-'+posy);
// 	var currentX = posx;
// 	var currentY = posy;
// 	var movement = scanRadius
//
// 	if (direction === 'right') {
// 		if ((width - currentX) >= movement) {
// 			currentX += movement
// 		} else {
// 			currentX = width
// 			direction = 'down'
// 			prevDirection = 'right'
// 		}
// 	}
// 	else if (direction === 'down') {
// 		if (currentY === height) {
// 			direction = 'right'
// 			prevDirection = 'left'
// 			currentX = 0
// 			currentY = 0
// 		} else if ((height - currentY) >= movement) {
// 			currentY += movement
// 			if (prevDirection === 'right') {
// 				direction = 'left'
// 			} else {
// 				direction = 'right'
// 			}
// 		} else {
// 			currentY = height
// 		}
// 	}
// 	else if (direction == 'left') {
// 		if (currentX >= movement) {
// 			currentX -= movement
// 		} else {
// 			currentX = 0
// 			direction = 'down'
// 			prevDirection = 'left'
// 		}
// 	}
//
// 	var data = {coordinates: {posx:currentX, posy:currentY},direction: direction, prevDirection: prevDirection};
// 	return data
// }



module.exports = sender;
