const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const shootBtn = document.getElementById("shootBtn");

canvas.width = 500;
canvas.height = 700;

let gameRunning = false;
let score = 0;

// Player
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    speed: 6
};

// Controls
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Bullets
let bullets = [];

// Enemies
let enemies = [];

function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: 3
    });
}

// Shoot function
function shootBullet() {
    if (!gameRunning) return;

    bullets.push({
        x: player.x + player.width / 2 - 3,
        y: player.y,
        width: 6,
        height: 15,
        speed: 8
    });
}

// FIRE button (mobile + click)
shootBtn.addEventListener("click", shootBullet);
shootBtn.addEventListener("touchstart", shootBullet);

// Update
function update() {

    // Player movement
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }

    // Move bullets
    bullets.forEach((bullet, bIndex) => {
        bullet.y -= bullet.speed;

        if (bullet.y < 0) {
            bullets.splice(bIndex, 1);
        }
    });

    // Move enemies
    enemies.forEach((enemy, eIndex) => {
        enemy.y += enemy.speed;

        // Collision: bullet hits enemy
        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
                score++;
            }
        });

        // Collision: enemy hits player
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameRunning = false;
            startBtn.style.display = "block";
            startBtn.innerText = "RESTART";
        }
    });
}

// Draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Bullets
    ctx.fillStyle = "yellow";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Enemies
    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Game Loop
function gameLoop() {
    if (gameRunning) {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();

// Spawn enemy every 1 second
setInterval(() => {
    if (gameRunning) spawnEnemy();
}, 1000);

// Start button
startBtn.addEventListener("click", () => {
    gameRunning = true;
    enemies = [];
    bullets = [];
    score = 0;
    player.x = canvas.width / 2 - 25;
    startBtn.style.display = "none";
});