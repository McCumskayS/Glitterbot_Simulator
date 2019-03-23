const engine = require('./roverPathFinding.js')

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
			width = grid.length-1;
			height = grid[0].length-1;

			// initialize the utilityArray for the first time it sends the information of grid map
			if (count == 0) {
				createUtility();
			} else {
				count = 2;
			}
		});

		//receive the location of the drone and send back the path
		socket.on('drone-frontEnd', function(data) {
			// console.log(data.state)
			// console.log(data.coordinates.posx+"-"+data.coordinates.posy);
			scanRadius = data.scanRadius;
			// console.log('scan radius: ' + scanRadius);

			var newdata = routinePath(data.coordinates.posx, data.coordinates.posy, scanRadius, direction, prevDirection);
			direction = newdata.direction;
			prevDirection = newdata.prevDirection;
			// console.log('Direction: '+direction);
			if (data.state != false){
				socket.emit('drone-frontEnd', newdata);
			}
		});

		// receive
		socket.on('litter-channel', function(data) {
			console.log('x:'+data.x+'y:'+data.y);
		});

		// copy tre array from front end to back end
		socket.on('treeArray', function(data) {
			treeArray = data.slice();
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

function routinePath(posx, posy, scanRadius, direction, prevDirection) {

	console.log('from server: '+posx+'-'+posy);
	var currentX = posx;
	var currentY = posy;
	var movement = scanRadius

	if (direction === 'right') {
		if ((width - currentX) >= movement) {
			currentX += movement
		} else {
			currentX = width
			direction = 'down'
			prevDirection = 'right'
		}
	}
	else if (direction === 'down') {
		if (currentY === height) {
			direction = 'right'
			prevDirection = 'left'
			currentX = 0
			currentY = 0
		} else if ((height - currentY) >= movement) {
			currentY += movement
			if (prevDirection === 'right') {
				direction = 'left'
			} else {
				direction = 'right'
			}
		} else {
			currentY = height
		}
	}
	else if (direction == 'left') {
		if (currentX >= movement) {
			currentX -= movement
		} else {
			currentX = 0
			direction = 'down'
			prevDirection = 'left'
		}
	}

	var data = {coordinates: {posx:currentX, posy:currentY},direction: direction, prevDirection: prevDirection};
	return data
}

// set the destination according to the utility array
function movement() {
	
}

module.exports = sender;
