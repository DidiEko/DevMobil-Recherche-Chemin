export default class PointerController {
  constructor({ canvas, stage, onSelect }) {
    this.canvas = canvas;
    this.stage = stage;
    this.onSelect = onSelect;

    this.canvas.addEventListener('pointerdown', event => {
      this.onPointerDown(event);
    });
  }

  onPointerDown(event) {
    if (event.button !== 0) return;

    const bounds = this.canvas.getBoundingClientRect();

    const position = {
      x: (event.clientX - bounds.left)
        * this.canvas.width / bounds.width,
      y: (event.clientY - bounds.top)
        * this.canvas.height / bounds.height,
    };

    const cell = this.stage.positionToCell(position);

    if (!this.stage.isWalkable(cell.row, cell.col)) return;

    this.onSelect(cell);
  }
}