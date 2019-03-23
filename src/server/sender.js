function sender(io) {
	//test roverPath
	//test comment
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

	//When a client connect display message on console
	io.on('connection', function(socket){
	  console.log('a user connected');
		socket.on('rover-frontEnd', function(data) {
			console.log(data.coordinates.posx+"-"+data.coordinates.posy);
			if (data.waiting != false) {
				socket.emit('rover-frontEnd', roverPath);
			}
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
	});
}

function routinePath(posx, posy, scanRadius, direction, prevDirection) {
	var width = 49;
	var height = 49;
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
	//DO treePathFinding here


	var data = {coordinates: {posx:currentX, posy:currentY},direction: direction, prevDirection: prevDirection};
	return data
}


module.exports = sender;
