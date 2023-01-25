let position = 0;
let wordLimit = 5;
let answer = '';
let isGameOver = false;
const ANSWER_URL = 'https://words.dev-apis.com/word-of-the-day';
const VALID_URL = 'https://words.dev-apis.com/validate-word';

const letters = document.querySelectorAll('.letter');
const spinner = document.querySelector('.spinner');

// GET the answer of the day from the server
async function getAnswer() {
  try {
    const response = await fetch(ANSWER_URL);
    const data = await response.json();
    setLoading(false);
    answer = data.word;
  } catch (error) {
    console.error('Could not get right answer');
  }
}

// POST method to see if word is an actual 5 letter word
async function validateWord(guess) {
  setLoading(true);
  const input = {
    "word": guess
  }
  try {
    const response = await fetch(VALID_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    const output = await response.json();
    setLoading(false);
    return output.validWord;
  } catch (error) {
    console.error('Could not validate guess');
  }
}

// Everytime user presses enter, check to see if word is correct, wrong, or valid
async function checkWord() {
  // word is all filled up
  if (position === wordLimit) {
    let guess = '';
    // get the guess word
    for (let i = position - 5; i < wordLimit; i++) {
      guess += letters[i].innerText.toLowerCase();
    }
    // if guess is a valid word
    console.log(await validateWord(guess));
    if (await validateWord(guess)) {
      console.log('why am i running');
      // color the letters depending on correctness
      const answerMap = makeMap(answer); // Keep track of letter count
      let j = 0;
      for (let i = position - 5; i < wordLimit; i++) {
        if (answer.includes(guess[j]) && answerMap[guess[j]] != 0) {
          letters[i].style.backgroundColor = '#B59F3B';
          answerMap[guess[j]]--;
          if (guess[j] === answer[j]) {
            letters[i].style.backgroundColor = '#538D4D';
            answerMap[guess[j]]--;
          }
        } else {
          letters[i].style.backgroundColor = '#3A3A3B';
        }
        j++;
      }
      // check if guess is answer 
      if (guess === answer) {
        isGameOver = true;
        spinner.innerText = '🏆 🏆 🏆';
        setTimeout(() => {
          alert(`You win! Congratulations!`);
        }, '300');
        setLoading(true);
        spinner.style.animation = 'null';
      } else if (wordLimit === 30) {
        // wait before giving alert to color the blocks
        setTimeout(() => {
          alert(`You Lose! The correct answer was ${answer}`);
        }, '300');
      } else {
        // advance to next word block
        wordLimit += 5;
      }
    } else {
      // not a valid word - stay in same word block
      for (let i = position - 5; i < wordLimit; i++) {
        requestAnimationFrame((time) => {
          requestAnimationFrame((time) => {
            letters[i].style.animation = 'blink 1s linear';
          });
          letters[i].style.animation = '';
        });
      }
      return;
    }
  } else { // needs more letters
    // do nothing
    return;
  }
}

// Listen for user's keyboard events
async function init() {
  await getAnswer();
  document.body.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      deleteLetter();
    } else if (event.key === 'Enter') {
      checkWord();
    } else if (isLetter(event.key)) {
      addLetter(event.key);
    } else {
      event.preventDefault;
    }
  })
}

init();

// Helper functions

// Set loading icon visible or hidden depending on AJAX request
function setLoading(isLoading) {
  isLoading ? spinner.style.visibility = 'visible' : spinner.style.visibility = 'hidden';
}

// Check if key.event is a letter
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// Add letter to current word up to the limit
function addLetter(letter) {
  if (position < wordLimit && position < 30) {
    letters[position].innerText = letter;
    position++;
  }
}

// Delete the last letter from current word
function deleteLetter(letter) {
  if (isGameOver) {
    return;
  }
  else if (position > wordLimit - 5) {
    letters[position - 1].innerText = '';
    position--;
  } else {
    letters[position].innerText = '';
  }
}

// Make a map out of an array of letters
function makeMap(array) {
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


