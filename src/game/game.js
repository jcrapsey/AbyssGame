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
    },

    onReady:function ()
    {
      this._super();

      pc.device.resize(200,150);
      pc.device.scale = 4;

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
    }
});