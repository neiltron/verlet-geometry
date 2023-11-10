import Line from './Line';
import defined from 'defined';
const { webgl } = require('../../context');

module.exports = class Explosion extends THREE.Object3D {
  // random is a noise2d generator
  constructor (random, startX, startY) {
    super();

    this.build(random, startX, startY);
  }

  build (random, startX, startY) {
    for (let i = 0; i < 50; i++) {
      const x = ((Math.floor(i % 10) * 100) - 500) + ((Math.random() - .5) * 125);
      const y = ((Math.floor(i / 10) * 100) - 500) + ((Math.random() - .5) * 125);
      const length = random.noise2D(x, y);
      const line = new Line({ length: length });

      line.index = i;
      line.position.x = startX;
      line.position.y = startY;
      line.direction = [x, y];
      line.rotation.z = i;
      line.rotation.y = i;
      line.isFalling = false;
      line.isSpinning = true;

      this.add(line);
    }
  }

  update(dt = 0, time) {
    this.height = defined(this.width, window.innerWidth);
    this.width = defined(this.height, window.innerHeight);

    for (let i = 0; i < this.children.length; i++) {
      const line = this.children[i];

      if (
        line.position.y < this.height / -2 || line.position.y > this.height / 2 ||
        line.position.x < this.width / -2 || line.position.x > this.width / 2
      ) {
        webgl.scene.remove(line);
        line.parent.remove(line);
        line.remove();

        return false;
      }

      line.position.x += dt * (line.direction[0] / 2);
      line.position.y -= dt * (line.direction[1] / 1) - Math.sin(line.index * line.index);
      line.position.z -= dt * (line.direction[1] / 1) - Math.sin(line.index * line.index);
    }
  }
}
