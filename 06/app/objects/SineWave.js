import Particle from '../lib/Particle';

export default class SineWave {
  constructor(width, height, lineWidth, color) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.lineWidth = lineWidth;
    this.amplitude = 50;
    this.frequency = 2;
    this.segmentWidth = 1;
    this.nbSegment = 0;
    this.head = new Particle(0, 0, 12, color);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    this.begin = this.height * 0.5;
    this.head.position.y = this.height * 0.5;
    this.end = this.height;
    this.nbSegment = Math.floor((this.end - this.begin) / this.segmentWidth);
  }

  update(context, time) {
    let y = 0;
    let x = Math.sin(y);
    let k;

    context.save();
    context.strokeStyle = this.color;
    context.lineWidth = this.lineWidth;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.moveTo(this.begin + x, 0.5 * this.height);

    // draw segments
    context.beginPath();
    for (let i = this.begin, j = 0; i <= this.end; i += this.segmentWidth, j++) {
      y = time + (this.begin + i) / this.amplitude;
      k = 1 - (j / this.nbSegment);
      x = Math.sin(y * this.frequency) * k;
      if (j == 0) {
        this.head.position.x = x * this.amplitude + 0.5 * this.width;
      }

      context.lineTo(x * this.amplitude + 0.5 * this.width, i);
    }

    context.stroke();
    this.head.draw(context);
    context.restore();
  }
}