import Square from './objects/Square';

export default class Scene {
  constructor($canvas, width, height) {
    this.$canvas = $canvas;
    this.context = this.$canvas.getContext('2d');

    this.width = 0;
    this.height = 0;

    this.params = {};

    this.tick = 0;
    this.lastTime = 0;

    this.nbSquares = 5;
    this.squares = [];
    this.staticSquare = new Square(width * 0.5, height * 0.5);
    this.staticSquare.scaleSpeed = 0;
    this.staticSquare.angleSpeed = 0;

    let s;
    for (let i = 0; i < this.nbSquares; i++) {
      s = new Square(width * 0.5, height * 0.5);
      s.scale = 1.0 - (0.2 * i);
      s.scaleSpeed = 0.004;
      s.angleSpeed = 0.004;
      this.squares.push(s);
    }

    this.resize(width, height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    for (let i = 0; i < this.nbSquares; i++) {
      this.squares[i].resize(width, height);
    }
    this.staticSquare.resize(width, height);
    this.$canvas.width = width;
    this.$canvas.height = height;
  }

  render() {
    const now = Date.now();
    const elapsed = (now - this.lastTime) / 1000;

    this.tick += elapsed;

    this.context.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.nbSquares; i++) {
      this.squares[i].update(this.context, this.tick);
    }
    this.staticSquare.update(this.context, this.tick);

    this.lastTime = now;
  }
}