import Webgl from './Webgl';
import raf from 'raf';
import dat from 'dat-gui';
import 'gsap';

let webgl;
let gui;

// webgl settings
webgl = new Webgl(window.innerWidth, window.innerHeight);
document.body.appendChild(webgl.renderer.domElement);

// GUI settings
gui = new dat.GUI();
gui.add(webgl.params, 'usePostprocessing');
const postFold = gui.addFolder('post processing');
postFold.add(webgl.params, 'vignette');
postFold.add(webgl.params, 'bloom');
const light1 = gui.addFolder('light 1')
light1.add(webgl.pointLight1.position, 'x')
light1.add(webgl.pointLight1.position, 'y')
light1.add(webgl.pointLight1.position, 'z')
const light2 = gui.addFolder('light 2')
light2.add(webgl.pointLight2.position, 'x')
light2.add(webgl.pointLight2.position, 'y')
light2.add(webgl.pointLight2.position, 'z')
gui.close();

// handle resize
window.addEventListener('resize', resizeHandler);

// let's play !
animate();

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  raf(animate);

  webgl.render();
}
