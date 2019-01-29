// actually it is a wise idea to divide the whole scanning area into parts rather than scale the litter place of greatest probability
// beacause the area can be divided into different sizes and cannot ensure that the drone can scan everywhere.


// scan algorithm for the Drone
class Point{
  constructor(locationX, locationY){
    this.locationX = locationX;
    this.locationY = locationY;
    this.property = 0; // default to be a path
    this.totalCost = 0; // the total cost to get to this point from the original point
  }
}

class DroneSprite{
  //Creates the rover sprite and adds it to the map at x:0;y:0
  constructor() {
		this.texture = PIXI.Texture.fromImage('./sprites/drone.png');
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.anchor.set(0.5, 0.5);
		container.addChild(this.sprite);
		this.posx = 0;
		this.posy = 0;
		this.animSpeed = 2 //Default

    // the image processor
    this.lens = 2;
    this.height = 1;
    this.scanRadius = Math.sqrt(lens^2 - height^2); // the real radius of the scanning area

    // a info that tells whether receive instruction to move to a specific point
    this.flag = 0;
    this.reachPoint = new Point(10,10);
    this.divNum = 4;

    //suppose the map is a rectangle of size length*width
    this.length = container.width;
    this.width = container.height;
    // get the length and width of each divided area
    this.sideLength = length/divNum;
    this.sideWidth = width/divNum;

    this.numOfLitter[] = new Array[sideLength*sideWidth];
  }

  function moveTo(targetX, targetY) {
    var distanceSquared = ((this.posx-targetX)^2) + ((this.posy-targetY)^2);
    distanceSquared = Math.abs(distanceSquared);
    var distance = Math.sqrt(distanceSquared);
    var time = distance/this.animSpeed;
    droneTimeline.to(this.sprite, time, {x:squareSize*targetX, y:squareSize*targetY});
    this.posx = targetX;
    this.posy = targetY;
    console.log("Drone: " +this.posx+"-"+this.posy);
}
  

    // the function shows the flying routine of the drone
    function Routine() {
      var locationX = 0;
      var locationY = 0;
      // every time the drone flies to the startpoint of the map which should be (0,0)
      moveTo(locationX, locationY);

      //start routine movement
      while(true) {

        if (this.posy < width) {
          // move the drone horizontally
          locationX = length;
          moveTo(locationX, locationY);
          locationY += 2*scanRadius;
          moveTo(locationX, locationY);
        }
          // first move down a bit
        if(this.posy < width) {
          locationX = 0;
          moveTo(locationX, locationY);
          locationY += 2*scanRadius;
          moveTo(locationX, locationY);
        }
        else {
          break;
        }
      }

    }

    // a function that first takes a compulsory routine movement and do scanning according to the probability of occurance of litter or receiving any instruction to fly to a certain point
    function totalMovement() {
      // First take a routine in order to scan all the areas of the map
      Routine();

      if (flag == 1) {  // receive instruction and move to reachPoint
        move(reachPoint);
        // TODO: move the drone according to the array ranking
      }
      else {
        // TODO: directly move the drone according to the array ranking
      }
    }

    // a function that does scanning inside the scanning area of index
    function sideMovement(index) {
      var row = index/divNum;
      var column = index%divNum - 1;
      if (column == -1) {
        column += 4;
      }
      var locationX = row*sideWidth;
      var locationY = column*sideLength;
      moveTo(locationX, locationY);
      // start scanning
      while(true) {
        if(this.posy < row*sideWidth) {
          locationX += sideLength;
          moveTo(locationX, locationY);
          locationY += scanRadius;
          moveTo(locationX, locationY);
        }

        if(this.posy < row*sideWidth) {
          locationX -= sideLength;
          moveTo(locationX, locationY);
          locationY += scanRadius;
          moveTo(locationX, locationY);
        }
        else {
          break;
        }
      }
    }

    // mark the area in the map that has been scanned
    var Glength;
    var Gwidth;
    function markScanningArea(currentPoint) {

    }

    function searchLitter() {
      // scan the area within the radius scanRadius


    }


}
