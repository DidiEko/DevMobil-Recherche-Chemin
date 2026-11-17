export default class Circle {
  constructor({ position, radius = 15, color = '#75e0b0' }) {
    this.position = position;
    this.radius = radius;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}