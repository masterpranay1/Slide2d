const body = document.querySelector("body");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 1.5;
if(innerWidth == '768') {
  canvas.width = innerWidth * 0.9;
}
if(innerWidth < '425') {
  canvas.height = innerHeight / 1.8;
}
w = canvas.width;
h = canvas.height;
let highScore = 0;
hScore = document.querySelector('.high-score');
if(localStorage.getItem('slide2d') == null) {
  highScore = 0;
  hScore.textContent = highScore;
  localStorage.setItem('slide2d', JSON.stringify({highScore:highScore}));
} else {
  highScore = JSON.parse(localStorage.getItem('slide2d')).highScore;
  hScore.textContent = highScore;
}

const controls = document.querySelector('.controls');
class GameBoard {
  constructor() {
    this.boxPosition1 = {
      x: 0,
      y: 0,
      h: w * 0.02,
      w: h * 0.2,
    };
    this.boxPosition2 = {
      x: w - w * 0.02,
      y: 0,
      h: w * 0.02,
      w: h * 0.2,
    };
    this.ballPos = {
      x: w * 0.5,
      y: Math.random() * (h - w * 0.015) + w * 0.015,
      r: w * 0.015,
      vx: -1,
      vy: 1,
    };
    this.score = 0;
    this.level = 1;
  }
  drawCenterLine = (color = "#fffffe") => {
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(w / 2, w * 0.11);
    ctx.lineTo(w / 2, h - w * 0.05);
    ctx.strokeStyle = color;
    ctx.stroke();
  };
  drawBGcolor = (color) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  drawPlayingBoxes = () => {
    let x1 = this.boxPosition1.x,
      y1 = this.boxPosition1.y,
      h1 = this.boxPosition1.h,
      w1 = this.boxPosition1.w,
      x2 = this.boxPosition2.x,
      y2 = this.boxPosition2.y,
      h2 = this.boxPosition2.h,
      w2 = this.boxPosition2.w;
    ctx.fillStyle = "#bae8e8";
    ctx.fillRect(x1, y1, h1, w1);
    ctx.fillRect(x2, y2, h2, w2);
  };
  drawBall = () => {
    let x = this.ballPos.x,
      y = this.ballPos.y,
      r = this.ballPos.r;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
  };
  drawScore = () => {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#ffd803";
    ctx.fillText(this.score, w * 0.485, h * 0.14);
  };
  drawLevel = () => {
    let fontSize = w * 0.025;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "#e3f6f5";
    ctx.fillText(`Level : ${this.level}`, w * 0.45, h * 0.05);
  };
  draw = (color) => {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 1.5;
    if(innerWidth <= 768) {
      canvas.width = innerWidth * 0.9;
    }
    if(innerWidth < '425') {
      canvas.height = innerHeight / 1.8;
    }
    w = canvas.width;
    h = canvas.height;

    this.drawBGcolor(color);
    this.drawCenterLine();
    this.drawPlayingBoxes();
    this.drawBall();
    this.drawScore();
    this.drawLevel();
  };
  drawStart = () => {
    this.draw();
  };
  drawGameOver = () => {
    // "#272343"
    this.drawBGcolor("#272343");
    ctx.font = "64px Arial";
    if(innerWidth < '768') {
      ctx.font = "48px Arial";
    }
    if(innerWidth < '425') {
      ctx.font = "32px Arial";
    }
    ctx.fillStyle = "#bae8e8";
    ctx.fillText("Game Over", w * 0.25, h * 0.2);
    ctx.fillStyle = "#ffd803";
    ctx.fillText(`${this.score}`, w * 0.48, h * 0.4);

    ctx.font = "32px Arial";
    if(innerWidth < '768') {
      ctx.font = "20px Arial";
    }
    if(innerWidth < '425') {
      ctx.font = "16px Arial";
    }
    ctx.fillStyle = "#bae8e8";
    ctx.fillText("Press Space to Start Again", w * 0.2, h * 0.6);
  };

  moveBall = () => {
    if (
      this.ballPos.x - this.ballPos.r <= 0 ||
      this.ballPos.x + this.ballPos.r >= w
    ) {
      this.ballPos.vx = -this.ballPos.vx;
    }
    if (
      this.ballPos.y - this.ballPos.r <= 0 ||
      this.ballPos.y + this.ballPos.r >= h
    ) {
      this.ballPos.vy = -this.ballPos.vy;
    }
    this.ballPos.x += this.ballPos.vx;
    this.ballPos.y += this.ballPos.vy;
  };
  moveBoxes = (e) => {
    // for box 1
    if (e.key == "ArrowDown" && this.boxPosition1.y + this.boxPosition1.w < h) {
      this.boxPosition1.y += 10;
    }
    if (e.key == "ArrowUp" && this.boxPosition1.y >= 10) {
      this.boxPosition1.y -= 10;
    }
    // for box 2
    if (e.key == "ArrowLeft" && this.boxPosition2.y + this.boxPosition2.w < h) {
      this.boxPosition2.y += 10;
    }
    if (e.key == "ArrowRight" && this.boxPosition2.y >= 10) {
      this.boxPosition2.y -= 10;
    }
  };
  moveBoxesTouch = (e) => {
    if(e == 1 && this.boxPosition1.y + this.boxPosition1.w < h) {
      this.boxPosition1.y += 10;
    }
    if(e == 2 && this.boxPosition1.y >= 10) {
      this.boxPosition1.y -= 10;
    }
    if(e == 3 && this.boxPosition2.y + this.boxPosition2.w < h) {
      this.boxPosition2.y += 10;
    }
    if (e == 4 && this.boxPosition2.y >= 10) {
      this.boxPosition2.y -= 10;
    }
  }
  checkCollision = () => {
    // check collision between the squares and the ball
    let bx = this.ballPos.x - this.ballPos.r;
    let by = this.ballPos.y;
    let x = this.boxPosition1.x + this.boxPosition1.h;
    let y1 = this.boxPosition1.y *1.05;
    let y2 = (this.boxPosition1.y + this.boxPosition1.w) * 1.05;
    if (bx <= x && by >= y1 && by <= y2) {
      this.ballPos.vx = -this.ballPos.vx;
      this.score++;
    }
    x = this.boxPosition2.x;
    y1 = this.boxPosition2.y;
    y2 = this.boxPosition2.y + this.boxPosition2.w;
    bx = this.ballPos.x + this.ballPos.r;
    if (bx >= x && by >= y1 && by <= y2) {
      this.ballPos.vx = -this.ballPos.vx;
      this.score++;
    }
  };

  gameOver = () => {
    if (
      this.ballPos.x - this.ballPos.r <= this.boxPosition1.h * 0.5 ||
      this.ballPos.x + this.ballPos.r >= w - this.boxPosition1.h * 0.5
    ) {
      if(this.score > highScore) {
        localStorage.setItem('slide2d', JSON.stringify({highScore : this.score}));
        highScore = this.score;
        console.log(highScore);
        hScore.textContent = highScore;
      }
      return 1;
    }
  };
}
let game = undefined, isOver = 0;
const init = () => {
  game = new GameBoard();
  game.draw();
  body.addEventListener("keydown", (e) => {
    game.moveBoxes(e);
  });
  let id;
  controls.querySelector('.key-down').addEventListener('touchstart', () => {
    id = setInterval(game.moveBoxesTouch(1), 10);
  });
  controls.querySelector('.key-down').addEventListener('touchend', () => {
    clearInterval(id);
  });
  controls.querySelector('.key-up').addEventListener('touchstart', () => {
    id = setInterval(game.moveBoxesTouch(2), 10);
  });
  controls.querySelector('.key-up').addEventListener('touchend', () => {
    clearInterval(id);
  });
  controls.querySelector('.key-left').addEventListener('touchstart', () => {
    id = setInterval(game.moveBoxesTouch(3), 10);
  });
  controls.querySelector('.key-left').addEventListener('touchend', () => {
    clearInterval(id);
  });
  controls.querySelector('.key-right').addEventListener('touchstart', () => {
    id = setInterval(game.moveBoxesTouch(4), 10);
  });
  controls.querySelector('.key-right').addEventListener('touchend', () => {
    clearInterval(id);
  });
  animate();
};
function animate() {
  let id = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(isOver == 2) {
    game = new GameBoard();
    isOver = 0;
  }
  if (game.gameOver()) {
    game.drawGameOver();
    isOver = 1;
  } else {
    game.draw("#272343");
    game.moveBall();
    game.checkCollision();
  }
}
canvas.addEventListener('click', function(){
  if(isOver == 1)
  isOver = 2;
});
body.addEventListener('keydown', function(e){
  if(isOver == 1 && e.code == 'Space')
  isOver = 2;
});

init();
window.addEventListener("resize", function() {
  game = new GameBoard();
});