const { gui, webgl, assets } = require('../../context');
const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const confettiShader = require('../shaders/confetti.shader');
const defined = require('defined');

const colors = [
  '#e79080',
  '#c9dcce',
  '#e5ca8c',
];

module.exports = class Line extends THREE.Object3D {
  constructor (opts) {
    super();

    this.isExploding = false;
    this.isFalling = false;
    this.isSpinning = false;

    this.material = new LiveShaderMaterial(confettiShader, {
      transparent: true,
      lights: true,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        THREE.UniformsLib['common'],
        THREE.UniformsLib['fog'],
        {
          alpha: { value: 0 },
          time: { value: 0 },
          color: { value: new THREE.Color(colors[Math.floor(Math.random() * 3)]) },
        }
      ])
    });

    this.altMaterial = new THREE.MeshNormalMaterial();

    this.children = [];

    this.add(new THREE.Mesh(
      new THREE.BoxGeometry( 50 + (Math.random() * 4), opts.length * 100 + 20, 10, 2, 2, 1 ),
      this.material,
      // new THREE.MeshStandardMaterial({
      //   wireframe: false,
      //   color: colors[Math.floor(Math.random() * 3)],
      //   transparent: true
      // })
    ));

    this.lastResetTime = 0;
    this.repeatFalling = 1;
    this.updateIndex = 0;
    this.updateFunctions = [this.chilling, this.falling];


    // this.setUpdateFunction();
    // setInterval(this.setUpdateFunction, 4000);
    // setInterval(() => {
    //   this.repeatFalling = !this.repeatFalling;

    //   if (this.repeatFalling) { this.lastResetTime = Date.now() + this.index * 1000; }
    // }, 7000);
  }

  setUpdateFunction = () => {
    this.update = this.updateFunctions[this.updateIndex];
    this.updateIndex = this.updateIndex < this.updateFunctions.length - 1 ? this.updateIndex + 1 : 0;
  }

  update (dt = 0, time) {
    this.material.uniforms.time.value = time;

    if (this.isFalling) { this.falling(dt, time); }
    if (this.isSpinning) { this.spinning(dt, time); }
  }

  falling (dt = 0, time) {
    if (this.repeatFalling && this.position.y < -500) {
      this.position.y = 500 + this.index * 2;
      this.lastResetTime = time;
    }

    const t = this.lastResetTime - time;
    const xInc = Math.sin(this.index + t);
    let newY = this.position.y + (t - (t * this.index) / 200);

    this.position.x += xInc;
    this.position.y = newY;
  }

  spinning (dt = 0, time) {
    const inc = dt / (this.index * ((Math.sin(time) + 1.3) / 2.0));

    this.rotation.z += inc;
    this.rotation.y += inc;
  }
};