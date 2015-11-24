import THREE from 'three';
import Raymarcher from './objects/Raymarcher';
const OrbitControls = require('three-orbit-controls')(THREE);

export default class Webgl {
  constructor(width, height) {
    this.params = {};

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow( 2, 53 ), 1);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(width, height);

    this.raymarcher = new Raymarcher(width, height);
    this.scene.add(this.raymarcher.getMesh());
    this.controls = new OrbitControls(this.raymarcher.camera);
    this.controls.maxDistance = 50;

    this.clock = new THREE.Clock(true);
  }

  resize(width, height) {
    this.raymarcher.resize(width, height);
    this.renderer.setSize(width, height);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    this.raymarcher.update( this.clock.getElapsedTime() );
  }
}
