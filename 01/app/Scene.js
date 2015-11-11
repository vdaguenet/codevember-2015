import SineWave from './objects/SineWave';

export default class Scene {
  constructor($canvas, width, height) {
    this.$canvas = $canvas;
    this.context = this.$canvas.getContext('2d');

    this.width = 0;
    this.height = 0;

    this.params = {};

    this.tick = 0;
    this.lastTime = 0;

    this.sineWave1 = new SineWave(width, height, 2, '#666');
    this.sineWave1.amplitude = 120;
    this.sineWave1.frequency = 3;
    this.sineWave2 = new SineWave(width, height, 2, '#aaa');
    this.sineWave2.amplitude = 110;
    this.sineWave2.frequency = 3;
    this.sineWave3 = new SineWave(width, height, 2, '#fff');
    this.sineWave3.amplitude = 130;
    this.sineWave3.frequency = 3;

    this.resize(width, height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.sineWave1.resize(width, height);
    this.sineWave2.resize(width, height);
    this.sineWave3.resize(width, height);
    this.$canvas.width = width;
    this.$canvas.height = height;
  }

  render() {
    const now = Date.now();
    const elapsed = (now - this.lastTime) / 1000;
    // const squareLength = this.width * 0.6;
    const squareLength = 500;

    this.tick += elapsed;

    this.context.clearRect(0, 0, this.width, this.height);

    this.sineWave1.update(this.context, this.tick);
    this.sineWave2.update(this.context, this.tick);
    this.sineWave3.update(this.context, this.tick);

    this.context.save();
    this.context.strokeStyle = '#fff';
    this.context.lineWidth = 10;
    this.context.strokeRect((this.width - squareLength) * 0.5, (this.height - squareLength) * 0.5, squareLength, squareLength);
    this.context.restore();

    this.lastTime = now;
  }
}