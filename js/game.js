const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/bug.png";

// один квадратик имеет размеры 32 х 32 пикселя
let box = 32;

let score = 0;

// еда должно появляться в случайном месте, x, y - координаты,
// 17 - кол-во ячеек по горизонтали, 15 - по вертикали
// +1 и +3 - чтобы еда не появлялась за квадратиками (сверху отступ больше) 
let food = {
    x: Math.floor((Math.random() * 17 + 1)) * box,
    y: Math.floor((Math.random() * 15 + 3)) * box,
};

// распологаем змейку в начале игры в цетре канваса
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

// обработчик событий
document.addEventListener("keydown", direction);

let dir;

function direction(event) {
    if(event.keyCode == 37 && dir != "right")
        dir = "left";
    else if (event.keyCode == 38 && dir != "down")
        dir = "up";
    else if (event.keyCode == 39 && dir != "left")
        dir = "right";
    else if (event.keyCode == 40 && dir != "up")
        dir = "down";
}

// функция, которая следит не ест ли змея себя
function eatTail(head, arr) {
    for(let i = 0; i < arr.length; i++)
        if (head.x == arr[i].x && head.y == arr[i].y)
            clearInterval(game);
}

// рисуем игру
function drawGame() {
    ctx.drawImage(ground, 0, 0);

    ctx.drawImage(foodImg, food.x, food.y);

    // рисуем змею - координаты и размеры (32 х 32)
    // первый элемент делаем другим
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box)
    }

    // рисуем текст
    ctx.fillStyle = "white";
    ctx.font = "bold 40px Montserrat";
    ctx.fillText("Bugs caught: " + score, box, 1.7*box);

    // координаты перед началом движения
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // учим змею есть. Если координаты совпадают:
    // счет увеличивается и еда генерируется в другом месте
    if (snakeX == food.x && snakeY == food.y) {
        score ++;
        food = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box,
        }
    }
    // удаляем последний элемент в массиве
    else {
        snake.pop();
    }

    // если змея вышла за пределы поля
    if(snakeX < box * 1 || snakeX > box * 17
        || snakeY < box * 3 || snakeY > box * 17 )
        clearInterval(game);

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = {
        x: snakeX,
        y: snakeY
    };
    
    //вызываем функцию проверки на канибализм 
    eatTail(newHead, snake);

    // рисуем новую голову
    snake.unshift(newHead);
}

// вызываем нашу картинку каждые 100 ms
let game = setInterval(drawGame, 100);

