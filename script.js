// ====== ELEMENT REFERENCES ======
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");

const prePostcardScreen = document.getElementById("prePostcardScreen");
const nextBtn = document.getElementById("nextBtn");

const postcardScreen = document.getElementById("postcardScreen");
const yesBtn = document.querySelector("#postcardScreen #yesBtn");
const noBtn = document.querySelector("#postcardScreen #noBtn");

const player = document.getElementById("player");

let score = 0;
let playerX = window.innerWidth / 2;
let heartInterval;

// ====== START GAME ======
startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    gameArea.style.display = "block";
    heartInterval = setInterval(createHeart, 800);
});

// ====== PLAYER MOVEMENT ======
document.addEventListener("mousemove", (e) => {
    playerX = e.clientX;
    player.style.left = (playerX - player.offsetWidth / 2) + "px";
});

// Touch movement for mobile
document.addEventListener("touchmove", (e) => {
    playerX = e.touches[0].clientX;
    player.style.left = (playerX - player.offsetWidth / 2) + "px";
});

// ====== CREATE FALLING OBJECT ======
function createHeart() {
    const object = document.createElement("div");
    object.classList.add("heart");

    // Random type
    let rand = Math.random();
    let type, speed;

    if (rand < 0.6) {
        type = "good";
        object.innerHTML = "💜";
        speed = 5;
    } else if (rand < 0.85) {
        type = "bad";
        object.innerHTML = "💔";
        speed = 6;
    } else {
        type = "bomb";
        object.innerHTML = "💣";
        speed = 8;
    }

    object.dataset.type = type;
    object.style.left = Math.random() * (window.innerWidth - 40) + "px";
    object.style.top = "0px";

    gameArea.appendChild(object);

    let fall = setInterval(() => {
        object.style.top = parseInt(object.style.top) + speed + "px";

        let basketLeft = playerX - player.offsetWidth / 2;
        let basketRight = playerX + player.offsetWidth / 2;
        let heartLeft = parseInt(object.style.left);
        let heartRight = heartLeft + object.offsetWidth;

        // Collision
        if (heartRight >= basketLeft && heartLeft <= basketRight && parseInt(object.style.top) >= window.innerHeight - 140) {

            if (type === "good") {
                score++;
            } else if (type === "bad") {
                score = Math.max(0, score - 1);
            } else if (type === "bomb") {
                // Stop falling hearts
                clearInterval(heartInterval);
                gameArea.style.display = "none";
                showBombRetry();
            }

            scoreDisplay.innerText = score + " / 10";
            object.remove();
            clearInterval(fall);

            // Win condition
            if (score >= 10) {
                clearInterval(heartInterval);
                gameArea.style.display = "none";
                prePostcardScreen.style.display = "flex";
            }
        }

        // Remove heart if falls out
        if (parseInt(object.style.top) > window.innerHeight) {
            object.remove();
            clearInterval(fall);
        }
    }, 20);
}

// ====== BOMB RETRY SCREEN ======
function showBombRetry() {
    // Create overlay div
    const bombOverlay = document.createElement("div");
    bombOverlay.style.position = "fixed";
    bombOverlay.style.top = 0;
    bombOverlay.style.left = 0;
    bombOverlay.style.width = "100vw";
    bombOverlay.style.height = "100vh";
    bombOverlay.style.background = "#5f0a87";
    bombOverlay.style.display = "flex";
    bombOverlay.style.flexDirection = "column";
    bombOverlay.style.justifyContent = "center";
    bombOverlay.style.alignItems = "center";
    bombOverlay.style.zIndex = "1000";
    bombOverlay.innerHTML = `
        <h2 style="color:white;font-size:32px;">💣 Oh no! You caught a bomb!</h2>
        <p style="color:white;font-size:20px;">Don't worry, try again</p>
        <button id="retryBtn" style="padding:12px 28px; border:none; border-radius:25px; background:#b266ff; color:white; cursor:pointer; font-size:18px;">Try Again</button>
    `;
    document.body.appendChild(bombOverlay);

    document.getElementById("retryBtn").addEventListener("click", () => {
        location.reload();
    });
}

// ====== RIGHT ARROW BUTTON ======
nextBtn.addEventListener("click", () => {
    prePostcardScreen.style.display = "none";
    postcardScreen.style.display = "flex";
});

// ====== YES BUTTON FLIP ======
yesBtn.addEventListener("click", () => {
    postcardScreen.querySelector(".postcard").classList.add("flip");
});

// ====== NO BUTTON MOVING ======
noBtn.addEventListener("click", () => {
    noBtn.style.position = "fixed";
    noBtn.style.width = "auto"; // prevent stretching
    noBtn.style.left = Math.random() * (window.innerWidth - noBtn.offsetWidth) + "px";
    noBtn.style.top = Math.random() * (window.innerHeight - noBtn.offsetHeight) + "px";
});
