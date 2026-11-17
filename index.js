import Circle from './class/Circle.js';
import Vector2D from './class/Vector2D.js';
import AutomatonWithPathfinding from './class/AutomatonWithPathfinding.js';
import Tweens from './class/Tweens.js';
import PathFollower from './class/PathFollower.js';
import SceneRenderer from './class/SceneRenderer.js';
import PointerController from './class/PointerController.js';

const canvas = document.querySelector('#stage');
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

const renderer = new SceneRenderer({
    canvas,
    stage,
    circle,
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

function draw() {
    renderer.draw(destination, destinationReachable);
}

function selectDestination(cell) {
    if (follower.isMoving) return;

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

new PointerController({
    canvas,
    stage,
    onSelect: selectDestination,
});

const canvasResizeObserver = new ResizeObserver(() => {
    resizeCanvas();
});

canvasResizeObserver.observe(canvas);

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