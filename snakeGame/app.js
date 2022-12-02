// UI elements
let grid = document.querySelector(".grid");
let popup = document.querySelector(".playAgain");
let playAgain = document.querySelector(".playAgain");
let scoreDisplay = document.querySelector(".scoreDisplay");
let highScoreDisplay = document.querySelector(".highScoreDisplay");
let left = document.querySelector(".left");
let down = document.querySelector(".down");
let right = document.querySelector(".right");
let up = document.querySelector(".up");

// game properties
let width = 26;
let score = 0;
let speed = 0.98; // factor by which speed decreases after eaten item
let intervalTime = 0; // time between interval updates
let interval = 0;
let highScore = 0;
let movedFromLastPress = true; //prevents simultaneous keypresses

// snake properties
let currentSnake = [2, 1, 0]; // stores indices of snake
let recentSnake = [width - 1, width - 2, width - 3]; // stores recent tails
let direction = 1; // 1 = right, -1 = left, width = down, -width = up

// item properties
let appleIndex = 0; // index of an apple
let randomPoison = 5; // inverse frequency of poison
let randomCookie = 3; 
let randomPotion = 7;

// game initiliazation
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", control);
    createBoard();
    startGame();
    playAgain.addEventListener("click", replay);
});

// create board by appending width*width divs to the grid
function createBoard() {
    popup.style.display = "none";
    for (let i = 0; i < width*width; i++) {
        let div = document.createElement("div");
        grid.appendChild(div);
    }
}

// resets game features for new game 
function startGame() {
    let squares = document.querySelectorAll(".grid div");
    randomItem(squares);
    direction = 1;
    scoreDisplay.innerHTML = score;
    highScoreDisplay.innerHTML = highScore
    intervalTime = 100;
    currentSnake = [2, 1, 0];
    recentSnake = [width - 1, width - 2, width - 3];
    currentSnake.forEach((index) => squares[index].classList.add("snake"));
    interval = setInterval(moveSnake, intervalTime);
}

// moves snake at each interval
function moveSnake() {
    let squares = document.querySelectorAll(".grid div");

    // inserts additional circle at head and removes tail of snake 
    currentSnake.unshift(calculateShift(squares));
    if (!Number.isInteger(currentSnake[0])) return; // prevents console errors
    squares[currentSnake[0]].classList.add("snake");
    let tail = currentSnake.pop();
    squares[tail].classList.remove("snake");

    // updates recent snake
    recentSnake.pop();
    recentSnake.unshift(tail);

    // eats items
    if (squares[currentSnake[0]].classList.length > 1) {
        eatItem(squares);
    }

    // confirms that snake has moved
    movedFromLastPress = true;
}

// computes which square to insert additional circle onto snake
function calculateShift(squares) {

    // default case
    let shift = currentSnake[0] + direction;
    
    if (currentSnake[0] + width >= width * width && direction === width) {
        shift = shift % (width * width);
    } // snake is going down and reaches bottom
    
    else if (currentSnake[0] % width === width - 1 && direction === 1) {
        shift = shift - width;
    } // snake is going right and reaches right side

    else if (currentSnake[0] % width === 0 && direction === -1) {
        shift = shift + width;
    } // snake is going left and reaches left side
    
    else if (currentSnake[0] - width < 0 && direction === -width) {
        shift = shift + width * width;
    } // snake is going up and reaches top
    
    if (squares[shift].classList.contains("snake")) {
        return loss("Don't eat yourself!");
    } // snake hits itself

    return shift;
}

// displays popup and resets some features to prepare for new game
function loss(msg) {
    popup.style.display = "flex";
    highScore = Math.max(highScore, score)
    score = 0;
    return clearInterval(interval);
}

// handles which item is eaten, updates score and places new items
function eatItem(squares) {
    let itemStr = squares[currentSnake[0]].classList[0];
    if (itemStr === "apple") {
        eatApple(squares);
    } else if (itemStr === "cookie") {
        eatCookie(squares);
    } else if (itemStr === "poison") {
        eatPoison(squares);
    } else if (itemStr === "potion") {
        eatPotion(squares);
    }
}

// when apple is eaten, adds removed tail back onto snake
function eatApple(squares) {
    let tail = recentSnake[0];
    squares[currentSnake[0]].classList.remove("apple");
    squares[tail].classList.add("snake");
    currentSnake.push(tail);

    // update game features
    score++;
    updateScore();
    randomItem(squares);
    clearInterval(interval);
    intervalTime = intervalTime * speed;
    interval = setInterval(moveSnake, intervalTime);
}

// when poison is eaten, game is lost
function eatPoison(squares) {
    return loss("You shouldn't eat that!");
}

// when cookie is eaten, removes tail of snake
function eatCookie(squares) {
    squares[currentSnake[0]].classList.remove("cookie");
    let tail = currentSnake.pop();
    squares[tail].classList.remove("snake");
    if (currentSnake.length < 1) {
        return loss("Too many rotten apples!");
    };
    
    // update game features
    score--;
    updateScore();
    randomItem(squares);
    clearInterval(interval);
    intervalTime = intervalTime / speed;
    interval = setInterval(moveSnake, intervalTime);

}

// when potion is eaten, adds three recent tails to snake
function eatPotion(squares) {
    squares[currentSnake[0]].classList.remove("potion");
    squares[recentSnake[2], recentSnake[1], recentSnake[0]]
        .classList.add("snake");
    currentSnake.push(recentSnake[0], recentSnake[1], recentSnake[2]);

    // update game features
    score += 3;
    updateScore();
    randomItem(squares);
    clearInterval(interval);
    intervalTime = intervalTime * (speed ** 3);
    interval = setInterval(moveSnake, intervalTime);
}

// updates score panel
function updateScore() {
    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = Math.max(highScore, score)
}

// adds new items
function randomItem(squares) {
    // calculate odds
    let poisonOdds = Math.floor(Math.random() * randomPoison) + 1;
    let cookieOdds = Math.floor(Math.random() * randomCookie) + 1;
    let potionOdds = Math.floor(Math.random() * randomPotion) + 1;

    nextItem(1, "apple", squares);
    nextItem(poisonOdds, "poison", squares);
    nextItem(cookieOdds, "cookie", squares);
    nextItem(potionOdds, "potion", squares);
}

// determines whether given item will appear and adds to unoccupied square
function nextItem(randNum, itemStr, squares) {
    if (randNum === 1) {
        do {
            randIndex = Math.floor(Math.random() * squares.length);
        } while (squares[randIndex].classList.contains("snake") ||
            squares[randIndex].classList.length >= 1);
        squares[randIndex].classList.add(itemStr);
    }
}

// update direction of snake after user click; can't go opposite direction
function control(e) {
    if (movedFromLastPress) {
        movedFromLastPress = false;
        if (e.keyCode === 39 && direction != -1) {
            direction = 1;
        } else if (e.keyCode === 38 && direction != width) {
            direction = -width;
        } else if (e.keyCode === 37 && direction != 1) {
            direction = -1;
        } else if (e.keyCode === 40 && direction != -width) {
            direction = +width;
        }
    }
}

// restarts game when "Play Again" is clicked
function replay() {
    grid.innerHTML = "";
    createBoard();
    startGame();
    popup.style.display = "none";
}