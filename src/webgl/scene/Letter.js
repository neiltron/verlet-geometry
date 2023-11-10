const { gui, webgl, assets } = require('../../context');
import { TweenMax, Power3 } from 'gsap';

module.exports = class Letter extends THREE.Object3D {
  constructor (opts) {
    super();

    this.font = opts.font;

    const mesh = new THREE.Mesh(
      new THREE.TextGeometry( opts.letter, {
        font: this.font,
        size: 60,
        height: 2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: .1,
        bevelSegments: 1
      }),
      new THREE.MeshBasicMaterial({
        wireframe: false,
        color: 'white',
        transparent: false,
        opacity: opts.opacity
      })
    );

    this.add(mesh);
  }

  setLetter(letter) {
    this.geometry = new THREE.TextGeometry( letter, {
      font: this.font,
      size: 60,
      height: 2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: .1,
      bevelSegments: 1
    });

    this.geometry.verticesNeedUpdate = true;
    this.geometry.elementsNeedUpdate = true;
    this.geometry.morphTargetsNeedUpdate = true;
    this.geometry.uvsNeedUpdate = true;
    this.geometry.normalsNeedUpdate = true;
    this.geometry.colorsNeedUpdate = true;
    this.geometry.tangentsNeedUpdate = true;
    this.geometry.groupsNeedUpdate = true;
    this.geometry.lineDistancesNeedUpdate = true;
  }

  rotate () {
    TweenMax.to(this.rotation, .3, {
      x: this.rotation.x + Math.PI / 2,
      ease: Power3.easeOut
    });
  }

  update (dt = 0, time) {
    // this.rotation.x = Math.PI / 2;

    // this.position.z = Math.sin(time * 10);
  }
};