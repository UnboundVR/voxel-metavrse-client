export default class Block {
  constructor(position, type) {
    this.position = position;
    this.type = type;
  }

  matchesPosition(pos) {
    return JSON.stringify(pos) == JSON.stringify(this.position);
  }

  adjacentTo(pos) {
    let d1 = Math.abs(this.position[0] - pos[0]);
    let d2 = Math.abs(this.position[1] - pos[1]);
    let d3 = Math.abs(this.position[2] - pos[2]);

    return d1 + d2 + d3 == 1;
  }
}
