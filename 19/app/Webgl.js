// import THREE from 'three';
import Raymarcher from './objects/Raymarcher';

export default class Webgl {
  constructor(width, height) {
    this.params = {};

    this.scene = new THREE.Scene();

    this.renderCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow( 2, 53 ), 1);
    // this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    // this.camera.position.z = 100;


    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x262626);

    this.raymarcher = new Raymarcher(width, height);
    this.scene.add(this.raymarcher.getMesh());

    this.clock = new THREE.Clock(true);
  }

  resize(width, height) {
    // this.camera.aspect = width / height;
    // this.camera.updateProjectionMatrix();
    this.raymarcher.resize(width, height);
    this.renderer.setSize(width, height);
  }

  render() {
    this.renderer.render(this.scene, this.renderCamera);

    this.raymarcher.update( this.clock.getElapsedTime() );
  }
}
