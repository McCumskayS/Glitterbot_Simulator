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
	dronePath = {
		x: 4,
		y: 6,
	}
	//When a client connect display message on console
	io.on('connection', function(socket){
	  console.log('a user connected');
		socket.on('rover-frontEnd', function(data) {
			if (data == true) {
				socket.emit('rover-frontEnd', roverPath);
			}
		});
	  //socket.emit('rover-frontEnd', roverPath);
		//socket.emit('drone-frontEnd', dronePath);
	});
}

module.exports = sender;
