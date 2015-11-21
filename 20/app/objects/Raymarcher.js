import THREE from 'three';
const glslify = require('glslify');

export default class Raymarcher {
  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;

    this.positions = new Float32Array([
      -1, -1, 0,
      1, -1, 0,
      1, 1, 0,
      -1, -1, 0,
      1, 1, 0,
      -1, 1, 0
    ]);
    this.geom = new THREE.BufferGeometry();
    this.geom.addAttribute( 'position', new THREE.BufferAttribute(this.positions, 3));

    this.uniforms = {
      resolution:{ type: 'v2', value: new THREE.Vector2(this.width, this.height) },
      time: { type: 'f', value: 0.0 },
    };

    this.mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../shaders/raymarcher.vert'),
      fragmentShader: glslify('../shaders/raymarcher.frag'),
    });

    this.mesh = new THREE.Mesh( this.geom, this.mat );
  }

  getMesh() {
    return this.mesh;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.mat.uniforms.resolution.value.x = width;
    this.mat.uniforms.resolution.value.y = height;
  }

  update(time) {
    this.mat.uniforms.time.value = time;
  }
}