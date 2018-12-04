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
  }

    const reachPoint = new Point(10,10);



    // this function makes the drone move and scan the area to find new litter and mark the litter
    function move(reachPoint) {

      var DistanceSquared = (reachPoint.locationX-DroneSprite.posx)^2 + (reachPoint.locationY-DroneSprite.posy)^2;
      var Distance = Math.sqrt(DistanceSquared);
      var cosA = Math.abs(reachPoint.locationX-DroneSprite.posx)/Distance;
      var sinA = Math.abs(reachPoint.locationY-DroneSprite.posy)/Distance;

      while(this.posx != reac hPoint.locationX && this.posx != reachPoint.locationY){

          this.posx += scanRadius*cosA;
          this.posy += scanRadius*sinA;

        // scanning
        searchLitter();
    }

    // the function shows the flying routine of the drone
    function Routine() {
      //suppose the map is a rectangle of size length*width
      var length;
      var width;

      point = new Point(0, 0);

      while(true){
        // every time the drone flies to the startpoint of the map which should be (0,0)
        move(0, 0);
        //start routine movement
        while(true) {

          while(this.posx < length) {
            // move the drone horizontally
            point.locationX = length;
            move(point);
          }
          // first move down a bit
          if(this.posy < width) {
            point.locationY += 2*scanRadius;
            move(point);
          }
          else {
            break;
          }
          // then move back
          while(this.posx > 0) {
            point.locationX = 0;
            move(point);
          }

          if(this.posy < width) {
            point.locationY += 2*scanRadius;
            move(point);
          }
          else {
            break;
          }
        }
      }

    }

    function searchLitter() {
      // scan the area within the radius scanRadius


    }


}
