export default class Hexagon {
  constructor(wWidth, wHeight, scale) {
    this.width = 550 * scale;
    this.height = 500 * scale;
    this.x = 0.5 * wWidth;
    this.y = 0.5 * wHeight;
    this.scale = 1;
    this.alpha = 1;
  }

  resize(wWidth, wHeight) {
    this.x = 0.5 * wWidth;
    this.y = 0.5 * wHeight;
  }

  draw(context) {
    context.lineWidth = 6;
    context.lineJoin = 'round';
    context.strokeStyle = '#fff';
    context.moveTo(this.x - 0.25 * this.width, this.y - 0.5 * this.height);
    context.beginPath();
    context.lineTo(this.x + 0.25 * this.width, this.y - 0.5 * this.height);
    context.lineTo(this.x + 0.5 * this.width, this.y);
    context.lineTo(this.x + 0.25 * this.width, this.y + 0.5 * this.height);
    context.lineTo(this.x - 0.25 * this.width, this.y + 0.5 * this.height);
    context.lineTo(this.x - 0.5 * this.width, this.y);
    context.lineTo(this.x - 0.25 * this.width, this.y - 0.5 * this.height);
    context.closePath();
    context.stroke();
  }

  update(context, time) {
    context.save();
    context.globalAlpha = this.alpha;
    this.draw(context);
    context.restore();
  }
}