import THREE from 'three';
const glslify = require('glslify');

export default class Plane extends THREE.Object3D {
  constructor() {
    super();

    this.uniforms = {
      time: { type: 'f', value: 0.0 },
      resolution: { type: 'f', value: 60.0 },
    };
    this.geom = new THREE.PlaneGeometry( 60, 60, 32, 32 );
      this.mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../shaders/plane.vert'),
      fragmentShader: glslify('../shaders/plane.frag'),
      depthTest: false,
      transparent: true,
    });
    this.plane = new THREE.Mesh( this.geom, this.mat );
    this.plane.rotation.x = -0.33 * Math.PI;
    this.add( this.plane );
  }

  update(t) {
    this.mat.uniforms.time.value = t;
  }
}