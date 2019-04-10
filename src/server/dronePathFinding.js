var PF = require('pathfinding');
var girdBackUp = [];
var height = 0;
var width = 0;
var temp = [];
var utilityArray = [];

function pathFindingEngine(currentLocation, targets, grid, direction, treeArray) {
  var droneX = currentLocation.x;
  var droneY = currentLocation.y;

  if (temp.length == 0) {
    height = grid.length;
    //console.log('the value of height at dronePathFinding: '+ height);
    width = grid[0].length;
    //console.log('the value of width at dronePathFinding: '+ width);
    temp = transformGrid();
    // initialize utility array
    utilityInitialisation();
    // console.log('the height of utility array: ' + utilityArray.length);
    // console.log('the width of utility array: ' + utilityArray[0].length);
  }

  updateUtility(treeArray);

  temp = setWalkable(targets, temp);
  // console.log('print the map before calculate: ');
  // for (var i = 0; i < temp.length; i++) {
  //   console.log(temp[i]);
  // }
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
    utilityArray[targets[i][1]][targets[i][0]] -= 1;

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

  // all the points on the path shall minus 1 to remain unchanged according to the utility array value
  for (var i = 0; i < newdata.path.length; i++) {
    var path = newdata.path;
    utilityArray[path[i][1]][path[i][0]] -= 1;
  }

  return newdata;
}

function utilityMovement(currentLocation, treeArray) {
  var droneX = currentLocation.x;
  var droneY = currentLocation.y;
  // update the utility array
  updateUtility(treeArray);
  // according to the utility array, calculate which is the next target
  // rank the 2D utilityArray
  var maxUtility = 0;
  var candidateTargets = [];
  // calculate the candidate targets with the highest utility value
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (utilityArray[i][j] > maxUtility) {
        maxUtility = utilityArray[i][j];
        if (candidateTargets.length != 0) {
          candidateTargets = [];
        }
        candidateTargets.push([j,i]);
      } else if (utilityArray[i][j] == maxUtility) {
      candidateTargets.push([j,i]);
      }
    }
  }
  console.log('candidate targets utility length: ' + candidateTargets.length);
  // calculate which candidate target is the farthest from the current position
  var index = Math.floor(Math.random()*(candidateTargets.length + 1));
  var target = [candidateTargets[index][0], candidateTargets[index][1]];
  // var maxDistance = 0;
  // var target = [0,0];
  // for (var i = 0; i < candidateTargets.length; i++) {
  //   var posx = candidateTargets[i][0];
  //   var posy = candidateTargets[i][1];
  //   var distance = Math.sqrt((droneX-posx)^2 + (droneY-posy)^2);
  //   if (distance >= maxDistance) {
  //     target = [posx, posy];
  //     maxDistance = distance;
  //   }
  // }

  // get path using AStarFinder
  var finder = new PF.AStarFinder({
    allowDiagonal: true
  });

  console.log('第三方的身份 the utility target should be: '+target[0]+ ', '+target[1]);
  var utilityGrid = new PF.Grid(temp);
  var path = finder.findPath(droneX, droneY, target[0], target[1], utilityGrid);
  for (var i = 0; i < path.length; i++) {
    utilityArray[path[i][1]][path[i][0]] = 0;
  }

  return path;
}

function transformGrid() {
  var temp = [];
  for (var i = 0; i < height; i++) {
    temp[i] = [];
    for (var j = 0; j < width; j++) {
      temp[i][j] = 1;
    }
  }

  return temp;
}

// initialize an empty utility array with the same height and width of the grid map
function utilityInitialisation () {
  var utility = [];
  for (var i = 0; i < width; i++) {
    utility[i] = 0;
  }
  for (var j = 0; j < height; j++) {
    utilityArray[j] = utility;
  }
}

// update the utility array and set the tree positions to be -1 and the other positions +2
function updateUtility (treeArray) {
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (treeArray[i][j] != 1) {
        utilityArray[i][j] += 2;
      } else {
        utilityArray[i][j] = -1;
      }
    }
  }
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

  console.log('show direction before changing it: ' + direction);
  //console.log('show target position x: ' + target[0]);

  if ((target[0] == width-1 && direction == 'right') || (target[0] == 0 && direction == 'left')) {
    if (target[1] == height-1) {
      direction = 'utility random';
    } else {
      direction = 'down';
    }
  }
  else if (target[0] == width-1 && direction == 'down') {
    direction = 'left';
  }
  else if (target[0] == 0 && direction == 'down') {
    direction = 'right';
  }

  return direction;
}

module.exports.engine = pathFindingEngine;
module.exports.utility = utilityMovement;
