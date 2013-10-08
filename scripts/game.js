CollisionType =
{
  NONE:0x0000, // BIT MAP
  BULLETS:0x0001, // 0000001
  ENEMY:0x0002, // 0000010
  FRIENDLY:0x0004, // 0000100
  WALL:0x0008
};

Abyss = pc.Game.extend('Abyss',
  {},
  {
    loadingScene: null,
    loadingLayer: null,
    soundManager: null,

    init: function(){
      this._super();
      pc.device.scale = 5;
      pc.device.scaledCanvas = document.getElementById("pcGameCanvasScale");
    },

    onReady:function ()
    {
      this._super();
      pc.device.onResize(this.onResize);

      // load resources
      pc.device.loader.setDisableCache();
      pc.device.loader.add(new pc.DataResource('DevMap', 'assets/maps/DevMap.tmx'));
      pc.device.loader.add(new pc.Image('DevTiles8', 'assets/tiles/DevTiles8.png'));
      pc.device.loader.add(new pc.Image('StarTiles128', 'assets/tiles/StarTiles128.png'));

      if (pc.device.soundEnabled)
      {
      }

      this.loadingScene = new LoadingScene();
      this.addScene(this.loadingScene);
      pc.device.loader.start(this.onLoading.bind(this), this.onLoaded.bind(this));
    },

    onLoading: function(){
      this.loadingScene.onLoading.apply(this.loadingScene, arguments);
    },

    onLoaded: function(){
      this.loadingScene.onLoaded.apply(this.loadingScene, arguments);

      this.gameScene = new DevScene();
      pc.device.game.addScene(this.gameScene);
    },

    onResize: function(){
      pc.device.scaledCanvas.width = pc.device.canvasWidth * pc.device.scale;
      pc.device.scaledCanvas.height = pc.device.canvasHeight * pc.device.scale;
      pc.device.scaledCtx = pc.device.scaledCanvas.getContext('2d');
      pc.device.scaledCtx.scale(pc.device.scale, pc.device.scale);
      pc.device.scaledCtx.imageSmoothingEnabled = false
      //pc.device.ctx.imageSmoothingEnabled = false;
      //pc.device.scale = 5;
      //pc.device.ctx.scale(5,5);
    },

    process: function(){
      this._super();
      pc.device.scaledCtx.clearRect(0, 0, pc.device.scaledCanvas.width, pc.device.scaledCanvas.height);      
      pc.device.scaledCtx.drawImage(pc.device.canvas, 0, 0);
    }
});
DevScene = pc.Scene.extend('DevScene',
  { },
  {
    gameLayer:null,
    init:function ()
    {
      this._super();
      this.loadFromTMX(pc.device.loader.get('DevMap').resource, new pc.EntityFactory());

      this.tileLayer = this.get('Main');
      this.gameLayer = this.get('entity');
      this.gameLayer.setZIndex(20);

      this.tileLayer.setOriginTrack(this.gameLayer);

      // entities
      var targetEntity = pc.Entity.create(this.gameLayer);
      targetEntity.addComponent( pc.components.Spatial.create({ x:0, y:0, w:3, h:3 }) );
      targetEntity.addComponent( pc.components.Rect.create({ color:'#ff2222' }) );
      targetEntity.addComponent( pc.components.Physics.create({
                            maxSpeed:{x:24, y:150},
                            friction:0.1,
                            fixedRotation:true,
                            bounce:0,
                            mass:1.5,
                            linearDamping:1,
                            collisionGroup:1,
                            collisionCategory:CollisionType.FRIENDLY,
                            collisionMask:CollisionType.FRIENDLY | CollisionType.ENEMY | CollisionType.WALL}) );
      this.playerSpatial =targetEntity.getComponent('spatial');
      console.log(this.playerSpatial);
      // systems
      this.gameLayer.addSystem(new DevControlSystem());
      this.gameLayer.addSystem(new ScaleRenderSystem());
      this.gameLayer.addSystem( new pc.systems.Physics({
        gravity: { x:0, y:0 },
        tileCollisionMap: {
          tileMap:this.tileLayer.tileMap,
          collisionCategory:CollisionType.WALL
        },
        collisionGroup:0
      }));

      // components
      targetEntity.addComponent(
        pc.components.Input.create({
          states:[
            ['up'   , ['UP'   ]],
            ['down' , ['DOWN' ]],
            ['left' , ['LEFT' ]],
            ['right', ['RIGHT']]
          ]
        })
      );
      console.log(this.gameLayer);
    },

    process:function ()
    {
      if (!pc.device.loader.finished) return;
      
      this.gameLayer.setOrigin(
                this.playerSpatial.getCenterPos().x - (this.viewPort.w / 2),
                this.playerSpatial.getCenterPos().y - (this.viewPort.h / 2));

      pc.device.ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);

      this._super();
    }

  }
);

LoadingScene = pc.Scene.extend('LoadingScene',
  { },
  {
    percentageComplete:0,
    loadingLayer:null,

    init:function ()
    {
      this._super();
      this.loadingLayer = new pc.Layer('loading');
      this.addLayer(this.loadingLayer);
    },

    process:function ()
    {
      var ctx = pc.device.ctx;
      ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);
      ctx.font = "normal 50px Times";
      ctx.fillStyle = "#bbb";
      ctx.fillText('Abyss', (pc.device.canvasWidth / 2)-61, (pc.device.canvasHeight / 2)-50);
      ctx.font = "normal 14px Verdana";
      ctx.fillStyle = "#777";
      ctx.fillText('Loading: ' + this.percentageComplete + '%', (pc.device.canvasWidth/2)-51, pc.device.canvasHeight/2);
      this._super();
    },

    onLoading:function (percentageComplete)
    {
      this.percentageComplete = percentageComplete;
    },

    onLoaded:function ()
    {
    }

  }
);

/**
* PlayerControlSystem
* Handle input for the player
*/

DevControlSystem = pc.systems.Input.extend('PlayerControlSystem', { }, {

  init:function ()
  {
    this._super([ 'input' ], 60);
  },

  onAction: function(){
    console.log('action?');
  },

  process:function (entity)
  {
    this._super(entity);
    var isUpState    = this.isInputState(entity, 'up'   );
    var isDownState  = this.isInputState(entity, 'down' );
    var isLeftState  = this.isInputState(entity, 'left' );
    var isRightState = this.isInputState(entity, 'right');
    var entityPhysics;

    if(isUpState || isDownState || isLeftState || isRightState){
      entityPhysics = entity.getComponent('physics');
      if(isUpState){ entityPhysics.applyImpulse(0.4,-90); }
      if(isDownState){ entityPhysics.applyImpulse(0.4,90); }
      if(isLeftState){ entityPhysics.applyImpulse(0.4,180); }
      if(isRightState){ entityPhysics.applyImpulse(0.4,0); }
    }
  }
});
/**
* PlayerControlSystem
* Handle input for the player
*/

ScaleRenderSystem = pc.systems.Render.extend('ScaleRenderSystem', { }, {
  processAll: function(){
    this._super();
  }
});
//@ sourceMappingURL=game.js.map