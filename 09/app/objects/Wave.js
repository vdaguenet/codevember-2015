import THREE from 'three';
const glslify = require('glslify');

export default class Wave extends THREE.Object3D {
  constructor() {
    super();

    this.ready = false;
    this.particleSprite;
    this.uniforms = {
      time: { type: 'f', value: 0.0 },
    };
    this.nbParticles = 0;
    this.particleSize = 2.0;
    this.plane = new THREE.PlaneGeometry(150, 100, 150, 150);
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../shaders/wave.vert'),
      fragmentShader: glslify('../shaders/wave.frag'),
      depthTest: false,
      transparent: true,
    });

    this.init();

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.rotation.x = -0.45 * Math.PI;

    this.add(this.points);
    this.ready = true;

  }

  init() {
    this.nbParticles = this.plane.vertices.length;
    this.positions = new Float32Array(this.nbParticles * 3);
    this.sizes = new Float32Array(this.nbParticles);

    for (let i = 0, i3 = 0; i < this.nbParticles; i ++, i3 += 3) {
      this.positions[ i3 + 0 ] = this.plane.vertices[ i ].x;
      this.positions[ i3 + 1 ] = this.plane.vertices[ i ].y;
      this.positions[ i3 + 2 ] = this.plane.vertices[ i ].z;

      this.sizes[ i ] = this.particleSize;
    }

    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
  }

  update(t) {
    if (!this.ready) { return; }

    this.material.uniforms.time.value = t;
  }
}