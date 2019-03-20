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

const engine = require('./roverPathFinding.js')

var litterArrayLocations = [];
var roverX;
var roverY;

function sender(io) {

	//When a client connect display message on console
	io.on('connection', function(socket){
	  console.log('a user connected');
		socket.on('rover-frontEnd', function(data) {
			console.log(data.coordinates.posx);
			console.log(data.coordinates.posx+"-"+data.coordinates.posy);
			console.log("rover is waiting: "+data.state);
			roverX = data.coordinates.posx;
			roverY = data.coordinates.posy;
			var path = engine(litterArrayLocations, {x:roverX, y:roverY}, grid);
			console.log(path);
			if (data.state != false) {
				socket.emit('rover-frontEnd', path);
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

		socket.on('grid-channel', function(data) {
			grid = data.grid;
			litterArrayLocations = data.litter;
			console.log(litterArrayLocations);
		})

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

// function to check trees
function testTrees(posx, posy, scanRadius, treeArray, grid) {
	var height = 49;
	var weight = 49;

	var currentX = posx;
	var currentY = posy;

	// check trees here

	var data = checkTrees(currentX, currentY, treeArray, grid, scanRadius);
	while (data.nextLocation.posx != currentX) {
		data = checkTrees(data.nextLocation.posx, data.nextLocation.posy, treeArray, grid, scanRadius);
	}

	return data;

}

function setGridUnWalkable(grid) {
	for (let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid[i].length; j++) {
			grid.setWalkableAt(i, j, false);
		}
	}
	return grid;
}

// A function that check whether exist trees on the roverPath
function checkTrees(posx, posy, treeArray, grid, scanRadius) {
	var width = 49;
	var height = 49;
  var nextX = posx+scanRadius;
	var nextY = posy;

	for (let i = -scanRadius; i <= scanRadius; i++) {
		for (let j = -scanRadius; j <= scanRadius; j++) {
			//First check the boundary
			if (posx+i > width || posy+j > height || posx+i < 0 || posy+j < 0) {
				continue;
			}	else {
					if (treeArray[posy+j][posx+i] != 1) {
						grid.setWalkableAt(posx+i, posy+j, true);
					} else {
							if (posx+i == nextX && posy+j == nextY) {
								// choose the next location
								for (let k = scanRadius; k >= -scanRadius; k--) {
									for(let m = scanRadius; m >= -scanRadius; m--) {
										if(treeArray[nextY+m][nextY+k] != 1) {
											nextX = nextX+k;
											nextY = nextY+m;
										}
									}
								}
							}
						}
				}
		}
	}
	var data = {nextLocation:{posx:nextX, posy:nextY}, grid: grid};
	return data;
}


}
module.exports = sender;
