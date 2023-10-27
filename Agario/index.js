const ctx = document.querySelector("canvas");
const c = ctx.getContext('2d');

ctx.width = window.innerWidth;
ctx.height = window.innerHeight;

const Colliders = []
const GameObjects = []
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

function UpdatePlayerVel(player)
{
if(P1MoveRight == true)
{
Player1.RigidBody2D.velocity.x = 5;
}
else if(P1MoveLeft == true)
{
Player1.RigidBody2D.velocity.x = -5;
}
else
Player1.RigidBody2D.velocity.x = 0;
}

class GameObject
{
constructor({name})
{
this.name = name;
this.AddComponent(new Transform({position: {x:0,y:0}}, this));
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
    else if (this.name == "Circle_Blue") {
        
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
        this.velocity.y += this.gravity
        this.velocity.x *= this.drag;
        this.velocity.y *= this.drag;
        this.gameObject.transform.position.x += this.velocity.x
        this.gameObject.transform.position.y += this.velocity.y
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
if(Collider != this)
if(this.gameObject.transform.position.x + this.size.x >= Collider.gameObject.transform.position.x && this.gameObject.transform.position.x <= Collider.gameObject.transform.position.x + Collider.size.x)
{
if(this.gameObject.transform.position.y + this.size.y >= Collider.gameObject.transform.position.y && this.gameObject.transform.position.y <= Collider.gameObject.transform.position.y + Collider.size.y)
{
this.OnCollisionEnter(Collider);
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
    Player2 = new GameObject({name: "Circle_Blue"})
    Player2.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0.75, bounce: 0}, Player2))
    Player2.AddComponent(new Sprite({size: {x: 50, y: 50}, color: "blue", shape: "circle"}, Player2))
    Player2.AddComponent(new Movement({up: 's', down: 'w', left: 'd', right: 'a', speed: 4}, Player2))
    Player2.AddComponent(new CircleCollider({size: {x: Player2.Sprite.size.x, y: Player2.Sprite.size.y}}, Player2))

    Player2.transform.position = {x:(window.innerHeight*5)*Math.random(), y:(window.innerWidth*5)*Math.random()};
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
}
Background = new GameObject({name: "Background"})
Background.AddComponent(new Sprite({size: {x: 2000, y: 1000}, color: "black", shape: "rect"}, Background))

Player1 = new GameObject({name: "Circle_Red"})
Player1.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0.75, bounce: 0}, Player1))
Player1.AddComponent(new Sprite({size: {x: 80, y: 80}, color: "red", shape: "circle"}, Player1))
Player1.AddComponent(new CircleCollider({size: {x: Player1.Sprite.size.x, y: Player1.Sprite.size.y}}, Player1))


Player1.transform.position = {x:window.innerWidth/2, y:window.innerHeight/2};

GameObjects.push(Background);

for (let i = 0; i < 100; i++) {
    CreateNewCircle()
}

GameObjects.push(Player1);




Update();

window.addEventListener('keydown', (event) => {
Inputs.push(event.key)
})
window.addEventListener('keyup', (event) => {
KeyUp.push(event.key)
})

/*c.lineWidth = 5;
c.beginPath()
c.moveTo(0,0)
c.lineTo(Math.pow(i*10),0)
c.stroke();*/