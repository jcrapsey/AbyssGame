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