import Particle from '../lib/Particle';

export default class ParticleContainer {
  constructor(nbParticle, width, height) {
    this.width = width;
    this.height = height;
    this.nbParticle = nbParticle;
    this.pool = [];
    this.angles = [];
    this.slice = 0;
    this.speed = 0.01;

    this.populate();
  }

  populate() {
    let p;
    let x;
    let y;
    let angle = 0;
    this.slice = 2 * Math.PI / this.nbParticle;

    for (let i = 0; i < this.nbParticle; i++) {
      angle = this.slice * i;
      x = 0.5 * this.width + Math.cos(angle) * 150;
      y = 0.5 * this.height + Math.sin(angle) * 150;

      p = new Particle(x, y);
      p.color = '#fff';
      this.pool.push(p);
      this.angles[i] = angle;
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  update(context, tick) {
    this.pool.forEach((particle, i) => {
      this.angles[i] += this.speed;
      particle.position.x = 0.5 * this.width + Math.cos(this.angles[i]) * 150;
      particle.position.y = 0.5 * this.height + Math.sin(this.angles[i]) * 150;

      particle.update();
      particle.draw(context);
    });
  }
}