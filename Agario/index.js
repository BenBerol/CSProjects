const ctx = document.querySelector("canvas");
const c = ctx.getContext('2d');

ctx.width = window.innerWidth;
ctx.height = window.innerHeight;

const Colliders = []
const GameObjects = []
const mapSize = 3
const density = 8
const speed = 14
var Inputs = []
var KeyUp = []
var P1MoveRight = false
var P1MoveLeft = false
var P2MoveRight = false
var P2MoveLeft = false



c.font = "100px serif";
c.fillStyle = "orange";

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
    constructor({size, color, shape}, gameObject)
    {
        super(gameObject)
        this.size = size;
        this.color = color;
        this.shape = shape;
        this.gameObject.Sprite = this;
    }
    Draw()
    {
        c.fillStyle = this.color;
        if (this.shape == "rect") {
            c.fillRect(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, this.size.y);
        }
        if (this.shape == "circle") {
                c.beginPath();
                c.arc(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, 0, 2 * Math.PI);
                c.fill();
                c.closePath();
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
        while(this.speed > speed) {
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

        dx = Math.abs(this.otherCollider.gameObject.transform.position.x-this.gameObject.transform.position.x)
        dy = Math.abs(this.otherCollider.gameObject.transform.position.y-this.gameObject.transform.position.y)
        distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.gameObject.Collider.size.x) {
            let index = GameObjects.indexOf(this.otherCollider.gameObject)
            GameObjects.splice(index, 1)
            index = Colliders.indexOf(this.otherCollider)
            Colliders.splice(index, 1)
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
            this.gameObject.RigidBody2D.velocity.y = -this.speed  
        }
        else if (this.moveDown == true) {
            this.gameObject.RigidBody2D.velocity.y = this.speed
        }
        else {
            this.gameObject.RigidBody2D.velocity.y = 0
        }

        if (this.moveRight == true) {
            this.gameObject.RigidBody2D.velocity.x = this.speed
        }
        else if (this.moveLeft == true) {
            this.gameObject.RigidBody2D.velocity.x = -this.speed
        }
        else {
            this.gameObject.RigidBody2D.velocity.x = 0
        }
    }
}

function CreateNewCircle()
{
    let R = Math.random()*255
    let G = Math.random()*255
    let B = Math.random()*255

    Player2 = new GameObject({name: "Dot"})
    Player2.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0, bounce: 0}, Player2))
    Player2.AddComponent(new Sprite({size: {x: 50, y: 50}, color: `rgb(${R}, ${G}, ${B})`, shape: "circle"}, Player2))
    Player2.AddComponent(new Movement({up: 's', down: 'w', left: 'd', right: 'a', speed: speed*2}, Player2))
    Player2.AddComponent(new CircleCollider({size: {x: Player2.Sprite.size.x, y: Player2.Sprite.size.y}}, Player2))

    Player2.transform.position = {
        x:((window.innerWidth*mapSize)*Math.random()-(mapSize/2 - 0.5)*window.innerWidth)*0.95, 
        y:((window.innerHeight*mapSize)*Math.random()-(mapSize/2 - 0.5)*window.innerHeight)*0.95
    };
    dx = Math.abs(Player2.transform.position.x-Player1.transform.position.x)
    dy = Math.abs(Player2.transform.position.y-Player1.transform.position.y)
    distance = Math.sqrt(dx * dx + dy * dy)
    while(distance < (Player1.Collider.size.x + Player2.Sprite.size.x))
    {
        Player2.transform.position = {x:window.innerHeight*Math.random(), y:window.innerWidth*Math.random()};
        dx = Math.abs(Player2.transform.position.x-Player1.transform.position.x)
        dy = Math.abs(Player2.transform.position.y-Player1.transform.position.y)
        distance = Math.sqrt(dx * dx + dy * dy)
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

    console.log(Player1.transform.relativePosition)
}

Background = new GameObject({name: "Background"})
Background.AddComponent(new Sprite({size: {x: 2000, y: 1000}, color: "white", shape: "rect"}, Background))
Background.transform.position = {x: 0, y:0}

LeftWall = new GameObject({name: "leftWall"})
LeftWall.AddComponent(new Sprite ({size: {x:1000, y:window.innerHeight*mapSize}, color: "black", shape: "rect"}, LeftWall))
LeftWall.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0, bounce: 0}, LeftWall))
LeftWall.AddComponent(new Movement({up: 's', down: 'w', left: 'd', right: 'a', speed: speed*2}, LeftWall))
LeftWall.transform.position = {x: -window.innerWidth * (mapSize-1)/2-LeftWall.Sprite.size.x, y: -window.innerHeight * (mapSize-1)/2}

RightWall = new GameObject({name: "RightWall"})
RightWall.AddComponent(new Sprite ({size: {x:1000, y:window.innerHeight*mapSize}, color: "black", shape: "rect"}, RightWall))
RightWall.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0, bounce: 0}, RightWall))
RightWall.AddComponent(new Movement({up: 's', down: 'w', left: 'd', right: 'a', speed: speed*2}, RightWall))
RightWall.transform.position = {x: window.innerWidth * (mapSize+1)/2, y: -window.innerHeight * (mapSize-1)/2}

Player1 = new GameObject({name: "Circle_Red"})
Player1.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0, bounce: 0}, Player1))
Player1.AddComponent(new Sprite({size: {x: 80, y: 80}, color: "rgb(225, 10, 10)", shape: "circle"}, Player1))
Player1.AddComponent(new CircleCollider({size: {x: Player1.Sprite.size.x, y: Player1.Sprite.size.y}}, Player1))
Player1.AddComponent(new Movement({up: 'w', down: 's', left: 'a', right: 'd', speed: speed*2}, Player1))

GameObjects.push(Background);

for (let i = 0; i < mapSize*mapSize*density; i++) {
    CreateNewCircle()
}

GameObjects.push(Player1);
GameObjects.push(LeftWall)
GameObjects.push(RightWall)




Update();

window.addEventListener('keydown', (event) => {
    Inputs.push(event.key)
})
window.addEventListener('keyup', (event) => {
    KeyUp.push(event.key)
})