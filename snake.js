//Full màn hình ngang 75 Ô, dọc 31
class Node {
    constructor(data = {x, y}, next = null, prev = null) {
        this.data = data;
        this.next = next;
        this.prev = prev;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    //Thêm đầu
    insertHead(data) {
        let node = new Node(data);
        node.next = this.head;
        if(this.size == 0) {
            this.tail = node;
        } else {
            this.head.prev = node;
        }
        this.head = node;
        this.size++;
    }

    //Thêm đuôi
    insertTail(data) {
        let node = new Node(data);
        if(this.size == 0) {
            this.head = node;
            this.tail = node;
            this.size++;
            return;
        }
        this.tail.next = node;
        node.prev = this.tail;
        this.tail = node;
        this.size++; 
    }

    //Xóa đầu
    deleteHead() {
        if(this.head != null && this.tail != null) {
            this.head = this.head.next;
            this.head.prev = null;
        }
        this.size--;
    }

    //Xóa đuôi
    deleteTail() {
        if(this.head != null && this.tail != null) {
            this.tail = this.tail.prev;
            this.tail.next = null;
        }
        this.size--;
    }

    print() {
        while(this.head != null && this.tail != null) {
            console.log(this.head);
            this.head = this.head.next;
        }
    }
}

window.onload = function() {
    const cvs = document.getElementById("canvas");
    const ctx = cvs.getContext("2d");

    const cvsW = cvs.width;
    const cvsH = cvs.height;

    //Dài rộng của 1 box snake
    const box = 25;

    //load Audio
    let dead = new this.Audio();
    let eat = new this.Audio();
    let up = new this.Audio();
    let right = new this.Audio();
    let left = new this.Audio();
    let down = new this.Audio();

    dead.src = "audio/dead.wav";
    eat.src = "audio/eat.wav";
    up.src = "audio/up.mp3";
    right.src = "audio/right.mp3";
    left.src = "audio/left.mp3";
    down.src = "audio/down.mp3";

    let snake = new LinkedList();

    function drawSnake(x, y) {
        //Vẽ hình
        ctx.fillStyle = "#FFF";
        ctx.fillRect(x*box, y*box, box, box);

        //Vẽ viền khung
        ctx.fillStyle = "#000";
        ctx.strokeRect(x*box, y*box, box, box);
    }

    //Điều khiển snake
    let direction = "RIGHT";
    document.addEventListener("keydown", getDirection);
    function getDirection(event) {
        let key = event.keyCode;
        if(key == 37 && direction != "RIGHT") {
            direction = "LEFT";
            left.play();
        } else if(key == 38 && direction != "DOWN") {
            direction = "UP";
            up.play();
        } else if(key == 39 && direction != "LEFT") {
            direction = "RIGHT";
            right.play();
        } else if(key == 40 && direction != "UP") {
            direction = "DOWN";
            down.play();
        }
    }

    //Khởi tọa snake.length = 3
    let len = 3;
    for(let i = 0; i < len; i++) {
        snake.insertHead({x : i, y : 0});
    }

    //Tạo food
    let food = {
        x : Math.round(Math.random() * (cvsW / box) + 1),
        y : Math.round(Math.random() * (cvsH / box) + 1)
    };

    //Vẽ food
    function drawFood(x, y) {
        //Vẽ hình
        ctx.fillStyle = "yellow";
        ctx.fillRect(x*box, y*box, box, box);

        //Vẽ viền khung
        ctx.fillStyle = "#000";
        ctx.strokeRect(x*box, y*box, box, box);
    }

    //kiểm tra va chạm
    function checkCollision(x, y, list) {
        let headSnake = list.head;
        for(let i = 0; i < list.length; i++) {
            if(x == headSnake.data.x && y == headSnake.data.y) {
                return true;
            }
            headSnake = headSnake.next;
        }
        return false;
    }

    function draw() {
        //Xóa màn hình
        ctx.clearRect(0, 0, cvsW, cvsH);
        let headSnake = snake.head;
        for(let i = 0; i < snake.size; i++) {
            xPoint = headSnake.data.x;
            yPoint = headSnake.data.y;
            drawSnake(xPoint, yPoint);
            headSnake = headSnake.next;
        }

        //Vẽ food
        drawFood(food.x, food.y);

        //Đầu rắn mới
        let snakeX = snake.head.data.x;
        let snakeY = snake.head.data.y;

        //Thua khi đụng tường
        if(snakeX < 0 || snakeY < 0 || snakeX >= cvsW/box || snakeY >= cvsH/box || checkCollision(snakeX, snakeY, snake)) {
            dead.play();
            location.reload();
        }

        //Chuyển hướng đi snake
        if(direction == "LEFT") snakeX--;
        else if(direction == "UP") snakeY--;
        else if(direction == "RIGHT") snakeX++;
        else if(direction == "DOWN") snakeY++;

        //snake ăn food
        if(snakeX == food.x && snakeY == food.y) {
            food = {
                x : Math.round(Math.random() * (cvsW / box) + 1),
                y : Math.round(Math.random() * (cvsH / box) + 1)
            };
        } else {
             //Xóa đuôi snake
            snake.deleteTail();
        }

        //Thêm đầu snake
        snake.insertHead({x : snakeX, y : snakeY});
    }

    setInterval(draw, 60);
}