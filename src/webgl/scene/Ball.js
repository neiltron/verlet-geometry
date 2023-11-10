import { TweenMax, Power1 } from 'gsap';
import defined from 'defined';
import Constraint from './Constraint';
const { webgl } = require('../../context');

let lastX = 0;
let lastY = 0;
let rotationDiffX = 0;
let rotationDiffY = 0;

let innerY = 0;

module.exports = class Ball extends THREE.Object3D {
  constructor (opts) {
    super();

    this.constraints = [];

    this.index = opts.index;

    this.cellSize = 200;
    this.position.x = (Math.floor(this.index % 5) * this.cellSize) - ((document.body.clientWidth / 2) - this.cellSize * 1.25);
    this.position.y = (Math.floor(this.index / 5) * this.cellSize) - ((document.body.clientHeight / 2) - this.cellSize * 1.25);

    this.build();
  }

  setMouse(mouse) {
    this.mouse = mouse;
  }

  build () {
    const material = new THREE.MeshStandardMaterial({ transparent: false, opacity: .8, color: 0xff0000, wireframe: false });
    const innerMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0, color: 0xff00ff });
    this.sphere = new THREE.SphereGeometry(this.cellSize / 3, 20, 20);
    this.sphere.computeFaceNormals();
    this.innerSphere = new THREE.SphereGeometry(this.cellSize / 6, 20, 20);
    this.innerSphere.computeFaceNormals();

    var envMap = new THREE.TextureLoader().load('cat3.png');
    envMap.mapping = THREE.SphericalReflectionMapping;
    material.envMap = envMap;
    material.aoMap = envMap;
    material.aoMapIntensity = 1;
    // material.map = envMap;

    this.mesh = new THREE.Mesh(this.sphere, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.innerMesh = new THREE.Mesh(this.innerSphere, innerMaterial);

    this.innerMesh.updateMatrix();
    this.innerMesh.geometry.applyMatrix( this.innerMesh.matrix );
    this.innerMesh.matrix.identity();

    var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
    var lineGeometry = new THREE.Geometry();

    this.add(this.mesh);
    this.add(this.innerMesh);

    const uvs = this.sphere.vertices;

    // console.log('uvs', this.sphere);

    // console.log(this.mesh.geometry.vertices[0])

    for (let i = 0; i < this.mesh.geometry.vertices.length; i += 1) {
      // console.log(this.mesh.geometry.vertices[i]);

        this.constraints.push(
          new Constraint({
            vertices: [
              this.mesh.geometry.vertices[i],
              this.innerMesh.geometry.vertices[i]
            ],
            masses: [1, 1],
            stiffness: .04,
            index: this.constraints.length
          })
        );

        lineGeometry.vertices.push(this.mesh.geometry.vertices[i]);
        lineGeometry.vertices.push(this.innerMesh.geometry.vertices[i]);
    }


    for (let i = 0; i < this.mesh.geometry.faces.length; i += 1) {
        this.constraints.push(
          new Constraint({
            vertices: [
              this.mesh.geometry.vertices[this.mesh.geometry.faces[i]['a']],
              this.mesh.geometry.vertices[this.mesh.geometry.faces[i]['b']]
            ],
            stiffness: .05,
            index: this.constraints.length
          })
        );

        this.constraints.push(
          new Constraint({
            vertices: [
              this.mesh.geometry.vertices[this.mesh.geometry.faces[i]['a']],
              this.mesh.geometry.vertices[this.mesh.geometry.faces[i]['c']]
            ],
            stiffness: .05,
            index: this.constraints.length
          })
        );

        this.constraints.push(
          new Constraint({
            vertices: [
              this.mesh.geometry.vertices[this.mesh.geometry.faces[i]['b']],
              this.mesh.geometry.vertices[this.mesh.geometry.faces[i]['c']]
            ],
            stiffness: .05,
            index: this.constraints.length
          })
        );


        lineGeometry.vertices.push(this.mesh.geometry.faces[i]['a']);
        lineGeometry.vertices.push(this.mesh.geometry.faces[i]['b']);
        lineGeometry.vertices.push(this.mesh.geometry.faces[i]['a']);
        lineGeometry.vertices.push(this.mesh.geometry.faces[i]['c']);
        lineGeometry.vertices.push(this.mesh.geometry.faces[i]['b']);
        lineGeometry.vertices.push(this.mesh.geometry.faces[i]['c']);
    }

    // console.log(this.constraints.length)

    this.lineMesh = new THREE.Line( lineGeometry, lineMaterial );
    // this.add(this.lineMesh);
  }

  update(dt = 0, time) {
    this.lineMesh.geometry.vertices = [];


    rotationDiffX -= lastX - this.mouse[0] + this.position.y / 50;
    rotationDiffY += lastY - this.mouse[1] + this.position.x / 50;

    rotationDiffX /= 1000;
    rotationDiffY /= 1000;

    lastX = this.mouse[0];
    lastY = this.mouse[1];


    TweenMax.to(this.mesh.position, 10, {
      x: this.mouse[0] / 500,
      y: this.mouse[1] / 500,
    }, Power1.easeInOut);

    TweenMax.to(this.innerMesh.rotation, 1, {
      x: rotationDiffY,
      y: rotationDiffX,
    }, Power1.easeInOut);

    this.mesh.updateMatrix();
    this.mesh.geometry.applyMatrix( this.innerMesh.matrix );
    this.mesh.matrix.identity();

    // this.innerMesh.updateMatrix();
    // this.innerMesh.geometry.applyMatrix( this.innerMesh.matrix );
    // this.innerMesh.matrix.identity();


    for (var i = 0; i < this.constraints.length; i++) {
      this.constraints[i].update(dt, time);

      // this.mesh.geometry.vertices[i] = this.constraints[i].vertices[0];
      // this.innerMesh.geometry.vertices[i] = this.constraints[i].vertices[1];

      this.lineMesh.geometry.vertices.push(this.constraints[i].vertices[0]);
      this.lineMesh.geometry.vertices.push(this.constraints[i].vertices[1]);
    }

    this.mesh.geometry.computeVertexNormals();
    this.mesh.geometry.computeFaceNormals();
    this.mesh.geometry.verticesNeedUpdate = true;
    // this.mesh.geometry.elementsNeedUpdate = true;
    this.mesh.geometry.normalsNeedUpdate = true;

    this.lineMesh.geometry.verticesNeedUpdate = true;
  }
}
