import THREE from 'three';

export default class Triangle extends THREE.Object3D {
  constructor() {
    super();

    this.triangleGeom = new THREE.TetrahedronGeometry(12, 0);
    this.triangleMat = new THREE.MeshBasicMaterial({
      color: 0x819da4,
      linewidth: 3,
      wireframe: true,
    });
    this.triangle = new THREE.Mesh( this.triangleGeom, this.triangleMat );
    this.triangle.rotation.x = 0.29 * Math.PI;
    this.triangle.rotation.y = -0.25 * Math.PI;

    console.log(this.triangleGeom);

    this.add( this.triangle );
  }

  update() {}
}