const engine = require('./roverPathFinding.js')
const droneEngine = require('./dronePathFinding.js')
const converter = require('./CoordinatesConversion.js')

var scanRadius = 0;
var grid = [];
// 0 for left and 1 for right
var direction = 'right'
// var prevDirection = 'left'
var treeArray = [];
var litterArray = [];
var startPos = {
  lat: 0,
	long: 0
}
var endPos = {
	lat: 0,
	long: 0
}
var latLongWidth = 0;
var latLongHeight = 0;

var litterArrayLocations = [];
var roverX;
var roverY;

var width;
var height;

var count = 0;
var clientId;


function sender(io) {
	//When a client connect display message on console
	io.on('connection', function(socket){
	  console.log('a user connected');
		socket.on('rover-frontEnd', function(data) {
			console.log('ID of the client is: ' + clientId);
			roverX = data.coordinates.posx;
			roverY = data.coordinates.posy;
			var path = engine(litterArrayLocations, {x:roverX, y:roverY}, grid);
			//console.log(path);
			if (data.state != false) {
				socket.emit('rover-frontEnd', path);
			}
		});

    socket.on('grid-channel', function(data) {
			clientId = socket.id;
			console.log('ID of the client is: ' + clientId);
			grid = data.grid;
			litterArrayLocations = data.litter;

			height = grid.length;
			//console.log('the height of the grid: '+grid.length);
			width = grid[0].length;
			//console.log('the width of the grid: '+grid[0].length);

			// initialize the utilityArray for the first time it sends the information of grid map
			if (count == 0) {
				treeArray = initializeTreeArray();
				console.log('successfully initialize grid');
				count = 2;
			}
		});

		// copy tre array from front end to back end
		socket.on('treeArray', function(data) {
			treeArray = data;
		});

		//receive the location of the drone and send back the path
		socket.on('drone-frontEnd', function(data) {
			scanRadius = data.scanRadius;
      var currentLocation = {x: data.coordinates.posx, y: data.coordinates.posy};

			if (data.state != false) {

        if (direction != 'utility random') {
          var targets = checkTrees(data.coordinates.posx, data.coordinates.posy, scanRadius);
  				console.log('the length of targets array: '+ targets.length);
  				var newdata = droneEngine.engine(currentLocation, targets, grid, direction, treeArray);
  				direction = newdata.direction;
  				console.log('the direction next is: ' + direction);
  				var path = newdata.path;
  				// console.log('the length of the drone path is: '+path.length);
        } else {
          var path = droneEngine.utility(currentLocation, treeArray);
        }

				socket.emit('drone-frontEnd', path);
			}
		});

		// receive litter from the drone
		socket.on('litter-channel', function(data) {
			litterArray = data;
		});

		socket.on('mobile-channel', function(data) {
			console.log('position received: ' + data.latitude + ' - ' + data.longitude)
			let pos = {lat: data.latitude, long: data.longitude}
			const gridCoordinates = converter.mapOnGrid(startPos, pos, latLongWidth, latLongHeight);
			if (gridCoordinates.x > grid.length || gridCoordinates.x < 0) {
				return;
			}
			else if (gridCoordinates.y > grid[0].length || gridCoordinates.y < 0) {
				return;
			} else {
				io.to(clientId).emit('phone', gridCoordinates);
				console.log('YOLOOOOOO');
			}
		});

		//connection for recieving start position of the map
		socket.on('app-startPos', function(data){
			console.log('Recived start positions')
			startPos.lat = data.latitude
			startPos.long = data.longitude
		});

		//connection for recieving end position of the map
		socket.on('app-endPos', function(data){
			console.log('Recived end position')
			endPos.lat = data.latitude
			endPos.long = data.longitude
			//TODO: MAKE SURE YOU GOT BOTH START AND END ONCE!!!!!
			//!!!!!!!!!!!!
			latLongWidth = converter.calculateWidth(startPos, endPos, grid.length)
			latLongHeight = converter.calculateHeight(startPos, endPos, grid[0].length)

			console.log("Calculated width: " + latLongWidth)
			console.log("Calculated height: " + latLongHeight)
		});
  });
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
	// console.log('print tree array before check trees: \n');
	// if (posx == 1 && posy == 1){
	 // for (var i = 0; i < treeArray.length; i++) {
	 // 	console.log(treeArray[i]);
	 // }

	console.log('the current position of drone: '+ 'x: '+posx + ' y: ' + posy);

	for (var i = -scanRadius; i <= scanRadius; i++) {
		for (var j = -scanRadius; j <= scanRadius; j++) {
			if (posx+i >= width || posy+j >= height || posx+i < 0 || posy+j < 0) {
					continue;
			} else if (treeArray[posy+j][posx+i] != 1) {
				targets.push([posx+i,posy+j]);
			}
		}
	}

	return targets;
}

 //initialize treeArray to be a 2D array/
 function initializeTreeArray() {
 	var trees = [];
 	var treesArray = [];
 	for (var j = 0; j < width; j++) {
 		trees[j] = 0;
 	}
 	for (var i = 0; i < height; i++) {
 		treesArray[i] = trees;
 	}
 	return treesArray;
 }

module.exports = sender;
