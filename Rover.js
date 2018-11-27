class Rover {
    constructor(Id,BatteryLevel,State,Speed,LocationX,LocationY,Height,Area){
        setId(Id);
        setBatteryLevel(BatteryLevel);
        setState(State);
        setSpeed(Speed);
        setLocationX(LocationX);
        setLocationY(LocationY);
        setCapacity(Capacity);
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

  	set setCapacity(Capacity){
      this.Capacity = Capacity;
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

  	get getCapacity(){
      return Capacity;
    }

    var socket = io.connect('http://localhost:80');
    // important functionalities
    move() {
      receivePath();
      // do somewthing according to the planning path
    }

    receivePath(){
      // pass data to this and do something
      socket.on('connetion', function(socket) {
         // TODO
         //receive data from the server
         socket.on('action', function(data){
           console.log('data');
         });
         //send data to the server
         socket.emit('action', data);
      });
    }

    report(){
      // send data about the whole info of robot
      socket.on('connection', function(socket){
        socket.emit('myEvent', data);
      });
    }
}
