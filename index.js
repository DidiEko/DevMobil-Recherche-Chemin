import Circle from './class/Circle.js';
import Vector2D from './class/Vector2D.js';

const canvas = document.querySelector('#stage');
const ctx = canvas.getContext('2d');

const circle = new Circle({
  position: new Vector2D({ x: 0, y: 0 }),
});

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  circle.position.x = canvas.width / 2;
  circle.position.y = canvas.height / 2;

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circle.draw(ctx);
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();