export default class Automaton {
  constructor({
    rows,
    cols,
    cellSize = 25,
    freeColor = '#dbe7de',
    wallColor = '#293444',
  }) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.freeColor = freeColor;
    this.wallColor = wallColor;

    this.grid = Array.from(
      { length: rows },
      () => Array(cols).fill(0),
    );
  }

  randomize(probability = 0.55) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = Math.random() < probability ? 1 : 0;
      }
    }
  }

  getFreeCells() {
    const cells = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col] === 1) {
          cells.push({ row, col });
        }
      }
    }

    return cells;
  }

  cellToPosition({ row, col }) {
    return {
      x: (col + 0.5) * this.cellSize,
      y: (row + 0.5) * this.cellSize,
    };
  }

  draw(ctx) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        ctx.fillStyle = this.grid[row][col] === 1
          ? this.freeColor
          : this.wallColor;

        ctx.fillRect(
          col * this.cellSize,
          row * this.cellSize,
          this.cellSize - 1,
          this.cellSize - 1,
        );
      }
    }
  }
}