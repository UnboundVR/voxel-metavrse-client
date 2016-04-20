export default {
  uncompress(voxels) {
    let output = [];
    voxels.forEach(item => {
      for (var i = 0; i < item[0]; i++) {
        output.push(item[1]);
      }
    });

    return output;
  }
};
