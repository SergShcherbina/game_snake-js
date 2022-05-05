const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');                        //контекст 2d

let ground = new Image();                                   //создаем обьект фоновой картинки
ground.src = 'img/game.png';                                   

let foodImage = new Image();                                
foodImage.src = 'img/food.png';

let box = 32;                                               //одна клетка/шаг

let score = 0                                               //счет игры

let food = {                                                //задаем рандомные координаты еды
    x: Math.floor((Math.random() * 17 + 1)) * box,
    y: Math.floor((Math.random() * 15 + 3)) * box,
};

const snake = [];                                           //создаем пустой масив змеи
    snake[0] = {                                            //задаем координаты головы
        x: 9 * box,
        y: 10 * box,
    };

document.addEventListener('keydown', direction);            //оброботчик для управления змейкой 

let dir;

function direction(e) {
    if(e.keyCode == 37 && dir != 'right') {                 //если нажимаем на 37клавишу и змея не ползет вправо, тогда ползет влево
        dir = 'left';
    } else if (e.keyCode == 38 && dir != 'down') {
        dir = 'up';
    } else if (e.keyCode == 39 && dir != 'left') {
        dir = 'right';
    } else if (e.keyCode == 40 && dir != 'up') {
        dir = 'down'; 
    }
}

function eatTail(head, arr) {                               //ф-я перебора масива змейки, которая заканчивает изру при врезании самой в себя 
    for(let i = 0; i < arr.length; i ++) {
        if(head.x == arr[i].x && head.y == arr[i].y){
            clearInterval(game);
        }
    }
}

function drawGame() {                                       // функция с обновлением частоты раз в 100мc (setInterval)
    ctx.drawImage(ground, 0, 0);                            //рисуем изображение переменной ground (context.drawImage(img, x, y, width, height)

    ctx.drawImage(foodImage, food.x, food.y);               

    ctx.fillStyle = 'white';                                //стиль текста (счет)
    ctx.font = "50px Arial";                                //параметры шрифта
    ctx.fillText(score, box * 2.5, box * 1.7);              //рисуем текст (ctx.fillText(text, x, y [, maxWidth]); [, maxWidth] макс шир текста(необязательно)

    for(let i = 0; i < snake.length; i ++){                 //постройка змеи
        ctx.fillStyle = i ==  0 ? 'green' : 'yellow';       //если первый эл массива зеленыйб то остальные желтые
        ctx.fillRect(snake[i].x, snake[i].y, box, box);     //рисуем змею с координатими и размерами (ctx.fillRect(x, y, width, height))
    }

    let snakeX = snake[0].x;                                //переменные с первоначальным значение змеи
    let snakeY = snake[0].y;

    if(snakeX == food.x && snakeY == food.y){               //если координаты змеи и еды совпадают
        score++;                                            //увеличиваем счет
        food = {                                            //ставим новые рандомные координаты еды
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box,
        };
    } else {                                                
        snake.pop();                                        //если не совпадаютб удаляем последний элемент массива змеи
    }

    if(snakeX < box  || snakeX > box * 17                   //сброс setInterval если змея дошла до границ игрового поля
        || snakeY < 3 * box || snakeY > box *17) {
            clearInterval(game);
        }

    if(dir == 'left') snakeX -= box;                        //ели нажали влево, перемещаем масив по -1 клетке (влево)
    if(dir == 'right') snakeX += box;
    if(dir == 'up') snakeY -= box;
    if(dir == 'down') snakeY += box;
    
    let newHead = {                                         //создаем новую голову змеи така как прежнюю удалили( snake.pop())
        x: snakeX,
        y: snakeY,
    };

    eatTail(newHead, snake);                               //постоянно вызываем функцию по проверке пересечения змеи    

    snake.unshift(newHead);                                //добавляем голову в начало массива
}

let game = setInterval(drawGame, 100);                      