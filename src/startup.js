import { TweenMax, Elastic } from 'gsap';
import CustomEase from './vendor/CustomEase';
const Line = require('./webgl/scene/Line');
const Letter = require('./webgl/scene/Letter');
const Explosion = require('./webgl/scene/Explosion');
const Ball = require('./webgl/scene/Ball');
// const SpinningBox = require('./webgl/scene/SpinningBox');
const ws = require('./websockets').default;
const Random = require('./util/Random');

const random = new Random('what it do');

const { assets, webgl, gui } = require('./context');

// will eventually hold a reference to the font file for adding to Letters
let fontKey;
let font;
let letterOpacity = 1;
let wordIndex = 0;


const mouse = [0, 0];

const updateMousePos = (e) => {
  mouse[0] = (e.clientX - (document.body.clientWidth / 2)) - 1;
  mouse[1] = document.body.clientHeight - e.clientY - (document.body.clientHeight / 2);

  balls.forEach(ball => {
    ball.setMouse(mouse);
  });
};

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('touchmove', updateMousePos);



const lines = new THREE.Object3D();
const buildLines = () => {
  for (let i = 0; i < 100; i++) {
    const x = ((Math.floor(i % 10) * 100) - 625) + ((Math.random() - .5) * 125);
    const y = ((Math.floor(i / 10) * 100) - 500) + ((Math.random() - .5) * 125);
    const length = random.noise2D(x, y);
    const line = new Line({ length: length });

    line.index = i;
    line.position.x = x;
    line.position.y = y;
    line.rotation.z = i;
    line.rotation.y = i;
    line.isFalling = true;
    line.isSpinning = true;

    lines.add(line);
  }
}


const balls = [];

for (let i = 0; i < 25; i++) {
  const ball = new Ball({ index: i });
  webgl.scene.add(ball);

  balls.push(ball);
}


const letters = new THREE.Object3D();
const words = [
  'ENJOY'.split(''),
  'ENJOY: The Sounds '.split(''),
  'ENJOY: Yourself '.split(''),
  'ENJOY: Your Weekend '.split(''),
];

const buildLetters = () => {
  for (let i = 0; i < 100; i++) {
    const letter = new Letter({
      font: font,
      letter: words[0][Math.floor(i % words[0].length)] || '?',
      opacity: letterOpacity ? 1 : 0,
    });

    letter.index = i;
    letter.position.x = ((Math.floor(i % 10) * 140) - 625);
    letter.position.y = ((Math.floor(i / 10) * 140) - 500);
    letter.position.z -= 100;
    letter.rotation.z = (i / 40) + (i / 100);

    letters.add(letter);
  }
}


module.exports = function () {
  // Set background color
  const background = 'black';
  document.body.style.background = background;
  webgl.renderer.setClearColor(background);

  // Hide canvas while loading assets
  webgl.canvas.style.visibility = 'hidden';

  var loader = new THREE.FontLoader();

  fontKey = assets.queue({
    // url: '/Replica-Mono_Regular.json'
    url: '/proxima-nova-thin.json'
  });

  // Preload any queued assets
  assets.loadQueued(() => {
    console.log('Done loading');

    const loader = new THREE.FontLoader();

    font = loader.parse(assets.get(fontKey));

    webgl.canvas.style.visibility = '';
    webgl.canvas.addEventListener('touchstart', ev => ev.preventDefault());

    // buildLines();
    // buildExplosion();
    // buildLetters();

    setInterval(() => {
      for (let i = 0; i < letters.children.length; i++) {
        letters.children[i].rotate();
      }
    }, 2000);

    webgl.scene.add(lines);
    webgl.scene.add(letters);

    ws.onmessage = (e) => {
      const rotation = JSON.parse(e.data);


      TweenMax.to(webgl.scene.rotation, 1.0, {
        x: webgl.scene.rotation.x + rotation.x / 2000,
        y: webgl.scene.rotation.y + rotation.y / 2000,
        z: webgl.scene.rotation.z + rotation.z / 1200,
        ease: Elastic.easeOut,
        onComplete: () => {
          // console.log('animated', webgl.scene.rotation);

          animate(webgl.scene.rotation, 1.0, {
            x: 0,
            y: 0,
            z: 0,
            ease: Elastic.easeOut
          });
        }
      });
    }

    // start animation loop
    webgl.start();
    webgl.draw();

    document.addEventListener('click', (e) => {
      letterOpacity = !letterOpacity;

      // const explosion = new Explosion(random, (e.clientX - (document.body.clientWidth / 2)) - 1, (document.body.clientHeight - e.clientY - (document.body.clientHeight / 2)));
      // webgl.scene.add(explosion);

      balls.forEach(ball => {
        ball.mesh.material.wireframe = !ball.mesh.material.wireframe;
        ball.mesh.needsUpdate = true;
      });

      // letters.children.forEach(letter => {
      //   TweenMax.to(letter.children[0].material, 1, {
      //     opacity: letterOpacity ? 1 : 0,
      //     ease: Power3.easeInOut
      //   });
      // });

      // lines.children.forEach(line => {
      //   TweenMax.to(line.children[0].material, 1, {
      //     opacity: !letterOpacity ? 1 : 0,
      //     ease: Power3.easeInOut
      //   });
      // });
    });

    // setInterval(() => {
    //   wordIndex = wordIndex < words.length - 1 ? wordIndex + 1 : 0;

    //   letters.children.forEach((letter, i) => {
    //     letter.setLetter(words[wordIndex][Math.floor(i % words[wordIndex].length)] || '?');

    //     // const newLetter = new Letter({
    //     //   letter: words[wordIndex][Math.floor(i % words[wordIndex].length)] || '?',
    //     //   opacity: letterOpacity ? 1 : 0,
    //     //   font: font,
    //     // });

    //     // const { px, py, pz } = letter.position;
    //     // const { rx, ry, rz } = letter.position;

    //     // newLetter.position.x = px;
    //     // newLetter.position.y = py;
    //     // newLetter.position.z = pz;
    //     // newLetter.rotation.x = rx;
    //     // newLetter.rotation.y = ry;
    //     // newLetter.rotation.z = rz;

    //     // letters.remove(letter);
    //     // letters.add(newLetter);
    //     // webgl.scene.add(newLetter);
    //   });
    // }, 5000);
  });
};