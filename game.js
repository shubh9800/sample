const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let bird = { x: 50, y: canvas.height / 2, radius: 20, velocity: 0 };
let gravity = 0.4;
let flapStrength = -7;
let pipes = [];
let pipeWidth = 60;
let pipeGap = canvas.height / 4;
let score = 0;
let gameOver = false;
let started = false;

// Event listeners
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  pipeGap = canvas.height / 4;
});

window.addEventListener("pointerdown", () => {
  if (!started) {
    started = true;
    gameLoop();
  }
  bird.velocity = flapStrength;
});

// Pipe creation
function createPipe() {
  let topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + pipeGap
  });
}

// Draw bird
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

// Draw score
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Create pipes
  if (started && pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }

  // Move pipes & check collision
  pipes.forEach(pipe => {
    pipe.x -= 3;

    // Collision check
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipeWidth &&
      (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
    ) {
      gameOver = true;
    }

    // Score update
    if (pipe.x + pipeWidth < bird.x && !pipe.scored) {
      score++;
      pipe.scored = true;
    }
  });

  // Ground / ceiling collision
  if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
    gameOver = true;
  }

  drawPipes();
  drawBird();
  drawScore();

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 120, canvas.height / 2);
    return;
  }

  requestAnimationFrame(gameLoop);
}
