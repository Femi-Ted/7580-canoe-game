const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const timeDisplay = document.getElementById("time");
const endGameBtn = document.getElementById("endGameBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartGameBtn = document.getElementById("restartGameBtn");

canvas.width = window.innerWidth;
canvas.height =
  window.innerHeight - document.getElementById("gameHeader").offsetHeight;

let canoe = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 20,
  color: "blue",
  speed: 5,
  dx: 0,
};

let rocks = [];
let gameInterval;
let elapsedTime = 0;
let rockAdditionInterval;

function drawCanoe() {
  ctx.beginPath();
  ctx.arc(canoe.x, canoe.y, canoe.radius, 0, Math.PI * 2);
  ctx.fillStyle = canoe.color;
  ctx.fill();
  ctx.closePath();
}

function addRock() {
  let maxWidth = canvas.width / 3; // Maximum width for a rock
  let minWidth = canvas.width / 10; // Minimum width for a rock
  let size = Math.random() * (maxWidth - minWidth) + minWidth;
  let rock = {
    x: Math.random() * (canvas.width - size),
    y: -size,
    width: size,
    height: canvas.height / 10, // Fixed height for a rock
  };
  // Ensure there is only one rock per row
  if (rocks.length === 0 || rocks[rocks.length - 1].y > rock.height) {
    rocks.push(rock);
  }
}

function drawRocks() {
  rocks.forEach((rock) => {
    ctx.beginPath();
    ctx.rect(rock.x, rock.y, rock.width, rock.height);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  });
}

function updateRocks() {
  rocks.forEach((rock) => {
    rock.y += 3; // Move the rock downwards
    if (collisionDetection(canoe, rock)) {
      endGame();
    }
  });
  rocks = rocks.filter((rock) => rock.y < canvas.height);
}

function collisionDetection(circle, rect) {
  // Simple AABB collision detection
  if (
    circle.x + circle.radius > rect.x &&
    circle.x - circle.radius < rect.x + rect.width &&
    circle.y + circle.radius > rect.y &&
    circle.y - circle.radius < rect.y + rect.height
  ) {
    return true;
  }
  return false;
}

function endGame() {
  clearInterval(gameInterval);
  alert(`Game Over! Time elapsed: ${elapsedTime.toFixed(1)} seconds`);
}

function resetGame() {
  rocks = [];
  canoe.x = canvas.width / 2;
  canoe.dx = 0;
  elapsedTime = 0;
  gameOverScreen.classList.add("hidden"); // Hide game over screen
  startGame();
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCanoe();
  drawRocks();
  updateRocks();
  canoe.x += canoe.dx;
  // Prevent the canoe from going off-screen
  if (canoe.x + canoe.radius > canvas.width) {
    canoe.x = canvas.width - canoe.radius;
  } else if (canoe.x - canoe.radius < 0) {
    canoe.x = canoe.radius;
  }
  displayTime();
}

function displayTime() {
  elapsedTime += 1 / 60;
  let minutes = Math.floor(elapsedTime / 60);
  let seconds = Math.floor(elapsedTime % 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

endGameBtn.addEventListener("click", endGame);
restartGameBtn.addEventListener("click", resetGame);

document.addEventListener("keydown", function (event) {
  if (event.key === "a" || event.key === "A") {
    canoe.dx = -canoe.speed;
  } else if (event.key === "d" || event.key === "D") {
    canoe.dx = canoe.speed;
  }
});

document.addEventListener("keyup", function (event) {
  if (
    event.key === "a" ||
    event.key === "A" ||
    event.key === "d" ||
    event.key === "D"
  ) {
    canoe.dx = 0;
  }
});

function startGame() {
  if (gameInterval) clearInterval(gameInterval);
  if (rockAdditionInterval) clearInterval(rockAdditionInterval);

  gameInterval = setInterval(updateGame, 1000 / 60);
  setInterval(addRock, 2000);
}

startGame();

function startGame() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, 1000 / 60);
  setInterval(addRock, 2000);
}

startGame();
