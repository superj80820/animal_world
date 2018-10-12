/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
    // this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();//置中
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;this.game.scale.setShowAll();window.addEventListener('resize', function () {  this.game.scale.refresh();});this.game.scale.refresh();//全螢幕
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.spritesheet('chick', 'assets/sprites/chick.png', 37, 45, 20);
};

Game.create = function(){
    Game.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer();
};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'chick',1);
    left = Game.playerMap[id].animations.add('left',[10,11,12],15,true);
    right = Game.playerMap[id].animations.add('right',[0,1,2],15,true);

    // Game.playerMap[id].animations.play('run',[1,2],15, true);
    // game.physics.startSystem(Phaser.Physics.ARCADE);

    // //  Set the world (global) gravity
    // game.physics.arcade.gravity.y = 100;

    // //  Sprite 1 will use the World (global) gravity
    // // Game.playerMap[id] = game.add.sprite(100, 96, 'ilkke');

    // // Enable physics on those sprites
    // game.physics.enable( [ Game.playerMap[id] ], Phaser.Physics.ARCADE);

    // Game.playerMap[id].body.collideWorldBounds = true;
    // Game.playerMap[id].body.bounce.y = 0.8;
    
 
};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*5;
    
    if (x>player.x){
        player.play('left');
        tween.to({x:x,y:y}, duration);
        tween.start();
        tween.onComplete.add(function(){player.animations.stop();},this);
    }else
    if (x<player.x){
        player.play('right');
        tween.to({x:x,y:y}, duration);
        tween.start();
        tween.onComplete.add(function(){player.animations.stop();},this);
    }
    
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};