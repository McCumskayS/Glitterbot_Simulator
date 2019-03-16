const engine = require('./roverPathFinding.js')
var grid = [];
var litterArrayLocations = [];
var baseLocation = [];
var roverX;
var roverY;
var capacity;

function sender(io) {
	//When a client connect display message on console
	io.on('connection', function(socket){
	  console.log('a user connected');
	  baseLocation[0] = [];
	  baseLocation[0][0] = 1;
		socket.on('rover-frontEnd', function(data) {
			console.log(data.coordinates.posx);
			console.log(data.coordinates.posx+"-"+data.coordinates.posy);
			console.log("rover is waiting: "+data.state);
			roverX = data.coordinates.posx;
			roverY = data.coordinates.posy;
			capacity = data.capacity;
			if (capacity > 0){
				var path = engine(litterArrayLocations, {x:roverX, y:roverY}, grid);
			}
			else {
				var path = engine(baseLocation, {x:roverX, y:roverY}, grid);
			}
			console.log(path);
			if (data.state != false) {
				socket.emit('rover-frontEnd', path);
			}
		});
		socket.on('grid-channel', function(data) {
			grid = data.grid;
			litterArrayLocations = data.litter;
			console.log(litterArrayLocations);
		})
	});
}

module.exports = sender;
