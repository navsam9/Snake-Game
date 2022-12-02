// UI Components
let grid = document.querySelector(".grid");
let popup = document.querySelector(".playAgain");
let playAgain = document.querySelector(".playAgain");
let scoreDisplay = document.querySelector(".scoreDisplay");
let highScoreDisplay = document.querySelector(".highScoreDisplay");
let left = document.querySelector(".left");
let down = document.querySelector(".down");
let right = document.querySelector(".right");
let up = document.querySelector(".up");

// width of the grid <=3
let width = 26;

// snake game features

let currentIndex = 0;
let appleIndex = 0;
let currentSnake = [2, 1, 0];

// stores three previous tails;
let recentSnake = [width-1, width-2, width-3];

let direction = 1;
let score = 0;
let speed = 0.98;
let intervalTime = 0;
let interval = 0;
let highScore = 0;


let movedFromLastPress = true;

// random features 
let randomPoison = 5;
let randomCookie = 3;
let randomPotion = 10;




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

// initiliaze game features for new game 
function startGame() {
    let squares = document.querySelectorAll(".grid div");
    randomApple(squares);
    direction = 1;
    scoreDisplay.innerHTML = score;
    highScoreDisplay.innerHTML = highScore
    intervalTime = 100;
    currentSnake = [2, 1, 0];
    recentSnake = [width - 1, width - 2, width - 3];
    currentIndex = 0;
    currentSnake.forEach((index) => squares[index].classList.add("snake"));
    interval = setInterval(moveOutcome, intervalTime);
}


// at each displacement of snake, check if game over
function moveOutcome() {
    let squares = document.querySelectorAll(".grid div");
    moveSnake(squares);
}


// move the snake by removing last element in currentsnake
// and adding new element to beginning depending on direction 
function moveSnake(squares) {
    let tail = currentSnake.pop();
    squares[tail].classList.remove("snake");

    currentSnake.unshift(calculateShift(squares));

    console.log(recentSnake);
    recentSnake.pop();
    recentSnake.unshift(tail);

    squares[currentSnake[0]].classList.add("snake");
    eatPoison(squares, tail);
    eatApple(squares, tail);
    eatCookie(squares, tail);
    eatPotion(squares, tail);
    movedFromLastPress = true;
}

function calculateShift(squares) {
    let shift = currentSnake[0] + direction;
    // snake is going down and reaches bottom
    if (currentSnake[0] + width >= width * width && direction === width) {
        shift = shift % (width * width);
    }
    // snake is going right and reaches right side
    else if (currentSnake[0] % width === width - 1 && direction === 1) {
        shift = shift - width;
    }
    // snake is going left and reaches left side
    else if (currentSnake[0] % width === 0 && direction === -1) {
        shift = shift + width;
    }
    // snake is going up and reaches top
    else if (currentSnake[0] - width < 0 && direction === -width) {
        shift = shift + width * width;
    }
    // snake hits itself
    if (squares[shift].classList.contains("snake")) {
        return loss("Don't eat yourself!");
    }
    return shift;
}

// displays popup and resets games features to prepare for new game
function loss(msg) {
    popup.style.display = "flex";
    highScore = Math.max(highScore, score)
    score = 0;
    return clearInterval(interval);
}

// checks if snake hits a border
//function checkForHits(squares) {
//    if (
//        //(currentSnake[0] + width >= width * width && direction === width) ||
//        //(currentSnake[0] % width === width - 1 && direction === 1) ||
//        //(currentSnake[0] % width === 0 && direction === -1) ||
//        //(currentSnake[0] - width <= 0 && direction === -width) ||
//        //squares[currentSnake[0] + direction].classList.contains("snake")
//        fals
//    ) {
//        return true;
//    } else {
//        return false;
//    }
//}

// when head of snake is on an apple set a new random apple
// and increment length of snake

function eatApple(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("apple")) {
        squares[currentSnake[0]].classList.remove("apple");
        squares[tail].classList.add("snake");
        currentSnake.push(tail);
        randomApple(squares);
        score++;
        scoreDisplay.textContent = score;
        highScoreDisplay.textContent = Math.max(highScore,score)
        clearInterval(interval);
        intervalTime = intervalTime * speed;
        interval = setInterval(moveOutcome, intervalTime);
    }
}

function nextFibNumber(n) {
    let x1 = 0.5 * (n + Math.sqrt(5 * (n ** 2) + 4))
    let x2 = 0.5 * (n + Math.sqrt(5 * (n ** 2) - 4))
    return Number.isInteger(x1) ? x1 : x2;
;}

// what happens when poison is eaten
function eatPoison(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("poison")) {
        return loss("You shouldn't eat that!");
    }
}

// when cookie is eaten
function eatCookie(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("cookie")) {
        squares[currentSnake[0]].classList.remove("cookie");
        squares[currentSnake[0]].classList.remove("snake");
        if (currentSnake.length <= 2) {
            return loss("Too many rotten apples!");
        };
        currentSnake.shift();
        randomApple(squares);
        score--;
        scoreDisplay.textContent = score;
        highScoreDisplay.textContent = Math.max(highScore, score)
        clearInterval(interval);
        intervalTime = intervalTime / speed;
        interval = setInterval(moveOutcome, intervalTime);
    }
}

function eatPotion(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("potion")) {
        squares[currentSnake[0]].classList.remove("potion");

        squares[recentSnake[0]].classList.add("snake");
        squares[recentSnake[1]].classList.add("snake");
        squares[recentSnake[2]].classList.add("snake");
        currentSnake.push(recentSnake[0]);
        currentSnake.push(recentSnake[1]);
        currentSnake.push(recentSnake[2]);
        randomApple(squares);
        score += 3;
        scoreDisplay.textContent = score;
        highScoreDisplay.textContent = Math.max(highScore, score)
        clearInterval(interval);
        intervalTime = intervalTime * (speed ** 3);
        interval = setInterval(moveOutcome, intervalTime);
    }
}


// picks a spot for new apple that is not occupied by the snake
function randomApple(squares) {

    nextItem(1, "apple", squares);

    // calculate odds
    let poisonOdds = Math.floor(Math.random() * randomPoison) + 1;
    let cookieOdds = Math.floor(Math.random() * randomCookie) + 1;
    let potionOdds = Math.floor(Math.random() * randomPotion) + 1;

    nextItem(poisonOdds, "poison", squares);

    nextItem(cookieOdds, "cookie", squares);

    nextItem(potionOdds, "potion", squares);
}


// determines whether given item will appear next or not
function nextItem(randNum, itemStr, squares) {
    if (randNum === 1) {
        do {
            randIndex = Math.floor(Math.random() * squares.length);
        } while (squares[randIndex].classList.contains("snake") ||
            squares[randIndex].classList.contains("apple") ||
            squares[randIndex].classList.contains("cookie") ||
            squares[randIndex].classList.contains("potion") ||
            squares[randIndex].classList.contains("poison"));
        squares[randIndex].classList.add(itemStr);
    }
}


// set the direction of the snake upon user key click
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

// controls for mobile users
//up.addEventListener("click", () => (direction = -width));
//down.addEventListener("click", () => (direction = +width));
//left.addEventListener("click", () => (direction = -1));
//right.addEventListener("click", () => (direction = 1));

// when snake hits a wall, have replay option pop up
function replay() {
    grid.innerHTML = "";
    createBoard();
    startGame();
    popup.style.display = "none";
}