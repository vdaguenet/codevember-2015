export default class Square {
  constructor(x, y) {
    this.width = 500;
    this.height = this.width;

    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.centerX = x;
    this.centerY = y;

    this.angle = 0;
    this.scale = 1;
    this.angleSpeed = 0;
    this.scaleSpeed = 0.05;
  }

  resize(width, height) {
    const x = width * 0.5;
    const y = height * 0.5;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.centerX = x;
    this.centerY = y;
  }

  update(context, time) {
    this.angle -= this.angleSpeed;
    this.scale -= this.scaleSpeed;

    if (this.scale <= 0) {
      this.angle = 0;
      this.scale = 1;
      return;
    }

    context.save();

    context.strokeStyle = '#262626';
    context.lineWidth = 4;

    context.translate(this.centerX, this.centerY);
    context.scale(this.scale, this.scale);
    context.rotate(this.angle);
    context.translate(-this.centerX, -this.centerY);
    context.strokeRect(this.x, this.y, this.width, this.height);

    context.restore();
  }
}