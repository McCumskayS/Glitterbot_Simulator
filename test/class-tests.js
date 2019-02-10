//Test file for testing various classes.
//Authors: Scott McCumskay
//Date:07/02/2019

var assert = chai.assert;

describe('Array', function() {

    it('should start empty', function(){
      var arr = [];

      assert.equal(arr.length, 0);

    });
});

//Tests for DroneSprite class, located in src/renders/droneSprite.js
describe('DroneSprite class', function(){
  const connt = new PIXI.Container();         //Placebo variables for test purposes
  var drone = new DroneSprite(20,connt);
  describe('Dronesprite "moveTo" function', function(){   //moveTo function tests
    var targetx = 4;
    var targety = 6;
    drone.moveTo(targetx,targety);
    it('posx should be equal to targetx',function(){
      assert.equal(drone.posx,targetx);
    });
    it('posy should be equal to targety',function(){
      assert.equal(drone.posy,targety);
    });
  });
});

//Tests for RenderMapRefactor class, located in src/renders/renderMapRefactor.js
describe('RenderMapRefactor class', function(){
  //Placebo socket variables
  const path = require('path')
  const express = require('express')
  const app = express()
  const port = 3000
  const root = __dirname;
  const socket = require('socket.io')
  const sender = require('../src/server/sender.js')
  app.get('/', function(req, res) {
      res.sendFile('index.html', {root: path.join(root, '../src')});
  });
  app.use(express.static('../src'));
  const server = app.listen(port,
      () => console.log(`Example app listening on port ${port}!`));
  const io = socket(server);
  sender(io);
  //RenderMapRefactor variables
  const connr = new PIXI.Container();
  var rendermap = new MapRenderer(connr);




  it('row should be equal to 100 upon instantiation',function(){
    assert.equal(rendermap.row,100);
  });
});
