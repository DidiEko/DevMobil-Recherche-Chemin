import Vector2D from './Vector2D.js';

export default class PathFollower {
  constructor({ circle, stage, tweens, cell, speed = 0.15 }) {
    this.circle = circle;
    this.stage = stage;
    this.tweens = tweens;
    this.cell = { ...cell };
    this.speed = speed;
    this.isMoving = false;
    this.onArrival = null;
  }

  start() {
    if (this.isMoving) return;

    const next = this.stage.flowMap[this.cell.row][this.cell.col];

    if (next === null) return;

    this.isMoving = true;
    this.moveToNextCell();
  }

  moveToNextCell() {
    const next = this.stage.flowMap[this.cell.row][this.cell.col];

    if (next.row === this.cell.row && next.col === this.cell.col) {
      this.isMoving = false;
      this.onArrival?.();
      return;
    }

    const start = this.circle.position.clone();
    const end = new Vector2D(this.stage.cellToPosition(next));

    const distance = Math.hypot(
      end.x - start.x,
      end.y - start.y,
    );

    this.tweens.create({
      from: 0,
      to: 1,
      dur: distance / this.speed,
      ease: 'linear',

      animate: progress => {
        this.circle.position = start.clone().lerp(end, progress);
      },

      onComplete: () => {
        this.cell = { ...next };
        this.moveToNextCell();
      },
    });
  }
}