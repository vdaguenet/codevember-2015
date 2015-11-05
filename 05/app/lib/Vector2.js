export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  invert() {
    this.x = -this.x;
    this.y = -this.y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  multiply(value) {
    this.x *= value;
    this.y *= value;
  }

  divide(value) {
    this.x /= value;
    this.y /= value;
  }

  equals(vector) {
    return this.x === vector.x && this.y === vector.y;
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  distance(vector) {
    return Math.sqrt(this.distSq(vector));
  }

  normalize() {
    return this.divide(this.length());
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  clone() {
    return new Vector(this.x, this.y);
  }
}