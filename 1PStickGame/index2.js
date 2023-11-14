let spot = 0;
let nums;
let P1Turn = true;
let dynamite = localStorage.getItem("numSticks");
let list = ""
let gameOver = false

function init() {
    nums=[]
    let firstPlayer = document.getElementById("firstPlayer")
    if (localStorage.getItem("P1Turn") == "true") {
        firstPlayer.innerHTML = "Player goes first!"
        P1Turn = true
    }
    else {
        firstPlayer.innerHTML = "Computer goes first!"
        P1Turn = false
        computerTurn()
    }
    let sticksLeft = document.getElementById("sticksLeft")
    sticksLeft.innerHTML = dynamite + " Sticks Left"
}
init()

function startGame() {
    window.location.href = "index2.html"
}

function randomTurn() {
    let numSticks = Math.ceil(Math.random() * 4)
    removeSticks(numSticks)
}

function removeSticks(num1) {
    if (gameOver == false) {
        dynamite -= num1
        nums.push(num1)
            if (P1Turn)
                list += "Player: " + nums[nums.length-1] + " <br>"
            else
                list += "Computer: " + nums[nums.length-1] + " <br>"
        let paragraph = document.getElementById("listNums")
        paragraph.innerHTML = list
        let input = document.getElementById("num1")
        input.value = ""
        let form = document.getElementById("form")
        P1Turn = !P1Turn
        if (dynamite <= 0) {
            dynamite = 0
            if (P1Turn) {
                form.innerHTML = "Computer blows up! Player Wins!"
                gameOver = true;
            }
            else {
                form.innerHTML = "Player blows up! Computer Wins!"
                gameOver = true
            }
            setTimeout(reloadGame, 2000)
        }
        let sticksLeft = document.getElementById("sticksLeft")
        sticksLeft.innerHTML = dynamite + " Sticks Left"
    }
}

function playerTurn() {
    let num1 = document.getElementById("num1").value
    if (num1 >= 1 && num1 <= 4 && num1%1 == 0) {
        removeSticks(num1)
        computerTurn()
    }
}

function computerTurn() {
    if (dynamite%5 != 1) {
        if (dynamite%5 == 0) {
            removeSticks(4)
        }
        else{
            removeSticks(dynamite%5-1)
        }
    }
    else {
        randomTurn()
    }
}

function handleKeyPress(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        playerTurn();
    }
}

function optionChange() {
    var selectedOption = document.getElementById("options")
    if (selectedOption.value == "second") {
        localStorage.setItem("P1Turn", false);
    }
    else {
        localStorage.setItem("P1Turn", true)
    }
}

function sliderChange() {
    var slider = document.getElementById("amtRange")
    var numSticks = document.getElementById("numSticks")
    numSticks.innerHTML = slider.value
    localStorage.setItem("numSticks", slider.value)
}

function startPageLoad() {
    localStorage.setItem("numSticks", 11)
    localStorage.setItem("P1Turn", true)
}

function reloadGame() {
    window.location.href = "startPage.html"
}