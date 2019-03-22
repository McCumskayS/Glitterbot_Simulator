const assert = require("assert");
var request = require("request");
var fork = require("child_process").fork;
var drone = require('../renders/droneSprite.js');
var exec = require('child_process').exec;



describe('Array', function() {

    it('should start empty', function(){
      var arr = [];

      assert.equal(arr.length, 0);

    });
});

/*describe('DroneSprite class', function(){
  let container, WebGLRenderer
  if(!isNode) {
    Container = require('pixi.js').Container
    WebGLRenderer = require('pixi.js').WebGLRenderer
  }
  var droneSprite = new DroneSprite(20,null);

  describe('DroneSprite "moveTo" function', function(){
    var targetx = 2;
    var targety = 2;
    it('posx should be equal to targetx', function(){
      assert.equal(drone.posx,targetx);
    });
    it('posy should be equal to targety', function(){
      assert.equal(drone.posy,targety)
    });
  });
});*/

describe('listener test', function(){
  var child, port = 3000;

  before( function(done){
    child = fork('server/index.js',null,{env:{PORT: port}});
    child.on('message', function (msg){
      if (msg === 'Example app listening on port 3000!') {
        done();
      }

    });
  });
  after(function(){
    child.kill();
  });

  it('listens on the specified port', function(done){
    this.timeout(30000);

    request('localhost:'+port, function(err, resp, body){
      assert(resp.statusCode === 200);
      done();
    });
  });
});
