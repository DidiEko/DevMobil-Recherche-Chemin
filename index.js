const canvas = document.querySelector('#stage');
const ctx = canvas.getContext('2d');
// ctx est le contexte 2D : il fournit les outils pour dessiner.

function resizeCanvas() {
// resizeCanvas() adapte les dimensions de dessin à la taille affichée, puis redessine.
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  draw();
}

function draw() {
// draw() efface la surface et dessine un cercle vert de 15 pixels de rayon au centre.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    15,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = '#75e0b0';
  ctx.fill();
}

window.addEventListener('resize', resizeCanvas);
// resize permet de garder le cercle centré quand tu redimensionnes la fenêtre.

resizeCanvas();