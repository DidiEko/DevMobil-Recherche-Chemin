export default class SceneRenderer {
  constructor({ canvas, stage, circle }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stage = stage;
    this.circle = circle;
  }

  drawDestination(destination, reachable) {
    if (destination === null) return;

    const position = this.stage.cellToPosition(destination);

    this.ctx.beginPath();
    this.ctx.arc(
      position.x,
      position.y,
      this.stage.cellSize * 0.4,
      0,
      Math.PI * 2,
    );
    this.ctx.strokeStyle = reachable ? '#15803d' : '#dc2626';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }

  draw(destination, reachable) {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );

    this.stage.draw(this.ctx);
    this.drawDestination(destination, reachable);
    this.circle.draw(this.ctx);
  }
}