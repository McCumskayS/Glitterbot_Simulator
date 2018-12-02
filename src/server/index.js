const path = require('path')
const express = require('express') //Load Express
const app = express() //App is an Express function
const port = 3000 //Set a port
const root = __dirname; //Root is the current Directory
const socket = require('socket.io') //Load socket.io
const sender = require('./sender.js')

//Route to the main HTML page (in this case index.html)
app.get('/', function(req, res) {
    res.sendFile('index.html', {root: path.join(root, '../')});
});

//Specify where to get files
//E.g. the various js scripts in index.html
app.use(express.static(root));

//Listening to port(3000) and logging a message on console
//Also save the connection to a variable named 'server'
const server = app.listen(port,
    () => console.log(`Example app listening on port ${port}!`));

//Make a socket instance from what we requried
//connected `to the previously created server
const io = socket(server);
sender(io);
