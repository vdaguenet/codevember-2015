import Vector2 from './Vector2';

export default class Particle {
  constructor(x = 0, y = 0, radius = 5, color = '#000', gravity = 0, friction = 1) {
    // physics
    this.position = new Vector2(x, y);
    this.velocity = new Vector2();
    this.acceleration = new Vector2();
    this.friction = friction;
    this.gravity = gravity;

    // style
    this.scale = 1;
    this.radius = radius;
    this.color = color;
  }

  accelerate(ax, ay) {
    this.acceleration.x = ax;
    this.acceleration.y = ay;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.multiply(this.friction);
    this.velocity.y += this.gravity;
    this.position.add(this.velocity);
  }

  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius * this.scale, 0, 2 * Math.PI, false);
    context.fill();
  }
}
