var PF = require('pathfinding');


function sender(io) {
	//test roverPath
	//test comment
	var scanRadius = 0;
  var grid = [];
	// 0 for left and 1 for right
	var direction = 'right'
	var prevDirection = 'left'

	roverPath = [
		{posx: 1, posy:0},
	  {posx: 2, posy:0},
		{posx: 2, posy:1},
	  {posx: 3, posy:1},
		{posx: 4, posy:1},
		{posx: 4, posy:0},
		{posx: 5, posy:1},
		{posx: 6, posy:1},
	]

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
			//console.log('routinePath start work!');
			var newdata = routinePath(data.coordinates.posx, data.coordinates.posy, scanRadius, socket, direction, prevDirection);
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
			})
		});
}

function routinePath(posx, posy, scanRadius, socket, direction, prevDirection) {
	var width = 49;
	var height = 49;
	console.log('from server: '+posx+'-'+posy);
	var currentX = posx;
	var currentY = posy;
	var movement = 2*scanRadius

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

function treePathFinding(grid, posx, posy, treeArray, scanRadius, nextX, nextY) {

	var temp = setGridUnWalkable(grid);
	//check trees and set the new grid
	var newGrid = checkTree(posx, posy, temp);
	//do the movement
	var gridCopy = new PF.Grid(newGrid);
	var finder = new PF.AStarFinder({
		allowDiagonal: true;
	});

	var path = finder.findPath(posx, posy, )

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
function checkTree(posx, posy, treeArray, grid, nextX, nextY) {
	var width = grid.length;
	var height = grid[i].length;

	for (let i = -this.scanRadius; i <= this.scanRadius; i++) {
		for (let j = -this.scanRadius; j <= this.scanRadius; j++) {
			//First check the boundary
			if (posx+i > width || posy+j > height || posx+i < 0 || posy+j < 0) {
				continue;
			}	else {
				if (treeArray[posy+j][posx+i] != 1) {
					grid.setWalkableAt(posx+i, posy+j, true);
				} else {
						if (posx+i == nextX && posy+j == nextY) {

						}
					}

				}
		}
	}
	return grid;
}

function checkNextLocation() {

}


module.exports = sender;
