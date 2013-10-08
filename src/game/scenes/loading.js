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
