// Getting required DOM elements
let board = document.querySelector(".board");
let startBtn = document.querySelector(".btn-start");
let restartBtn = document.querySelector(".btn-restart");
let startGameModal = document.querySelector(".start-game");
let gameOverModal = document.querySelector(".game-over");
let modal = document.querySelector(".modal");
let highScoreElement = document.querySelector("#high-score");
let scoreElement = document.querySelector("#score");
let timeElement = document.querySelector("#time");

// Each block size in the grid
let blockHeight = 40;
let blockWidth = 40;

// Game score, time and highScore
let score = 0;
let time = `00-00`;
let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.innerText = highScore;

// Calculate number of rows and columns the board can fit
let cols = Math.floor(board.clientWidth / blockWidth);
let rows = Math.floor(board.clientHeight / blockHeight);

// Intervals for rendering & timer
let intervalId = null;
let timerIntervalId = null;

// Generate initial random food position
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * rows),
};

// Stores DOM blocks for grid
var blocks = [];

// Initial snake body (starting with one block)
let snake = [{ x: 1, y: 3 }];

// Initial movement direction
let direction = "down";

// Creating the grid blocks dynamically
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    let block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);

    // Storing each block by "row-col" key
    blocks[`${row}-${col}`] = block;
  }
}

// Function to update the game screen
function render() {
  let head = null;

  // Add food class to current food block
  blocks[`${food.x}-${food.y}`].classList.add("food");

  // Calculate new head position based on direction
  if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  // WALL COLLISION — stop game when snake hits boundary
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId); // stop snake movement
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }

  // FOOD EATING LOGIC
  if (head.x == food.x && head.y == food.y) {
    // Remove old food
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    // Generate new random food position
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * rows),
    };

    blocks[`${food.x}-${food.y}`].classList.add("food");

    // Add new head without removing tail (snake grows)
    snake.unshift(head);

    // Update score
    score += 10;
    scoreElement.innerText = score;

    // Update high score in localStorage
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
    }
  } else {
    // Remove all filled snake blocks before re-rendering
    snake.forEach((block) => {
      blocks[`${block.x}-${block.y}`].classList.remove("fill");
    });

    // Insert new head
    snake.unshift(head);

    // Remove tail (keeps snake same length unless food eaten)
    snake.pop();
  }

  // Draw snake on board
  snake.forEach((block) => {
    blocks[`${block.x}-${block.y}`].classList.add("fill");
  });
}

// Start button event — begins game & timer
startBtn.addEventListener("click", () => {
  modal.style.display = "none";

  // Start snake movement
  intervalId = setInterval(() => {
    render();
  }, 300);

  // Start timer for game duration
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);

    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }

    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000);
});

// Restart button event
restartBtn.addEventListener("click", () => {
  restart();
});

// Restart game logic
function restart() {
  // Remove old food and snake from board
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((block) => {
    blocks[`${block.x}-${block.y}`].classList.remove("fill");
  });

  // Reset values
  score = 0;
  time = `00-00`;
  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;

  modal.style.display = "none";
  direction = "down";

  // Reset snake to initial position
  snake = [{ x: 1, y: 3 }];

  // New random food
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * rows),
  };

  // Restart snake movement
  intervalId = setInterval(() => {
    render();
  }, 400);
}

// Keyboard controls to change snake direction
addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp") {
    direction = "up";
  } else if (e.key == "ArrowDown") {
    direction = "down";
  } else if (e.key == "ArrowRight") {
    direction = "right";
  } else if (e.key == "ArrowLeft") {
    direction = "left";
  }
});
