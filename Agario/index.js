const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const Colliders = []
const GameObjects = []
const mapSize = 12
const density = 8
const maxSpeed = 14
const growthRate = 2
const startingNum = 10
let Player1;
let Background;
let BackgroundLines
let Player2;
let TextBox;
let mouseX;
let mouseY;
let Inputs = []
let KeyUp = []
let P1MoveRight = false
let P1MoveLeft = false
let gameOver = false;



ctx.font = "100px serif";
ctx.fillStyle = "orange";

function Create2DArray(rows, columns) {
    const matrix = [];

    for (let i = 0; i < rows; i++) {
        matrix[i] = []; // Create an empty row
        for (let j = 0; j < columns; j++) {
            matrix[i][j] = 0; // Fill each cell with a value (e.g., 0)
        }
    }
    return matrix
}

class GameObject {
    constructor({ name }) {
        this.name = name;
        this.AddComponent(new Transform({ position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } }, this));
    }
    Components = []
    transform;
    RigidBody2D;
    Sprite;

    Update() {
        for (let index = 0; index < this.Components.length; index++) {
            this.Components[index].Update()
        }
    }
    OnSquareCollisionEnter(Collider) {
        this.RigidBody2D.OnSquareCollisionEnter(Collider);
    }
    OnCircleCollisionEnter(Collider) {
        if (this.name == "Circle_Red") {
            this.RigidBody2D.OnCircleCollisionEnter(Collider);
        }
        else if (this.name == "Dot") {

        }
    }
    AddComponent(Component) {
        this.Components[this.Components.length] = Component;
    }
}

class Component {
    constructor(gameObject) {
        this.gameObject = gameObject;
    }
}

class Sprite extends Component {
    constructor({ size, color, shape, text, textColor, fontSize, globalAlpha, base}, gameObject) {
        super(gameObject)
        this.size = size;
        this.color = color;
        this.shape = shape;
        this.text = text || null
        this.textColor = textColor || "black"
        this.fontSize = fontSize || 30
        this.globalAlpha = globalAlpha || 1
        this.base = base || 0
        this.gameObject.Sprite = this;

        this.newText = ""

        if (this.base > 0) {
            let number = Number(this.text)
            while (number > 0) {
                let remainder = number % this.base;
                this.newText = remainder + this.newText;
                number = Math.floor(number / base);
              }
        }
    }
    Draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.globalAlpha
        if (this.shape == "rect") {
            ctx.fillRect(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, this.size.y);
        }
        if (this.shape == "circle") {
            ctx.beginPath();
            ctx.arc(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();

            if (this.text) {
                ctx.fillStyle = this.textColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = this.fontSize + "px Impact";
                if (this.base > 0) {
                    ctx.fillText(this.newText, this.gameObject.transform.position.x, this.gameObject.transform.position.y-15);
                    ctx.fillText("(" + this.base + ")", this.gameObject.transform.position.x, this.gameObject.transform.position.y+15)
                }
                else {
                    ctx.fillText(this.text, this.gameObject.transform.position.x, this.gameObject.transform.position.y);
                }
            }
        }
        if (this.shape == "lines") {
            
            const cellSize = this.size.x;
            const rows = Math.floor(canvas.height / cellSize)+1;
            const columns = Math.floor(canvas.width / cellSize)+1;

                ctx.beginPath();
                ctx.strokeStyle = this.color;

                for (let i = -1; i <= rows; i++) {
                const y = i * cellSize;
                ctx.moveTo(0, y+(this.gameObject.transform.position.y%cellSize));
                ctx.lineTo(canvas.width, y+(this.gameObject.transform.position.y%cellSize));
                }

                for (let i = -1; i <= columns; i++) {
                const x = i * cellSize;
                ctx.moveTo(x+(this.gameObject.transform.position.x%cellSize), 0);
                ctx.lineTo(x+(this.gameObject.transform.position.x%cellSize), canvas.height);
                }

                ctx.stroke();
        }
    }
    Update() {
        this.Draw();
    }
}

class Transform extends Component {
    constructor({ position }, gameObject) {
        super(gameObject)
        this.position = position;
        this.gameObject.transform = this;
        this.relativePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    }
    Update() {

    }
}

class RigidBody2D extends Component {
    constructor({ velocity, gravity, drag, bounce, direction, momentum, variety }, gameObject) {
        super(gameObject)
        this.velocity = velocity
        this.gravity = gravity
        this.drag = drag
        this.gameObject.RigidBody2D = this;
        this.bounce = bounce
        this.direction = direction || -1
        this.momentum = momentum || 0
        this.variety = variety || 0
    }
    Update() {
        this.speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2))
        this.velocity.x += Math.cos(this.direction) * this.momentum
        this.velocity.y += Math.sin(this.direction) * this.momentum

        this.gameObject.transform.position.x += this.velocity.x
        this.gameObject.transform.position.y += this.velocity.y

        this.velocity.x *= this.drag;
        this.velocity.y *= this.drag;
        if (this.direction != -1 && Math.random() < this.variety) {
            this.direction = Math.random() * 2 * Math.PI
            this.momentum = (Math.random())
        }
    }
    OnSquareCollisionEnter(Collider) {
        this.gameObject.transform.position.x -= this.velocity.x
        this.gameObject.transform.position.y -= this.velocity.y
        this.velocity = { x: -1 * (this.bounce * this.velocity.x), y: -1 * (this.bounce * this.velocity.y) };
    }
    OnCircleCollisionEnter(Collider) {
        this.otherCollider = Collider;

        this.dx = Math.abs(this.otherCollider.gameObject.transform.position.x - this.gameObject.transform.position.x)
        this.dy = Math.abs(this.otherCollider.gameObject.transform.position.y - this.gameObject.transform.position.y)
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)

        if (this.distance < this.gameObject.Collider.size.x && this.gameObject.Sprite.text > this.otherCollider.gameObject.Sprite.text) {
            let index = GameObjects.indexOf(this.otherCollider.gameObject)
            GameObjects.splice(index, 1)
            index = Colliders.indexOf(this.otherCollider)
            Colliders.splice(index, 1)
            let oldSize = Player1.Sprite.size.x
            Player1.Sprite.size.x += Math.sqrt(this.otherCollider.gameObject.Sprite.text) * growthRate
            Player1.Sprite.text += this.otherCollider.gameObject.Sprite.text
            Player1.Sprite.fontSize *= Player1.Sprite.size.x / oldSize
            Player1.Components.forEach(component => {
                if (component instanceof CircleCollider) {
                    component.size.x += Math.sqrt(this.otherCollider.gameObject.Sprite.text) * growthRate
                }
            });
            CreateNewCircle(Math.floor(Math.random() * Player1.Sprite.text*10+1))
            TextBox.Sprite.text = "Yum! Number: " + this.otherCollider.gameObject.Sprite.text
        }
        else if (this.distance < this.gameObject.Collider.size.x && this.gameObject.Sprite.text < this.otherCollider.gameObject.Sprite.text) {
            let index = GameObjects.indexOf(this.otherCollider.gameObject)
            GameObjects.splice(index, 1)
            index = Colliders.indexOf(this.otherCollider)
            Colliders.splice(index, 1)
            let oldSize = Player1.Sprite.size.x
            Player1.Sprite.size.x = ((Player1.Sprite.size.x - 60) / (Math.sqrt(2) * growthRate)) + 60
            Player1.Sprite.fontSize *= Player1.Sprite.size.x / oldSize
            Player1.Sprite.text = Math.floor(Player1.Sprite.text / 2)
            Player1.Components.forEach(component => {
                if (component instanceof CircleCollider) {
                    component.size.x = ((component.size.x - 60) / (Math.sqrt(2) * growthRate)) + 60
                }
            });
            if (Player1.Sprite.text < startingNum) {
                Player1.Sprite.fontSize = 30
                Player1.Sprite.size.x = 60
                Player1.Sprite.text = startingNum;
                Player1.Components.forEach(component => {
                    if (component instanceof CircleCollider) {
                        component.size.x = Player1.Sprite.size.x;
                    }
                });
            }
            CreateNewCircle(Math.floor(Math.random() * Player1.Sprite.text*15+1))
            TextBox.Sprite.text = "Yuck Number Too Large! Number: " + this.otherCollider.gameObject.Sprite.text
        }
    }
}

class SquareCollider extends Component {
    constructor({ size }, gameObject) {
        super(gameObject)
        this.size = size
        Colliders.push(this)
    }
    Update() {
        for (let index = 0; index < Colliders.length; index++) {
            var Collider = Colliders[index];
            if (Collider != this) {
                if (this.gameObject.transform.position.x + this.size.x >= Collider.gameObject.transform.position.x && this.gameObject.transform.position.x <= Collider.gameObject.transform.position.x + Collider.size.x) {
                    if (this.gameObject.transform.position.y + this.size.y >= Collider.gameObject.transform.position.y && this.gameObject.transform.position.y <= Collider.gameObject.transform.position.y + Collider.size.y) {
                        this.OnCollisionEnter(Collider);
                    }
                }
            }
        }
    }
    OnCollisionEnter(Collider) {
        this.gameObject.OnSquareCollisionEnter(Collider)
    }
}

class CircleCollider extends Component {
    constructor({ size }, gameObject) {
        super(gameObject)
        this.size = size
        this.gameObject.Collider = this
        Colliders.push(this)
    }
    Update() {
        for (let index = 0; index < Colliders.length; index++) {
            var Collider = Colliders[index];
            if (Collider != this) {
                this.dx = Math.abs(this.gameObject.transform.position.x - Collider.gameObject.transform.position.x)
                this.dy = Math.abs(this.gameObject.transform.position.y - Collider.gameObject.transform.position.y)
                this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
                if (this.distance < (this.size.x + Collider.size.x)) {
                    this.OnCollisionEnter(Collider);
                }
            }
        }
    }
    OnCollisionEnter(Collider) {
        this.gameObject.OnCircleCollisionEnter(Collider)
    }
}

class KeyboardMovement extends Component {
    constructor({ up, down, left, right, speed }, gameObject) {
        super(gameObject);
        this.up = up
        this.down = down
        this.left = left
        this.right = right
        this.speed = speed

        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    }


    Update() {
        for (const x of Inputs) {
            if (x == this.up) {
                this.moveUp = true;
            }
            else if (x == this.down) {
                this.moveDown = true;
            }
            if (x == this.right) {
                this.moveRight = true;
            }
            else if (x == this.left) {
                this.moveLeft = true;
            }
        }

        for (const x of KeyUp) {
            if (x == this.up) {
                this.moveUp = false;
            }
            else if (x == this.down) {
                this.moveDown = false;
            }
            if (x == this.right) {
                this.moveRight = false;
            }
            else if (x == this.left) {
                this.moveLeft = false;
            }
        }
        if (this.moveUp == true) {
            this.gameObject.RigidBody2D.velocity.y += -this.speed
        }
        else if (this.moveDown == true) {
            this.gameObject.RigidBody2D.velocity.y += this.speed
        }
        else {
            // this.gameObject.RigidBody2D.velocity.y = 0
        }

        if (this.moveRight == true) {
            this.gameObject.RigidBody2D.velocity.x += this.speed
        }
        else if (this.moveLeft == true) {
            this.gameObject.RigidBody2D.velocity.x += -this.speed
        }
        else {
            // this.gameObject.RigidBody2D.velocity.x = 0
        }
    }
}

class MouseMovement extends Component {
    constructor({ speed }, gameObject) {
        super(gameObject);
        this.speed = speed
    }
    Update() {
        let angle = Math.atan2(mouseY - Player1.transform.position.y, mouseX - Player1.transform.position.x)
        let inCenter
        if (Math.hypot(mouseX - Player1.transform.position.x, mouseY+30 - Player1.transform.position.y) < Player1.Sprite.size.x / 3) {
            inCenter = true
        }
        else {
            inCenter = false
        }
        if (angle && !inCenter) {
            GameObjects.forEach(gameObject => {
                if (gameObject.name != "Circle_Red" && gameObject.RigidBody2D) {
                    gameObject.RigidBody2D.velocity.x -= Math.cos(angle) * this.speed
                    gameObject.RigidBody2D.velocity.y -= Math.sin(angle) * this.speed
                }
            });
        }
    }
}

class Clock extends Component {
    constructor({time}, gameObject) {
        super(gameObject)
        this.time = time+1
        this.updateTimer()
    }
    updateTimer() {
        if (this.time > 0) {
            this.time--
            setTimeout(() => this.updateTimer(), 1000);;
            this.gameObject.Sprite.text = "TIME REMAINING: " + this.time
        }
    }
    endGame() {
        gameOver = true;
    }
    Update() {
        if (this.time == 0) {
            TextBox.Sprite.text = "GAME OVER!"
            TextBox.Sprite.fontSize = "70"
            setTimeout(() => this.endGame(), 10);
        }
    }
}

function CreateNewCircle(value) {
    let R = Math.random() * 175 + 50
    let G = Math.random() * 175 + 50
    let B = Math.random() * 175 + 30

    let direction = ((Math.random()) * 2 * Math.PI)
    let momentum = (Math.random())

    Player2 = new GameObject({ name: "Dot" })
    Player2.AddComponent(new RigidBody2D({ 
        velocity: { x: 0, y: 0 }, 
        gravity: 0, drag: 0.75, 
        bounce: 0, 
        direction: direction, 
        momentum: momentum, 
        variety: 0.01 }, 
        Player2))

    Player2.AddComponent(new Sprite({ 
        size: { x: 60, y: 60 }, 
        color: `rgb(${R}, ${G}, ${B})`, 
        shape: "circle", 
        text: value, 
        base: Math.floor(Math.random()*9+2)}, 
        Player2))
    // Player2.AddComponent(new KeyboardMovement({ up: 's', down: 'w', left: 'd', right: 'a', speed: 4 }, Player2))
    Player2.AddComponent(new CircleCollider({ size: { x: Player2.Sprite.size.x, y: Player2.Sprite.size.y } }, Player2))

    Player2.transform.position = {
        x: ((900 * mapSize) * Math.random() - (mapSize / 2 - 0.5) * 900),
        y: ((900 * mapSize) * Math.random() - (mapSize / 2 - 0.5) * 900)
    };
    this.dx = Math.abs(Player2.transform.position.x - Player1.transform.position.x)
    this.dy = Math.abs(Player2.transform.position.y - Player1.transform.position.y)
    this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    while (this.distance < (Player1.Collider.size.x + Player2.Sprite.size.x)) {
        Player2.transform.position = { x: window.innerHeight * Math.random(), y: window.innerWidth * Math.random() };
        this.dx = Math.abs(Player2.transform.position.x - Player1.transform.position.x)
        this.dy = Math.abs(Player2.transform.position.y - Player1.transform.position.y)
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    }
    GameObjects.push(Player2)
}

function Update() {
    if (gameOver == false) {
        window.requestAnimationFrame(Update);

        for (let index = 0; index < GameObjects.length; index++) {
            GameObjects[index].Update()
        };

        Inputs = []
        KeyUp = []
    }
}

Background = new GameObject({ name: "Background" })
Background.AddComponent(new Sprite({ 
    size: { x: 2000, y: 1000 }, 
    color: "rgb(244,251,255)", 
    shape: "rect" }, 
    Background))
Background.transform.position = { x: 0, y: 0 }


BackgroundLines = new GameObject({ name: "BackgroundLines" })
BackgroundLines.AddComponent(new Sprite(
    {size:{x:30, y:30}, 
    color: "rgb(223,230,233)", 
    shape: "lines"}, 
    BackgroundLines))
BackgroundLines.AddComponent(new RigidBody2D({velocity: {x:0, y:0}, gravity:0, drag: 0.75, bounce:0}, BackgroundLines))
BackgroundLines.transform.position = {x:0, y:0}


Player1 = new GameObject({ name: "Circle_Red" })
Player1.AddComponent(new RigidBody2D({ velocity: { x: 0, y: 0 }, gravity: 0, drag: 0.75, bounce: 0 }, Player1))
Player1.AddComponent(new Sprite({ 
    size: { x: 60, y: 60 }, 
    color: "rgb(225, 10, 10)", 
    shape: "circle", 
    text: startingNum }, 
    Player1))
Player1.AddComponent(new CircleCollider({ size: { x: Player1.Sprite.size.x, y: Player1.Sprite.size.y } }, Player1))
Player1.AddComponent(new MouseMovement({ speed: 1.7 }, Player1))


TextBox = new GameObject({ name: "TextBox" })
TextBox.AddComponent(new Sprite({ 
    size: { x: 0, y: 0 }, 
    color: "white", 
    shape: "circle", 
    text: "Eat Smaller Circles to Get Bigger!", 
    textColor: "black", 
    fontSize: 50, 
    globalAlpha: 0.75 }, TextBox))
TextBox.transform.position = { x: canvas.width / 2, y: canvas.height / 10 }


Timer = new GameObject({name: "Timer"})
Timer.AddComponent(new Sprite(
    {size: {x:0, y:0}, 
    color: "white", 
    shape:"circle", 
    text:"TIME REMAINING: 60", 
    textColor: "black", 
    fontSize: 60, 
    globalAlpha:0.75}, 
    Timer))
Timer.AddComponent(new Clock({time: 40}, Timer))
Timer.transform.position = {x: canvas.width/2, y:canvas.height*9/10}


GameObjects.push(Background);
GameObjects.push(BackgroundLines)

for (let i = 0; i < mapSize * mapSize * density*1.5/7; i++) {
    CreateNewCircle(Math.floor(Math.random() * (Player1.Sprite.text-1))+1)
}
for (let i = 0; i < mapSize * mapSize * density*5/7; i++) {
    CreateNewCircle(Math.floor(Math.random() * Player1.Sprite.text*10+1))
}
for (let i = 0; i < mapSize * mapSize * density/10; i++) {
    CreateNewCircle(Math.floor(Math.random() * Player1.Sprite.text*40+1))
}

GameObjects.push(Player1);
GameObjects.push(TextBox)
GameObjects.push(Timer)





Update();

window.addEventListener('keydown', (event) => {
    Inputs.push(event.key)
})
window.addEventListener('keyup', (event) => {
    KeyUp.push(event.key)
})
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
})