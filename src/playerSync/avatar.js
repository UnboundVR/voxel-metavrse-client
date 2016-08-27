import player from 'voxel-player';
import fly from 'voxel-fly';
import walk from 'voxel-walk';
import voxel from '../voxel';
import teleport from '../teleport';

let avatar, avatarVisible;

// TODO instead of doing this, we should probably show/hide the whole object, or place the camera further away (so we can use a mirror for example)
function setAvatarVisibility(visible) {
  avatar.playerSkin.rightArm.visible = visible;
  avatar.playerSkin.leftArm.visible = visible;
  avatar.playerSkin.rightLeg.visible = visible;
  avatar.playerSkin.leftLeg.visible = visible;
  avatar.playerSkin.head.visible = visible;
  avatar.playerSkin.body.visible = visible;

  avatarVisible = visible;
}

export default {
  setup(settings) {
    var createPlayer = player(voxel.engine);
    avatar = createPlayer('assets/avatars/player.png');
    avatar.possess();
    var initialPos = teleport.teleportPosition || settings.initialPosition;
    avatar.position.set(initialPos[0], initialPos[1], initialPos[2]);

    var makeFly = fly(voxel.engine);
    var target = voxel.engine.controls.target();
    voxel.engine.flyer = makeFly(target);
    setAvatarVisibility(false);

    function onTick() {
      walk.render(target.playerSkin);
      var vx = Math.abs(target.velocity.x);
      var vz = Math.abs(target.velocity.z);
      if (vx > 0.001 || vz > 0.001) {
        walk.stopWalking();
      } else {
        walk.startWalking();
      }
    }

    voxel.engine.on('tick', onTick);
  },
  toggleCamera() {
    avatar.toggle();
    setAvatarVisibility(!avatarVisible);
  },
  move(position) {
    avatar.position.set(position[0], position[1], position[2]);
  }
};
