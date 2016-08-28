import avatar from './avatar';
import voxel from '../voxel';
import skin from 'minecraft-skin';
import io from 'socket.io-client';
import consts from '../constants';
import location from './location';
import loading from '../loading';

let socket;
let initialized = false;

export default {
  init() {
    let loadingResource = loading.log('Initializing player sync...');

    var self = this;

    socket = io.connect(consts.SERVER_ADDRESS() + '/playerSync');
    socket.on('connect', () => {
      console.log(`Got playerSync id ${socket.id} from server`);
      self.playerId = socket.id;
    });

    socket.on('settings', settings => {
      if(initialized) {
        console.log('playerSync settings already received, ignoring this time');
        return;
      } else {
        console.log('Receiving playerSync settings');
      }

      self.settings = settings;
      self.others = {};

      function sendState() {
        if (!socket.connected) {
          return;
        }
        var player = voxel.engine.controls.target();
        var state = {
          position: player.yaw.position,
          rotation: {
            y: player.yaw.rotation.y,
            x: player.pitch.rotation.x
          }
        };
        socket.emit('state', state);
      }

      voxel.engine.controls.on('data', state => {
        var interacting = false;
        Object.keys(state).map(control => {
          if (state[control] > 0) {
            interacting = true;
          }
        });

        if (interacting) {
          sendState();
        }
      });

      // setTimeout is because three.js seems to throw errors if you add stuff too soon
      setTimeout(() => {
        socket.on('update', updates => {
          Object.keys(updates.positions).map(player => {
            var update = updates.positions[player];
            if (player === self.playerId) {
              return self.onServerUpdate(update); // local player
            }
            self.updatePlayerPosition(player, update); // other players
          });
        });
      }, 1000);

      socket.on('leave', id => {
        if (!self.others[id]) {
          return;
        }
        voxel.engine.scene.remove(self.others[id].mesh);
        delete self.others[id];
      });

      avatar.setup(settings);
      location.init();
      initialized = true;

      loadingResource.finish('Initialized player sync');
    });
  },
  moveUser(position) {
    avatar.move(position);
  },
  displayShareLink() {
    location.shareLocation();
  },
  getInitialPosition(settings) {
    return location.getInitialPosition(settings);
  },
  onServerUpdate(update) {
    // TODO use server sent location
  },
  updatePlayerPosition(id, update) {
    function scale( x, fromLow, fromHigh, toLow, toHigh ) {
      return ( x - fromLow ) * ( toHigh - toLow ) / ( fromHigh - fromLow ) + toLow;
    }

    var pos = update.position;
    var player = this.others[id];
    if (!player) {
      let playerSkin = skin(voxel.engine.THREE, 'assets/avatars/player.png', {
        scale: new voxel.engine.THREE.Vector3(0.04, 0.04, 0.04)
      });
      let playerMesh = playerSkin.mesh;
      this.others[id] = playerSkin;
      playerMesh.children[0].position.y = 10;
      voxel.engine.scene.add(playerMesh);
    }

    let playerSkin = this.others[id];
    let playerMesh = playerSkin.mesh;
    playerMesh.position.copy(playerMesh.position.lerp(pos, this.settings.lerpPercent));

    playerMesh.children[0].rotation.y = update.rotation.y + (Math.PI / 2);
    playerSkin.head.rotation.z = scale(update.rotation.x, -1.5, 1.5, -0.75, 0.75);
  },
  toggleCamera: avatar.toggleCamera.bind(avatar)
};
