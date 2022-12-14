// Declare value globally
var playerOneName = "";
var playerOneColor = "";
var playerTwoName = "";
var playerTwoColor = "";

// Setup of the first player
function getInputOneValue() {
  // Selecting the input element and get its value
  var inputPlayerOne = document.querySelector("#inputPlayer1");
  var colorsPlayerOne = document.querySelectorAll("input[name=color]");

  var labelPlayerTwo = document.querySelectorAll("#colorListTwo .color");

  // If the user don't enter a name, Player one by default
  if (inputPlayerOne.value !== "") {
    playerOneName = inputPlayerOne.value;
  } else {
    playerOneName = "PlayerONE";
  }
  
  // If the user don't enter a color, red by default and we display none on the next color
  for (let i = 0; i < colorsPlayerOne.length; i++) {
    if (colorsPlayerOne[i].checked) {
      playerOneColor = colorsPlayerOne[i].value;
      labelPlayerTwo[i].className = "disable" ;
    }
  }

  // Animation betwenn form One and Two
  console.log(playerOneColor, playerOneName);
  // a faire avant 1 seconde
  var containerToHide = document.querySelector("#containerOne.information");
  containerToHide.className = "animate__animated animate__zoomOut";
  containerToHide.style.setProperty("--animate-duration", ".8s");
  // a faire aprés 1 seconde
  setTimeout(() => {
    containerToHide.classList.add("displayNone");
    var containerToShow = document.querySelector("#containerTwo.information");
    containerToShow.classList.remove("displayNone");
    containerToShow.className = "animate__animated animate__zoomIn information";
    containerToShow.style.setProperty("--animate-duration", ".8s");
    document.querySelector(".player p").innerHTML = playerOneName;
  }, 800);
}

// Setup of the second player
function getInputTwoValue() {
  // Selecting the input element and get its value
  var inputPlayerTwo = document.querySelector("#inputPlayer2");
  var colorsPlayerTwo = document.querySelectorAll("input[name=color2]");
  var colorsPlayerTwo = document.querySelectorAll("input[name=color2]");


  // If the user don't enter a name, Player two by default
  if (inputPlayerTwo.value !== "") {
    playerTwoName = inputPlayerTwo.value;
  } else {
    playerTwoName = "PlayerTWO";
  }

    // If the user don't enter a color, yellow by default and we display none on the next color
  for (let i = 0; i < colorsPlayerTwo.length; i++) {
    if (colorsPlayerTwo[i].checked) {
      playerTwoColor = colorsPlayerTwo[i].value;
    }
  }
  console.log(playerTwoColor, playerTwoName);

  // Display of the game container

  // a faire avant 1 seconde
  var containerToHide = document.querySelector("#containerTwo.information");
  containerToHide.className = "animate__animated animate__zoomOut";
  containerToHide.style.setProperty("--animate-duration", ".8s");
  // a faire aprés 1 seconde
  setTimeout(() => {
    containerToHide.classList.add("displayNone");
    var containerToShow = document.querySelector("#container.jeux");
    containerToShow.classList.remove("displayNone");
    containerToShow.className = "animate__animated animate__zoomIn";
    containerToShow.style.setProperty("--animate-duration", ".8s");

    // Setup the good value to the good place
    let playerOneTitle = document.querySelector("#playerOne");
    playerOneTitle.innerHTML += " " + playerOneName;
    let playerTwoTitle = document.querySelector("#playerTwo");
    playerTwoTitle.innerHTML += " " + playerTwoName;

    let cases = document.querySelectorAll(".score");
    cases[0].style.borderColor = playerOneColor;
    cases[1].style.borderColor = playerTwoColor;

    let scoreBoard = document.querySelector("#playerBoard");
    scoreBoard.style.borderColor = playerOneColor;
  }, 800);
}

// when we click on this button it change de numbers of columns then we choose the color of the player then we play
// then we stock it into local storage and at the second party we ask if we want to keep preset

// We start the game
function newGame(button) {
  button.style.display = "none";
  const game = document.querySelector("#gameContainer");
  // Columns
  const columns = [];
  // Array that store columns and rows

  const slotsArray = [];

  //   where if get slots array in local storage a reback the party

  // determine the next color
  let nextColor = playerOneColor;
  // Number of columns
  let numbersOfColumns = 7;
  let numbersOfSlots = numbersOfColumns - 1;
  // create columns
  for (let i = 0; i < numbersOfColumns; i++) {
    const column = document.createElement("div");
    column.className = "column animate__animated animate__zoomIn";
    column.style.setProperty("--animate-duration", ".2s");
    game.appendChild(column);
    columns.push(column);
  }

  // Class that create a Slot for each case
  class Slot {
    // Setup element
    constructor(element, column, row) {
      this.column = column;
      this.row = row;
      this.element = element;
      this.state = "";
      this.animated = "";
    }
    // for each case  clicked, we gonna change the color of the next player, check for a gameover or win, change the element clickable
    clicked() {
      const el = this.element;
      if (!el.classList.contains("clickable")) return;
      //   we save state of tile
      el.style.backgroundColor = nextColor;
      this.state = nextColor;
      this.animated = "animated";

      // make next element NOT clickable
      el.classList.remove("clickable");
      el.classList.add("animated");

      // make next element clickable
      if (slotsArray[this.column][this.row - 1]) {
        slotsArray[this.column][this.row - 1].element.classList.add(
          "clickable",
          nextColor
        );
      }

      // Check for gameOver
      if (isDraw(slotsArray) == true) {
        gameOver(nextColor);
      }

      // Check for winner
      if (isWinner(this.column, this.row, nextColor, slotsArray) == true) {
        gameOver(nextColor);
        if(nextColor == playerOneColor ){
          nextColor = playerTwoColor
        }else if (nextColor == playerTwoColor){
          nextColor = playerOneColor
        }
      }
      let scoreBoard = document.querySelector("#playerBoard");
      // change next color
      let oldColor = nextColor; // Change next color for Player 2 color
      if (nextColor == playerOneColor) {
        nextColor = playerTwoColor;
        scoreBoard.style.borderColor = playerTwoColor;
        document.querySelector(".player p").innerHTML = playerTwoName;
      } else {
        scoreBoard.style.borderColor = playerOneColor;
        nextColor = playerOneColor;
        document.querySelector(".player p").innerHTML = playerOneName;
      }
      document.querySelectorAll(".clickable").forEach((element) => {
        element.classList.remove(oldColor);
        element.classList.add(nextColor);
      });
    }
  }

  // create slots and push to columns
  columns.forEach((el, col) => {
    let slotColumn = [];
    for (let i = 0; i < numbersOfSlots; i++) {
      const div = document.createElement("div");
      div.classList.add("slot");
      el.appendChild(div);
      const slot = new Slot(div, col, i);
      slotColumn.push(slot);
      // add the function clickable on click
      div.onclick = () => {
        slot.clicked();
      };
      // Setup position for each slot
      div.style.top = i * 70 + 2 + "px";
    }
    slotsArray.push(slotColumn);
  });

    // add the click event function to each  first element
  slotsArray.forEach((col) => {
    col[5].element.classList.add("clickable", nextColor);
  });

  console.log(slotsArray);
}

// Check if game is draw
function isDraw(slotsArray) {
  let isDraw = true;
  slotsArray.forEach((column) => {
    column.forEach((slot) => {
      if (slot.state == "") {
        isDraw = false;
      }
    });
  });
  return isDraw;
}
// Text the lines to see if someone has won
function testLines(lines, color, slotsArray) {
  // Const that if it's 4 you win
  let connectedSlots = 1;
  // In each line
  lines.forEach((line) => {
    // We gonna check each slot 
    for (let i = 0; i < line.length; i++) {
      const slotLocation = line[i];
      column = slotLocation[0];
      row = slotLocation[1];
      // Don't allow for searching off screen
      if (column >= 0 && column <= 6 && row >= 0 && row <= 5) {
        // Make sure it's defined
        if (typeof slotsArray[column][row] !== "undefined") {
          // We gonna add one to the counter if it match the color at the position we define in isWinner
          
          if (slotsArray[column][row].state == color) {
            console.log(connectedSlots);
            connectedSlots += 1;
          } else {
            break;
          }
        }
      } else {
        break;
      }
    }
  });

  if (connectedSlots >= 4) {
    return true;
  } else {
    return false;
  }
}

// Check if there is a winner
function isWinner(col, row, color, slotsArray) {
  const winningLines = {
    // condition to win
    horizontal: [
      [
        [col - 1, row],
        [col - 2, row],
        [col - 3, row],
      ],
      [
        [col + 1, row],
        [col + 2, row],
        [col + 3, row],
      ],
    ],
    vertical: [
      [
        [col, row - 1],
        [col, row - 2],
        [col, row - 3],
      ],
      [
        [col, row + 1],
        [col, row + 2],
        [col, row + 3],
      ],
    ],
    diagonalLeft: [
      [
        [col - 1, row - 1],
        [col - 2, row - 2],
        [col - 3, row - 3],
      ],
      [
        [col + 1, row + 1],
        [col + 2, row + 2],
        [col + 3, row + 3],
      ],
    ],
    diagonalRight: [
      [
        [col - 1, row + 1],
        [col - 2, row + 2],
        [col - 3, row + 3],
      ],
      [
        [col + 1, row - 1],
        [col + 2, row - 2],
        [col + 3, row - 3],
      ],
    ],
  };

  // try each way
  if (
    testLines(winningLines.horizontal, color, slotsArray) == true ||
    testLines(winningLines.vertical, color, slotsArray) == true ||
    testLines(winningLines.diagonalLeft, color, slotsArray) == true ||
    testLines(winningLines.diagonalRight, color, slotsArray) == true
  ) {
    return true;
  } else {
    return false;
  }
}

// Check if the game is over
function gameOver(winner) {
  // add one to the winner
  setScore(winner);
  // check for the goodname to show
  let winnerName;
  let looserName;
  if (winner === playerOneColor) {
    winnerName = playerOneName;
    looserName = playerTwoName;
  } else if (winner === playerTwoColor) {
    winnerName = playerTwoName;
    looserName = playerOneName;
  }

  // Delete the game
  let button = document.querySelector("#playButton");
  let buttonText = document.querySelector("#buttonText");

  document.querySelectorAll(".column").forEach((column) => {
    column.innerHTML = "";
    column.parentNode.removeChild(column);
    // show the button to restart the game
    button.style.display = "inherit";
    buttonText.innerHTML = winnerName +" Win !!</br></br></br>Revanche "+looserName+" ?" 
  });
}

// Set score on the scoreboard
function setScore(winner) {
  // if no winner
  if (winner == "undefined") {
    return;
  }

  document.getElementById(winner + "Score").innerHTML =
    parseInt(document.getElementById(winner + "Score").innerHTML) + 1;
}

// restart all the game
function refreshGame() {
  location.reload();
}
