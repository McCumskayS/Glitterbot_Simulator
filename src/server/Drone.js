class Drone {
    constructor(Id,BatteryLevel,State,Speed,LocationX,LocationY,Height,Area){
        setId(Id);
        setBatteryLevel(BatteryLevel);
        setState(State);
        setSpeed(Speed);
        setLocationX(LocationX);
        setLocationY(LocationY);
        setHeight(Height);
        setArea(Area);
    }
    // Setter
    set setId(Id){
  	   this.Id = Id;
  	}

  	set setBatteryLevel(BatteryLevel){
  		this.BatteryLevel = BatteryLevel;
  	}

  	set setState(State){
  		this.State = State;
  	}

  	set setSpeed(Speed){
  		this.Speed = Speed;
  	}

  	set setLocationX(LocationX){
  		this.LocationX = LocationX;
  	}

  	set setLocationY(LocationY){
  		this.LocationY = LocationY;
  	}

  	set setHeight(Height){
  		this.Height = Height;
  	}

  	set setArea(Area){
  		this.Area = Area;
  	}

    // getter for all variables
  	get getId(){
  		return this.Id;
  	}

  	get getBatteryLevel(){
  		return this.BatteryLevel;
  	}

  	get getState(){
  		return this.State;
  	}

  	get getSpeed(){
  		return this.Speed;
  	}

  	get getLocationX(){
  		return this.LocationX;
  	}

  	get getLocationY(){
  		return this.LocationY;
  	}

  	get getHeight(){
  		return this.Height;
  	}

  	get getArea(){
  		return this.Area;
  	}

    var socket = io.connect('http://localhost:80');
    // important functionalities
    scan() {
      receivePath();
      // scan the area
      // define the radius of the camera vision scale to be r, the path destination to be X,Y
      var DistanceSquared = (X-LocationX)^2 + (Y-LocationY)^2;
      var Distance = Math.sqrt(DistanceSquared);
      var cosA = Math.abs(X-LocationX)/Distance;
      var sinA = Math.abs(Y-LocationY)/Distance;

      while(LocationX <= X && LocationY <= Y){
        // first let the camera scan the surrounding environment as a circle in radius r
        //TODO
        // then move the Drone
        this.LocationX += r*cosA;
        this.LocationY += r*sinA;

      }
    }

    receivePath(){
      // receive path from the server
      socket.on('connetion', function(socket) {
         // TODO
         socket.on('action', function(data){
           console.log('data');
         });
         socket.emit('action', data);
      });
    }

    report(){
      socket.on('connnection', function(socket) {
        socket.emit('myEvent', data);
      });

    }
}
