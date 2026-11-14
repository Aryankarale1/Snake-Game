const board = document.querySelector('.board');
const startbutton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startgamemodal = document.querySelector(".start-game");
const gameovermodal = document.querySelector(".game-over");
const restartbutton = document.querySelector(".btn-restart");


const highscoreElement = document.querySelector("#Highscore");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockheight = 50
const blockwidth = 50
let highScore = localStorage.getItem("highscore")||0
let score = 0
let time = `00-00`

highscoreElement.innerText = highScore

const cols = Math.floor(board.clientWidth/blockwidth);
const rows = Math.floor(board.clientHeight/blockheight);
board.style.setProperty('--cols', cols);
board.style.setProperty('--rows', rows);
let intervalid = null;
let timerintervalid = null;
let food ={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}

const blocks = [];
let snake = [{
    x:1,y:3
}]

let direction = 'right'


for (let row = 0; row<rows; row++) {
    for (let col = 0; col<cols; col++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}


function render() {
    let head = null

        blocks[`${food.x}-${food.y}`]?.classList.add('food');
    if(direction === "left"){
        head = {x:snake[0].x,y:snake[0].y-1}
    }
    else if (direction === "right"){
        head = {x:snake[0].x,y:snake[0].y+1}
    }
    else if (direction === "down"){
        head = {x:snake[0].x+1,y:snake[0].y}
    }
    else if (direction === "up"){
        head = {x:snake[0].x-1,y:snake[0].y}
    }

    if (head.x < 0 || head.x >=rows || head.y < 0 || head.y >= cols){
        clearInterval(intervalid)

        modal.style.display ="flex"
        startgamemodal.style.display = "none"
        gameovermodal.style.display = "flex"

        return;
    }

    if(head.x ==food.x && head.y == food.y){
         blocks[`${food.x}-${food.y}`]?.classList.remove('food');
         food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
         blocks[`${food.x}-${food.y}`].classList.add("food")

         snake.unshift(head)

         score+=10
         scoreElement.innerText = score 

         if (score>highScore){
            highScore = score
            localStorage.setItem("highscore",highScore.toString())
            highscoreElement.innerText = highScore;
         }
    }
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]?.classList.remove('fill');
    });

    snake.unshift(head)
    snake.pop()

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]?.classList.add('fill');
     });
}



startbutton.addEventListener("click",()=>{
    modal.style.display = "none"
    intervalid = setInterval(() => {
    render()
}, 300);
timerintervalid = setInterval(()=>{
    let [min,sec] = time.split("-").map(Number)
    if (sec ==59){
        min+=1
        sec=0
    }
    else {
        sec+=1
    }
    time = `${min}-${sec}`
    timeElement.innerText = time
},1000)
})

restartbutton.addEventListener("click",restartgame)

function restartgame() {

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")

    })

    score=0
    time =`00-00`

    scoreElement.innerText = score 
    timeElement.innerText = time


    modal.style.display = "none"
    direction = "down"
    snake = [{x:1,y:3}]
    food ={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
    intervalid = setInterval(() => {
    render()
    }, 300);
}



addEventListener("keydown",(event)=>{
    if (event.key == "ArrowUp"){
        direction = "up"
    }

    else if (event.key == "ArrowRight"){
        direction = "right"
    }

    else if (event.key == "ArrowLeft"){
        direction = "left"
    }
    else if (event.key == "ArrowDown"){
        direction = "down"
    }
})