const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const Colliders = []
const GameObjects = []
const mapSize = 12
const density = 8
const maxSpeed = 14
const growthRate = 0.25
let Player1;
let Background;
let Player2;
let TextBox;
var Inputs = []
var KeyUp = []
var P1MoveRight = false
var P1MoveLeft = false
var P2MoveRight = false
var P2MoveLeft = false



ctx.font = "100px serif";
ctx.fillStyle = "orange";

function Create2DArray(rows, columns)
{
    const matrix = [];

    for (let i = 0; i < rows; i++) {
        matrix[i] = []; // Create an empty row
        for (let j = 0; j < columns; j++)
        {
            matrix[i][j] = 0; // Fill each cell with a value (e.g., 0)
        }
    }
    return matrix
}

class GameObject
{
    constructor({name})
    {
        this.name = name;
        this.AddComponent(new Transform({position: {x:window.innerWidth/2,y:window.innerHeight/2}}, this));
    }
    Components = []
    transform;
    RigidBody2D;
    Sprite;

    Update()
    {
        for(let index = 0; index < this.Components.length; index++)
        {
            this.Components[index].Update()
        }
    }
    OnSquareCollisionEnter(Collider)
    {
        this.RigidBody2D.OnSquareCollisionEnter(Collider);
    }
    OnCircleCollisionEnter(Collider)
    {
        if (this.name == "Circle_Red") {
            this.RigidBody2D.OnCircleCollisionEnter(Collider);
        }
        else if (this.name == "Dot") {
            
        }
    }
    AddComponent(Component)
    {
        this.Components[this.Components.length] = Component;
    }
}

class Component {
    constructor(gameObject) {
        this.gameObject = gameObject;
    }
}

class Sprite extends Component
{
    constructor({size, color, shape, text, textColor, fontSize}, gameObject)
    {
        super(gameObject)
        this.size = size;
        this.color = color;
        this.shape = shape;
        this.text = text || null
        this.textColor = textColor || "black"
        this.fontSize = fontSize || 30
        this.gameObject.Sprite = this;
    }
    Draw()
    {
        ctx.fillStyle = this.color;
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
                ctx.fillText(this.text, this.gameObject.transform.position.x, this.gameObject.transform.position.y);
            }
        }
    }
    Update()
    {
        this.Draw();
    }
}

class Transform extends Component
{
    constructor({position}, gameObject)
    {
        super(gameObject)
        this.position = position;
        this.gameObject.transform = this;
        this.relativePosition = {x:window.innerWidth/2, y:window.innerHeight/2}
    }
    Update() {

    }
}

class RigidBody2D extends Component
{
    constructor({velocity, gravity, drag, bounce}, gameObject)
    {
        super(gameObject)
        this.velocity = velocity
        this.gravity = gravity
        this.drag = drag
        this.gameObject.RigidBody2D = this;
        this.bounce = bounce
    }
    Update()
    {
        this.speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2))
        while(this.speed > maxSpeed) {
            this.velocity.x *= 0.99
            this.velocity.y *= 0.99
            this.speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2))
        }
        if (this.gameObject.name == "Circle_Red") {
            this.gameObject.transform.relativePosition.x += this.velocity.x
            this.gameObject.transform.relativePosition.y += this.velocity.y
        }
        else {
            this.gameObject.transform.position.x += this.velocity.x
            this.gameObject.transform.position.y += this.velocity.y
        }
        this.velocity.y += this.gravity
        this.velocity.x *= this.drag;
        this.velocity.y *= this.drag;
    }
    OnSquareCollisionEnter(Collider)
    {
        this.gameObject.transform.position.x -= this.velocity.x
        this.gameObject.transform.position.y -= this.velocity.y
        this.velocity = {x: -1*(this.bounce*this.velocity.x), y: -1*(this.bounce * this.velocity.y)};
    }
    OnCircleCollisionEnter(Collider) 
    {
        this.otherCollider = Collider;

        this.dx = Math.abs(this.otherCollider.gameObject.transform.position.x-this.gameObject.transform.position.x)
        this.dy = Math.abs(this.otherCollider.gameObject.transform.position.y-this.gameObject.transform.position.y)
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)

        if (this.distance < this.gameObject.Collider.size.x && this.gameObject.Sprite.text > this.otherCollider.gameObject.Sprite.text) {
            let index = GameObjects.indexOf(this.otherCollider.gameObject)
            GameObjects.splice(index, 1)
            index = Colliders.indexOf(this.otherCollider)
            Colliders.splice(index, 1)
            this.scaleFactor = this.otherCollider.gameObject.Sprite.text/Player1.Sprite.text
            console.log("*" + (1.0+this.scaleFactor))
            this.scaleFactor = Math.sqrt(1+this.scaleFactor*growthRate)
            Player1.Sprite.size.x *= this.scaleFactor
            Player1.Sprite.text += this.otherCollider.gameObject.Sprite.text
            Player1.Sprite.fontSize *= this.scaleFactor
            Player1.Components.forEach(component => {
                if (component instanceof CircleCollider) {
                    component.size.x *= this.scaleFactor;
                }
            });
        }
        else if (this.distance < this.gameObject.Collider.size.x && this.gameObject.Sprite.text < this.otherCollider.gameObject.Sprite.text) {
            let index = GameObjects.indexOf(this.otherCollider.gameObject)
            GameObjects.splice(index, 1)
            index = Colliders.indexOf(this.otherCollider)
            Colliders.splice(index, 1)
            this.scaleFactor = this.otherCollider.gameObject.Sprite.text/Player1.Sprite.text
            console.log("*" + (1.0+this.scaleFactor))
            this.scaleFactor = Math.sqrt(1+this.scaleFactor*growthRate)
            Player1.Sprite.size.x *= this.scaleFactor
            Player1.Sprite.text += this.otherCollider.gameObject.Sprite.text
            Player1.Sprite.fontSize *= this.scaleFactor
            Player1.Components.forEach(component => {
                if (component instanceof CircleCollider) {
                    component.size.x *= this.scaleFactor;
                }
            });
        }
    }
}

class SquareCollider extends Component
{
    constructor({size}, gameObject)
    {
        super(gameObject)
        this.size = size
        Colliders.push(this)
    }
    Update()
    {
        for(let index = 0; index < Colliders.length; index++)
        {
            var Collider = Colliders[index];
            if(Collider != this) {
                if(this.gameObject.transform.position.x + this.size.x >= Collider.gameObject.transform.position.x && this.gameObject.transform.position.x <= Collider.gameObject.transform.position.x + Collider.size.x)
                {
                    if(this.gameObject.transform.position.y + this.size.y >= Collider.gameObject.transform.position.y && this.gameObject.transform.position.y <= Collider.gameObject.transform.position.y + Collider.size.y)
                    {
                        this.OnCollisionEnter(Collider);
                        console.log("hit")
                    }
                }
            }
        }
    }
    OnCollisionEnter(Collider)
    {
        this.gameObject.OnSquareCollisionEnter(Collider)
    }
}

class CircleCollider extends Component {
    constructor({size}, gameObject) 
    {
        super(gameObject)
        this.size = size
        this.gameObject.Collider = this
        Colliders.push(this)
    }
    Update()
    {
            for(let index = 0; index < Colliders.length; index++)
            {
                var Collider = Colliders[index];
                if(Collider != this) {
                    this.dx = Math.abs(this.gameObject.transform.position.x-Collider.gameObject.transform.position.x)
                    this.dy = Math.abs(this.gameObject.transform.position.y-Collider.gameObject.transform.position.y)
                    this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
                    if(this.distance < (this.size.x + Collider.size.x))
                    {
                        this.OnCollisionEnter(Collider);
                    }
                }
            }
    }
    OnCollisionEnter(Collider)
    {
        this.gameObject.OnCircleCollisionEnter(Collider)
    }
}

class Movement extends Component {
    constructor({up, down, left, right, speed}, gameObject)
    {
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
            this.gameObject.RigidBody2D.velocity.y = 0
        }

        if (this.moveRight == true) {
            this.gameObject.RigidBody2D.velocity.x += this.speed
        }
        else if (this.moveLeft == true) {
            this.gameObject.RigidBody2D.velocity.x += -this.speed
        }
        else {
            this.gameObject.RigidBody2D.velocity.x = 0
        }
    }
}

function CreateNewCircle()
{
    let R = Math.random()*175+50
    let G = Math.random()*175+50
    let B = Math.random()*175+30

    Player2 = new GameObject({name: "Dot"})
    Player2.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0.75, bounce: 0}, Player2))
    Player2.AddComponent(new Sprite({size: {x: 50, y: 50}, color: `rgb(${R}, ${G}, ${B})`, shape: "circle", text:Math.floor(Math.random()*1000+1)}, Player2))
    Player2.AddComponent(new Movement({up: 's', down: 'w', left: 'd', right: 'a', speed: 4}, Player2))
    Player2.AddComponent(new CircleCollider({size: {x: Player2.Sprite.size.x, y: Player2.Sprite.size.y}}, Player2))

    Player2.transform.position = {
        x:((window.innerWidth*mapSize)*Math.random()-(mapSize/2 - 0.5)*window.innerWidth)*0.95, 
        y:((window.innerHeight*mapSize)*Math.random()-(mapSize/2 - 0.5)*window.innerHeight)*0.95
    };
    this.dx = Math.abs(Player2.transform.position.x-Player1.transform.position.x)
    this.dy = Math.abs(Player2.transform.position.y-Player1.transform.position.y)
    this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    while(this.distance < (Player1.Collider.size.x + Player2.Sprite.size.x))
    {
        Player2.transform.position = {x:window.innerHeight*Math.random(), y:window.innerWidth*Math.random()};
        this.dx = Math.abs(Player2.transform.position.x-Player1.transform.position.x)
        this.dy = Math.abs(Player2.transform.position.y-Player1.transform.position.y)
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    }
    GameObjects.push(Player2)
}

function Update()
{
    window.requestAnimationFrame(Update);

    for(let index = 0; index < GameObjects.length; index++)
    {
        GameObjects[index].Update()
    };

    Inputs = []
    KeyUp = []
}

Background = new GameObject({name: "Background"})
Background.AddComponent(new Sprite({size: {x: 2000, y: 1000}, color: "white", shape: "rect"}, Background))
Background.transform.position = {x: 0, y:0}

// LeftWall = new GameObject({name: "leftWall"})
// LeftWall.AddComponent(new Sprite ({size: {x:1000, y:10000000}, color: "black", shape: "rect"}, LeftWall))
// LeftWall.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0.75, bounce: 0}, LeftWall))
// LeftWall.AddComponent(new Movement({up: 's', down: 'w', left: 'd', right: 'a', speed: 4}, LeftWall))
// LeftWall.transform.position = {x: -window.innerWidth * (mapSize-1)/2-LeftWall.Sprite.size.x, y: -5000000}

// RightWall = new GameObject({name: "RightWall"})
// RightWall.AddComponent(new Sprite ({size: {x:1000, y:10000000}, color: "black", shape: "rect"}, RightWall))
// RightWall.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0.75, bounce: 0}, RightWall))
// RightWall.AddComponent(new Movement({up: 's', down: 'w', left: 'd', right: 'a', speed: 4}, RightWall))
// RightWall.transform.position = {x: window.innerWidth * (mapSize+1)/2, y: -5000000}

// TopWall = new GameObject({name: "TopWall"})
// TopWall.AddComponent(new Sprite ({size: {x:10000000, y:1000}, color: "black", shape: "rect"}, TopWall))
// TopWall.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0.75, bounce: 0}, TopWall))
// TopWall.AddComponent(new Movement({up: 's', down: 'w', left: 'd', right: 'a', speed: 4}, TopWall))
// TopWall.transform.position = {x: -5000000, y: -window.innerHeight * (mapSize-1)/2-TopWall.Sprite.size.x}

Player1 = new GameObject({name: "Circle_Red"})
Player1.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0.75, bounce: 0}, Player1))
Player1.AddComponent(new Sprite({size: {x: 80, y: 80}, color: "rgb(225, 10, 10)", shape: "circle", text: 50}, Player1))
Player1.AddComponent(new CircleCollider({size: {x: Player1.Sprite.size.x, y: Player1.Sprite.size.y}}, Player1))
Player1.AddComponent(new Movement({up: 'w', down: 's', left: 'a', right: 'd', speed: 4}, Player1))



TextBox = new GameObject({name: "TextBox"})
TextBox.AddComponent(new Sprite({size: {x: 0, y:0}, color: "white", shape: "circle", text:"hi", textColor: "black"}, TextBox))
TextBox.transform.position = {x: canvas.width/2, y: canvas.height/10}
// TextBox.AddComponent(new Text({}))

GameObjects.push(Background);

for (let i = 0; i < mapSize*mapSize*density; i++) {
    CreateNewCircle()
}

GameObjects.push(Player1);
GameObjects.push(TextBox)
// GameObjects.push(LeftWall)
// GameObjects.push(RightWall)
// GameObjects.push(TopWall)




Update();

window.addEventListener('keydown', (event) => {
    Inputs.push(event.key)
})
window.addEventListener('keyup', (event) => {
    KeyUp.push(event.key)
})