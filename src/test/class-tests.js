//Test file for testing various classes.
//Authors: Scott McCumskay
//Date:07/02/2019
mocha.setup('bdd');
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
    var targetx = 2;
    var targety = 2;
    drone.moveTo(targetx,targety);
    it('posx should be equal to targetx',function(){
      assert.equal(drone.posx,targetx);
    });
    it('posy should be equal to targety',function(){
      assert.equal(drone.posy,targety);
    });
  });
});

describe('RoverSprite class', function(){

});
