import Automaton from './Automaton.js';

export default class AutomatonWithPathfinding extends Automaton {
  isWalkable(row, col) {
    return (
      row >= 0 &&
      row < this.rows &&
      col >= 0 &&
      col < this.cols &&
      this.grid[row][col] === 1
    );
  }

  getWalkableNeighbors({ row, col }) {
    const neighbors = [];

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        if (rowOffset === 0 && colOffset === 0) continue;

        const nextRow = row + rowOffset;
        const nextCol = col + colOffset;

        if (!this.isWalkable(nextRow, nextCol)) continue;

        if (rowOffset !== 0 && colOffset !== 0) {
          if (
            !this.isWalkable(row + rowOffset, col) ||
            !this.isWalkable(row, col + colOffset)
          ) {
            continue;
          }
        }

        neighbors.push({ row: nextRow, col: nextCol });
      }
    }

    return neighbors;
  }

  initFlowMap() {
    this.flowMap = Array.from(
      { length: this.rows },
      () => Array(this.cols).fill(null),
    );
  }

  flowFieldTo(row, col) {
    this.initFlowMap();

    if (!this.isWalkable(row, col)) return;

    const destination = { row, col };
    const frontier = [destination];

    this.flowMap[row][col] = destination;

    for (let index = 0; index < frontier.length; index++) {
      const cell = frontier[index];

      for (const next of this.getWalkableNeighbors(cell)) {
        if (this.flowMap[next.row][next.col] !== null) continue;

        this.flowMap[next.row][next.col] = cell;
        frontier.push(next);
      }
    }
  }
}