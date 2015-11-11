import Scene from './Scene';
import raf from 'raf';

const canvas = document.getElementById('c');
const scene = new Scene(canvas, window.innerWidth, window.innerHeight);

// handle resize
window.addEventListener('resize', resizeHandler);

// let's play !
animate();

function resizeHandler() {
  scene.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  raf(animate);

  scene.render();
}
