const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Load 8-ball image
const ballImage = new Image();
ballImage.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Billiard_ball_8.png/600px-Billiard_ball_8.png';

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    speed: 5,
    velocityX: 5,
    velocityY: 5
};

const paddleWidth = 100;
const paddleHeight = 20;

const playerPaddle = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: canvas.height - paddleHeight - 10,
    width: paddleWidth,
    height: paddleHeight,
    dx: 0
};

const aiPaddle = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: 10,
    width: paddleWidth,
    height: paddleHeight,
    speed: 5
};

function drawPaddle(x, y, width, height) {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x, y, width, height);
}

function drawBall() {
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function moveBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with left and right walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.velocityX = -ball.velocityX;
    }

    // Ball collision with top and bottom (AI or Player)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Ball and player paddle collision
    if (ball.y + ball.radius > playerPaddle.y &&
        ball.x > playerPaddle.x &&
        ball.x < playerPaddle.x + playerPaddle.width) {
        ball.velocityY = -ball.velocityY;
    }

    // Ball and AI paddle collision
    if (ball.y - ball.radius < aiPaddle.y + aiPaddle.height &&
        ball.x > aiPaddle.x &&
        ball.x < aiPaddle.x + aiPaddle.width) {
        ball.velocityY = -ball.velocityY;
    }
}

function movePaddles() {
    playerPaddle.x += playerPaddle.dx;

    // Prevent paddle from going off-screen
    if (playerPaddle.x < 0) {
        playerPaddle.x = 0;
    } else if (playerPaddle.x + playerPaddle.width > canvas.width) {
        playerPaddle.x = canvas.width - playerPaddle.width;
    }

    // Simple AI movement
    if (ball.x > aiPaddle.x + aiPaddle.width / 2) {
        aiPaddle.x += aiPaddle.speed;
    } else if (ball.x < aiPaddle.x + aiPaddle.width / 2) {
        aiPaddle.x -= aiPaddle.speed;
    }

    // Prevent AI paddle from going off-screen
    if (aiPaddle.x < 0) {
        aiPaddle.x = 0;
    } else if (aiPaddle.x + aiPaddle.width > canvas.width) {
        aiPaddle.x = canvas.width - aiPaddle.width;
    }
}

function update() {
    moveBall();
    movePaddles();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    drawPaddle(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        playerPaddle.dx = 7;
    } else if (e.key === 'ArrowLeft') {
        playerPaddle.dx = -7;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        playerPaddle.dx = 0;
    }
});

ballImage.onload = function () {
    gameLoop();
};
