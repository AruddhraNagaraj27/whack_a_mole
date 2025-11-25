const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
let gridSize;
let intervalId;
let gamePaused = false;
let hitCount = 0;
let level = 1;
let currentDifficulty = 'Medium'; // default
let moleVisibleDuration = 1500; // ms base
let moleIntervalRange = { min: 1100, max: 1300 }; // default medium

// Audio elements
const backgroundMusic = document.getElementById('backgroundMusic');
const hitSound = document.getElementById('hitSound');
const missSound = document.getElementById('missSound');
const levelUpSound = document.getElementById('levelUpSound');

// Difficulty settings (ms durations)
const DIFFICULTY_SETTINGS = {
    Easy:   { min: 1800, max: 2000, visible: 1600 },
    Medium: { min: 1100, max: 1300, visible: 1200 },
    Hard:   { min: 500,  max: 700,  visible: 900 }
};

function setDifficulty(d) {
    currentDifficulty = d;
    const diffBtns = document.querySelectorAll('.difficulty-btn');
    diffBtns.forEach(b => {
        if (b.dataset.difficulty === d) {
            b.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.15) inset';
        } else {
            b.style.boxShadow = 'none';
        }
    });

    const settings = DIFFICULTY_SETTINGS[d];
    moleIntervalRange.min = settings.min;
    moleIntervalRange.max = settings.max;
    moleVisibleDuration = settings.visible;

    // If game running, reconfigure interval
    if (intervalId && !gamePaused) {
        clearInterval(intervalId);
        scheduleNextMole();
    }
}

// Start the game
function startGame() {
    gridSize = parseInt(document.getElementById('gridSizeInput').value) || 3;
    generateGrid(gridSize);

    // player name input
    const nameInput = document.getElementById('playerNameInput');
    if (!nameInput.value.trim()) {
        // If empty, show a subtle alert, but not blocking
        // (keeps behaviour consistent with "don't change UI")
        alert("Tip: enter your name to save your score (or stay anonymous).");
    }

    backgroundMusic.play().catch(()=>{ /* some browsers require user gesture */});
    gamePaused = false;
    hitCount = 0;
    level = 1;
    scoreElement.textContent = hitCount;
    levelElement.textContent = `Level: ${level}`;

    // Start scheduling moles
    scheduleNextMole();

    toggleControlButtons();
}

// Toggle visibility of buttons
function toggleControlButtons() {
    document.getElementById('pauseButton').style.display = gamePaused ? 'none' : 'inline-block';
    document.getElementById('resumeButton').style.display = gamePaused ? 'inline-block' : 'none';
}

// Pause
function pauseGame() {
    clearInterval(intervalId);
    gamePaused = true;
    toggleControlButtons();
    backgroundMusic.pause();
}

// Resume
function resumeGame() {
    gamePaused = false;
    toggleControlButtons();
    backgroundMusic.play().catch(()=>{});
    scheduleNextMole();
}

// Generate grid
function generateGrid(size) {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';
    gameGrid.style.gridTemplateColumns = `repeat(${size}, 100px)`;

    for (let i = 1; i <= size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.id = i;
        gameGrid.appendChild(cell);

        cell.addEventListener('click', () => handleCellClick(i));
    }
}

// schedule next mole using a randomized interval based on difficulty + level
function scheduleNextMole() {
    if (gamePaused) return;
    // interval shrinks slightly as level increases
    const levelPenalty = Math.max(0, (level - 1) * 100);
    const min = Math.max(200, moleIntervalRange.min - levelPenalty);
    const max = Math.max(300, moleIntervalRange.max - levelPenalty);
    const next = Math.floor(Math.random() * (max - min + 1)) + min;

    clearInterval(intervalId);
    intervalId = setInterval(() => {
        showMole(gridSize);
        // To keep intervals varying, clear and reschedule after each mole
        clearInterval(intervalId);
        scheduleNextMole();
    }, next);
}

// Show mole
function showMole(size) {
    if (gamePaused) return;

    fetch(`/get_mole_position/${size}`)
        .then(response => response.json())
        .then(data => {
            const molePosition = data.position;
            const moleCell = document.querySelector(`.cell[data-id='${molePosition}']`);
            if (!moleCell) return;

            moleCell.innerHTML = `<img src="/static/images/mole.png" class="mole">`;

            // hide mole after visible duration (adjust by level so higher level = shorter visible)
            const visible = Math.max(200, moleVisibleDuration - (level - 1) * 100);
            setTimeout(() => { 
                // If the player clicked and replaced with hammer, don't clear prematurely
                if (moleCell && moleCell.querySelector('.mole')) {
                    moleCell.innerHTML = ''; 
                }
            }, visible);
        });
}

// Cell click
function handleCellClick(cellId) {
    const cell = document.querySelector(`.cell[data-id='${cellId}']`);
    if (cell && cell.querySelector('.mole')) {
        cell.innerHTML = `<img src="/static/images/hammer.png" class="hammer">`;
        hitSound.play();

        setTimeout(() => { cell.innerHTML = ''; }, 500);

        hitCount++;
        updateScoreAndLevel();
    } else {
        missSound.play();
        if (hitCount > 2) {
            // non-blocking user hint
            alert("Ouchhh you missed it :(");
        }
    }
}

// Update score & level
function updateScoreAndLevel() {
    scoreElement.textContent = hitCount;

    if (hitCount % 10 === 0) {
        level++;
        levelElement.textContent = `Level: ${level}`;
        levelUpSound.play();

        // reconfigure interval (shorten)
        clearInterval(intervalId);
        scheduleNextMole();

        showStar();
        alert("Yayyyy you win!!!!");
    }
}

// Star animation
function showStar() {
    const star = document.createElement('img');
    star.src = "/static/images/star.png";
    star.className = 'star';
    document.body.appendChild(star);

    setTimeout(() => { star.remove(); }, 2000);
}

// End game
function endGame() {
    clearInterval(intervalId);
    backgroundMusic.pause();

    const playerName = document.getElementById('playerNameInput').value.trim() || "Anonymous";
    alert(`Game Over! Your score is ${hitCount}`);

    // Save score to server (non-blocking)
    fetch('/save_score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player_name: playerName,
            score: hitCount,
            difficulty: currentDifficulty
        })
    }).then(res => res.json())
      .then(data => {
          // Optionally inform that it was saved quietly
          if (data && data.status === 'saved') {
              console.log('Score saved, id:', data.id);
          }
      }).catch(err => {
          console.warn('Could not save score:', err);
      });

    resetGame();
}

// Reset
function resetGame() {
    hitCount = 0;
    scoreElement.textContent = hitCount;
    level = 1;
    levelElement.textContent = `Level: ${level}`;
    toggleControlButtons();
    // clear grid visuals
    const cells = document.querySelectorAll('.cell');
    cells.forEach(c => c.innerHTML = '');
}

// On first load mark the default difficulty button
document.addEventListener('DOMContentLoaded', () => {
    setDifficulty(currentDifficulty);
});
