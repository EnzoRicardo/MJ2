const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

let score = 0;
let missed = 0;
const maxMissed = 5;

let bubbleSpeed = 700;
let bubbleInterval = setInterval(createBubble, bubbleSpeed);

function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');

  const posX = Math.random() * (gameArea.offsetWidth - 40);
  bubble.style.left = `${posX}px`;
  bubble.style.bottom = '0px';

  bubble.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    bubble.remove();

    // Aumenta dificuldade a cada 5 pontos
    if (score % 5 === 0 && bubbleSpeed > 200) {
      bubbleSpeed -= 50;
      clearInterval(bubbleInterval);
      bubbleInterval = setInterval(createBubble, bubbleSpeed);
    }
  });

  bubble.addEventListener('animationend', () => {
    bubble.remove();
    missed++;
    if (missed >= maxMissed) {
      endGame();
    }
  });

  gameArea.appendChild(bubble);
}

function endGame() {
  clearInterval(bubbleInterval);
  gameOverDisplay.classList.remove('hidden');
  restartBtn.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
  // Resetar dados
  score = 0;
  missed = 0;
  bubbleSpeed = 700;
  scoreDisplay.textContent = score;

  gameOverDisplay.classList.add('hidden');
  restartBtn.classList.add('hidden');

  document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());

  bubbleInterval = setInterval(createBubble, bubbleSpeed);
});
