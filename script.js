const TARGET_DATE = new Date(2026, 8, 28); // 28 septembre 2026
const TOTAL_CASES = 15; // J, J-1 ... J-14
const MINESWEEPER_LEVELS = {
  facile: { rows: 8, cols: 8, hearts: 8 },
  moyen: { rows: 9, cols: 9, hearts: 12 },
  dur: { rows: 12, cols: 12, hearts: 28 }
};
const SNAKE_LEVELS = {
  facile: { speed: 180, goal: 8 },
  moyen: { speed: 130, goal: 12 },
  dur: { speed: 95, goal: 16 }
};
const PACMAN_LEVELS = {
  facile: { speed: 190, ghostCount: 1, goal: 20 },
  moyen: { speed: 145, ghostCount: 2, goal: 35 },
  dur: { speed: 115, ghostCount: 3, goal: 50 }
};
const CATRUNNER_LEVELS = {
  facile: { speed: 4, spawn: 95, goal: 18 },
  moyen: { speed: 5, spawn: 80, goal: 24 },
  dur: { speed: 6.5, spawn: 66, goal: 30 }
};
const TETRIS_LEVELS = {
  facile: { speed: 520, goal: 5 },
  moyen: { speed: 380, goal: 8 },
  dur: { speed: 260, goal: 12 }
};
const SPACE_LEVELS = {
  facile: { speed: 600, rows: 3, cols: 6, goal: 18, waves: 1 },
  moyen: { speed: 470, rows: 4, cols: 7, goal: 56, waves: 2 },
  dur: { speed: 360, rows: 5, cols: 8, goal: 120, waves: 3 }
};
const FLAPPY_LEVELS = {
  facile: { speed: 2.3, gap: 135, goal: 8 },
  moyen: { speed: 2.9, gap: 115, goal: 12 },
  dur: { speed: 3.4, gap: 95, goal: 16 }
};
const PONG_LEVELS = {
  facile: { ai: 2.2, goal: 5 },
  moyen: { ai: 3.1, goal: 7 },
  dur: { ai: 4.2, goal: 9 }
};
const PINBALL_LEVELS = {
  facile: { speed: 2.8, goal: 35 },
  moyen: { speed: 3.5, goal: 50 },
  dur: { speed: 4.2, goal: 70 }
};
const FIGHTER_LEVELS = {
  facile: { ai: 0.5 },
  moyen: { ai: 0.8 },
  dur: { ai: 1.2 }
};
const GAME_META = {
  minesweeper: { name: "Démineur", controls: "Clique sur les cases • évite les cœurs" },
  snake: { name: "Snake", controls: "Flèches directionnelles • mange les points" },
  pacman: { name: "Pac-Man", controls: "Flèches directionnelles • évite les fantômes" },
  catrunner: { name: "Course du petit mascotte", controls: "↑ ou Espace pour sauter" },
  tetris: { name: "Tetris", controls: "← → pour bouger • ↑ pour tourner • ↓ pour descendre" },
  chess: { name: "Échecs", controls: "Clique sur une pièce puis la case cible" },
  tictactoe: { name: "Morpion", controls: "Clique sur une case pour jouer" },
  solitaire: { name: "Solitaire", controls: "Clique sur les cartes • déplace-les dans les piles" },
  spaceinvaders: { name: "Space Invaders", controls: "← → pour bouger • Espace pour tirer" },
  flappy: { name: "Flappy", controls: "↑ ou Espace pour saut" },
  pong: { name: "Pong", controls: "↑ ↓ pour bouger • ou clique pour jouer" },
  pinball: { name: "Flipper", controls: "Barre espace pour lancer • flèches pour diriger" },
  fighter: { name: "Combat", controls: "← → pour bouger • ↑ pour sauter • ↓ pour se baisser • Espace pour frapper" }
};
const previewParam = (new URLSearchParams(window.location.search).get("preview") || "").toLowerCase();
const PREVIEW_ALL_CASES = previewParam === "all" || previewParam === "1" || previewParam === "true" || window.location.hash === "#preview";

const countdownGrid = document.getElementById("countdownGrid");
const dayJContainer = document.getElementById("dayJContainer");
const caseModal = document.getElementById("caseModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalBody = document.getElementById("modalBody");
const lockedMessageTemplate = document.getElementById("lockedMessageTemplate");
let activeGameCleanup = null;

const entries = buildEntries();
renderGrid(entries);

closeModalBtn.addEventListener("click", closeModal);
caseModal.addEventListener("click", (event) => {
  if (event.target === caseModal) {
    closeModal();
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

function buildEntries() {
  const items = [];
  const gameByLabel = {
    "J-14": "minesweeper",
    "J-13": "snake",
    "J-12": "pacman",
    "J-11": "catrunner",
    "J-10": "tetris",
    "J-9": "chess",
    "J-8": "tictactoe",
    "J-7": "solitaire",
    "J-6": "spaceinvaders",
    "J-5": "flappy",
    "J-4": "pong",
    "J-3": "pinball",
    "J-2": "fighter"
  };
  const photoFiles = [
    "Personnel/J.jpg",
    "Personnel/IMG_20260914_114343.jpg",
    "Personnel/IMG_20260914_114401.jpg",
    "Personnel/IMG_20260914_114423.jpg",
    "Personnel/IMG_20260914_114501.jpg",
    "Personnel/IMG_20260914_114512.jpg",
    "Personnel/IMG_20260914_114527.jpg",
    "Personnel/IMG_20260914_114541.jpg",
    "Personnel/IMG_20260914_114614.jpg",
    "Personnel/IMG_20260914_114630.jpg",
    "Personnel/IMG_20260914_114642.jpg",
    "Personnel/IMG_20260914_114656.jpg",
    "Personnel/IMG_20260914_114715.jpg",
    "Personnel/IMG_20260914_114730.jpg",
    "Personnel/IMG_20260914_114741.jpg"
  ];

  for (let offset = 0; offset < TOTAL_CASES; offset += 1) {
    const date = new Date(TARGET_DATE);
    date.setDate(TARGET_DATE.getDate() - offset);

    const label = offset === 0 ? "J" : `J-${offset}`;
    const imagePath = photoFiles[offset] || "";
    const gameType = gameByLabel[label] || "";

    items.push({
      id: offset,
      label,
      unlockDate: date,
      contentType: gameType || imagePath ? (gameType || "image") : "placeholder",
      text: "Contenu a definir ensemble (photo ou mini-jeu).",
      imagePath,
      cardImagePath: imagePath,
      gameHtml: "",
      gameLevel: gameType ? "moyen" : null
    });
  }

  return items;
}

function renderGrid(items) {
  const today = startOfDay(new Date());
  const nonJItems = items
    .filter((item) => item.label !== "J")
    .sort((a, b) => b.id - a.id);
  const jItem = items.find((item) => item.label === "J");

  nonJItems.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "case-card";

    const isUnlocked = PREVIEW_ALL_CASES || today >= startOfDay(item.unlockDate);
    if (!isUnlocked) {
      card.classList.add("locked");
    }

    if (item.cardImagePath) {
      card.classList.add("with-photo");
      const statusLabel = isUnlocked ? "Disponible" : "Bloquée";
      card.innerHTML = `
        <img src="${item.cardImagePath}" alt="Photo ${item.label}" class="case-photo" />
        <div class="case-content">
          <span class="case-label">${item.label}</span>
          <span class="case-status ${isUnlocked ? "" : "locked"}">${statusLabel}</span>
        </div>
      `;
    } else {
      const statusLabel = isUnlocked ? "Disponible" : "Bloquée";

      card.innerHTML = `
        <span class="case-label">${item.label}</span>
        <span class="case-status ${isUnlocked ? "" : "locked"}">${statusLabel}</span>
      `;
    }

    card.addEventListener("click", () => openCase(item, isUnlocked));

    card.style.animation = `reveal 450ms ease ${index * 50}ms both`;
    countdownGrid.appendChild(card);
  });

  if (jItem) {
    const jCard = document.createElement("button");
    jCard.type = "button";
    jCard.className = "case-card case-j";

    const isUnlocked = PREVIEW_ALL_CASES || today >= startOfDay(jItem.unlockDate);
    if (!isUnlocked) {
      jCard.classList.add("locked");
    }

    if (jItem.cardImagePath) {
      jCard.classList.add("with-photo");
      const statusLabel = isUnlocked ? "Disponible" : "Bloquée";
      jCard.innerHTML = `
        <img src="${jItem.cardImagePath}" alt="Photo ${jItem.label}" class="case-photo" />
        <div class="case-content">
          <span class="case-label">${jItem.label}</span>
          <span class="case-status ${isUnlocked ? "" : "locked"}">${statusLabel}</span>
        </div>
      `;
    } else {
      const statusLabel = isUnlocked ? "Disponible" : "Bloquée";
      jCard.innerHTML = `
        <span class="case-label">${jItem.label}</span>
        <span class="case-status ${isUnlocked ? "" : "locked"}">${statusLabel}</span>
      `;
    }

    jCard.addEventListener("click", () => openCase(jItem, isUnlocked));
    jCard.style.animation = "reveal 500ms ease 180ms both";
    dayJContainer.appendChild(jCard);
  }
}

function getGameMeta(contentType) {
  return GAME_META[contentType] || { name: "Mini-jeu", controls: "Utilise les touches du jeu" };
}

function openCase(item, isUnlocked) {
  if (activeGameCleanup) {
    activeGameCleanup();
    activeGameCleanup = null;
  }

  const gameMeta = getGameMeta(item.contentType);
  modalTitle.textContent = `${item.label} — ${gameMeta.name}`;
  modalDate.textContent = `Date d'ouverture: ${formatDate(item.unlockDate)}`;
  modalBody.innerHTML = "";

  if (!isUnlocked) {
    modalBody.appendChild(lockedMessageTemplate.content.cloneNode(true));
    openModal();
    return;
  }

  if (item.contentType === "minesweeper") {
    renderMinesweeper(item);
    return;
  }

  if (item.contentType === "snake") {
    renderSnake(item);
    return;
  }

  if (item.contentType === "pacman") {
    renderPacman(item);
    return;
  }

  if (item.contentType === "catrunner") {
    renderCatRunner(item);
    return;
  }

  if (item.contentType === "tetris") {
    renderTetris(item);
    return;
  }

  if (item.contentType === "chess") {
    renderChess(item);
    return;
  }

  if (item.contentType === "tictactoe") {
    renderTicTacToe(item);
    return;
  }

  if (item.contentType === "solitaire") {
    renderSolitaire(item);
    return;
  }

  if (item.contentType === "spaceinvaders") {
    renderSpaceInvaders(item);
    return;
  }

  if (item.contentType === "flappy") {
    renderFlappy(item);
    return;
  }

  if (item.contentType === "pong") {
    renderPong(item);
    return;
  }

  if (item.contentType === "pinball") {
    renderPinball(item);
    return;
  }

  if (item.contentType === "fighter") {
    renderStreetFighter(item);
    return;
  }

  if (item.contentType === "image" && item.imagePath) {
    const image = document.createElement("img");
    image.src = item.imagePath;
    image.alt = `Image ${item.label}`;
    image.className = "case-image";
    modalBody.appendChild(image);
    if (item.text) {
      const caption = document.createElement("p");
      caption.textContent = item.text;
      modalBody.appendChild(caption);
    }
    openModal();
    return;
  }

  if (item.contentType === "game" && item.gameHtml) {
    modalBody.innerHTML = item.gameHtml;
    openModal();
    return;
  }

  const placeholder = document.createElement("p");
  placeholder.className = "placeholder-box";
  placeholder.textContent = item.text;
  modalBody.appendChild(placeholder);
  openModal();
}

function renderMinesweeper(item) {
  const panel = document.createElement("div");
  panel.className = "minesweeper-panel";

  const controls = document.createElement("div");
  controls.className = "minesweeper-controls";

  const difficultyLabel = document.createElement("label");
  difficultyLabel.className = "minesweeper-label";
  difficultyLabel.textContent = "Difficulté";

  const difficultySelect = document.createElement("select");
  difficultySelect.className = "minesweeper-select";
  difficultySelect.innerHTML = `
    <option value="facile">Facile</option>
    <option value="moyen">Moyen</option>
    <option value="dur">Dur</option>
  `;
  difficultySelect.value = item.gameLevel || "moyen";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "minesweeper-reset";
  resetButton.textContent = "Reset";

  const messageBox = document.createElement("div");
  messageBox.className = "minesweeper-message-box";

  const board = document.createElement("div");
  board.className = "minesweeper-board";

  controls.appendChild(difficultyLabel);
  controls.appendChild(difficultySelect);
  controls.appendChild(resetButton);
  panel.appendChild(controls);
  panel.appendChild(messageBox);
  panel.appendChild(board);
  modalBody.appendChild(panel);

  let boardState = null;
  let currentConfig = null;

  const startGame = (levelKey) => {
    item.gameLevel = levelKey;
    currentConfig = MINESWEEPER_LEVELS[levelKey] || MINESWEEPER_LEVELS.moyen;
    boardState = createMinesweeperState(currentConfig);
    messageBox.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${currentConfig.cols}, minmax(0, 1fr))`;
    drawBoard();
  };

  const showResult = (type) => {
    const message = document.createElement("div");
    message.className = `minesweeper-message ${type}`;
    if (type === "lose") {
      message.textContent = "Vous avez perdu, vous êtes tombée amoureuse.";
    } else {
      message.textContent = "Tu as réussi à survivre pour aujourd'hui, à demain";
    }
    messageBox.innerHTML = "";
    messageBox.appendChild(message);
  };

  const drawBoard = () => {
    board.innerHTML = "";
    for (let row = 0; row < currentConfig.rows; row += 1) {
      for (let col = 0; col < currentConfig.cols; col += 1) {
        const cell = boardState.board[row][col];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "minesweeper-cell";

        if (cell.revealed) {
          button.classList.add("revealed");
        }
        if (cell.flagged) {
          button.classList.add("flagged");
        }
        if (cell.isHeart && cell.revealed) {
          button.classList.add("heart");
        }

        if (!cell.revealed && cell.flagged) {
          button.textContent = "❤";
        } else if (cell.revealed && cell.isHeart) {
          button.textContent = "❤";
        } else if (cell.revealed && cell.adjacent > 0) {
          button.textContent = String(cell.adjacent);
        } else {
          button.textContent = "";
        }

        button.addEventListener("click", () => {
          revealCell(boardState, row, col);
          drawBoard();

          if (boardState.lastResult === "lose") {
            showResult("lose");
          } else if (boardState.lastResult === "win") {
            showResult("win");
          }
        });

        button.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          if (!cell.revealed && !boardState.ended) {
            cell.flagged = !cell.flagged;
            drawBoard();
          }
        });

        board.appendChild(button);
      }
    }
  };

  difficultySelect.addEventListener("change", () => {
    startGame(difficultySelect.value);
  });

  resetButton.addEventListener("click", () => {
    startGame(difficultySelect.value);
  });

  startGame(difficultySelect.value);
  openModal();
}

function renderSnake(item) {
  const panel = document.createElement("div");
  panel.className = "snake-panel";

  const controls = document.createElement("div");
  controls.className = "minesweeper-controls";

  const difficultyLabel = document.createElement("label");
  difficultyLabel.className = "minesweeper-label";
  difficultyLabel.textContent = "Difficulté";

  const difficultySelect = document.createElement("select");
  difficultySelect.className = "minesweeper-select";
  difficultySelect.innerHTML = `
    <option value="facile">Facile</option>
    <option value="moyen">Moyen</option>
    <option value="dur">Dur</option>
  `;
  difficultySelect.value = item.gameLevel || "moyen";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "minesweeper-reset";
  resetButton.textContent = "Reset";

  const scoreBox = document.createElement("div");
  scoreBox.className = "snake-score";

  const messageBox = document.createElement("div");
  messageBox.className = "minesweeper-message-box";

  const canvas = document.createElement("canvas");
  canvas.className = "snake-canvas";
  canvas.width = 320;
  canvas.height = 320;

  controls.appendChild(difficultyLabel);
  controls.appendChild(difficultySelect);
  controls.appendChild(resetButton);
  panel.appendChild(controls);
  panel.appendChild(scoreBox);
  panel.appendChild(messageBox);
  panel.appendChild(canvas);
  modalBody.appendChild(panel);

  const context = canvas.getContext("2d");
  const gridSize = 16;
  const cellSize = canvas.width / gridSize;

  let intervalId = null;
  let snake = [];
  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };
  let food = { x: 10, y: 10 };
  let score = 0;
  let ended = false;
  let hasStarted = false;
  let levelConfig = SNAKE_LEVELS.moyen;

  const updateScore = () => {
    scoreBox.textContent = `Score: ${score} | Objectif: ${levelConfig.goal}`;
  };

  const draw = () => {
    context.fillStyle = "#fff4f8";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#f2d9e3";
    for (let i = 0; i <= gridSize; i += 1) {
      context.fillRect(i * cellSize, 0, 1, canvas.height);
      context.fillRect(0, i * cellSize, canvas.width, 1);
    }

    context.fillStyle = "#d15882";
    context.beginPath();
    context.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize * 0.32,
      0,
      Math.PI * 2
    );
    context.fill();

    context.fillStyle = "#7bcf7f";
    snake.forEach((segment, index) => {
      if (index === 0) {
        context.fillStyle = "#50b857";
      } else {
        context.fillStyle = "#7bcf7f";
      }
      context.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });
  };

  const spawnFood = () => {
    let valid = false;
    while (!valid) {
      const candidate = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      valid = !snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y);
      if (valid) {
        food = candidate;
      }
    }
  };

  const showResult = (type) => {
    const message = document.createElement("div");
    message.className = `minesweeper-message ${type}`;
    if (type === "lose") {
      message.textContent = "Vous avez perdu, vous êtes tombée amoureuse.";
    } else {
      message.textContent = "Tu as réussi à survivre pour aujourd'hui, à demain";
    }
    messageBox.innerHTML = "";
    messageBox.appendChild(message);
  };

  const stopLoop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startLoop = () => {
    stopLoop();
    intervalId = window.setInterval(step, levelConfig.speed);
  };

  const checkCollision = (head) => {
    if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize) {
      return true;
    }
    return snake.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const step = () => {
    if (ended) {
      return;
    }

    direction = nextDirection;
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    if (checkCollision(head)) {
      ended = true;
      stopLoop();
      showResult("lose");
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 1;
      updateScore();

      if (score >= levelConfig.goal) {
        ended = true;
        draw();
        stopLoop();
        showResult("win");
        return;
      }

      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  };

  const setDirection = (x, y) => {
    if (ended) {
      return;
    }
    if (snake.length > 1 && nextDirection.x === -x && nextDirection.y === -y) {
      return;
    }
    nextDirection = { x, y };
    if (!hasStarted) {
      hasStarted = true;
      startLoop();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setDirection(0, -1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setDirection(0, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setDirection(-1, 0);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setDirection(1, 0);
    }
  };

  const startGame = (levelKey) => {
    item.gameLevel = levelKey;
    levelConfig = SNAKE_LEVELS[levelKey] || SNAKE_LEVELS.moyen;
    messageBox.innerHTML = "";
    score = 0;
    ended = false;
    hasStarted = false;
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    snake = [
      { x: 4, y: 8 },
      { x: 3, y: 8 },
      { x: 2, y: 8 }
    ];
    spawnFood();
    updateScore();
    draw();
    stopLoop();
  };

  difficultySelect.addEventListener("change", () => {
    startGame(difficultySelect.value);
  });

  resetButton.addEventListener("click", () => {
    startGame(difficultySelect.value);
  });

  window.addEventListener("keydown", handleKeyDown);
  activeGameCleanup = () => {
    stopLoop();
    window.removeEventListener("keydown", handleKeyDown);
  };

  startGame(difficultySelect.value);
  openModal();
}

function renderPacman(item) {
  const panel = document.createElement("div");
  panel.className = "snake-panel";

  const controls = document.createElement("div");
  controls.className = "minesweeper-controls";

  const difficultyLabel = document.createElement("label");
  difficultyLabel.className = "minesweeper-label";
  difficultyLabel.textContent = "Difficulté";

  const difficultySelect = document.createElement("select");
  difficultySelect.className = "minesweeper-select";
  difficultySelect.innerHTML = `
    <option value="facile">Facile</option>
    <option value="moyen">Moyen</option>
    <option value="dur">Dur</option>
  `;
  difficultySelect.value = item.gameLevel || "moyen";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "minesweeper-reset";
  resetButton.textContent = "Reset";

  const scoreBox = document.createElement("div");
  scoreBox.className = "snake-score";

  const messageBox = document.createElement("div");
  messageBox.className = "minesweeper-message-box";

  const canvas = document.createElement("canvas");
  canvas.className = "snake-canvas";
  canvas.width = 320;
  canvas.height = 320;

  controls.appendChild(difficultyLabel);
  controls.appendChild(difficultySelect);
  controls.appendChild(resetButton);
  panel.appendChild(controls);
  panel.appendChild(scoreBox);
  panel.appendChild(messageBox);
  panel.appendChild(canvas);
  modalBody.appendChild(panel);

  const context = canvas.getContext("2d");
  const map = [
    "1111111111111111",
    "1000000000000001",
    "1011110111101101",
    "1000010000100001",
    "1011011110110101",
    "1001000000010001",
    "1011110111101111",
    "1000000100000001",
    "1110111101110101",
    "1000100000010001",
    "1011101110111101",
    "1000001000100001",
    "1011111011110101",
    "1000000000000001",
    "1111111111111111"
  ];
  const rows = map.length;
  const cols = map[0].length;
  const cellSize = canvas.width / cols;

  let intervalId = null;
  let levelConfig = PACMAN_LEVELS.moyen;
  let pacman = { x: 1, y: 1, dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0 };
  let ghosts = [];
  let pellets = new Set();
  let score = 0;
  let ended = false;
  let hasStarted = false;
  let mouthPhase = 0;

  const tileKey = (x, y) => `${x},${y}`;

  const isWalkable = (x, y) => {
    if (x < 0 || y < 0 || x >= cols || y >= rows) {
      return false;
    }
    return map[y][x] === "0";
  };

  const updateScore = () => {
    scoreBox.textContent = `Score: ${score} | Objectif: ${levelConfig.goal}`;
  };

  const showResult = (type) => {
    const message = document.createElement("div");
    message.className = `minesweeper-message ${type}`;
    if (type === "lose") {
      message.textContent = "Vous avez perdu, vous êtes tombée amoureuse.";
    } else {
      message.textContent = "Tu as réussi à survivre pour aujourd'hui, à demain";
    }
    messageBox.innerHTML = "";
    messageBox.appendChild(message);
  };

  const stopLoop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startLoop = () => {
    stopLoop();
    intervalId = window.setInterval(step, levelConfig.speed);
  };

  const spawnPellets = () => {
    pellets.clear();
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (isWalkable(x, y) && !(x === pacman.x && y === pacman.y)) {
          pellets.add(tileKey(x, y));
        }
      }
    }
  };

  const spawnGhosts = () => {
    const starts = [
      { x: 14, y: 13, dirX: -1, dirY: 0 },
      { x: 14, y: 1, dirX: -1, dirY: 0 },
      { x: 1, y: 13, dirX: 1, dirY: 0 }
    ];
    ghosts = starts.slice(0, levelConfig.ghostCount).map((start) => ({ ...start }));
  };

  const draw = () => {
    context.fillStyle = "#0f132a";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (map[y][x] === "1") {
          context.fillStyle = "#3e4cd5";
          context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else {
          context.fillStyle = "#1a1e3f";
          context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    context.fillStyle = "#ffe6a9";
    pellets.forEach((key) => {
      const [x, y] = key.split(",").map(Number);
      context.beginPath();
      context.arc(
        x * cellSize + cellSize / 2,
        y * cellSize + cellSize / 2,
        Math.max(2, cellSize * 0.08),
        0,
        Math.PI * 2
      );
      context.fill();
    });

    ghosts.forEach((ghost, index) => {
      const ghostColors = ["#ff5a75", "#62d5ff", "#ffb347"];
      context.fillStyle = ghostColors[index % ghostColors.length];
      context.beginPath();
      context.arc(
        ghost.x * cellSize + cellSize / 2,
        ghost.y * cellSize + cellSize / 2,
        cellSize * 0.34,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    const centerX = pacman.x * cellSize + cellSize / 2;
    const centerY = pacman.y * cellSize + cellSize / 2;
    const baseAngle = Math.atan2(pacman.dirY, pacman.dirX);
    const mouth = (Math.sin(mouthPhase) + 1) * 0.22 + 0.12;
    context.fillStyle = "#ffd83d";
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, cellSize * 0.38, baseAngle + mouth, baseAngle + (Math.PI * 2 - mouth), false);
    context.closePath();
    context.fill();
  };

  const moveGhost = (ghost) => {
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];
    const valid = directions.filter((dir) => isWalkable(ghost.x + dir.x, ghost.y + dir.y));

    if (valid.length === 0) {
      return;
    }

    const continueMove = valid.find((dir) => dir.x === ghost.dirX && dir.y === ghost.dirY);
    let chosen = continueMove;

    const atJunction = valid.length > 2 || !continueMove;
    if (atJunction) {
      const nonBacktracking = valid.filter((dir) => !(dir.x === -ghost.dirX && dir.y === -ghost.dirY));
      const pool = nonBacktracking.length > 0 ? nonBacktracking : valid;
      chosen = pool[Math.floor(Math.random() * pool.length)];
    }

    ghost.dirX = chosen.x;
    ghost.dirY = chosen.y;
    ghost.x += ghost.dirX;
    ghost.y += ghost.dirY;
  };

  const checkGhostCollision = () => ghosts.some((ghost) => ghost.x === pacman.x && ghost.y === pacman.y);

  const crossedGhost = (previousPacman, previousGhosts) => {
    for (let i = 0; i < ghosts.length; i += 1) {
      const before = previousGhosts[i];
      const after = ghosts[i];
      if (!before || !after) {
        continue;
      }
      const crossed =
        previousPacman.x === after.x &&
        previousPacman.y === after.y &&
        pacman.x === before.x &&
        pacman.y === before.y;
      if (crossed) {
        return true;
      }
    }
    return false;
  };

  const step = () => {
    if (ended) {
      return;
    }

    const previousPacman = { x: pacman.x, y: pacman.y };
    const previousGhosts = ghosts.map((ghost) => ({ x: ghost.x, y: ghost.y }));

    if (isWalkable(pacman.x + pacman.nextDirX, pacman.y + pacman.nextDirY)) {
      pacman.dirX = pacman.nextDirX;
      pacman.dirY = pacman.nextDirY;
    }

    if (isWalkable(pacman.x + pacman.dirX, pacman.y + pacman.dirY)) {
      pacman.x += pacman.dirX;
      pacman.y += pacman.dirY;
    }

    const key = tileKey(pacman.x, pacman.y);
    if (pellets.has(key)) {
      pellets.delete(key);
      score += 1;
      updateScore();
      if (score >= levelConfig.goal) {
        ended = true;
        stopLoop();
        showResult("win");
        draw();
        return;
      }
    }

    // Collision immediate si Pac-Man arrive sur la case actuelle d'un fantome.
    if (checkGhostCollision()) {
      ended = true;
      stopLoop();
      showResult("lose");
      draw();
      return;
    }

    ghosts.forEach((ghost) => moveGhost(ghost));

    // Collision apres deplacement ou croisement de trajectoires dans le meme tick.
    if (checkGhostCollision() || crossedGhost(previousPacman, previousGhosts)) {
      ended = true;
      stopLoop();
      showResult("lose");
      draw();
      return;
    }

    mouthPhase += 0.45;
    draw();
  };

  const setDirection = (x, y) => {
    if (ended) {
      return;
    }
    pacman.nextDirX = x;
    pacman.nextDirY = y;
    if (!hasStarted) {
      hasStarted = true;
      if (pacman.dirX === 0 && pacman.dirY === 0) {
        pacman.dirX = x;
        pacman.dirY = y;
      }
      startLoop();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setDirection(0, -1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setDirection(0, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setDirection(-1, 0);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setDirection(1, 0);
    }
  };

  const startGame = (levelKey) => {
    item.gameLevel = levelKey;
    levelConfig = PACMAN_LEVELS[levelKey] || PACMAN_LEVELS.moyen;
    messageBox.innerHTML = "";
    score = 0;
    ended = false;
    hasStarted = false;
    pacman = { x: 1, y: 1, dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0 };
    spawnGhosts();
    spawnPellets();
    updateScore();
    mouthPhase = 0;
    draw();
    stopLoop();
  };

  difficultySelect.addEventListener("change", () => {
    startGame(difficultySelect.value);
  });

  resetButton.addEventListener("click", () => {
    startGame(difficultySelect.value);
  });

  window.addEventListener("keydown", handleKeyDown);
  activeGameCleanup = () => {
    stopLoop();
    window.removeEventListener("keydown", handleKeyDown);
  };

  startGame(difficultySelect.value);
  openModal();
}

function createArcadePanel(item, options = {}) {
  const panel = document.createElement("div");
  panel.className = "snake-panel";

  const meta = getGameMeta(item.contentType);

  const controls = document.createElement("div");
  controls.className = "minesweeper-controls";
  controls.style.display = "flex";
  controls.style.alignItems = "center";
  controls.style.gap = "8px";
  controls.style.flexWrap = "wrap";

  const controlsLegend = document.createElement("div");
  controlsLegend.style.margin = "0";
  controlsLegend.style.fontSize = "11px";
  controlsLegend.style.lineHeight = "1.4";
  controlsLegend.style.color = "#2b2b35";
  controlsLegend.style.fontWeight = "600";
  controlsLegend.style.flex = "1 1 150px";
  controlsLegend.style.minWidth = "0";
  controlsLegend.innerHTML = `<strong>Commandes :</strong> ${meta.controls}`;

  const difficultyLabel = document.createElement("label");
  difficultyLabel.className = "minesweeper-label";
  difficultyLabel.textContent = "Difficulté";

  const difficultySelect = document.createElement("select");
  difficultySelect.className = "minesweeper-select";
  difficultySelect.innerHTML = `
    <option value="facile">Facile</option>
    <option value="moyen">Moyen</option>
    <option value="dur">Dur</option>
  `;
  difficultySelect.value = item.gameLevel || "moyen";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "minesweeper-reset";
  resetButton.textContent = "Reset";

  const scoreBox = document.createElement("div");
  scoreBox.className = "snake-score";

  const messageBox = document.createElement("div");
  messageBox.className = "minesweeper-message-box";

  controls.appendChild(difficultyLabel);
  controls.appendChild(difficultySelect);
  controls.appendChild(resetButton);
  controls.appendChild(controlsLegend);

  panel.appendChild(controls);
  panel.appendChild(scoreBox);
  panel.appendChild(messageBox);

  let canvas = null;
  if (options.withCanvas !== false) {
    canvas = document.createElement("canvas");
    canvas.className = "snake-canvas";
    canvas.width = options.canvasSize || 320;
    canvas.height = options.canvasSize || 320;
    panel.appendChild(canvas);
  }

  modalBody.appendChild(panel);

  const cleanups = [];
  const addCleanup = (fn) => cleanups.push(fn);
  activeGameCleanup = () => {
    cleanups.forEach((fn) => fn());
  };

  return { panel, controls, difficultySelect, resetButton, scoreBox, messageBox, canvas, addCleanup };
}

function setGameMessage(messageBox, type, text) {
  const message = document.createElement("div");
  message.className = `minesweeper-message ${type}`;
  message.textContent = text;
  messageBox.innerHTML = "";
  messageBox.appendChild(message);
}

function renderCatRunner(item) {
  const ui = createArcadePanel(item);
  const context = ui.canvas.getContext("2d");
  const width = ui.canvas.width;
  const height = ui.canvas.height;
  const groundY = height - 36;
  const catX = 52;
  const catWidth = 30;
  const catHeight = 26;

  let intervalId = null;
  let config = CATRUNNER_LEVELS.moyen;
  let catY = 0;
  let velocityY = 0;
  let started = false;
  let ended = false;
  let frame = 0;
  let score = 0;
  let obstacles = [];

  const updateScore = () => {
    ui.scoreBox.textContent = `Score: ${score} | Objectif: ${config.goal}`;
  };

  const stop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const drawHeart = (x, y, w, h) => {
    context.beginPath();
    context.moveTo(x + w / 2, y + h);
    context.bezierCurveTo(x + w, y + h * 0.55, x + w, y, x + w / 2, y + h * 0.18);
    context.bezierCurveTo(x, y, x, y + h * 0.55, x + w / 2, y + h);
    context.fill();
    context.closePath();
  };

  const drawPixelMascot = (x, y) => {
    const sprite = [
      "0000000000000000",
      "0000111111000000",
      "0001111111100000",
      "0011111111110000",
      "0111111111111000",
      "0110100010111000",
      "0110110110111000",
      "0111111111111000",
      "0111111111111000",
      "0011111111110000",
      "0011001100110000",
      "0001111111100000",
      "0000111111000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000"
    ];

    const px = 2;
    const faceColor = "#f5d7b0";
    const earColor = "#f6c59f";
    const accentColor = "#83dfe9";
    const dark = "#2d2a35";
    const blush = "#ff9db2";

    for (let row = 0; row < sprite.length; row += 1) {
      for (let col = 0; col < sprite[row].length; col += 1) {
        if (sprite[row][col] !== "1") continue;
        const pxX = x + col * px;
        const pxY = y + row * px;
        context.fillStyle = faceColor;
        context.fillRect(pxX, pxY, px, px);
      }
    }

    context.fillStyle = earColor;
    context.fillRect(x + 4 * px, y + 1 * px, 2 * px, 3 * px);
    context.fillRect(x + 10 * px, y + 1 * px, 2 * px, 3 * px);

    context.fillStyle = accentColor;
    context.fillRect(x + 5 * px, y + 10 * px, 6 * px, 2 * px);

    context.fillStyle = dark;
    context.fillRect(x + 5 * px, y + 6 * px, 2 * px, 2 * px);
    context.fillRect(x + 9 * px, y + 6 * px, 2 * px, 2 * px);
    context.fillRect(x + 7 * px, y + 8 * px, 2 * px, 2 * px);

    context.fillStyle = blush;
    context.fillRect(x + 4 * px, y + 7 * px, 2 * px, 2 * px);
    context.fillRect(x + 10 * px, y + 7 * px, 2 * px, 2 * px);

    context.fillStyle = "#f7efe8";
    context.fillRect(x + 5 * px, y + 11 * px, 6 * px, 4 * px);

    context.fillStyle = dark;
    context.fillRect(x + 1 * px, y + 10 * px, 2 * px, 5 * px);
    context.fillRect(x + 13 * px, y + 10 * px, 2 * px, 5 * px);
    context.fillRect(x + 5 * px, y + 15 * px, 2 * px, 3 * px);
    context.fillRect(x + 9 * px, y + 15 * px, 2 * px, 3 * px);
  };

  const draw = () => {
    context.fillStyle = "#edf8ff";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "#d7ebff";
    for (let i = 0; i < 5; i += 1) {
      context.beginPath();
      context.arc(28 + i * 70, 42 + (i % 2) * 10, 16, 0, Math.PI * 2);
      context.arc(44 + i * 70, 42 + (i % 2) * 10, 16, 0, Math.PI * 2);
      context.arc(36 + i * 70, 48 + (i % 2) * 10, 18, 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = "#d8b58b";
    context.fillRect(0, groundY, width, height - groundY);

    context.fillStyle = "#c8885a";
    for (let x = 0; x < width; x += 18) {
      context.fillRect(x, groundY + 8, 10, 4);
    }

    const catSpriteY = groundY - catHeight - catY;
    drawPixelMascot(catX, catSpriteY);

    obstacles.forEach((obstacle) => {
      const heartX = obstacle.x;
      const heartY = obstacle.y ?? (groundY - obstacle.h);
      context.fillStyle = obstacle.color;
      drawHeart(heartX, heartY, obstacle.w, obstacle.h);
      context.fillStyle = "rgba(255,255,255,0.45)";
      context.fillRect(heartX + obstacle.w * 0.35, heartY + obstacle.h * 0.2, 2, 2);
    });
  };

  const collides = (catXPos, catYValue, obstacle) => {
    if (!obstacle.dangerous) {
      return false;
    }
    const catRect = { x: catXPos, y: groundY - catHeight - catYValue, w: catWidth, h: catHeight };
    const obstacleRect = { x: obstacle.x, y: obstacle.y ?? (groundY - obstacle.h), w: obstacle.w, h: obstacle.h };
    return catRect.x < obstacleRect.x + obstacleRect.w && catRect.x + catRect.w > obstacleRect.x && catRect.y < obstacleRect.y + obstacleRect.h && catRect.y + catRect.h > obstacleRect.y;
  };

  const getSpawnDelay = () => Math.max(28, Math.round(config.spawn - score * 0.6));
  const getSpeed = () => config.speed + Math.min(score * 0.18, 4.5);

  const spawnObstacle = () => {
    const variants = [
      { w: 18, h: 18, color: "#ff5f8f", dangerous: true, y: null },
      { w: 22, h: 20, color: "#ff7a9c", dangerous: true, y: null },
      { w: 26, h: 24, color: "#ff4f7a", dangerous: true, y: null },
      { w: 18, h: 16, color: "#ff82ad", dangerous: false, y: groundY - 42 }
    ];
    const variant = variants[Math.floor(Math.random() * variants.length)];
    obstacles.push({
      x: width + 10,
      w: variant.w,
      h: variant.h,
      color: variant.color,
      dangerous: variant.dangerous,
      y: variant.y
    });
  };

  const step = () => {
    if (!started || ended) {
      draw();
      return;
    }

    frame += 1;
    velocityY -= 0.75;
    catY += velocityY;
    if (catY < 0) {
      catY = 0;
      velocityY = 0;
    }

    if (frame % getSpawnDelay() === 0) {
      spawnObstacle();
    }

    obstacles.forEach((obstacle) => {
      obstacle.x -= getSpeed();
    });

    obstacles = obstacles.filter((obstacle) => {
      if (obstacle.x + obstacle.w < 0) {
        score += 1;
        updateScore();
        return false;
      }
      return true;
    });

    if (obstacles.some((obstacle) => collides(catX, catY, obstacle))) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "lose", "Tu as touché un cœur trop tôt. Rejoue !");
    }

    if (score >= config.goal) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
    }

    draw();
  };

  const startGame = (level) => {
    item.gameLevel = level;
    config = CATRUNNER_LEVELS[level] || CATRUNNER_LEVELS.moyen;
    score = 0;
    frame = 0;
    catY = 0;
    velocityY = 0;
    started = false;
    ended = false;
    obstacles = [];
    ui.messageBox.innerHTML = "";
    updateScore();
    stop();
    intervalId = window.setInterval(step, 16);
    draw();
  };

  const jump = () => {
    if (ended) {
      return;
    }
    if (!started) {
      started = true;
    }
    if (catY === 0) {
      velocityY = 11.2;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" || event.key === " ") {
      event.preventDefault();
      jump();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  ui.addCleanup(() => {
    stop();
    window.removeEventListener("keydown", handleKeyDown);
  });

  ui.difficultySelect.addEventListener("change", () => startGame(ui.difficultySelect.value));
  ui.resetButton.addEventListener("click", () => startGame(ui.difficultySelect.value));

  startGame(ui.difficultySelect.value);
  openModal();
}

function renderTetris(item) {
  const ui = createArcadePanel(item);
  const context = ui.canvas.getContext("2d");
  const cols = 10;
  const rows = 18;
  const size = Math.max(16, Math.floor(ui.canvas.width / cols));
  ui.canvas.height = size * rows;
  const pieces = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]]
  ];
  const colors = ["#3fb0ff", "#ffd77a", "#b37dff", "#7be08d", "#ff9b70", "#ff7cb8", "#9bd4ff"];

  let config = TETRIS_LEVELS.moyen;
  let board = [];
  let active = null;
  let score = 0;
  let ended = false;
  let started = false;
  let intervalId = null;

  const updateScore = () => {
    ui.scoreBox.textContent = `Lignes: ${score} | Objectif: ${config.goal}`;
  };

  const stop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const makePiece = () => {
    const index = Math.floor(Math.random() * pieces.length);
    return { shape: pieces[index], color: colors[index], x: 3, y: 0 };
  };

  const collision = (piece, offsetX, offsetY, shape = piece.shape) => {
    for (let y = 0; y < shape.length; y += 1) {
      for (let x = 0; x < shape[y].length; x += 1) {
        if (!shape[y][x]) {
          continue;
        }
        const nx = piece.x + x + offsetX;
        const ny = piece.y + y + offsetY;
        if (nx < 0 || nx >= cols || ny >= rows) {
          return true;
        }
        if (ny >= 0 && board[ny][nx]) {
          return true;
        }
      }
    }
    return false;
  };

  const merge = () => {
    active.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          board[active.y + y][active.x + x] = active.color;
        }
      });
    });
  };

  const clearLines = () => {
    let cleared = 0;
    for (let y = rows - 1; y >= 0; y -= 1) {
      if (board[y].every(Boolean)) {
        board.splice(y, 1);
        board.unshift(new Array(cols).fill(""));
        cleared += 1;
        y += 1;
      }
    }
    if (cleared > 0) {
      score += cleared;
      updateScore();
    }
  };

  const rotate = (shape) => shape[0].map((_, index) => shape.map((row) => row[index]).reverse());

  const draw = () => {
    context.fillStyle = "#121830";
    context.fillRect(0, 0, ui.canvas.width, ui.canvas.height);
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        context.fillStyle = board[y][x] || "#1b244a";
        context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
      }
    }

    if (!active) {
      return;
    }

    active.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (!cell) {
          return;
        }
        context.fillStyle = active.color;
        context.fillRect((active.x + x) * size + 1, (active.y + y) * size + 1, size - 2, size - 2);
      });
    });
  };

  const lockAndNext = () => {
    merge();
    clearLines();
    if (score >= config.goal) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
      return;
    }
    active = makePiece();
    if (collision(active, 0, 0)) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "lose", "Vous avez perdu, vous êtes tombée amoureuse.");
    }
  };

  const step = () => {
    if (!started || ended) {
      draw();
      return;
    }
    if (!collision(active, 0, 1)) {
      active.y += 1;
    } else {
      lockAndNext();
    }
    draw();
  };

  const move = (dx) => {
    if (!active || ended) {
      return;
    }
    if (!collision(active, dx, 0)) {
      active.x += dx;
    }
  };

  const drop = () => {
    if (!active || ended) {
      return;
    }
    if (!collision(active, 0, 1)) {
      active.y += 1;
    } else {
      lockAndNext();
    }
  };

  const doRotate = () => {
    const rotated = rotate(active.shape);
    if (!collision(active, 0, 0, rotated)) {
      active.shape = rotated;
    }
  };

  const handleKeyDown = (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(event.key)) {
      event.preventDefault();
      if (!started) {
        started = true;
      }
    }
    if (event.key === "ArrowLeft") {
      move(-1);
    } else if (event.key === "ArrowRight") {
      move(1);
    } else if (event.key === "ArrowDown") {
      drop();
    } else if (event.key === "ArrowUp") {
      doRotate();
    }
    draw();
  };

  const startGame = (level) => {
    item.gameLevel = level;
    config = TETRIS_LEVELS[level] || TETRIS_LEVELS.moyen;
    board = Array.from({ length: rows }, () => new Array(cols).fill(""));
    active = makePiece();
    score = 0;
    ended = false;
    started = false;
    ui.messageBox.innerHTML = "";
    updateScore();
    draw();
    stop();
    intervalId = window.setInterval(step, config.speed);
  };

  window.addEventListener("keydown", handleKeyDown);
  ui.addCleanup(() => {
    stop();
    window.removeEventListener("keydown", handleKeyDown);
  });

  ui.difficultySelect.addEventListener("change", () => startGame(ui.difficultySelect.value));
  ui.resetButton.addEventListener("click", () => startGame(ui.difficultySelect.value));

  startGame(ui.difficultySelect.value);
  openModal();
}

function renderTicTacToe(item) {
  const ui = createArcadePanel(item, { withCanvas: false });
  const board = document.createElement("div");
  board.className = "game-grid game-grid-3";
  ui.panel.appendChild(board);

  let cells = [];
  let player = "X";
  let ended = false;

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const updateScore = () => {
    ui.scoreBox.textContent = "Morpion: aligne 3 symboles";
  };

  const winner = (state, mark) => lines.some((line) => line.every((idx) => state[idx] === mark));

  const findMove = (mark) => {
    for (const line of lines) {
      const values = line.map((idx) => cells[idx]);
      if (values.filter((v) => v === mark).length === 2 && values.includes("")) {
        return line[values.indexOf("")];
      }
    }
    return -1;
  };

  const aiTurn = () => {
    if (ended) {
      return;
    }
    let move = findMove("O");
    if (move === -1 && ui.difficultySelect.value !== "facile") {
      move = findMove("X");
    }
    if (move === -1) {
      const empties = cells.map((v, i) => (v ? -1 : i)).filter((v) => v !== -1);
      move = empties[Math.floor(Math.random() * empties.length)];
    }
    if (move >= 0) {
      cells[move] = "O";
    }
    renderBoard();
    if (winner(cells, "O")) {
      ended = true;
      setGameMessage(ui.messageBox, "lose", "Vous avez perdu, vous êtes tombée amoureuse.");
      return;
    }
    if (!cells.includes("")) {
      ended = true;
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
    }
  };

  const play = (index) => {
    if (ended || cells[index]) {
      return;
    }
    cells[index] = player;
    renderBoard();
    if (winner(cells, player)) {
      ended = true;
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
      return;
    }
    if (!cells.includes("")) {
      ended = true;
      setGameMessage(ui.messageBox, "lose", "Vous avez perdu, vous êtes tombée amoureuse.");
      return;
    }
    window.setTimeout(aiTurn, 220);
  };

  const renderBoard = () => {
    board.innerHTML = "";
    cells.forEach((value, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "game-cell";
      button.textContent = value;
      button.addEventListener("click", () => play(index));
      board.appendChild(button);
    });
  };

  const startGame = () => {
    cells = ["", "", "", "", "", "", "", "", ""];
    ended = false;
    ui.messageBox.innerHTML = "";
    updateScore();
    renderBoard();
  };

  ui.difficultySelect.addEventListener("change", startGame);
  ui.resetButton.addEventListener("click", startGame);
  startGame();
  openModal();
}

function renderSolitaire(item) {
  const ui = createArcadePanel(item, { withCanvas: false });
  const board = document.createElement("div");
  board.className = "game-grid";
  ui.panel.appendChild(board);

  let first = null;
  let second = null;
  let locked = false;
  let matched = 0;
  let cards = [];

  const levelPairs = { facile: 6, moyen: 8, dur: 10 };

  const updateScore = () => {
    ui.scoreBox.textContent = `Paires trouvées: ${matched} / ${cards.length / 2}`;
  };

  const startGame = (level) => {
    item.gameLevel = level;
    const pairCount = levelPairs[level] || levelPairs.moyen;
    const values = [];
    for (let i = 1; i <= pairCount; i += 1) {
      values.push(i, i);
    }
    cards = values
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value, open: false, done: false }));
    first = null;
    second = null;
    matched = 0;
    locked = false;
    ui.messageBox.innerHTML = "";
    updateScore();
    draw();
  };

  const draw = () => {
    board.innerHTML = "";
    cards.forEach((card) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `game-cell ${card.done ? "done" : ""}`;
      button.textContent = card.open || card.done ? `♥${card.value}` : "?";
      button.addEventListener("click", () => flip(card.id));
      board.appendChild(button);
    });
  };

  const flip = (id) => {
    if (locked) {
      return;
    }
    const card = cards.find((itemCard) => itemCard.id === id);
    if (!card || card.open || card.done) {
      return;
    }
    card.open = true;
    if (!first) {
      first = card;
      draw();
      return;
    }
    second = card;
    draw();
    if (first.value === second.value) {
      first.done = true;
      second.done = true;
      first = null;
      second = null;
      matched += 1;
      updateScore();
      if (cards.every((entry) => entry.done)) {
        setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
      }
      return;
    }

    locked = true;
    window.setTimeout(() => {
      first.open = false;
      second.open = false;
      first = null;
      second = null;
      locked = false;
      draw();
    }, 650);
  };

  ui.difficultySelect.addEventListener("change", () => startGame(ui.difficultySelect.value));
  ui.resetButton.addEventListener("click", () => startGame(ui.difficultySelect.value));

  startGame(ui.difficultySelect.value);
  openModal();
}

function renderChess(item) {
  const ui = createArcadePanel(item, { withCanvas: false });
  const boardEl = document.createElement("div");
  boardEl.className = "game-grid chess-grid";
  ui.panel.appendChild(boardEl);

  const symbols = {
    K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
    k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟"
  };
  const baseBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
  ];

  let board = [];
  let selected = null;
  let turn = "white";
  let ended = false;

  const inside = (x, y) => x >= 0 && y >= 0 && x < 8 && y < 8;
  const colorOf = (piece) => (piece && piece === piece.toUpperCase() ? "white" : piece ? "black" : "");

  const cloneBoard = () => baseBoard.map((row) => [...row]);

  const lineMoves = (x, y, piece, dirs) => {
    const moves = [];
    const own = colorOf(piece);
    dirs.forEach(([dx, dy]) => {
      let nx = x + dx;
      let ny = y + dy;
      while (inside(nx, ny)) {
        const target = board[ny][nx];
        if (!target) {
          moves.push([nx, ny]);
        } else {
          if (colorOf(target) !== own) {
            moves.push([nx, ny]);
          }
          break;
        }
        nx += dx;
        ny += dy;
      }
    });
    return moves;
  };

  const legalMoves = (x, y) => {
    const piece = board[y][x];
    if (!piece) {
      return [];
    }
    const own = colorOf(piece);
    const lower = piece.toLowerCase();
    const moves = [];

    if (lower === "p") {
      const dir = own === "white" ? -1 : 1;
      const start = own === "white" ? 6 : 1;
      if (inside(x, y + dir) && !board[y + dir][x]) {
        moves.push([x, y + dir]);
      }
      if (y === start && !board[y + dir][x] && !board[y + dir * 2][x]) {
        moves.push([x, y + dir * 2]);
      }
      [-1, 1].forEach((dx) => {
        const nx = x + dx;
        const ny = y + dir;
        if (inside(nx, ny) && board[ny][nx] && colorOf(board[ny][nx]) !== own) {
          moves.push([nx, ny]);
        }
      });
      return moves;
    }

    if (lower === "r") {
      return lineMoves(x, y, piece, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
    }
    if (lower === "b") {
      return lineMoves(x, y, piece, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    }
    if (lower === "q") {
      return lineMoves(x, y, piece, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
    }
    if (lower === "n") {
      [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (inside(nx, ny) && colorOf(board[ny][nx]) !== own) {
          moves.push([nx, ny]);
        }
      });
      return moves;
    }
    if (lower === "k") {
      for (let dx = -1; dx <= 1; dx += 1) {
        for (let dy = -1; dy <= 1; dy += 1) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          const nx = x + dx;
          const ny = y + dy;
          if (inside(nx, ny) && colorOf(board[ny][nx]) !== own) {
            moves.push([nx, ny]);
          }
        }
      }
      return moves;
    }
    return moves;
  };

  const hasKing = (kingSymbol) => board.some((row) => row.includes(kingSymbol));

  const makeMove = (fx, fy, tx, ty) => {
    board[ty][tx] = board[fy][fx];
    board[fy][fx] = "";
  };

  const aiMove = () => {
    if (ended) {
      return;
    }
    const allMoves = [];
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        if (colorOf(board[y][x]) !== "black") {
          continue;
        }
        legalMoves(x, y).forEach(([tx, ty]) => {
          allMoves.push({ fx: x, fy: y, tx, ty, capture: !!board[ty][tx] });
        });
      }
    }
    if (allMoves.length === 0) {
      ended = true;
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
      return;
    }
    const difficulty = ui.difficultySelect.value;
    let candidates = allMoves;
    if (difficulty !== "facile") {
      const captures = allMoves.filter((move) => move.capture);
      if (captures.length > 0) {
        candidates = captures;
      }
    }
    const choice = candidates[Math.floor(Math.random() * candidates.length)];
    makeMove(choice.fx, choice.fy, choice.tx, choice.ty);
    if (!hasKing("K")) {
      ended = true;
      setGameMessage(ui.messageBox, "lose", "Vous avez perdu, vous êtes tombée amoureuse.");
    }
    turn = "white";
    draw();
  };

  const clickSquare = (x, y) => {
    if (ended || turn !== "white") {
      return;
    }
    const piece = board[y][x];
    if (selected) {
      const moves = legalMoves(selected.x, selected.y);
      const ok = moves.some(([mx, my]) => mx === x && my === y);
      if (ok) {
        makeMove(selected.x, selected.y, x, y);
        selected = null;
        if (!hasKing("k")) {
          ended = true;
          setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
          draw();
          return;
        }
        turn = "black";
        draw();
        window.setTimeout(aiMove, 250);
        return;
      }
      selected = null;
    }
    if (piece && colorOf(piece) === "white") {
      selected = { x, y };
    }
    draw();
  };

  const draw = () => {
    boardEl.innerHTML = "";
    ui.scoreBox.textContent = ended ? "Partie terminée" : `Tour: ${turn === "white" ? "Blanc" : "Noir"}`;
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `chess-cell ${(x + y) % 2 === 0 ? "light" : "dark"}`;
        if (selected && selected.x === x && selected.y === y) {
          button.classList.add("selected");
        }
        const piece = board[y][x];
        button.textContent = piece ? symbols[piece] : "";
        button.addEventListener("click", () => clickSquare(x, y));
        boardEl.appendChild(button);
      }
    }
  };

  const startGame = () => {
    item.gameLevel = ui.difficultySelect.value;
    board = cloneBoard();
    selected = null;
    turn = "white";
    ended = false;
    ui.messageBox.innerHTML = "";
    draw();
  };

  ui.difficultySelect.addEventListener("change", startGame);
  ui.resetButton.addEventListener("click", startGame);
  startGame();
  openModal();
}

function renderSpaceInvaders(item) {
  const ui = createArcadePanel(item);
  const ctx = ui.canvas.getContext("2d");
  const w = ui.canvas.width;
  const h = ui.canvas.height;

  let intervalId = null;
  let cfg = SPACE_LEVELS.moyen;
  let started = false;
  let ended = false;
  let left = false;
  let right = false;
  let score = 0;
  let bullets = [];
  let alienBullets = [];
  let aliens = [];
  let currentWave = 0;
  let ship = { x: w / 2 - 14, y: h - 24, w: 28, h: 12, stunned: 0, rapidTimer: 0, shieldTimer: 0, fireCooldown: 0, firing: false };
  let alienDir = 1;
  let bossPulse = 0;
  let drops = [];

  const updateScore = () => {
    ui.scoreBox.textContent = `Score: ${score} | Vague: ${currentWave + 1}/${cfg.waves} | Objectif: ${cfg.goal}`;
  };

  const stop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const drawAlien = (alien) => {
    const px = 3;
    const pattern = alien.pattern || [
      "01110",
      "11111",
      "11111",
      "01010",
      "10101"
    ];

    const color = alien.color || "#ff5d8f";
    ctx.fillStyle = color;

    if (alien.isBoss) {
      ctx.fillStyle = alien.color;
      ctx.fillRect(alien.x, alien.y, alien.w, alien.h);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillRect(alien.x + alien.w * 0.18, alien.y + alien.h * 0.28, alien.w * 0.14, alien.h * 0.16);
      ctx.fillRect(alien.x + alien.w * 0.68, alien.y + alien.h * 0.28, alien.w * 0.14, alien.h * 0.16);
      ctx.fillStyle = "#1a1023";
      ctx.fillRect(alien.x + alien.w * 0.3, alien.y + alien.h * 0.6, alien.w * 0.4, 4);
      return;
    }

    for (let row = 0; row < pattern.length; row += 1) {
      for (let col = 0; col < pattern[row].length; col += 1) {
        if (pattern[row][col] === "0") {
          continue;
        }
        ctx.fillRect(alien.x + col * px, alien.y + row * px, px, px);
      }
    }
  };

  const spawnAliens = () => {
    aliens = [];
    const spacerX = cfg.cols === 6 ? 34 : cfg.cols === 7 ? 30 : 26;
    const spacerY = cfg.rows === 3 ? 26 : cfg.rows === 4 ? 24 : 20;
    const baseOffsetX = cfg.cols === 8 ? 18 : 20;
    const waveOffsetY = currentWave * 26;
    const bossStartY = 18;
    const normalStartY = 90 + waveOffsetY;

    const bossCount = currentWave === 0 ? 1 : currentWave === 1 ? 2 : 3;
    for (let i = 0; i < bossCount; i += 1) {
      const bossW = 28 + i * 12;
      const bossH = 18 + i * 8;
      const bossX = 26 + i * 86;
      const bossY = bossStartY + i * 18;
      const boss = {
        x: bossX,
        y: bossY,
        w: bossW,
        h: bossH,
        alive: true,
        isBoss: true,
        hp: 10 + currentWave * 6 + i * 4,
        maxHp: 10 + currentWave * 6 + i * 4,
        color: ["#ffb703", "#7c6cff", "#2ec4b6"][i % 3],
        power: ["spread", "shield", "burst"][i % 3],
        pattern: null
      };
      aliens.push(boss);
    }

    for (let r = 0; r < cfg.rows; r += 1) {
      for (let c = 0; c < cfg.cols; c += 1) {
        const offsetX = (r % 2 === 0 ? 0 : 8) * (cfg.rows === 5 ? 1 : 0);
        const x = baseOffsetX + c * spacerX + offsetX;
        const y = normalStartY + r * spacerY + (cfg.rows === 5 && c % 2 === 1 ? 4 : 0);

        let pattern = [
          "01110",
          "11111",
          "11111",
          "01010",
          "10101"
        ];
        let color = "#ff5d8f";

        if (cfg.rows === 3) {
          pattern = [
            "00100",
            "01110",
            "11111",
            "11111",
            "01010"
          ];
          color = "#7ef9b2";
        } else if (cfg.rows === 5) {
          pattern = [
            "01110",
            "11111",
            "11011",
            "11111",
            "01010"
          ];
          color = "#90d7ff";
        }

        aliens.push({
          x,
          y,
          w: 20,
          h: 14,
          alive: true,
          pattern,
          color,
          isBoss: false,
          hp: 1,
          maxHp: 1,
          power: "basic"
        });
      }
    }
  };

  const draw = () => {
    ctx.fillStyle = "#0f1228";
    ctx.fillRect(0, 0, w, h);

    if (ship.shieldTimer > 0) {
      ctx.strokeStyle = "rgba(123, 223, 242, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ship.x + ship.w / 2, ship.y + ship.h / 2, 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = ship.stunned > 0 ? "#ff9f1c" : "#4cc9f0";
    ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
    ctx.fillStyle = "#ffd166";
    bullets.forEach((bullet) => ctx.fillRect(bullet.x, bullet.y, 3, 8));
    ctx.fillStyle = "#f72585";
    alienBullets.forEach((bullet) => ctx.fillRect(bullet.x, bullet.y, 4, 10));
    ctx.fillStyle = "#7ef9b2";
    drops.forEach((drop) => {
      const pulse = Math.sin((drop.y + drop.phase) * 0.18) * 2.5;
      ctx.fillStyle = "rgba(126, 249, 178, 0.2)";
      ctx.fillRect(drop.x - 4 - pulse, drop.y - 4 - pulse, 16 + pulse * 2, 16 + pulse * 2);
      ctx.fillStyle = drop.type === "rapid" ? "#ffd166" : drop.type === "shield" ? "#7bdff2" : "#ff7ac6";
      ctx.fillRect(drop.x, drop.y, 8, 8);
      ctx.fillStyle = "#fff";
      ctx.fillRect(drop.x + 2, drop.y + 2, 4, 4);
      ctx.fillStyle = "#7ef9b2";
    });
    aliens.forEach((alien) => {
      if (!alien.alive) {
        return;
      }
      drawAlien(alien);
    });
  };

  const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  const spawnDrop = (x, y) => {
    const types = ["rapid", "shield", "score"];
    const type = types[Math.floor(Math.random() * types.length)];
    drops.push({ x, y, type, w: 8, h: 8, phase: Math.random() * 100 });
  };

  const fireAlienShot = () => {
    const livingAliens = aliens.filter((alien) => alien.alive);
    if (livingAliens.length === 0) {
      return;
    }
    const shooter = livingAliens[Math.floor(Math.random() * livingAliens.length)];
    const shotCount = shooter.isBoss && shooter.power === "spread" ? 3 : 1;
    const baseAngle = shooter.isBoss ? 0.2 : 0;

    for (let i = 0; i < shotCount; i += 1) {
      const angle = baseAngle + (shotCount === 1 ? 0 : (i - 1) * 0.3);
      alienBullets.push({
        x: shooter.x + shooter.w / 2 - 2,
        y: shooter.y + shooter.h + 4,
        w: 4,
        h: 10,
        vx: Math.sin(angle) * 1.8,
        vy: 4.5 + (shooter.isBoss ? 1.2 : 0),
        isBossShot: shooter.isBoss
      });
    }
  };

  const step = () => {
    if (!started || ended) {
      draw();
      return;
    }

    if (ship.stunned > 0) {
      ship.stunned -= 1;
    }

    if (ship.stunned === 0) {
      if (left) {
        ship.x -= 5;
      }
      if (right) {
        ship.x += 5;
      }
      ship.x = Math.max(0, Math.min(w - ship.w, ship.x));
    }

    if (ship.rapidTimer > 0) {
      ship.rapidTimer -= 1;
    }
    if (ship.shieldTimer > 0) {
      ship.shieldTimer -= 1;
    }
    if (ship.fireCooldown > 0) {
      ship.fireCooldown -= 1;
    }

    if (ship.firing && ship.fireCooldown <= 0 && ship.stunned === 0) {
      fire();
      ship.fireCooldown = ship.rapidTimer > 0 ? 90 : 180;
    }

    bullets.forEach((bullet) => {
      bullet.y -= bullet.speed || 8;
    });
    bullets = bullets.filter((bullet) => bullet.y > -10);

    drops.forEach((drop) => {
      drop.y += 2;
      drop.phase += 0.35;
    });
    drops = drops.filter((drop) => drop.y < h + 20);

    const collectDrop = () => {
      const pickup = drops.find((drop) => hit({ x: drop.x, y: drop.y, w: drop.w, h: drop.h }, ship));
      if (!pickup) {
        return;
      }
      drops = drops.filter((drop) => drop !== pickup);
      if (pickup.type === "rapid") {
        ship.rapidTimer = 260;
      } else if (pickup.type === "shield") {
        ship.shieldTimer = 240;
      } else {
        score += 8;
      }
      updateScore();
    };

    collectDrop();

    alienBullets.forEach((bullet) => {
      bullet.x += bullet.vx || 0;
      bullet.y += bullet.vy || 5;
    });
    alienBullets = alienBullets.filter((bullet) => bullet.y < h + 20 && bullet.x > -20 && bullet.x < w + 20);

    let reverse = false;
    aliens.forEach((alien) => {
      if (!alien.alive) {
        return;
      }
      alien.x += alienDir * 1.2;
      if (alien.x < 10 || alien.x + alien.w > w - 10) {
        reverse = true;
      }
    });
    if (reverse) {
      alienDir *= -1;
      aliens.forEach((alien) => {
        alien.y += 10;
      });
    }

    bullets.forEach((bullet) => {
      aliens.forEach((alien) => {
        if (!alien.alive) {
          return;
        }
        if (hit({ x: bullet.x, y: bullet.y, w: 3, h: 8 }, alien)) {
          bullet.y = -50;
          alien.hp = (alien.hp || 1) - 1;
          if (alien.hp <= 0) {
            alien.alive = false;
            score += alien.isBoss ? 10 : 1;
            if (Math.random() < (alien.isBoss ? 0.75 : 0.3)) {
              spawnDrop(alien.x + alien.w / 2 - 4, alien.y + alien.h / 2);
            }
          } else {
            score += 1;
          }
          updateScore();
        }
      });
    });

    alienBullets.forEach((bullet) => {
      if (hit({ x: bullet.x, y: bullet.y, w: bullet.w, h: bullet.h }, ship)) {
        bullet.y = h + 30;
        if (ship.shieldTimer > 0) {
          ship.shieldTimer = 0;
          return;
        }
        ship.stunned = 40;
        if (bullet.isBossShot && Math.random() < 0.5) {
          ship.x = Math.max(0, ship.x - 8);
        }
      }
    });

    if (aliens.some((alien) => alien.alive && alien.y + alien.h >= ship.y)) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "lose", "Vous avez perdu, vous êtes tombée amoureuse.");
    }

    if (aliens.every((alien) => !alien.alive)) {
      if (currentWave < cfg.waves - 1) {
        currentWave += 1;
        spawnAliens();
        updateScore();
        draw();
        return;
      }
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
    }

    const shouldFire = aliens.some((alien) => alien.alive && alien.isBoss)
      ? 0.035
      : 0.02;
    if (Math.random() < shouldFire) {
      fireAlienShot();
    }

    if (aliens.some((alien) => alien.alive && alien.isBoss && alien.power === "shield" && Math.random() < 0.02)) {
      aliens.forEach((alien) => {
        if (alien.alive && !alien.isBoss && Math.random() < 0.5) {
          alien.x += 8;
        }
      });
    }

    draw();
  };

  const fire = () => {
    if (ship.stunned > 0) {
      return;
    }
    bullets.push({
      x: ship.x + ship.w / 2 - 1,
      y: ship.y - 4,
      speed: ship.rapidTimer > 0 ? 12 : 8
    });
  };

  const keydown = (event) => {
    if (["ArrowLeft", "ArrowRight", " "].includes(event.key)) {
      event.preventDefault();
      if (!started) {
        started = true;
      }
    }
    if (event.key === "ArrowLeft") {
      left = true;
    }
    if (event.key === "ArrowRight") {
      right = true;
    }
    if ((event.key === " " || event.code === "Space") && ship.stunned === 0) {
      ship.firing = true;
      fire();
      ship.fireCooldown = 0;
    }
  };

  const keyup = (event) => {
    if (event.key === "ArrowLeft") {
      left = false;
    }
    if (event.key === "ArrowRight") {
      right = false;
    }
    if (event.key === " " || event.code === "Space") {
      ship.firing = false;
    }
  };

  const startGame = (level) => {
    item.gameLevel = level;
    cfg = SPACE_LEVELS[level] || SPACE_LEVELS.moyen;
    started = false;
    ended = false;
    score = 0;
    bullets = [];
    alienBullets = [];
    drops = [];
    currentWave = 0;
    bossPulse = 0;
    ship = { x: w / 2 - 14, y: h - 24, w: 28, h: 12, stunned: 0, rapidTimer: 0, shieldTimer: 0, fireCooldown: 0, firing: false };
    left = false;
    right = false;
    alienDir = 1;
    ui.messageBox.innerHTML = "";
    spawnAliens();
    updateScore();
    stop();
    intervalId = window.setInterval(step, cfg.speed / 20);
    draw();
  };

  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  ui.addCleanup(() => {
    stop();
    window.removeEventListener("keydown", keydown);
    window.removeEventListener("keyup", keyup);
  });

  ui.difficultySelect.addEventListener("change", () => startGame(ui.difficultySelect.value));
  ui.resetButton.addEventListener("click", () => startGame(ui.difficultySelect.value));
  startGame(ui.difficultySelect.value);
  openModal();
}

function renderFlappy(item) {
  const ui = createArcadePanel(item);
  const ctx = ui.canvas.getContext("2d");
  const w = ui.canvas.width;
  const h = ui.canvas.height;
  let cfg = FLAPPY_LEVELS.moyen;
  let bird = { x: 64, y: h / 2, vy: 0, r: 10 };
  let pipes = [];
  let started = false;
  let ended = false;
  let score = 0;
  let intervalId = null;
  let frame = 0;

  const updateScore = () => {
    ui.scoreBox.textContent = `Score: ${score} | Objectif: ${cfg.goal}`;
  };

  const stop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const draw = () => {
    ctx.fillStyle = "#d6f0ff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#5fc26f";
    pipes.forEach((pipe) => {
      ctx.fillRect(pipe.x, 0, pipe.w, pipe.top);
      ctx.fillRect(pipe.x, pipe.top + cfg.gap, pipe.w, h);
    });
    ctx.fillStyle = "#ffca3a";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
    ctx.fill();
  };

  const fail = () => {
    ended = true;
    stop();
    setGameMessage(ui.messageBox, "lose", "Vous avez perdu, vous êtes tombée amoureuse.");
  };

  const step = () => {
    if (!started || ended) {
      draw();
      return;
    }
    frame += 1;
    bird.vy += 0.38;
    bird.y += bird.vy;

    if (frame % 75 === 0) {
      const top = 40 + Math.random() * (h - cfg.gap - 90);
      pipes.push({ x: w + 20, w: 36, top, scored: false });
    }

    pipes.forEach((pipe) => {
      pipe.x -= cfg.speed;
      if (!pipe.scored && pipe.x + pipe.w < bird.x) {
        pipe.scored = true;
        score += 1;
        updateScore();
      }
      const insideX = bird.x + bird.r > pipe.x && bird.x - bird.r < pipe.x + pipe.w;
      const insideY = bird.y - bird.r < pipe.top || bird.y + bird.r > pipe.top + cfg.gap;
      if (insideX && insideY) {
        fail();
      }
    });
    pipes = pipes.filter((pipe) => pipe.x + pipe.w > -20);

    if (bird.y - bird.r < 0 || bird.y + bird.r > h) {
      fail();
    }

    if (score >= cfg.goal) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
    }

    draw();
  };

  const flap = () => {
    if (ended) {
      return;
    }
    started = true;
    bird.vy = -5.8;
  };

  const keydown = (event) => {
    if (event.key === " " || event.key === "ArrowUp") {
      event.preventDefault();
      flap();
    }
  };

  const startGame = (level) => {
    item.gameLevel = level;
    cfg = FLAPPY_LEVELS[level] || FLAPPY_LEVELS.moyen;
    bird = { x: 64, y: h / 2, vy: 0, r: 10 };
    pipes = [];
    started = false;
    ended = false;
    score = 0;
    frame = 0;
    ui.messageBox.innerHTML = "";
    updateScore();
    stop();
    intervalId = window.setInterval(step, 16);
    draw();
  };

  window.addEventListener("keydown", keydown);
  ui.addCleanup(() => {
    stop();
    window.removeEventListener("keydown", keydown);
  });

  ui.difficultySelect.addEventListener("change", () => startGame(ui.difficultySelect.value));
  ui.resetButton.addEventListener("click", () => startGame(ui.difficultySelect.value));
  startGame(ui.difficultySelect.value);
  openModal();
}

function renderPong(item) {
  const ui = createArcadePanel(item);
  const ctx = ui.canvas.getContext("2d");
  const w = ui.canvas.width;
  const h = ui.canvas.height;
  let cfg = PONG_LEVELS.moyen;
  let started = false;
  let ended = false;
  let up = false;
  let down = false;
  let intervalId = null;
  let player = { x: 10, y: h / 2 - 35, w: 8, h: 70, score: 0 };
  let ai = { x: w - 18, y: h / 2 - 35, w: 8, h: 70, score: 0 };
  let ball = { x: w / 2, y: h / 2, vx: 3, vy: 2.2, r: 7 };

  const updateScore = () => {
    ui.scoreBox.textContent = `Toi ${player.score} - ${ai.score} IA | Objectif: ${cfg.goal}`;
  };

  const stop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const draw = () => {
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillRect(ai.x, ai.y, ai.w, ai.h);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  };

  const resetBall = (towardPlayer) => {
    ball.x = w / 2;
    ball.y = h / 2;
    ball.vx = towardPlayer ? -3 : 3;
    ball.vy = (Math.random() * 2 - 1) * 2.5;
  };

  const paddleHit = (paddle) => {
    return ball.x + ball.r > paddle.x && ball.x - ball.r < paddle.x + paddle.w && ball.y > paddle.y && ball.y < paddle.y + paddle.h;
  };

  const step = () => {
    if (!started || ended) {
      draw();
      return;
    }

    if (up) {
      player.y -= 5;
    }
    if (down) {
      player.y += 5;
    }
    player.y = Math.max(0, Math.min(h - player.h, player.y));

    if (ball.y > ai.y + ai.h / 2) {
      ai.y += cfg.ai;
    } else {
      ai.y -= cfg.ai;
    }
    ai.y = Math.max(0, Math.min(h - ai.h, ai.y));

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - ball.r <= 0 || ball.y + ball.r >= h) {
      ball.vy *= -1;
    }

    if (paddleHit(player) && ball.vx < 0) {
      ball.vx *= -1;
    }
    if (paddleHit(ai) && ball.vx > 0) {
      ball.vx *= -1;
    }

    if (ball.x < -10) {
      ai.score += 1;
      updateScore();
      resetBall(false);
    }
    if (ball.x > w + 10) {
      player.score += 1;
      updateScore();
      resetBall(true);
    }

    if (player.score >= cfg.goal) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
    }
    if (ai.score >= cfg.goal) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "lose", "Vous avez perdu, vous êtes tombée amoureuse.");
    }

    draw();
  };

  const keydown = (event) => {
    if (["ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      if (!started) {
        started = true;
      }
    }
    if (event.key === "ArrowUp") {
      up = true;
    }
    if (event.key === "ArrowDown") {
      down = true;
    }
  };
  const keyup = (event) => {
    if (event.key === "ArrowUp") {
      up = false;
    }
    if (event.key === "ArrowDown") {
      down = false;
    }
  };

  const startGame = (level) => {
    item.gameLevel = level;
    cfg = PONG_LEVELS[level] || PONG_LEVELS.moyen;
    started = false;
    ended = false;
    player = { x: 10, y: h / 2 - 35, w: 8, h: 70, score: 0 };
    ai = { x: w - 18, y: h / 2 - 35, w: 8, h: 70, score: 0 };
    ball = { x: w / 2, y: h / 2, vx: 3, vy: 2.2, r: 7 };
    ui.messageBox.innerHTML = "";
    updateScore();
    stop();
    intervalId = window.setInterval(step, 16);
    draw();
  };

  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  ui.addCleanup(() => {
    stop();
    window.removeEventListener("keydown", keydown);
    window.removeEventListener("keyup", keyup);
  });

  ui.difficultySelect.addEventListener("change", () => startGame(ui.difficultySelect.value));
  ui.resetButton.addEventListener("click", () => startGame(ui.difficultySelect.value));
  startGame(ui.difficultySelect.value);
  openModal();
}

function renderPinball(item) {
  const ui = createArcadePanel(item);
  const ctx = ui.canvas.getContext("2d");
  const w = ui.canvas.width;
  const h = ui.canvas.height;
  let cfg = PINBALL_LEVELS.moyen;
  let started = false;
  let ended = false;
  let left = false;
  let right = false;
  let score = 0;
  let intervalId = null;
  let ball = { x: w / 2, y: h - 34, vx: 0, vy: 0, r: 7 };
  let paddle = { x: w / 2 - 42, y: h - 18, w: 84, h: 9 };
  let nextBounceMultiplier = 1;
  let bumps = [
    { x: 90, y: 92, r: 16, kind: "boost", color: "#ffb703" },
    { x: 230, y: 118, r: 16, kind: "mirror", color: "#ff5da2" },
    { x: 165, y: 182, r: 17, kind: "double", color: "#2ee6c1" },
    { x: 315, y: 92, r: 14, kind: "triple", color: "#7c6cff" },
    { x: 300, y: 210, r: 15, kind: "boost", color: "#ffd166" }
  ];

  const updateScore = () => {
    ui.scoreBox.textContent = `Score: ${score} | Objectif: ${cfg.goal} | x${nextBounceMultiplier}`;
  };

  const stop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const drawBumper = (bump) => {
    ctx.save();
    ctx.translate(bump.x, bump.y);
    ctx.fillStyle = bump.color;
    ctx.shadowColor = bump.color;
    ctx.shadowBlur = 14;

    if (bump.kind === "boost") {
      ctx.beginPath();
      ctx.moveTo(0, -bump.r);
      ctx.lineTo(bump.r * 0.8, 0);
      ctx.lineTo(0, bump.r);
      ctx.lineTo(-bump.r * 0.8, 0);
      ctx.closePath();
      ctx.fill();
    } else if (bump.kind === "mirror") {
      ctx.beginPath();
      ctx.moveTo(-bump.r, -bump.r * 0.6);
      ctx.lineTo(0, bump.r);
      ctx.lineTo(bump.r, -bump.r * 0.6);
      ctx.closePath();
      ctx.fill();
    } else if (bump.kind === "double") {
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * bump.r;
        const y = Math.sin(angle) * bump.r;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, bump.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.arc(-bump.r * 0.25, -bump.r * 0.25, bump.r * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const draw = () => {
    ctx.fillStyle = "#1b1b2f";
    ctx.fillRect(0, 0, w, h);
    bumps.forEach((bump) => drawBumper(bump));
    ctx.fillStyle = "#21e6c1";
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  };

  const applyBumperEffect = (bump) => {
    const power = nextBounceMultiplier;

    if (bump.kind === "boost") {
      const boost = 1.3;
      ball.vx *= boost;
      ball.vy *= boost;
      ball.vy = Math.min(ball.vy, -4.8);
      score += 2;
    } else if (bump.kind === "mirror") {
      const temp = ball.vx;
      ball.vx = -ball.vy * 0.9;
      ball.vy = -temp * 0.9;
      score += 2;
    } else if (bump.kind === "double") {
      nextBounceMultiplier = 2;
      score += 3;
    } else if (bump.kind === "triple") {
      nextBounceMultiplier = 3;
      score += 4;
    }

    if (power > 1) {
      score += power;
    }

    if (bump.kind !== "double" && bump.kind !== "triple") {
      nextBounceMultiplier = 1;
    }

    updateScore();
  };

  const step = () => {
    if (ended) {
      draw();
      return;
    }

    if (left) {
      paddle.x -= 7;
    }
    if (right) {
      paddle.x += 7;
    }
    paddle.x = Math.max(0, Math.min(w - paddle.w, paddle.x));

    if (!started) {
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - ball.r - 2;
      draw();
      return;
    }

    ball.vy += 0.05;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x - ball.r <= 0 || ball.x + ball.r >= w) {
      ball.vx *= -1;
      ball.x = Math.max(ball.r, Math.min(w - ball.r, ball.x));
    }
    if (ball.y - ball.r <= 0) {
      ball.vy *= -1;
      ball.y = ball.r;
    }

    if (ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.vy > 0) {
      const offset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
      ball.vy = -Math.abs(ball.vy) * 0.95;
      ball.vx = offset * 4.2;
      ball.y = paddle.y - ball.r - 1;
      if (nextBounceMultiplier > 1) {
        score += nextBounceMultiplier;
        nextBounceMultiplier = 1;
        updateScore();
      }
    }

    bumps.forEach((bump) => {
      const dx = ball.x - bump.x;
      const dy = ball.y - bump.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < ball.r + bump.r) {
        const nx = dx / (distance || 1);
        const ny = dy / (distance || 1);
        const dot = ball.vx * nx + ball.vy * ny;
        ball.vx -= 2 * dot * nx;
        ball.vy -= 2 * dot * ny;
        const push = 1.4;
        ball.x += nx * push;
        ball.y += ny * push;
        applyBumperEffect(bump);
      }
    });

    if (ball.y - ball.r > h + 5) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "lose", "Vous avez perdu, vous êtes tombée amoureuse.");
    }

    if (score >= cfg.goal) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
    }

    draw();
  };

  const launchBall = () => {
    if (started) {
      return;
    }
    started = true;
    const direction = Math.random() > 0.5 ? 1 : -1;
    ball.vx = direction * cfg.speed;
    ball.vy = -Math.abs(cfg.speed) * 1.05;
  };

  const keydown = (event) => {
    if (["ArrowLeft", "ArrowRight", " "].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === "ArrowLeft") {
      left = true;
    }
    if (event.key === "ArrowRight") {
      right = true;
    }
    if (event.key === " " && !started) {
      launchBall();
    }
  };
  const keyup = (event) => {
    if (event.key === "ArrowLeft") {
      left = false;
    }
    if (event.key === "ArrowRight") {
      right = false;
    }
  };

  const startGame = (level) => {
    item.gameLevel = level;
    cfg = PINBALL_LEVELS[level] || PINBALL_LEVELS.moyen;
    started = false;
    ended = false;
    left = false;
    right = false;
    score = 0;
    ball = { x: w / 2, y: h - 34, vx: 0, vy: 0, r: 7 };
    paddle = { x: w / 2 - 42, y: h - 18, w: 84, h: 9 };
    ui.messageBox.innerHTML = "";
    updateScore();
    stop();
    intervalId = window.setInterval(step, 16);
    draw();
  };

  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  ui.addCleanup(() => {
    stop();
    window.removeEventListener("keydown", keydown);
    window.removeEventListener("keyup", keyup);
  });

  ui.difficultySelect.addEventListener("change", () => startGame(ui.difficultySelect.value));
  ui.resetButton.addEventListener("click", () => startGame(ui.difficultySelect.value));
  startGame(ui.difficultySelect.value);
  openModal();
}

function renderStreetFighter(item) {
  const ui = createArcadePanel(item);
  const ctx = ui.canvas.getContext("2d");
  const w = ui.canvas.width;
  const h = ui.canvas.height;
  let cfg = FIGHTER_LEVELS.moyen;
  let started = false;
  let ended = false;
  let left = false;
  let right = false;
  let jumpPressed = false;
  let downPressed = false;
  let attack = false;
  let intervalId = null;
  let p1 = { x: 52, yOffset: 0, hp: 100, attackCooldown: 0, attackTimer: 0, crouching: false, vy: 0, onGround: true };
  let p2 = { x: 240, yOffset: 0, hp: 100, attackCooldown: 0, attackTimer: 0, crouching: false, vy: 0, onGround: true };

  const getFighterY = (fighter) => h - 94 + fighter.yOffset;
  const getFighterHeight = (fighter) => (fighter.crouching ? 34 : 52);
  const getFighterHitbox = (fighter) => ({
    x: fighter.x,
    y: getFighterY(fighter),
    w: 26,
    h: getFighterHeight(fighter)
  });

  const updateScore = () => {
    ui.scoreBox.textContent = `Toi: ${Math.max(0, Math.floor(p1.hp))} HP | Rival: ${Math.max(0, Math.floor(p2.hp))} HP`;
  };

  const stop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const drawFighter = (fighter, color) => {
    const y = getFighterY(fighter);
    const height = getFighterHeight(fighter);
    const facing = fighter === p1 ? 1 : -1;

    ctx.fillStyle = color;
    ctx.fillRect(fighter.x, y, 26, height);

    if (fighter.attackTimer > 0) {
      const reach = 12 + (fighter.attackTimer * 1.5);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(
        fighter.x + (facing > 0 ? 26 : -reach),
        y + (height * 0.4),
        reach,
        8
      );
    }

    ctx.fillStyle = "#fff7d6";
    ctx.fillRect(fighter.x + 8, y - 10, 10, 10);
  };

  const draw = () => {
    ctx.fillStyle = "#22223b";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#4a4e69";
    ctx.fillRect(0, h - 42, w, 42);

    drawFighter(p1, "#6bd1ff");
    drawFighter(p2, "#ff6b9a");

    ctx.fillStyle = "#34d399";
    ctx.fillRect(12, 12, p1.hp * 1.2, 10);
    ctx.fillStyle = "#f43f5e";
    ctx.fillRect(w - 12 - p2.hp * 1.2, 12, p2.hp * 1.2, 10);
  };

  const inRange = () => {
    const a = getFighterHitbox(p1);
    const b = getFighterHitbox(p2);
    return Math.abs((a.x + a.w / 2) - (b.x + b.w / 2)) < 38;
  };

  const updateFighterPhysics = (fighter) => {
    if (!fighter.onGround) {
      fighter.yOffset += fighter.vy;
      fighter.vy += 0.6;
      if (fighter.yOffset >= 0) {
        fighter.yOffset = 0;
        fighter.vy = 0;
        fighter.onGround = true;
      }
    }
    if (fighter.attackCooldown > 0) {
      fighter.attackCooldown -= 1;
    }
    if (fighter.attackTimer > 0) {
      fighter.attackTimer -= 1;
    }
  };

  const step = () => {
    if (!started || ended) {
      draw();
      return;
    }

    if (left) {
      p1.x -= 3;
    }
    if (right) {
      p1.x += 3;
    }
    p1.x = Math.max(0, Math.min(w - 26, p1.x));
    p1.crouching = downPressed && p1.onGround;

    if (jumpPressed && p1.onGround) {
      p1.vy = -7.5;
      p1.onGround = false;
      p1.crouching = false;
    }

    if (attack && p1.attackCooldown <= 0) {
      p1.attackTimer = 7;
      p1.attackCooldown = 12;
    }

    if (p2.x < p1.x - 18) {
      p2.x += cfg.ai;
    } else if (p2.x > p1.x + 18) {
      p2.x -= cfg.ai;
    }
    p2.crouching = Math.random() < 0.06 && p2.onGround;
    if (p2.x < p1.x) {
      p2.x += 0.5;
    }

    updateFighterPhysics(p1);
    updateFighterPhysics(p2);

    if (p1.attackTimer > 0 && inRange()) {
      p2.hp -= 1.5;
    }
    if (p2.attackCooldown <= 0 && inRange() && Math.random() < 0.12) {
      p1.hp -= 6;
      p2.attackCooldown = 14;
    }

    updateScore();

    if (p2.hp <= 0) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "win", "Tu as réussi à survivre pour aujourd'hui, à demain");
    }
    if (p1.hp <= 0) {
      ended = true;
      stop();
      setGameMessage(ui.messageBox, "lose", "Vous avez perdu, vous êtes tombée amoureuse.");
    }

    draw();
  };

  const keydown = (event) => {
    const key = event.key;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Spacebar"].includes(key) || event.code === "Space") {
      started = true;
      event.preventDefault();
    }
    if (key === "ArrowLeft") {
      left = true;
    }
    if (key === "ArrowRight") {
      right = true;
    }
    if (key === "ArrowUp") {
      jumpPressed = true;
    }
    if (key === "ArrowDown") {
      downPressed = true;
    }
    if (key === " " || event.code === "Space") {
      attack = true;
    }
  };

  const keyup = (event) => {
    const key = event.key;
    if (key === "ArrowLeft") {
      left = false;
    }
    if (key === "ArrowRight") {
      right = false;
    }
    if (key === "ArrowUp") {
      jumpPressed = false;
    }
    if (key === "ArrowDown") {
      downPressed = false;
    }
    if (key === " " || event.code === "Space") {
      attack = false;
    }
  };

  const startGame = (level) => {
    item.gameLevel = level;
    cfg = FIGHTER_LEVELS[level] || FIGHTER_LEVELS.moyen;
    started = false;
    ended = false;
    left = false;
    right = false;
    jumpPressed = false;
    downPressed = false;
    attack = false;
    p1 = { x: 52, yOffset: 0, hp: 100, attackCooldown: 0, attackTimer: 0, crouching: false, vy: 0, onGround: true };
    p2 = { x: 240, yOffset: 0, hp: 100, attackCooldown: 0, attackTimer: 0, crouching: false, vy: 0, onGround: true };
    ui.messageBox.innerHTML = "";
    updateScore();
    stop();
    intervalId = window.setInterval(step, 16);
    draw();
  };

  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  ui.addCleanup(() => {
    stop();
    window.removeEventListener("keydown", keydown);
    window.removeEventListener("keyup", keyup);
  });

  ui.difficultySelect.addEventListener("change", () => startGame(ui.difficultySelect.value));
  ui.resetButton.addEventListener("click", () => startGame(ui.difficultySelect.value));
  startGame(ui.difficultySelect.value);
  openModal();
}

function createMinesweeperState(config) {
  const board = Array.from({ length: config.rows }, () =>
    Array.from({ length: config.cols }, () => ({
      isHeart: false,
      revealed: false,
      flagged: false,
      adjacent: 0
    }))
  );

  let placed = 0;
  while (placed < config.hearts) {
    const row = Math.floor(Math.random() * config.rows);
    const col = Math.floor(Math.random() * config.cols);
    if (!board[row][col].isHeart) {
      board[row][col].isHeart = true;
      placed += 1;
    }
  }

  for (let row = 0; row < config.rows; row += 1) {
    for (let col = 0; col < config.cols; col += 1) {
      if (board[row][col].isHeart) {
        continue;
      }
      let count = 0;
      for (let r = row - 1; r <= row + 1; r += 1) {
        for (let c = col - 1; c <= col + 1; c += 1) {
          if (r < 0 || c < 0 || r >= config.rows || c >= config.cols) {
            continue;
          }
          if (board[r][c].isHeart) {
            count += 1;
          }
        }
      }
      board[row][col].adjacent = count;
    }
  }

  return { board, ended: false, lastResult: "" };
}

function revealCell(state, row, col) {
  const cell = state.board[row][col];
  if (cell.revealed || cell.flagged || state.ended) {
    return;
  }

  if (cell.isHeart) {
    state.ended = true;
    state.lastResult = "lose";
    revealAllHearts(state);
    return;
  }

  floodReveal(state, row, col);
  if (checkWin(state)) {
    state.ended = true;
    state.lastResult = "win";
    revealAllHearts(state);
  }
}

function floodReveal(state, row, col) {
  const stack = [[row, col]];
  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop();
    const cell = state.board[currentRow][currentCol];
    if (cell.revealed || cell.isHeart) {
      continue;
    }
    cell.revealed = true;
    if (cell.adjacent !== 0) {
      continue;
    }
    for (let r = currentRow - 1; r <= currentRow + 1; r += 1) {
      for (let c = currentCol - 1; c <= currentCol + 1; c += 1) {
        if (r < 0 || c < 0 || r >= state.board.length || c >= state.board[0].length) {
          continue;
        }
        const target = state.board[r][c];
        if (!target.revealed && !target.isHeart && !target.flagged) {
          stack.push([r, c]);
        }
      }
    }
  }
}

function revealAllHearts(state) {
  for (const row of state.board) {
    for (const cell of row) {
      if (cell.isHeart) {
        cell.revealed = true;
      }
    }
  }
}

function checkWin(state) {
  for (const row of state.board) {
    for (const cell of row) {
      if (!cell.isHeart && !cell.revealed) {
        return false;
      }
    }
  }
  return true;
}

function openModal() {
  caseModal.classList.add("open");
  caseModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (activeGameCleanup) {
    activeGameCleanup();
    activeGameCleanup = null;
  }
  caseModal.classList.remove("open");
  caseModal.setAttribute("aria-hidden", "true");
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date) {
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "long"
  });
}
