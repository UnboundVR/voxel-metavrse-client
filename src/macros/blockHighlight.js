import highlight from 'voxel-highlight';
import voxelEngine from '../voxelEngine';
import events from '../events';
import consts from '../constants';

var position;

export default {
  init() {
    var hl = voxelEngine.engine.highlighter = highlight(voxelEngine.engine, {
      color: 0xff0000
    });

    hl.on('highlight', function (voxelPos) {
      position = voxelPos;
      events.emit(consts.events.HOVER, {}, {position: voxelPos});
    });

    hl.on('remove', function (voxelPos) {
      position = null;
      events.emit(consts.events.LEAVE, {}, {position: voxelPos});
    });

    hl.on('highlight-adjacent', function (voxelPos) {
      position = voxelPos;
    });

    hl.on('remove-adjacent', function () {
      position = null;
    });
  },
  getPosition() {
    return position;
  }
};
