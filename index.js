import Circle from './class/Circle.js';
import Vector2D from './class/Vector2D.js';
import Automaton from './class/Automaton.js';

const canvas = document.querySelector('#stage');
const ctx = canvas.getContext('2d');

const stage = new Automaton({
  rows: 20,
  cols: 30,
});

let freeCells = [];

do {
  stage.randomize(0.65, 8);
  freeCells = stage.getFreeCells();
} while (freeCells.length === 0);

const startingCell = freeCells[
  Math.floor(Math.random() * freeCells.length)
];

const circle = new Circle({
  position: new Vector2D(stage.cellToPosition(startingCell)),
  radius: stage.cellSize * 0.3,
  color: '#f97316',
});

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stage.draw(ctx);
  circle.draw(ctx);
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();