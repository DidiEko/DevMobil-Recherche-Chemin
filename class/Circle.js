export default class Circle {
  constructor({const circle = new Circle({
  position: new Vector2D({ x: 0, y: 0 }),
  radius: 25,
  color: '#ffb86b',
});}) {
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