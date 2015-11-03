import Scene from './Scene';
import raf from 'raf';
import dat from 'dat-gui';

const canvas = document.getElementById('c');
const scene = new Scene(canvas, window.innerWidth, window.innerHeight);

// GUI settings
const gui = new dat.GUI();
const f1 = gui.addFolder('wave1');
f1.add(scene.sineWave1, 'amplitude').min(50).max(300);
f1.add(scene.sineWave1, 'frequency').min(0).max(10);
const f2 = gui.addFolder('wave2');
f2.add(scene.sineWave2, 'amplitude').min(50).max(300);
f2.add(scene.sineWave2, 'frequency').min(0).max(10);
const f3 = gui.addFolder('wave3');
f3.add(scene.sineWave3, 'amplitude').min(50).max(300);
f3.add(scene.sineWave3, 'frequency').min(0).max(10);
gui.close();

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
