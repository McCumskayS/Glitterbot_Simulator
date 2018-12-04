// suppose the grid system is composed of many squares which length = 1
class Point{
  constructor(locationX, locationY){
    this.locationX = locationX;
    this.locationY = locationY;
    this.property = 0; // default to be a path
    this.totalCost = 0; // the total cost to get to this point from the original point
  }
}


// this function add potential node to the queue
function AddNodeToQueue(currentPoint){
    // calculate the total cost for every possible node
    for(int i=-1;i<2;i++) {
      for(int j=-1;j<2;j++) {
          // build a node for check
          potentialPoint = Point(currentPoint.locationX+i, currentPoint.locationY+j);

          if(potentialPoint.property == 0 || (potentialPoint.locationX == currentPoint.locationX && potentialPoint.locationY == currentPoint.locationY)){
              // this node is an obstacle or is the current node
              continue;
          }
          else{
            if(i == j) {
              potentialPoint.totalCost += Math.sqrt(2)*calculateCost(potentialPoint);

            }
            else {
              potentialPoint.totalCost += calculateCost(potentialPoint);
            }
          }
      }
    }


}

obj = {
  x: 5,
  y: 6,
  cost: skfbsdf,
}

// this function calculate the cost to this node
function calculateCost(point) {
  // depends on three things
  // path:1    grass:2
  // could be extended depending on the weather conditions and the speed
  if (point.property == 1) {
    return 1;
  }
  else{
    return 1.5;
  }
}
