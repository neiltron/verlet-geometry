export default class Constraint {
  constructor (opts) {
    this.vertices = opts.vertices;
    this.index = opts.index;

    this.restingDistance = opts.restingDistance || this.vertices[0].distanceTo(this.vertices[1]);
    this.stiffness = opts.stiffness || .01;

    this.masses = opts.masses || [1, 1];

    if (this.index === 2) {
      // console.log(this.vertices[0], this.vertices[1]);
    }
  }

  update(dt = 0, time) {
    let distance = this.vertices[0].distanceTo(this.vertices[1]);
    let diffX = this.vertices[0].x - this.vertices[1].x;
    let diffY = this.vertices[0].y - this.vertices[1].y;
    let diffZ = this.vertices[0].z - this.vertices[1].z;

    let difference = (this.restingDistance - distance) / distance;

    let translateX = diffX * this.stiffness * difference;
    let translateY = diffY * this.stiffness * difference;
    let translateZ = diffZ * this.stiffness * difference;

    if (this.index === 2) {
      // console.log(this.vertices[0], this.vertices[1]);
    }


    if (this.masses[0] !== 0) {
      this.vertices[0].x += translateX * (2 / this.masses[0]) * 6;
      this.vertices[0].y += translateY * (2 / this.masses[0]) * 6;
      this.vertices[0].z += translateZ * (2 / this.masses[0]) * 6;
    }

    if (this.masses[1] !== 0) {
      this.vertices[1].x -= translateX * (2 / this.masses[1]) * 2;
      this.vertices[1].y -= translateY * (2 / this.masses[1]) * 2;
      this.vertices[1].z -= translateZ * (2 / this.masses[1]) * 2;
    }
  }
}