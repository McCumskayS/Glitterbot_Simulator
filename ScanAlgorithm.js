// actually it is a wise idea to divide the whole scanning area into parts rather than scale the litter place of greatest probability
// beacause the area can be divided into different sizes and cannot ensure that the drone can scan everywhere.

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
    //Need to find a way to use this meaningfully
    this.scanRadius = Math.sqrt(lens^2 - height^2); // the real radius of the scanning area

    // a info that tells whether receive instruction to move to a specific point
    //Flag used to check if the user/operator is ovveriding the drone's control
    this.flag = 0;
    this.reachPoint = new Point(10,10);
    this.divNum = 4;

    /*
    //suppose the map is a rectangle of size length*width
    this.width = row;
    this.height = col;
    */
    /*
    // get the length and width of each divided area
    this.sideLength = length/divNum;
    this.sideWidth = width/divNum;
    */

    this.numOfLitter[] = new Array[divNum*divNum];
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
      searchLitter(locationX,locationY);
      //start routine movement
      while(true) {

        if (this.posy < height) {
          // move the drone horizontally step by step
          while (this.posx <= width) {
            locationX += 2*scanRadius;
            moveTo(locationX, locationY);
            // scan the area
            searchLitter(locationX,locationY);
          }
          // move downwards
          locationY += 2*scanRadius;
          moveTo(locationX, locationY);
        }
          // first move down a bit
        if(this.posy < height) {
          while (this.posx >= 0) {
            locationX -= 2*scanRadius;
            moveTo(locationX, locationY);
            searchLitter(locationX,locationY);
          }
          // move downwards
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

        // TODO: move the drone according to the array ranking
      }
      else {
        // TODO: directly move the drone following the array ranking
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


    function searchLitter(locationX, locationY) {
      // scan the area within the radius scanRadius
      for (i=-scanRadius; i<=scanRadius; i++) {
        for (j=-scanRadius; j<=scanRadius; j++) {
          // check whether the grid has litter
          if(locationX+i > width && locationY+j > height) {
            continue;
          }
          else {
            var terrain = grid[locationX+i][locationY+j];
            if (terrain.getTerrainLitter()) {
              //send location to server
            }
          }
        }
      }

    }


}
