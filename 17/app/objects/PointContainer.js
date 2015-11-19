import THREE from 'three';

export default class PointContainer extends THREE.Object3D {
  constructor() {
    super();

    this.size = 30;

    this.geom = new THREE.CircleGeometry(1, 32);
    this.mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geom, this.mat);
    let point;
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        for (var z = 0; z < 4; z++) {
          point = this.mesh.clone();
          point.position.x = -0.5 * this.size + 0.25 * x * this.size + 2 * x;
          point.position.y = 0.5 * this.size - 0.25 * y * this.size - 2 * y;
          point.position.z = 0.5 * this.size - 0.25 * z * this.size;
          this.add(point);
        }
      }
    }
  }

  update() {
    this.rotation.y += 0.1;
  }
}