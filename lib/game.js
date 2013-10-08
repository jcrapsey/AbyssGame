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