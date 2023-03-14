const ANSWER_LENGTH = 5; // How many lettters is the answer
const ROUNDS = 6; // How many guesses a player gets

/** GameState class - Contains Game State / Represents Controller/Model **/
class GameState {
  constructor() {
    this.rows = ROUNDS; // Number of Guesses
    this.cols = ANSWER_LENGTH; // Length of Answer
    // Set arrays of board, style, and animation
    const storedBoard = JSON.parse(localStorage.getItem("board"));
    this.board = storedBoard
      ? storedBoard
      : Array.from(Array(this.rows), () => new Array(this.cols).fill(null));
    const storedStyleBoard = JSON.parse(localStorage.getItem("styleBoard"));
    this.styleBoard = storedStyleBoard
      ? storedStyleBoard
      : Array.from(Array(this.rows), () => new Array(this.cols).fill(null));
    const storedAnimationBoard = JSON.parse(
      localStorage.getItem("animationBoard")
    );
    this.animationBoard = storedAnimationBoard
      ? storedAnimationBoard
      : Array.from(Array(this.rows), () => new Array(this.cols).fill(null));
  }

  // reset everything
  reset() {
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
    localStorage.setItem("board", JSON.stringify(this.board));
    return this.board;
  }
  // Add Letter to Array
  addLetter(rows, cols, letter) {
    this.board[rows][cols] = letter;
    localStorage.setItem("board", JSON.stringify(this.board));
  }
  // Delete Letter to Array
  deleteLetter(rows, cols) {
    this.board[rows][cols] = null;
    localStorage.setItem("board", JSON.stringify(this.board));
  }
  // Getter for styleBoard
  getStyleBoard() {
    localStorage.setItem("styleBoard", JSON.stringify(this.styleBoard));
    return this.styleBoard;
  }
  // Add Style to Array
  addStyle(rows, cols, style) {
    this.styleBoard[rows][cols] = style;
    localStorage.setItem("styleBoard", JSON.stringify(this.styleBoard));
  }
  // Delete Style to Array
  deleteStyle(rows, cols) {
    this.styleBoard[rows][cols] = null;
    localStorage.setItem("styleBoard", JSON.stringify(this.styleBoard));
  }
  // Getter for styleBoard
  getAnimationBoard() {
    localStorage.setItem("animationBoard", JSON.stringify(this.animationBoard));
    return this.animationBoard;
  }
  // Add Style to Array
  addAnimation(rows, cols, animation) {
    this.animationBoard[rows][cols] = animation;
    localStorage.setItem("animationBoard", JSON.stringify(this.animationBoard));
  }
  // Delete Style to Array
  resetAnimation() {
    this.animationBoard = Array.from(Array(this.rows), () =>
      new Array(this.cols).fill(null)
    );
    localStorage.setItem("animationBoard", JSON.stringify(this.animationBoard));
  }
}

/** GameController class - Contains Game Logic / Represents the Controller **/
class GameController {
  constructor(gameStateInput, timeUntilResetInput) {
    this.gameState = gameStateInput;
    this.answerLength = ANSWER_LENGTH;
    this.rounds = ROUNDS;
    this.wordList = wordList;
    // Have to store all of these in localStorage
    // Retrive a new answer for every 24 hours
    const now = new Date();
    if (!localStorage.getItem("timeStarted")) {
      localStorage.setItem("timeStarted", JSON.stringify(now.getTime()));
    }
    const timeElapsed = now.getTime() - localStorage.getItem("timeStarted");
    localStorage.setItem("timeElapsed", JSON.stringify(timeElapsed));
    let storedAnswer = JSON.parse(localStorage.getItem("answer"));
    if (!storedAnswer) {
      this.answer = this.loadAnswer();
    } else {
      // time to reset answer and the whole game in ms: 1 min
      if (timeElapsed >= 60000) {
        localStorage.setItem("timeStarted", JSON.stringify(now.getTime()));
        this.resetGame();
      } else {
        this.answer = storedAnswer;
      }
    }
    console.log(this.answer);

    // Store other variables in local Storage
    let storedCurrentRound = JSON.parse(localStorage.getItem("currentRound"));
    this.currentRound = storedCurrentRound ? storedCurrentRound : 0;

    let storedCurrentGuess = JSON.parse(localStorage.getItem("currentGuess"));
    this.currentGuess = storedCurrentGuess ? storedCurrentGuess : "";

    let storedIsGameRunning = JSON.parse(localStorage.getItem("isGameRunning"));
    this.isGameRunning = storedIsGameRunning ? storedIsGameRunning : true;

    let storedIsGameWon = JSON.parse(localStorage.getItem("isGameWon"));
    this.isGameWon = storedIsGameWon ? storedIsGameWon : false;
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
  // Load answer for every 24 hours
  loadAnswer() {
    try {
      let word =
        this.wordList[Math.floor(Math.random() * this.wordList.length)];
      localStorage.setItem("answer", JSON.stringify(word));
      // return either stored word or new generated answer
      return word;
    } catch (error) {
      console.error("Could not load answer");
    }
  }
  // reset game once a certain amount of time has passed since game started
  resetGame() {
    // reload answer
    this.answer = this.loadAnswer();
    // reset all of the other variables
    localStorage.setItem("currentRound", JSON.stringify(0));
    localStorage.setItem("currentGuess", JSON.stringify(""));
    localStorage.setItem("isGameRunning", JSON.stringify(true));
    localStorage.setItem("isGameWon", JSON.stringify(false));

    // reset game state
    this.gameState.reset();
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
      localStorage.setItem("currentGuess", JSON.stringify(this.currentGuess));
    } else {
      this.currentGuess =
        this.currentGuess.substring(0, this.answerLength - 1) + letter;
      localStorage.setItem("currentGuess", JSON.stringify(this.currentGuess));
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
    this.gameState.addAnimation(
      this.currentRound,
      this.currentGuess.length - 1,
      "animateFilled"
    );
  }
  // Delete letter from gameState array
  deleteLetter() {
    this.currentGuess = this.currentGuess.substring(
      0,
      this.currentGuess.length - 1
    );
    localStorage.setItem("currentGuess", JSON.stringify(this.currentGuess));
    this.gameState.deleteLetter(this.currentRound, this.currentGuess.length);
    this.gameState.deleteStyle(this.currentRound, this.currentGuess.length);
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
        this.gameState.addAnimation(this.currentRound, i, "animateInvalid");
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
        this.gameState.addAnimation(this.currentRound, i, "animateSubmit");
        answerMap[guessParts[i]]--;
      }
    }
    // Second pass to see which letters are close or wrong (yellow or gray)
    for (let i = 0; i < this.answerLength; i++) {
      if (guessParts[i] === answerParts[i]) {
        // do nothing
      } else if (answerMap[guessParts[i]] && answerMap[guessParts[i]] > 0) {
        this.gameState.addStyle(this.currentRound, i, "close");
        this.gameState.addAnimation(this.currentRound, i, "animateSubmit");
        answerMap[guessParts[i]]--;
        this.isGameWon = false;
        localStorage.setItem("isGameWon", JSON.stringify(this.isGameWon));
      } else {
        this.gameState.addStyle(this.currentRound, i, "wrong");
        this.gameState.addAnimation(this.currentRound, i, "animateSubmit");
        this.isGameWon = false;
        localStorage.setItem("isGameWon", JSON.stringify(this.isGameWon));
      }
    }
    // advance to next guess
    this.currentRound++;
    localStorage.setItem("currentRound", JSON.stringify(this.currentRound));
    this.currentGuess = "";
    localStorage.setItem("currentGuess", JSON.stringify(this.currentGuess));

    // Check if game is over - Play out Win or Lose conditions
    if (this.isGameWon) {
      this.isGameRunning = false;
      localStorage.setItem("isGameRunning", JSON.stringify(this.isGameRunning));
      this.currentRound = 6;
      localStorage.setItem("currentRound", JSON.stringify(this.currentRound));
    } else if (this.currentRound === this.rounds) {
      this.isGameRunning = false;
      localStorage.setItem("isGameRunning", JSON.stringify(this.isGameRunning));
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

/** ScreenController class - Contains Screen Logic / Renders the View **/
class ScreenController {
  constructor(gameControllerInput) {
    this.body = document.body;
    this.boardDiv = document.querySelector(".board");
    this.keyButtons = document.querySelectorAll(".key");
    this.gameController = gameControllerInput;
    this.toast = document.querySelector(".toast");
  }
  // Pass in a boolean that loads the appropriate toast
  setToast(hasWon) {
    const text = document.createElement("p");
    text.className = "toastText";
    this.toast.style.display = "block";
    if (hasWon) {
      text.innerText = "Splendid!";
      this.toast.appendChild(text);
      setTimeout(() => {
        this.toast.removeChild(text);
        this.toast.style.display = "none";
      }, 3000);
    } else {
      text.innerText =
        " Better luck tomorrow..." + "\n Answer: " + this.gameController.answer;
      this.toast.appendChild(text);
    }
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
      // Make sure game is still running before processing events
      if (this.gameController.getIsGameRunning()) {
        this.gameController.handleEvent(key, preventDefault);
        this.renderBoard();
        if (!this.gameController.getIsGameRunning()) {
          if (this.gameController.getIsGameWon()) {
            setTimeout(() => {
              this.setToast(true);
            }, 500);
          } else {
            setTimeout(() => {
              this.setToast(false);
            }, 500);
          }
        }
      }
    });
    // Listen to button events and check if game is over
    this.keyButtons.forEach((key) => {
      key.addEventListener("click", () => {
        // Make sure game is still running before processing events
        if (this.gameController.getIsGameRunning()) {
          this.gameController.handleEvent(key.innerText, null);
          this.renderBoard();
          if (!this.gameController.getIsGameRunning()) {
            if (this.gameController.getIsGameWon()) {
              setTimeout(() => {
                this.setToast(true);
              }, 500);
            } else {
              setTimeout(() => {
                this.setToast(false);
              }, 500);
            }
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
  const screen = new ScreenController(game);
  screen.renderBoard();
  screen.listen();
}

init();
