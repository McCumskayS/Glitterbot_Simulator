function sender(io) {
	//test roverPath
	//test comment
	roverPath = [
		{posx: 1, posy:0},
	  {posx: 2, posy:0},
		{posx: 2, posy:1},
	  {posx: 3, posy:1},
		{posx: 4, posy:1},
		{posx: 4, posy:0},
		{posx: 5, posy:1},
		{posx: 6, posy:1},
	]
	//testdrone Path
	dronePath = [
		{posx: 4, posy:6},
	]
	//When a client connect display message on console
	io.on('connection', function(socket){
	  console.log('a user connected');
		socket.on('rover-frontEnd', function(data) {
			console.log(data.coordinates.posx+"-"+data.coordinates.posy);
			if (data.waiting != false) {
				socket.emit('rover-frontEnd', roverPath);
			}
		});

		//receive the location of the drone and send back the path
		socket.on('drone-frontEnd', function(data) {
			console.log(data.coordinates.posx+"-"+data.coordinates.posy);
			socket.emit('drone-frontEnd', dronePath);
		});
	});
}

module.exports = sender;
