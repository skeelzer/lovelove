const TARGET_DATE = new Date(2026, 8, 28); // 28 septembre 2026
const TOTAL_CASES = 15; // J, J-1 ... J-14
const MINESWEEPER_LEVELS = {
  facile: { rows: 8, cols: 8, hearts: 8 },
  moyen: { rows: 9, cols: 9, hearts: 12 },
  dur: { rows: 12, cols: 12, hearts: 28 }
};

const countdownGrid = document.getElementById("countdownGrid");
const dayJContainer = document.getElementById("dayJContainer");
const caseModal = document.getElementById("caseModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalBody = document.getElementById("modalBody");
const lockedMessageTemplate = document.getElementById("lockedMessageTemplate");

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
    const isMinesweeperCase = label === "J-14";

    items.push({
      id: offset,
      label,
      unlockDate: date,
      contentType: isMinesweeperCase ? "minesweeper" : imagePath ? "image" : "placeholder",
      text: "Contenu a definir ensemble (photo ou mini-jeu).",
      imagePath,
      cardImagePath: imagePath,
      gameHtml: "",
      gameLevel: isMinesweeperCase ? "moyen" : null
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

    const isUnlocked = today >= startOfDay(item.unlockDate);
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

    const isUnlocked = today >= startOfDay(jItem.unlockDate);
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

function openCase(item, isUnlocked) {
  modalTitle.textContent = item.label;
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
