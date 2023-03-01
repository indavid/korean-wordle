const ANSWER_LENGTH = 5; // How many lettters is the answer
const ROUNDS = 6; // How many guesses a player gets

// Contains Game State
class GameBoard {
  constructor() {
    this.rows = ROUNDS; // Number of Guesses
    this.cols = ANSWER_LENGTH; // Length of Answer
    this.board = Array.from(Array(this.rows), () =>
      new Array(this.cols).fill(null)
    );
    this.styleBoard = Array.from(Array(this.rows), () =>
      new Array(this.cols).fill(null)
    );
  }
  // Getter method for gameBoard 2-D Array
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
}

// Contains Game Logic
class GameController {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
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
  // Getter method for GameBoard object's gameBoard array
  getBoard = () => {
    return this.gameBoard.getBoard();
  };
  // Getter method for GameBoard object's styleBoard array
  getStyleBoard = () => {
    return this.gameBoard.getStyleBoard();
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
  // Add letter to gameBoard array
  addLetter(letter) {
    if (this.currentGuess.length < this.answerLength) {
      this.currentGuess += letter;
    } else {
      this.currentGuess =
        this.currentGuess.substring(0, this.answerLength - 1) + letter;
    }
    this.gameBoard.addLetter(
      this.currentRound,
      this.currentGuess.length - 1,
      letter
    );
    this.gameBoard.addStyle(
      this.currentRound,
      this.currentGuess.length - 1,
      "filled"
    );
  }
  // Delete letter from gameBoard array
  deleteLetter() {
    this.currentGuess = this.currentGuess.substring(
      0,
      this.currentGuess.length - 1
    );
    this.gameBoard.deleteLetter(this.currentRound, this.currentGuess.length);
    this.gameBoard.deleteStyle(this.currentRound, this.currentGuess.length);
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
    if (this.currentGuess.length != this.answerLength) {
      console.log("not long enough");
      return;
    } else if (!this.wordList.includes(this.currentGuess)) {
      console.log("not a valid word");
      return;
    }
    // make objects for encapsulation
    const answerParts = this.answer.split("");
    const answerMap = this.makeMap(answerParts);
    const guessParts = this.currentGuess.split("");
    // check if game is won
    this.isGameWon = true;
    // first pass to see which letter we can mark as correct (green)
    for (let i = 0; i < this.answerLength; i++) {
      if (guessParts[i] === answerParts[i]) {
        this.gameBoard.addStyle(this.currentRound, i, "correct");
        answerMap[guessParts[i]]--;
      }
    }
    // second pass to see which letters are close or wrong (yellow or gray)
    for (let i = 0; i < this.answerLength; i++) {
      if (guessParts[i] === answerParts[i]) {
        // do nothing
      } else if (answerMap[guessParts[i]] && answerMap[guessParts[i]] > 0) {
        this.gameBoard.addStyle(this.currentRound, i, "close");
        answerMap[guessParts[i]]--;
        this.isGameWon = false;
      } else {
        this.gameBoard.addStyle(this.currentRound, i, "wrong");
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
    // Render board div based on current GameBoard object
    const board = this.gameController.getBoard();
    const styleBoard = this.gameController.getStyleBoard();
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
          letterDiv.classList.add(styleBoard[i][j]);
        }
      }
    }
  }
  // Add Event Listener to body for user events and hand to Controller for Game Logic
  listen() {
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
  const board = new GameBoard();
  console.log(board.gameBoard);
  const game = new GameController(board);
  game.loadAnswer();
  const screen = new ScreenController(game);
  screen.renderBoard();
  screen.listen();
}

init();
