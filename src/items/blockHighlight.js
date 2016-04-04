import highlight from 'voxel-highlight';
import voxelEngine from '../voxelEngine';
import events from '../events';
import consts from '../constants';
import executor from './itemExecutor';

var positionPlace, positionEdit;

export default {
  init() {
    var hl = voxelEngine.engine.highlighter = highlight(voxelEngine.engine, {
      color: 0xff0000,
      adjacentActive: executor.isAdjacentActive
    });

    hl.on('highlight', function (voxelPos) {
      positionEdit = voxelPos;
      events.emit(consts.events.HOVER, {}, {position: voxelPos});
    });

    hl.on('remove', function (voxelPos) {
      positionEdit = null;
      events.emit(consts.events.LEAVE, {}, {position: voxelPos});
    });

    hl.on('highlight-adjacent', function (voxelPos) {
      positionPlace = voxelPos;
    });

    hl.on('remove-adjacent', function () {
      positionPlace = null;
    });
  },
  getEditPosition() {
    return positionEdit;
  },
  getPlacePosition() {
    return positionPlace;
  }
};
