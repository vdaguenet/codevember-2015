import ParticleContainer from './objects/ParticleContainer';

export default class Scene {
  constructor($canvas, width, height) {
    this.$canvas = $canvas;
    this.context = this.$canvas.getContext('2d');

    this.width = 0;
    this.height = 0;

    this.params = {};

    this.tick = 0;
    this.lastTime = 0;

    this.particleContainer = new ParticleContainer(10, width, height);

    this.resize(width, height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.particleContainer.resize(width, height);
    this.$canvas.width = width;
    this.$canvas.height = height;
  }

  render() {
    const now = Date.now();
    const elapsed = (now - this.lastTime) / 1000;

    this.tick += elapsed;

    this.context.clearRect(0, 0, this.width, this.height);
    this.particleContainer.update(this.context, this.tick);

    this.lastTime = now;
  }
}