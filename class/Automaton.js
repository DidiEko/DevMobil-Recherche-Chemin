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
        
        this.birthRules = new Set([6, 7, 8]);
        this.survivalRules = new Set([3, 4, 5, 6, 7, 8]);

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

    countAliveNeighbors(row, col) {
        let count = 0;

        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                if (rowOffset === 0 && colOffset === 0) continue;

                const neighborRow = (row + rowOffset + this.rows) % this.rows;
                const neighborCol = (col + colOffset + this.cols) % this.cols;

                count += this.grid[neighborRow][neighborCol];
            }
        }

        return count;
    }

    nextGeneration() {
        const nextGrid = Array.from(
            { length: this.rows },
            () => Array(this.cols).fill(0),
        );

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbors = this.countAliveNeighbors(row, col);

                const rules = this.grid[row][col] === 1
                    ? this.survivalRules
                    : this.birthRules;

                nextGrid[row][col] = rules.has(neighbors) ? 1 : 0;
            }
        }

        this.grid = nextGrid;
    }

    generate(probability = 0.55, generations = 8) {
        this.randomize(probability);

        for (let generation = 0; generation < generations; generation++) {
            this.nextGeneration();
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

    positionToCell({ x, y }) {
        return {
            row: Math.floor(y / this.cellSize),
            col: Math.floor(x / this.cellSize),
        };
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