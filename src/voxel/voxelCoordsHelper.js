// this only works for cubic chunks (i.e. all dims are the same)
export default {
  getAbsoluteCoords(chunk, pos) {
    let d = chunk.dims[0];
    let z = Math.floor(pos / (d * d));
    let y = Math.floor((pos - d * d * z) / d);
    let x = Math.floor(pos - d * d * z - d * y);

    x += chunk.position[0] * d;
    y += chunk.position[1] * d;
    z += chunk.position[2] * d;

    return [x, y, z];
  },
  getFlatLocalPosition(chunk, coords) {
    let d = chunk.dims[0];
    let localCoords = [
      coords[0] - chunk.position[0] * d,
      coords[1] - chunk.position[1] * d,
      coords[2] - chunk.position[2] * d
    ];

    let flatLocalPosition = localCoords[0] + localCoords[1] * d + localCoords[2] * d * d;
    return flatLocalPosition;
  },
  isInside(chunk, coords) {
    let d = chunk.dims[0];
    let localCoords = [
      coords[0] - chunk.position[0] * d,
      coords[1] - chunk.position[1] * d,
      coords[2] - chunk.position[2] * d
    ];

    // if any local coordinate is smaller than 0 or larger than the chunk dimensions - 1 that's because the position is outside this chunk :)
    return localCoords.every(coord => coord >= 0 && coord < d);
  }
};
