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
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  update(context, tick) {
    let angle;
    this.slice = lerp(-Math.sin(tick * 0.8), 0, this.sliceTo);

    this.pool.forEach((particle, i) => {
      angle = this.slice * i;
      particle.position.x = 0.5 * this.width + Math.cos(angle) * this.radius;
      particle.position.y = 0.5 * this.height + Math.sin(angle) * this.radius;

      particle.update();
      particle.draw(context);
    });
  }
}