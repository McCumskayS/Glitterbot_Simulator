var PF = require('pathfinding');

function pathFindingEngine(treeArray, currentLocation, targets, grid, direction) {
  var droneX = currentLocation.x;
  var droneY = currentLocation.y;

  var height = grid.length;
  var width = grid[0].length;
  // update grid map by update the walkable places
  var newGrid = setMapWalkable(targets, grid);

  var candidateTargets = [];
  var candidatePaths = [];
  // get path
  var finder = new PF.AStarFinder({
    allowDiagonal: true
  });
  for (var i = 0; i < targets.length; i++) {
    var path = finder.findPath(droneX, droneY, targets[i][0], targets[i][1], newGrid);
    if (path.length != 0) {
      // store the targets and the corresponding path
      candidateTargets.push([targets[i][0], targets[i][1]]);
      candidatePaths.push(path);
    }
  }
  // evaluate the candidate targets to get the best destination to go
  var data = evaluateTarget(candidateTargets, droneX, droneY, direction);
  data.direction = changeDirection(data, candidateTargets, width);

  return data;
}

// initialize the grid map by setting the whole map unwalkable
function initializeGrid(height, width) {
  var grid = new PF.Grid(width, height);
  for (var i = 0; i < width; i++) {
    for (var j =  0; j < height; j++) {
      grid.setWalkableAt(i, j, false);
    }
  }
  return grid;
}

// set the positions unwalkable
function setMapWalkable(targets, grid) {
  for (var i = 0; i < targets.length; i++) {
    grid.setWalkableAt(targets[i][0], targets[i][1], true);
  }
  return grid;
}

// evaluate the candidate targets and get the best target index to explore the map
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
        differenceY = math.abs(candidateTargets[i][1] - posy);
      } else if (distanceX == differenceX) {
        var distanceY = math.abs(candidateTargets[i][1] - posy);
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
        differenceY = math.abs(candidateTargets[i][1] - posy);
      } else if (distanceX == differenceX) {
        var distanceY = math.abs(candidateTargets[i][1] - posy);
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
        differenceX = math.abs(candidateTargets[i][0] - posx);
      } else if (distanceY == differenceY) {
        var distanceX = math.abs(candidateTargets[i][0] - posx);
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
  if ((target[0] == width && direction == 'right') ||(target[0 == 0 && direction == left)]) {
    direction = 'down';
  }
  if (target[0] == width && direction == 'down') {
    direction = 'left';
  }
  if (target[0] == 0 && direction == 'left') {
    direction == 'right';
  }

  return direction;
}

module.exports.engine = pathFindingEngine;
module.exports.initialisation = initializeGrid;
