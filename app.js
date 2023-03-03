const ANSWER_LENGTH = 5; // How many lettters is the answer
const ROUNDS = 6; // How many guesses a player gets

// Contains Game State
class GameState {
  constructor() {
    this.rows = ROUNDS; // Number of Guesses
    this.cols = ANSWER_LENGTH; // Length of Answer
    this.board = Array.from(Array(this.rows), () =>
      new Array(this.cols).fill(null)
    );
    this.styleBoard = Array.from(Array(this.rows), () =>
      new Array(this.cols).fill(null)
    );
    this.animationBoard = Array.from(Array(this.rows), () =>
      new Array(this.cols).fill(null)
    );
  }
  // Getter method for gameState 2-D Array
  getBoard() {
    return this.board;
  }
  // Add Letter to Array
  addLetter(rows, cols, letter) {
    this.board[rows][cols] = letter;
  }
  // Delete Letter to Array
  deleteLetter(rows, cols) {
    this.board[rows][cols] = null;
  }
  // Getter for styleBoard
  getStyleBoard() {
    return this.styleBoard;
  }
  // Add Style to Array
  addStyle(rows, cols, style) {
    this.styleBoard[rows][cols] = style;
  }
  // Delete Style to Array
  deleteStyle(rows, cols) {
    this.styleBoard[rows][cols] = null;
  }
  // Getter for styleBoard
  getAnimationBoard() {
    return this.animationBoard;
  }
  // Add Style to Array
  addAnimation(rows, cols, animation) {
    this.animationBoard[rows][cols] = animation;
  }
  // Delete Style to Array
  resetAnimation() {
    this.animationBoard = Array.from(Array(this.rows), () =>
      new Array(this.cols).fill(null)
    );
  }
}

// Contains Game Logic
class GameController {
  constructor(gameStateInput) {
    this.gameState = gameStateInput;
    this.wordList = wordList;
    this.answer = "";
    this.answerLength = ANSWER_LENGTH;
    this.rounds = ROUNDS;
    this.currentRound = 0;
    this.currentGuess = "";
    this.isGameRunning = true;
    this.isGameWon = false;
  }
  // Getter for isGameWon
  getIsGameWon = () => {
    return this.isGameWon;
  };
  getIsGameRunning = () => {
    return this.isGameRunning;
  };
  // Getter method for gameState object's gameState array
  getBoard = () => {
    return this.gameState.getBoard();
  };
  // Getter method for gameState object's styleBoard array
  getStyleBoard = () => {
    return this.gameState.getStyleBoard();
  };
  // Getter method for gameState object's animationBoard array
  getAnimationBoard = () => {
    return this.gameState.getAnimationBoard();
  };
  // Load answer
  loadAnswer() {
    try {
      this.answer = this.wordList[Math.floor(Math.random() * 38, 698)];
      console.log(this.answer);
    } catch (error) {
      console.error("Could not load answer");
    }
  }
  // Check if input is an English letter
  isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }
  // Check if key.event is a Korean letter
  isKorean(letter) {
    const koreanRegex = /[\u3130-\u318F\uAC00-\uD7AF]+/;
    return koreanRegex.test(letter);
  }

  convertToKorean(letter) {
    const englishToKorean = {
      q: "ㅂ",
      w: "ㅈ",
      e: "ㄷ",
      r: "ㄱ",
      t: "ㅅ",
      y: "ㅛ",
      u: "ㅕ",
      i: "ㅑ",
      o: "ㅐ",
      p: "ㅔ",
      a: "ㅁ",
      s: "ㄴ",
      d: "ㅇ",
      f: "ㄹ",
      g: "ㅎ",
      h: "ㅗ",
      j: "ㅓ",
      k: "ㅏ",
      l: "ㅣ",
      z: "ㅋ",
      x: "ㅌ",
      c: "ㅊ",
      v: "ㅍ",
      b: "ㅠ",
      n: "ㅜ",
      m: "ㅡ",
    };
    if (englishToKorean[letter.toLowerCase()]) {
      return englishToKorean[letter.toLowerCase()];
    }
  }
  // Add letter to gameState array
  addLetter(letter) {
    if (this.currentGuess.length < this.answerLength) {
      this.currentGuess += letter;
    } else {
      this.currentGuess =
        this.currentGuess.substring(0, this.answerLength - 1) + letter;
    }
    this.gameState.addLetter(
      this.currentRound,
      this.currentGuess.length - 1,
      letter
    );
    this.gameState.addStyle(
      this.currentRound,
      this.currentGuess.length - 1,
      "filled"
    );
  }
  // Delete letter from gameState array
  deleteLetter() {
    this.currentGuess = this.currentGuess.substring(
      0,
      this.currentGuess.length - 1
    );
    this.gameState.deleteLetter(this.currentRound, this.currentGuess.length);
    this.gameState.deleteStyle(this.currentRound, this.currentGuess.length);
  }
  // Call after animation has been triggered
  resetAnimationBoard() {
    this.gameState.resetAnimation();
  }
  // Makes an object out of an array of letters and keeps count of how many letters are there
  makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
      const letter = array[i];
      if (obj[letter]) {
        obj[letter]++;
      } else {
        obj[letter] = 1;
      }
    }
    return obj;
  }
  // Verify if currentGuess is answer
  verifyGuess() {
    // Not a valid word
    if (this.currentGuess.length != this.answerLength) {
      return;
    } else if (!this.wordList.includes(this.currentGuess)) {
      console.log("not a valid word");
      for (let i = 0; i < this.answerLength; i++) {
        this.gameState.addAnimation(this.currentRound, i, "invalid");
      }
      return;
    }
    // Make objects for encapsulation
    const answerParts = this.answer.split("");
    const answerMap = this.makeMap(answerParts);
    const guessParts = this.currentGuess.split("");
    // Check if game is won
    this.isGameWon = true;
    // First pass to see which letter we can mark as correct (green)
    for (let i = 0; i < this.answerLength; i++) {
      if (guessParts[i] === answerParts[i]) {
        this.gameState.addStyle(this.currentRound, i, "correct");
        answerMap[guessParts[i]]--;
      }
    }
    // Second pass to see which letters are close or wrong (yellow or gray)
    for (let i = 0; i < this.answerLength; i++) {
      if (guessParts[i] === answerParts[i]) {
        // do nothing
      } else if (answerMap[guessParts[i]] && answerMap[guessParts[i]] > 0) {
        this.gameState.addStyle(this.currentRound, i, "close");
        answerMap[guessParts[i]]--;
        this.isGameWon = false;
      } else {
        this.gameState.addStyle(this.currentRound, i, "wrong");
        this.isGameWon = false;
      }
    }
    // advance to next guess
    this.currentRound++;
    this.currentGuess = "";

    // Check if game is over - Play out Win or Lose conditions
    if (this.isGameWon) {
      this.isGameRunning = false;
      this.currentRound = 6;
    } else if (this.currentRound === this.rounds) {
      this.isGameRunning = false;
    }
  }
  // Handle game logic of keyboard event from user
  handleEvent(key, preventDefault) {
    if (key === "Backspace" || key === "Delete") {
      this.deleteLetter();
    } else if (key === "Enter" || key === "ENTER") {
      this.verifyGuess();
    } else if (this.isLetter(key) || this.isKorean(key)) {
      if (this.isLetter(key)) {
        key = this.convertToKorean(key);
      }
      this.addLetter(key);
    } else {
      preventDefault;
    }
  }
}

class ScreenController {
  constructor(gameController) {
    this.body = document.body;
    this.boardDiv = document.querySelector(".board");
    this.keyButtons = document.querySelectorAll(".key");
    this.gameController = gameController;
    this.spinner = document.querySelector(".spinner");
  }
  // Set loading icon spinning
  setLoading(isLoading) {
    isLoading
      ? (this.spinner.style.visibility = "visible")
      : (this.spinner.style.visibility = "hidden");
  }
  // Render View based off of Model given by Controller
  renderBoard() {
    // Reset the board div
    this.boardDiv.innerHTML = "";
    // Render board div based on current gameState object
    const board = this.gameController.getBoard();
    const styleBoard = this.gameController.getStyleBoard();
    const animationBoard = this.gameController.getAnimationBoard();
    for (let i = 0; i < board.length; i++) {
      const wordDiv = document.createElement("div");
      wordDiv.className = "word p" + i;
      this.boardDiv.appendChild(wordDiv);
      for (let j = 0; j < board[i].length; j++) {
        const letterDiv = document.createElement("div");
        letterDiv.className = "letter";
        wordDiv.appendChild(letterDiv);
        letterDiv.innerText = board[i][j];
        if (letterDiv.innerText) {
          letterDiv.classList.add(animationBoard[i][j]);
          this.gameController.resetAnimationBoard();
          letterDiv.classList.add(styleBoard[i][j]);
        }
      }
    }
  }
  // Add Event Listener to body for user events and hand to Controller for Game Logic
  listen() {
    // Listen to keyboard events and check if game is over
    this.body.addEventListener("keydown", ({ key, preventDefault }) => {
      this.gameController.handleEvent(key, preventDefault);
      this.renderBoard();
      console.log(
        this.gameController.getIsGameRunning() +
          " and " +
          this.gameController.getIsGameWon()
      );
      if (!this.gameController.getIsGameRunning()) {
        if (this.gameController.getIsGameWon()) {
          setTimeout(() => alert("You won! :)"), 500);
        } else {
          setTimeout(() => alert("You lose. :("), 500);
        }
      }
    });
    // Listen to button events and check if game is over
    this.keyButtons.forEach((key) => {
      key.addEventListener("click", () => {
        this.gameController.handleEvent(key.innerText, null);
        this.renderBoard();
        if (!this.gameController.getIsGameRunning()) {
          if (this.gameController.getIsGameWon()) {
            setTimeout(() => alert("You won! :)"), 500);
          } else {
            setTimeout(() => alert("You lose. :("), 500);
          }
        }
      });
    });
  }
}

function init() {
  const state = new GameState();
  console.log(state.board);
  const game = new GameController(state);
  game.loadAnswer();
  const screen = new ScreenController(game);
  screen.renderBoard();
  screen.listen();
}

init();
