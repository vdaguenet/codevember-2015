export default class SineWave {
  constructor(width, height, lineWidth, color) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.lineWidth = lineWidth;
    this.amplitude = 100;
    this.frequency = 3;
    this.segmentWidth = 1;
    this.nbSegment = 0;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    this.begin = this.width * 0.1;
    this.end = this.width * 0.9;
    this.nbSegment = Math.floor((this.end - this.begin) / this.segmentWidth);
  }

  update(context, time) {
    let x;
    let k;
    let y = Math.sin(x);

    context.save();
    context.strokeStyle = this.color;
    context.lineWidth = this.lineWidth;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.moveTo(this.begin, y + 0.5 * this.height);

    // draw segments
    context.beginPath();
    for (let i = this.begin, j = 0; i <= this.end; i += this.segmentWidth, j++) {
      x = time + (this.begin + i) / this.amplitude;
      k = (j / this.nbSegment);
      y = Math.sin(x * this.frequency);
      y *= Math.abs(Math.round(k) - (2 * k - Math.round(k)));

      context.lineTo(i, y * this.amplitude + 0.5 * this.height);
    }

    context.stroke();
    context.restore();
  }
}