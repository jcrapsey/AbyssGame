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
