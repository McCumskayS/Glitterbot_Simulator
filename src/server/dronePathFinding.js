var PF = require('pathfinding');
var girdBackUp = [];
var height = 0;
var width = 0;
var temp = [];

function pathFindingEngine(currentLocation, targets, grid, direction) {
  var droneX = currentLocation.x;
  var droneY = currentLocation.y;


  if (droneX == 0 && droneY == 0) {
    height = grid.length;
    console.log('the value of height at dronePathFinding: '+ height);
    width = grid[0].length;
    console.log('the value of width at dronePathFinding: '+ width);
    // initialize the grid map for future use
    // gridBackUp = initializeGrid(height, width);
    temp = transformGrid();
  }
  // then update grid map by update the walkable places
  // var newGrid = setMapWalkable(targets, gridBackUp);
  // console.log('sgdkjhsaldhka'+newGrid);
  // // preserve the old map and for update
  // var gridBackUp = newGrid.clone();


  temp = setWalkable(targets, temp);
  // console.log('temp is : '+ temp);
  var candidateTargets = [];
  var candidatePaths = [];

  // get path
  var finder = new PF.AStarFinder({
    allowDiagonal: true
  });

  // console.log('target length: '+targets.length);

  for (var i = 0; i < targets.length; i++) {
    var newGrid = new PF.Grid(temp);

    var path = finder.findPath(droneX, droneY, targets[i][0], targets[i][1], newGrid);
    // console.log('the target x: '+targets[i][0]+'  the target y: '+targets[i][1])
    // console.log('the length for path '+i+' is: '+path.length);
    if (path.length != 0) {
      // store the targets and the corresponding path
      candidateTargets.push([targets[i][0], targets[i][1]]);
      candidatePaths.push(path);
    }
  }

  // console.log('the number of path in engine: '+candidatePaths.length);

  // evaluate the candidate targets to get the best destination to go
  var data = evaluateTarget(candidateTargets, droneX, droneY, direction);
  data.direction = changeDirection(data, candidateTargets, width);
  var newdata = {path: candidatePaths[data.index], direction: data.direction};

  return newdata;
}

// initialize the grid map by setting the whole map unwalkable
function initializeGrid(height, width) {
  var grid = new PF.Grid(width, height);
  for (var i = 0; i < width; i++) {
    for (var j =  0; j < height; j++) {
      grid.setWalkableAt(i, j, true);
      console.log("grid!" + grid[i][j]);
    }
  }
  return grid;
}

// set the positions walkable
function setMapWalkable(targets, grid) {
  for (var i = 0; i < targets.length; i++) {
    grid.setWalkableAt(targets[i][0], targets[i][1], true);
  }
  return grid;
}

function transformGrid() {
  var temp = [];
  for (var i = 0; i < height; i++) {
    temp[i] = [];
    for (var j =0; j < width; j++) {
      temp[i][j] = 1;
    }
  }

  return temp;
}

function setWalkable(targets, temp) {
  for (var i = 0; i < targets.length; i++) {
    var x = targets[i][0];
    var y = targets[i][1];
    temp[y][x] = 0;
  }
  return temp;
}

// evaluate the candidate targets and returns the best target index to explore the map
function evaluateTarget(candidateTargets, posx, posy, direction) {
  // use direction to decide which target to take for the next step
  var bestIndex = 0;
  var differenceX = 0;
  var differenceY = 0;

  // method 1
  for (var i = 0; i < candidateTargets.length; i++) {
    // from left to right
    if (direction == 'right') {
      var distanceX = candidateTargets[i][0] - posx;
      if (distanceX > differenceX) {
        bestIndex = i;
        differenceX = distanceX;
        differenceY = Math.abs(candidateTargets[i][1] - posy);
      } else if (distanceX == differenceX) {
        var distanceY = Math.abs(candidateTargets[i][1] - posy);
        if (distanceY < differenceY) {
          bestIndex = i;
          differenceY = distanceY;
        }
      }
    }
    // from right to left
    if (direction == 'left') {
      var distanceX = posx - candidateTargets[i][0];
      if (distanceX > differenceX) {
        bestIndex = i;
        differenceX = distanceX;
        differenceY = Math.abs(candidateTargets[i][1] - posy);
      } else if (distanceX == differenceX) {
        var distanceY = Math.abs(candidateTargets[i][1] - posy);
        if (distanceY < differenceY) {
          bestIndex = i;
          differenceY = distanceY;
        }
      }
    }
    // from top to bottom
    if (direction == 'down') {
      var distanceY = candidateTargets[i][1] - posy;
      if (distanceY > differenceY) {
        bestIndex = i;
        differenceY = distanceY;
        differenceX = Math.abs(candidateTargets[i][0] - posx);
      } else if (distanceY == differenceY) {
        var distanceX = Math.abs(candidateTargets[i][0] - posx);
        if (distanceX < differenceX) {
          bestIndex = i;
          differenceX = distanceX;
        }
      }
    }
  }

  data = {index: bestIndex, direction: direction};
  return data;
}

// change next Direction
function changeDirection(data, candidateTargets, width) {
  var direction = data.direction;
  var target = candidateTargets[data.index];
  if ((target[0] == width-1 && direction == 'right') ||(target[0] == 0 && direction == 'left')) {
    direction = 'down';
  }
  if (target[0] == width-1 && direction == 'down') {
    direction = 'left';
  }
  if (target[0] == 0 && direction == 'left') {
    direction = 'right';
  }

  return direction;
}

module.exports.engine = pathFindingEngine;
module.exports.initialisation = initializeGrid;
