import SineWave from './objects/SineWave';

export default class Scene {
  constructor($canvas, width, height) {
    this.$canvas = $canvas;
    this.context = this.$canvas.getContext('2d');

    this.width = 0;
    this.height = 0;

    this.tick = 0;
    this.lastTime = 0;
    this.previousAlpha = 1;

    this.sineWave1 = new SineWave(width, height, 4, '#fff');
    this.sineWave1.amplitude = 90;
    this.sineWave1.frequency = 2;
    this.sineWave2 = new SineWave(width, height, 4, '#fff');
    this.sineWave2.amplitude = 90;
    this.sineWave2.frequency = -2;

    this.resize(width, height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.sineWave1.resize(width, height);
    this.sineWave2.resize(width, height);
    this.$canvas.width = width;
    this.$canvas.height = height;
  }

  drawImpactCircle() {
    const displacement = Math.abs(Math.sin(this.tick * 2));
    const radius = 180 * (1 + displacement * 0.55);
    const alpha = 1 - displacement;

    this.context.save();
    this.context.strokeStyle = '#fff';
    this.context.lineWidth = 1;
    if (alpha <= this.previousAlpha) {
      this.context.globalAlpha = alpha;
    } else {
      this.context.globalAlpha = 0;
    }
    this.context.beginPath();
    this.context.arc(this.width * 0.5, this.height * 0.5, radius, 0, 2 * Math.PI, false);
    this.context.stroke();
    this.context.restore();

    this.previousAlpha = alpha;
  }

  drawStaticCircle() {
    this.context.save();
    this.context.strokeStyle = '#fff';
    this.context.lineWidth = 3;
    this.context.beginPath();
    this.context.arc(this.width * 0.5, this.height * 0.5, 180, 0, 2 * Math.PI, false);
    this.context.stroke();
    this.context.restore();
  }

  render() {
    const now = Date.now();
    const elapsed = (now - this.lastTime) / 1000;

    this.tick += elapsed;

    this.context.clearRect(0, 0, this.width, this.height);
    this.drawStaticCircle();
    this.drawImpactCircle();
    this.sineWave1.update(this.context, this.tick);
    this.sineWave2.update(this.context, this.tick);

    this.lastTime = now;
  }
}