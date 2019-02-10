const engine = require('./roverPathFinding.js')
var grid = [];
var litterArrayLocations = [];
var roverX;
var roverY;

function sender(io) {
	//When a client connect display message on console
	io.on('connection', function(socket){
	  console.log('a user connected');
		socket.on('rover-frontEnd', function(data) {
			console.log(data.coordinates.posx);
			console.log(data.coordinates.posx+"-"+data.coordinates.posy);
			console.log("rover is waiting: "+data.state);
			roverX = data.coordinates.posx;
			roverY = data.coordinates.posy;
			var path = engine(litterArrayLocations, {x:roverX, y:roverY}, grid);
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
