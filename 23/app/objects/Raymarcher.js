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
    this.geom = new THREE.BufferGeometry()
    this.geom.addAttribute( 'position', new THREE.BufferAttribute(this.positions, 3));

    this.camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
    this.camera.position.set(0, 1.0, -40.0);

    this.target = new THREE.Object3D();

    this.uniforms = {
      resolution:{ type: 'v2', value: new THREE.Vector2(this.width, this.height) },
      time: { type: 'f', value: 0.0 },
      camera: { type: 'v3', value: this.camera.position },
      target: { type: 'v3', value: this.target.position }
    };

    this.mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../shaders/main.vert'),
      fragmentShader: glslify('../shaders/main.frag')
    });

    this.mesh = new THREE.Mesh( this.geom, this.mat );
  }

  getMesh() {
    return this.mesh;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.mat.uniforms.resolution.value.x = this.width;
    this.mat.uniforms.resolution.value.y = this.height;
  }

  update(time) {
    this.mat.uniforms.time.value = time;
    this.mat.uniforms.resolution.value.x = this.width;
    this.mat.uniforms.resolution.value.y = this.height;
    this.mat.uniforms.camera.value = this.camera.position;
    this.mat.uniforms.target.value = this.target.position;
  }
}