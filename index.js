import Circle from './class/Circle.js';
import Vector2D from './class/Vector2D.js';
import AutomatonWithPathfinding from './class/AutomatonWithPathfinding.js';

const canvas = document.querySelector('#stage');
const ctx = canvas.getContext('2d');
const status = document.querySelector('#status');

const stage = new AutomatonWithPathfinding({
  rows: 20,
  cols: 30,
});

let freeCells = [];

do {
  stage.generate(0.65, 8);
  freeCells = stage.getFreeCells();
} while (freeCells.length === 0);

// TEST : deux zones libres séparées par un mur vertical.
// const wallCol = Math.floor(stage.cols / 2);

// for (let row = 0; row < stage.rows; row++) {
//   for (let col = 0; col < stage.cols; col++) {
//     stage.grid[row][col] = col === wallCol ? 0 : 1;
//   }
// } 

freeCells = stage.getFreeCells();

const startingCell = freeCells[
  Math.floor(Math.random() * freeCells.length)
];

const circle = new Circle({
  position: new Vector2D(stage.cellToPosition(startingCell)),
  radius: stage.cellSize * 0.3,
  color: '#f97316',
});

let destination = null;
let destinationReachable = false;

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  stage.cellSize = Math.min(
    canvas.width / stage.cols,
    canvas.height / stage.rows,
  );

  circle.position = new Vector2D(
    stage.cellToPosition(startingCell),
  );
  circle.radius = stage.cellSize * 0.3;

  draw();
}

function drawDestination() {
  if (destination === null) return;

  const position = stage.cellToPosition(destination);

  ctx.beginPath();
  ctx.arc(
    position.x,
    position.y,
    stage.cellSize * 0.4,
    0,
    Math.PI * 2,
  );
  ctx.strokeStyle = destinationReachable ? '#15803d' : '#dc2626';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stage.draw(ctx);
  drawDestination();
  circle.draw(ctx);
}

function onPointerDown(event) {
  if (event.button !== 0) return;

  const bounds = canvas.getBoundingClientRect();

  const position = {
    x: (event.clientX - bounds.left) * canvas.width / bounds.width,
    y: (event.clientY - bounds.top) * canvas.height / bounds.height,
  };

  const cell = stage.positionToCell(position);

  if (!stage.isWalkable(cell.row, cell.col)) return;

  destination = cell;
  stage.flowFieldTo(cell.row, cell.col);

  destinationReachable =
    stage.flowMap[startingCell.row][startingCell.col] !== null;

  if (
    cell.row === startingCell.row &&
    cell.col === startingCell.col
  ) {
    status.textContent = 'Le cercle est déjà à destination.';
  } else if (destinationReachable) {
    status.textContent = 'Un chemin existe vers cette destination.';
  } else {
    status.textContent = 'Cette destination est inaccessible.';
  }

  draw();
}

canvas.addEventListener('pointerdown', onPointerDown);
window.addEventListener('resize', resizeCanvas);

resizeCanvas();