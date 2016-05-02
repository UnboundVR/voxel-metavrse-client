import highlight from 'voxel-highlight';
import voxel from '../voxel';
import events from '../events';
import consts from '../constants';
import toolbar from './toolbar';

var positionPlace, positionEdit;

export default {
  init() {
    var hl = highlight(voxel.engine, {
      color: 0xff0000,
      adjacentActive: toolbar.isAdjacentActive.bind(toolbar)
    });

    hl.on('highlight', function (voxelPos) {
      positionEdit = voxelPos;
      events.emit(consts.events.HOVER, {}, block => block.matchesPosition(voxelPos));
    });

    hl.on('remove', function (voxelPos) {
      positionEdit = null;
      events.emit(consts.events.LEAVE, {}, block => block.matchesPosition(voxelPos));
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
