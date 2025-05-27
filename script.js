let gameRunning = true;
let score = 0;
let lives = 3;

const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");

// Mostrar vidas no placar
const livesDisplay = document.createElement("div");
livesDisplay.style.position = "absolute";
livesDisplay.style.top = "50px";
livesDisplay.style.left = "50%";
livesDisplay.style.transform = "translateX(-50%)";
livesDisplay.style.color = "black";
livesDisplay.style.fontWeight = "bold";
livesDisplay.style.fontSize = "20px";
livesDisplay.style.background = "rgba(255,255,255,0.3)";
livesDisplay.style.padding = "5px 15px";
livesDisplay.style.borderRadius = "8px";
gameArea.appendChild(livesDisplay);

let obstacleInterval;
let moveSpeed = 12; // já um pouco mais rápido
let baseFallSpeed = 6; // velocidade inicial das bolhas
let maxObstaclesAtOnce = 1;

function updateLivesDisplay() {
  livesDisplay.textContent = `Vidas: ${lives}`;
}

function resetGame() {
  score = 0;
  lives = 3;
  gameRunning = true;
  scoreDisplay.textContent = score;
  updateLivesDisplay();
  restartBtn.classList.add("hidden");

  document.querySelectorAll(".obstacle").forEach(ob => ob.remove());
  player.style.left = "50%";

  startGame();
}

function endGame() {
  gameRunning = false;
  restartBtn.classList.remove("hidden");
  clearInterval(obstacleInterval);
  alert("Game Over! Sua pontuação final foi: " + score);
}

restartBtn.addEventListener("click", resetGame);

// Função para criar bolhas, algumas podem ser venenosas
function createObstacle() {
  if (!gameRunning) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  // Decidir se é bolha venenosa (15% chance)
  const isPoison = Math.random() < 0.15;
  if (isPoison) {
    obstacle.style.backgroundColor = "purple"; // cor roxa para bolha venenosa
    obstacle.dataset.poison = "true";
  } else {
    // bolha colorida normal com tamanho reduzido conforme pontuação
    const colors = ["red", "yellow", "green", "blue", "orange"];
    obstacle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Diminuir tamanho com a pontuação para dificultar
    const size = Math.max(30, 70 - Math.floor(score / 5) * 5);
    obstacle.style.width = size + "px";
    obstacle.style.height = size + "px";
  }

  // Posição horizontal aleatória dentro da área
  const maxWidth = gameArea.clientWidth - parseInt(obstacle.style.width);
  const randomLeft = Math.floor(Math.random() * maxWidth);
  obstacle.style.left = `${randomLeft}px`;

  obstacle.style.borderRadius = "50%";
  obstacle.style.position = "absolute";
  obstacle.style.top = "-60px";

  gameArea.appendChild(obstacle);

  let topPos = -60;
  // Aumenta velocidade das bolhas com o score
  let fallSpeed = baseFallSpeed + Math.floor(score / 10);

  const fallInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(fallInterval);
      obstacle.remove();
      return;
    }

    topPos += fallSpeed;
    obstacle.style.top = `${topPos}px`;

    const obstacleRect = obstacle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Colisão
    if (
      obstacleRect.bottom > playerRect.top &&
      obstacleRect.top < playerRect.bottom &&
      obstacleRect.left < playerRect.right &&
      obstacleRect.right > playerRect.left
    ) {
      clearInterval(fallInterval);

      // Se venenosa, fim imediato
      if (obstacle.dataset.poison === "true") {
        lives = 0;
        updateLivesDisplay();
        endGame();
        return;
      }

      // Tirar uma vida
      lives--;
      updateLivesDisplay();

      if (lives <= 0) {
        endGame();
      } else {
        obstacle.remove();
      }
    }

    // Quando a bolha some no chão
    if (topPos > window.innerHeight) {
      clearInterval(fallInterval);
      obstacle.remove();
      if (!obstacle.dataset.poison) {
        score++;
        scoreDisplay.textContent = score;
      }
    }
  }, 20);
}

// Movimentação do jogador com limites apertados
function movePlayer(event) {
  if (!gameRunning) return;

  const playerLeft = parseInt(window.getComputedStyle(player).left);
  const areaWidth = gameArea.clientWidth;
  const playerWidth = parseInt(window.getComputedStyle(player).width);

  if ((event.key === "ArrowLeft" || event.key === "a") && playerLeft > 10) {
    player.style.left = `${playerLeft - moveSpeed}px`;
  } else if ((event.key === "ArrowRight" || event.key === "d") && playerLeft < areaWidth - playerWidth - 10) {
    player.style.left = `${playerLeft + moveSpeed}px`;
  }
}

function startGame() {
  document.addEventListener("keydown", movePlayer);

  // Intervalo para gerar bolhas (aumenta a quantidade com score)
  obstacleInterval = setInterval(() => {
    // Aumenta max bolhas caindo ao mesmo tempo conforme o score (até 5)
    maxObstaclesAtOnce = Math.min(5, 1 + Math.floor(score / 5));

    for (let i = 0; i < maxObstaclesAtOnce; i++) {
      createObstacle();
    }
  }, 900); // intervalo menor para ser mais frenético
}

resetGame();
