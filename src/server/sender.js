const engine = require('./roverPathFinding.js')
const converter = require('./CoordinatesConversion.js')

	var scanRadius = 0;
  var grid = [];
	// 0 for left and 1 for right
	var direction = 'right'
	var prevDirection = 'left'
 	var treeArray =[];
  var col = 49;

	for (var i = 0; i<col; i++) {
		treeArray[i] = [];
	}

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

function sender(io) {

	//When a client connect display message on console
	io.on('connection', function(socket){
	  console.log('a user connected');

		socket.on('rover-frontEnd', function(data) {

			roverX = data.coordinates.posx;
			roverY = data.coordinates.posy;
			var path = engine(litterArrayLocations, {x:roverX, y:roverY}, grid);
			console.log(path);
			if (data.state != false) {
				socket.emit('rover-frontEnd', path);
			}
		});

    socket.on('grid-channel', function(data) {
			grid = data.grid;
			litterArrayLocations = data.litter;
		});

		//receive the location of the drone and send back the path
		socket.on('drone-frontEnd', function(data) {
			console.log(data.state)
			console.log(data.coordinates.posx+"-"+data.coordinates.posy);
			scanRadius = data.scanRadius;
			console.log('scan radius: ' + scanRadius);

			var newdata = routinePath(data.coordinates.posx, data.coordinates.posy, scanRadius, direction, prevDirection);
			direction = newdata.direction;
			prevDirection = newdata.prevDirection;
			console.log('Direction: '+direction);
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

		socket.on('test-drone', function(data)) {
			console.log(data.latitude)
		}

		//connection for recieving start position of the map
		socket.on('app-startPos', function(data){
			console.log('Recived start positions!')
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
			width = converter.calculateWidth(startPos, endPos, grid.length)
			height = converter.calculateHeight(startPos, endPos, grid[0].length)

			console.console.log("Calculated width: " + width)
			console.console.log("Calculated height: " + height)
		});
  });
}

function routinePath(posx, posy, scanRadius, direction, prevDirection) {
	var width = 29;
	var height = 19;
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


module.exports = sender;
