import THREE from 'three';
import explodeGeometry from '../utils/explodeGeometry';

export default class Sphere extends THREE.Object3D {
  constructor() {
    super();

    let geomTemp = new THREE.SphereGeometry(20, 12, 12);
    this.geom = explodeGeometry(geomTemp);
    geomTemp.dispose();
    this.oGeom = this.geom.clone();
    this.mat = new THREE.MeshPhongMaterial({
      color: 0x000000,
      wireframe: false,
      shininess: 10,
      shading: THREE.FlatShading,
      side: THREE.DoubleSide
    });
    this.sphereExploded = new THREE.Mesh(this.geom, this.mat);

    this.heartSphere = new THREE.Mesh(
      new THREE.SphereGeometry(18, 32, 32),
      new THREE.MeshLambertMaterial({ color: 0xebe3d7 })
    );

    this.add(this.heartSphere);
    this.add(this.sphereExploded);

    this.explodeFactor = 1;
    this.explode();
  }

  explode() {
    let n;
    for (let i = 0, l = this.geom.vertices.length; i < l; i++) {
      n = this.geom.faces[~~(i/3)].normal.clone();
      this.geom.vertices[i].x = this.oGeom.vertices[i].x + n.x * this.explodeFactor;
      this.geom.vertices[i].y = this.oGeom.vertices[i].y + n.y * this.explodeFactor;
      this.geom.vertices[i].z = this.oGeom.vertices[i].z + n.z * this.explodeFactor;
    };
    this.geom.verticesNeedUpdate = true;
  }

  update(t) {
    this.rotation.y += 0.005
    this.explodeFactor = 1 + Math.max(Math.sin(t * .8), 0) * 5;
    this.explode();
  }
}