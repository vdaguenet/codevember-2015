import Hexagon from './objects/Hexagon';

export default class Scene {
  constructor($canvas, width, height) {
    this.$canvas = $canvas;
    this.context = this.$canvas.getContext('2d');

    this.width = 0;
    this.height = 0;

    this.params = {};

    this.tick = 0;
    this.lastTime = 0;

    this.hexagons = [];
    let h;
    for (let i = 0; i < 8; i++) {
      h = new Hexagon(width, height, 1 - i / 9);
      h.alpha = 0.5 - i * 0.5 / 8;
      this.hexagons.push(h);
    }
    this.nbHexagon = this.hexagons.length;

    this.resize(width, height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.hexagons.forEach((hexa) => {
      hexa.resize(width, height);
    });
    this.$canvas.width = width;
    this.$canvas.height = height;
  }

  render() {
    const now = Date.now();
    const elapsed = (now - this.lastTime) / 1000;

    this.tick += elapsed;

    this.context.clearRect(0, 0, this.width, this.height);
    this.hexagons.forEach((hexa, i) => {
      if (i === ~~((this.tick * 10) % this.nbHexagon)) {
        hexa.alpha = 1;
      } else {
        hexa.alpha = 0.5 - i * 0.5 / 8;
      }
      hexa.update(this.context, this.tick);
    });

    this.lastTime = now;
  }
}