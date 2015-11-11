import THREE from 'three';
import WAGNER from '@superguigui/wagner';
import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass';
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass';
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass';
import Sphere from './objects/Sphere';

export default class Webgl {
  constructor(width, height) {
    this.params = {
      usePostprocessing: true,
      vignette: true,
      bloom: true,
    };

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.z = 100;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);

    this.initLights();

    this.composer = new WAGNER.Composer(this.renderer);
    this.initPostprocessing();

    this.sphere = new Sphere();
    this.sphere.position.set(0, 0, 0);
    this.scene.add(this.sphere);

    this.clock = new THREE.Clock(true);
  }

  initLights() {
    this.pointLight1 = new THREE.PointLight( 0xffffff, 1, 0 );
    this.pointLight2 = new THREE.PointLight( 0xffffff, 1, 0 );

    this.pointLight1.position.set( 64, 104, 23);
    this.pointLight2.position.set( 0, 0, 100 );

    this.scene.add( this.pointLight1 );
    this.scene.add( this.pointLight2 );
  }

  initPostprocessing() {
    if (!this.params.usePostprocessing) { return; }

    this.vignettePass = new VignettePass();
    this.fxaaPass = new FXAAPass();
    this.bloomPass = new BloomPass({
      blurAmount: 2,
      zoomBlurStrength: 0.99,
      applyZoomBlur: true
    });
  }

  resize(width, height) {
    if (this.composer) {
      this.composer.setSize(width, height);
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  render() {
    if (this.params.usePostprocessing) {
      this.composer.reset();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.fxaaPass);
      if (this.params.vignette) { this.composer.pass(this.vignettePass); }
      if (this.params.bloom) { this.composer.pass(this.bloomPass); }
      this.composer.toScreen();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.sphere.update(this.clock.getElapsedTime());
  }
}
