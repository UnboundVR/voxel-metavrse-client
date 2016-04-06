import executor from './scriptExecutor';
import voxelEngine from '../voxelEngine';
import auth from '../auth';
import io from 'socket.io-client';
import github from './github';

var blocksWithCode = {};
var socket;

function resolveCode(blocks) {
  if(auth.isLogged()) {
    return Promise.resolve(blocks);
  } else {
    var promises = blocks.map(function(blockObj) {
      return github.getGist(blockObj.codeObj).then(function(codeObj) {
        blockObj.codeObj = codeObj;
      });
    });

    return Promise.all(promises).then(() => blocks);
  }
}

export default {
  init() {
    socket = io.connect(process.env.SERVER_ADDRESS + '/coding');
    socket.on('codeChanged', (position, codeObj) => {
      blocksWithCode[position] = codeObj;
      executor.update(position, codeObj.code);
      voxelEngine.setBlock(position, 2); // TODO unhardcode, we're setting this to a code block material
    });
    socket.on('codeRemoved', position => {
      delete blocksWithCode[position];
      executor.remove(position);
    });
  },
  getCode(position) {
    return blocksWithCode[position];
  },
  hasCode(position) {
    return !!blocksWithCode[position];
  },
  loadCode(blocks) {
    return resolveCode(blocks).then(blockObjs => {
      blockObjs.forEach(blockObj => {
        blocksWithCode[blockObj.position] = blockObj.codeObj;
      });
      return blockObjs;
    });
  },
  storeCode(position, code) {
    return new Promise(function(resolve, reject) {
      socket.emit('codeChanged', position, code, auth.getAccessToken(), (err, codeObj) => {
        if(err) {
          reject(err);
        } else {
          blocksWithCode[position] = codeObj;
          resolve(codeObj);
        }
      });
    });
  },
  removeCode(position) {
    delete blocksWithCode[position];
    socket.emit('codeRemoved', position);
  }
};
