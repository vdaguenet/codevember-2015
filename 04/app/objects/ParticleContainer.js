import Particle from '../lib/Particle';
import { lerp } from '../lib/math';

export default class ParticleContainer {
  constructor(nbParticle, width, height) {
    this.width = width;
    this.height = height;
    this.nbParticle = nbParticle;
    this.pool = [];
    this.angles = [];
    this.radius = 200;
    this.slice = 0;
    this.sliceTo = 2 * Math.PI / this.nbParticle;
    this.speed = 0;
    this.dir = 1;

    this.populate();
  }

  populate() {
    let p;
    let x;
    let y;
    let angle = 0;

    for (let i = 0; i < this.nbParticle; i++) {
      angle = this.slice * i;
      x = 0.5 * this.width + Math.cos(angle) * this.radius;
      y = 0.5 * this.height + Math.sin(angle) * this.radius;

      p = new Particle(x, y, 8);
      p.color = '#fff';
      this.pool.push(p);
      this.angles.push(angle);
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  update(context, tick) {
    if (this.slice >= this.sliceTo - 0.001 && this.dir === 1 && tick > 0.5) {
      this.dir = -1;
    }

    if (this.slice <= 0.01 && this.slice >= -0.01 && this.dir === -1) {
      this.dir = 1;
    }

    this.slice = lerp(this.dir * Math.abs(Math.sin(tick * 0.8)), 0, this.sliceTo);

    this.pool.forEach((particle, i) => {
      this.angles[i] = this.slice * i;
      particle.position.x = 0.5 * this.width + Math.cos(this.angles[i]) * this.radius;
      particle.position.y = 0.5 * this.height + Math.sin(this.angles[i]) * this.radius;

      particle.update();
      particle.draw(context);
    });
  }
}