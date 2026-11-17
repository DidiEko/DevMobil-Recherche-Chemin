import Circle from './class/Circle.js';
import Vector2D from './class/Vector2D.js';
import AutomatonWithPathfinding from './class/AutomatonWithPathfinding.js';
import Tweens from './class/Tweens.js';
import PathFollower from './class/PathFollower.js';

const canvas = document.querySelector('#stage');
const ctx = canvas.getContext('2d');
const status = document.querySelector('#status');
const newTerrainButton = document.querySelector('#new-terrain');

const stage = new AutomatonWithPathfinding({
    rows: 20,
    cols: 30,
});

const tweens = new Tweens();

function generateTerrain() {
    let freeCells = [];

    do {
        stage.generate(0.65, 8);
        freeCells = stage.getFreeCells();
    } while (freeCells.length === 0);

    stage.initFlowMap();

    return freeCells[Math.floor(Math.random() * freeCells.length)];
}

const startingCell = generateTerrain();

const circle = new Circle({
    position: new Vector2D(stage.cellToPosition(startingCell)),
    radius: stage.cellSize * 0.3,
    color: '#f97316',
});

const follower = new PathFollower({
    circle,
    stage,
    tweens,
    cell: startingCell,
    speed: 0.15,
});

let destination = null;
let destinationReachable = false;

follower.onArrival = () => {
    status.textContent = 'Arrivé ! Choisissez une nouvelle destination.';
    newTerrainButton.disabled = false;
    resizeCanvas();
};

function resizeCanvas() {
    // Le redimensionnement du dessin attend la fin du trajet.
    if (follower.isMoving) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    stage.cellSize = Math.min(
        canvas.width / stage.cols,
        canvas.height / stage.rows,
    );

    circle.position = new Vector2D(
        stage.cellToPosition(follower.cell),
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
    if (event.button !== 0 || follower.isMoving) return;

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
        stage.flowMap[follower.cell.row][follower.cell.col] !== null;

    if (!destinationReachable) {
        status.textContent = 'Cette destination est inaccessible.';
        return;
    }

    if (
        cell.row === follower.cell.row &&
        cell.col === follower.cell.col
    ) {
        status.textContent = 'Le cercle est déjà à destination.';
        return;
    }

    status.textContent = 'Déplacement en cours…';
    newTerrainButton.disabled = true;
    follower.start();
}

function resetTerrain() {
    if (follower.isMoving) return;

    tweens.deleteAll();

    follower.cell = generateTerrain();
    destination = null;
    destinationReachable = false;

    status.textContent = 'Nouveau terrain : choisissez une case libre.';

    resizeCanvas();
}

newTerrainButton.addEventListener('click', resetTerrain);

canvas.addEventListener('pointerdown', onPointerDown);
window.addEventListener('resize', resizeCanvas);

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        window.MainLoop.stop();
    } else {
        window.MainLoop.resetFrameDelta();
        window.MainLoop.start();
    }
});

resizeCanvas();

window.MainLoop
    .setUpdate(dt => tweens.update(dt))
    .setDraw(draw)
    .setEnd((fps, panic) => {
        if (panic) window.MainLoop.resetFrameDelta();
    })
    .start();