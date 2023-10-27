//DISCLAIMER: Asked ChatGPT for advice on how to calculate orthagonal collision vectors but didn't copy paste
//test

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
var gameOver = false
var maxVel = 35

function Create2DArray(rows, columns)
{
    const matrix = [];

    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < columns; j++) 
        {
            matrix[i][j] = 0;
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
    Collider;
    Sprite;
    Text;
    
    Update()
    {
        for(let index = 0; index < this.Components.length; index++)
        {
            this.Components[index].Update()
        }
    }
    OnCollisionEnter(Collider)
    {
        this.RigidBody2D.OnCollisionEnter(Collider);
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

        if (this.shape == "circle") {
            c.beginPath();
            c.arc(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, 0, 2 * Math.PI);
            c.fill();
            c.closePath();
        }
        else if (this.shape == "rect") {
            c.fillRect(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, this.size.y);
        }
        else if (this.shape == "emptyCircle") {
            c.lineWidth = 6
            c.strokeStyle = this.color
            c.beginPath();
            c.arc(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, 0, 2 * Math.PI);
            c.stroke();
            c.closePath();

            c.fillStyle = "rgb(230, 230, 230)"
            c.beginPath();
            c.arc(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, 0, 2 * Math.PI);
            c.fill();
            c.closePath();
        }
        else if (this.shape == "dashedLine") {
            c.lineWidth = this.size.x
            c.strokeStyle = this.color
            var startX = window.innerWidth/2 - this.size.x/2
            var startY = 0
            for (var i = 0; i < 40; i++) {
                if (i%2 == 0) {
                    c.beginPath()
                    c.moveTo(startX, startY)
                    c.lineTo(startX, startY+window.innerHeight/40)
                    c.stroke()
                }
            startY += window.innerHeight/40
            }
        }
        else if (this.shape == "paddle") {
            c.beginPath();
            c.arc(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, 0, 2 * Math.PI);
            c.fill();
            c.closePath();

            c.lineWidth = 4
            c.strokeStyle = "black"
            c.beginPath();
            c.arc(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x/2, 0, 2 * Math.PI);
            c.stroke();
            c.closePath();
        }
        else if (this.shape == "dots") {
            var startX = this.gameObject.transform.position.x;
            var startY = this.gameObject.transform.position.y;
            const dx = window.innerWidth/30
            var row = 0;
            for (var i = 1; i < 900; i++) {
                c.beginPath();
                c.arc(startX, startY, this.size.x, 0, 2 * Math.PI);
                c.fill();
                c.closePath();

                if (i%20 == 0) {
                    startY = this.gameObject.transform.position.y
                    startX += dx
                }
                startY += dx
            }
        }
    }
    Update()
    {
        this.Draw();
    }
}

class Text extends Component 
{
    constructor({size, color, font, text, value}, gameObject) 
    {
        super(gameObject)
        this.size = size;
        this.color = color;
        this.font = font;
        this.text = text;
        this.value = value
        this.gameObject.Text = this;
    }
    Draw() 
    {
        c.fillStyle = this.color;
        c.font = this.size + "px " + this.font
        
        if (this.gameObject == DragScore) {
            this.value = ((1-Puck.RigidBody2D.drag)*100).toFixed(3)
        }
        else if (this.gameObject == MaxSpeed) {
            this.value = (maxVel).toFixed(3)
        }

        c.fillText(this.text + this.value, this.gameObject.transform.position.x, this.gameObject.transform.position.y)
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
        var totalVel = Math.sqrt(this.velocity.x * this.velocity.x+ this.velocity.y * this.velocity.y)

        if (this.gameObject == Player1 && Player1.Collider.size.x + Player1.transform.position.x + this.velocity.x > window.innerWidth/2) {
            Player1.RigidBody2D.velocity.x = 0;
        }

        if (this.gameObject == Player2 && Player2.transform.position.x - Player2.Collider.size.x + this.velocity.x < window.innerWidth/2) {
            this.velocity.x = 0;
        }
        while (totalVel > maxVel && this.gameObject == Puck) {
            this.velocity.x *= 0.975
            this.velocity.y *= 0.975
            totalVel = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y)
        }
        this.gameObject.transform.position.x += this.velocity.x
        this.gameObject.transform.position.y += this.velocity.y

        if ((this.gameObject.transform.position.y < this.gameObject.Collider.size.y) || (this.gameObject.transform.position.y + this.gameObject.Collider.size.y > window.innerHeight)) {
            if (this.gameObject.transform.position.y < window.innerHeight/2){
                this.gameObject.transform.position.y -= this.velocity.y-1;
            }
            else {
                this.gameObject.transform.position.y -= this.velocity.y+1;
            }
            this.velocity.y *= -1;
        }

        if (this.gameObject.transform.position.x < -20 && this.gameObject != Puck) {
            this.gameObject.transform.position.x -= this.velocity.x - 1
            this.velocity.x = 0
        }

        if (this.gameObject.transform.position.x > window.innerWidth+20 && this.gameObject != Puck) {
            this.gameObject.transform.position.x -= this.velocity.x + 1
            this.velocity.x = 0
        }

        if (this.gameObject == Puck && this.drag < 0.99) {
            this.drag += 0.00002
        }
        else if (this.gameObject == Puck){
            this.drag = 0.99
        }
    }

    OnCollisionEnter(Collider)
    {
        this.otherCollider = Collider;

        var totalVelX = this.velocity.x - this.otherCollider.gameObject.RigidBody2D.velocity.x;
        var totalVelY = this.velocity.y - this.otherCollider.gameObject.RigidBody2D.velocity.y;
        
        var orthagonalVectorX = this.otherCollider.gameObject.transform.position.x - this.gameObject.transform.position.x;
        var orthagonalVectorY = this.otherCollider.gameObject.transform.position.y - this.gameObject.transform.position.y;

        var orthagonalVectorLength = Math.sqrt(orthagonalVectorX * orthagonalVectorX + orthagonalVectorY*orthagonalVectorY);

        orthagonalVectorX /= orthagonalVectorLength;
        orthagonalVectorY /= orthagonalVectorLength;

        var totalVelAlongOrthagonal = orthagonalVectorX * totalVelX + orthagonalVectorY * totalVelY;

        var dVelX = -2 * totalVelAlongOrthagonal * orthagonalVectorX;
        var dVelY = -2 * totalVelAlongOrthagonal * orthagonalVectorY;

        this.gameObject.transform.position.x -= this.velocity.x;
        this.gameObject.transform.position.y -= this.velocity.y;

        this.velocity.x += dVelX;
        this.velocity.y += dVelY;
        this.otherCollider.gameObject.RigidBody2D.velocity.x -= dVelX;
        this.otherCollider.gameObject.RigidBody2D.velocity.y -= dVelY;

        this.velocity.x *= this.bounce;
        this.velocity.y *= this.bounce;
        this.otherCollider.gameObject.RigidBody2D.velocity.x *= this.otherCollider.gameObject.RigidBody2D.bounce;
        this.otherCollider.gameObject.RigidBody2D.velocity.y *= this.otherCollider.gameObject.RigidBody2D.bounce;
    }
}

class Collider extends Component
{
    constructor({size, type}, gameObject) 
    {
        super(gameObject)
        this.size = size
        this.type = type
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
        this.gameObject.OnCollisionEnter(Collider)
    }
}

class PlayerMovement extends Component {
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

        if (this.moveRight == true) {
            this.gameObject.RigidBody2D.velocity.x += this.speed
        }
        else if (this.moveLeft == true) {
            this.gameObject.RigidBody2D.velocity.x += -this.speed
        }
    }
}

class Scorer extends Component {
    constructor({winScore}, gameObject) {
        super(gameObject)
        this.winScore = winScore
    }

    Update() {
        if (this.gameObject.transform.position.x + this.gameObject.Collider.size.x * 2 <= 50) 
        {
            this.gameObject.transform.position = {x: window.innerWidth*1/5, y: window.innerHeight/2+Math.random()*2-1};
            this.gameObject.RigidBody2D.velocity = {x: 0, y: 0}
            this.gameObject.RigidBody2D.drag = 0.96;
            maxVel = 30

            Player1.transform.position = {x: window.innerWidth/15, y: window.innerHeight/2};
            Player1.RigidBody2D.velocity = {x: 0, y: 0}
            
            Player2.transform.position = {x:window.innerWidth*14/15, y: window.innerHeight/2};
            Player2.RigidBody2D.velocity = {x:0, y:0}

            P2Score.Text.value += 1;
        }
        else if (this.gameObject.transform.position.x - this.gameObject.Collider.size.x * 2 >= window.innerWidth-50) 
        {
            this.gameObject.transform.position = {x: window.innerWidth*4/5, y: window.innerHeight/2+Math.random()*2-1};
            this.gameObject.RigidBody2D.velocity = {x: 0, y: 0}
            this.gameObject.RigidBody2D.drag = 0.97;
            maxVel = 30

            Player1.transform.position = {x: window.innerWidth/15, y: window.innerHeight/2};
            Player1.RigidBody2D.velocity = {x: 0, y: 0}
            
            Player2.transform.position = {x:window.innerWidth*14/15, y: window.innerHeight/2};
            Player2.RigidBody2D.velocity = {x:0, y:0}

            P1Score.Text.value += 1;
        }

        if ((this.gameObject.transform.position.y < window.innerHeight/4+25 || this.gameObject.transform.position.y > window.innerHeight*3/4-25) && this.gameObject.transform.position.x + this.gameObject.Collider.size.x >= window.innerWidth) 
        {
            this.gameObject.transform.position.x -= this.gameObject.RigidBody2D.velocity.x - 2
            this.gameObject.RigidBody2D.velocity.x *= -1;
        }
        else if ((this.gameObject.transform.position.y < window.innerHeight/4+25 || this.gameObject.transform.position.y > window.innerHeight*3/4-25) && this.gameObject.transform.position.x - this.gameObject.Collider.size.x <= 0) 
        {
            this.gameObject.transform.position.x -= this.gameObject.RigidBody2D.velocity.x - 2
            this.gameObject.RigidBody2D.velocity.x *= -1;
        }

        if (P2Score.Text.value >= this.winScore) {
            c.fillStyle = "orange"
            c.font = "100px Courier New"
            c.fillText("Player 2 Wins!", window.innerWidth/2-400, window.innerHeight/2)
            gameOver = true
        }

        if (P1Score.Text.value >= this.winScore) {
            c.fillStyle = "orange"
            c.font = "100px Courier New"
            c.fillText("Player 1 Wins!", window.innerWidth/2-400, window.innerHeight/2)
            gameOver = true
        }

    }
    
    
}

function Update()
{
    if (gameOver == false) {
        window.requestAnimationFrame(Update);
    }

    for(let index = 0; index < GameObjects.length; index++)
    {
        GameObjects[index].Update()
    };

   if (maxVel < 50) {    
    maxVel += 0.025
    }
    else {
        maxVel = 50
    }

    Inputs = []
    KeyUp = []
}


Background = new GameObject({name: "Background"})
Background.AddComponent(new Sprite({size: {x: 2000, y: 1000}, color: "rgb(230, 230, 230)", shape: "rect"}, Background))

Player1 = new GameObject({name: "Paddle_Red"})
Player1.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0.825, bounce: 0.1}, Player1))
Player1.AddComponent(new Sprite({size: {x: 75, y: 75}, color: "red", shape: "paddle"}, Player1))
Player1.AddComponent(new Collider({size: {x: 75, y: 75}}, Player1))
Player1.AddComponent(new PlayerMovement({up: 'w', down: 's', left: 'a', right: 'd', speed: 4}, Player1))

Player1.transform.position = {x: window.innerWidth/5, y: window.innerHeight/2};

Player2 = new GameObject({name: "Paddle_Blue"})
Player2.AddComponent(new RigidBody2D({velocity: {x:0,y:0}, gravity: 0, drag: 0.825, bounce: 0.1}, Player2))
Player2.AddComponent(new Sprite({size: {x: 75, y: 75}, color: "blue", shape: "paddle"}, Player2))
Player2.AddComponent(new Collider({size: {x: 75, y: 75}}, Player2))
Player2.AddComponent(new PlayerMovement({up: 'i', down: 'k', left: 'j', right: 'l', speed: 4}, Player2))

Player2.transform.position = {x:window.innerWidth*4/5, y: window.innerHeight/2};

Puck = new GameObject({name: "Puck_Black"})
Puck.AddComponent(new RigidBody2D({velocity: {x:0, y: 0}, gravity: 0, drag: 0.97, bounce: 1}, Puck))
Puck.AddComponent(new Sprite({size: {x: 40, y: 40}, color: "black", shape: "circle"}, Puck))
Puck.AddComponent(new Collider({size: {x: 40, y: 40}}, Puck))
Puck.AddComponent(new Scorer({winScore: 5}, Puck))

Puck.transform.position = {x: window.innerWidth/2, y: window.innerHeight/2+Math.random()*2-1}

TopWall = new GameObject({name: "TopWall"})
TopWall.AddComponent(new Sprite({size: {x: window.innerWidth, y: 1}, color: "black", shape: "rect"}, TopWall))

BottomWall = new GameObject({name: "BottomWall"})
BottomWall.AddComponent(new Sprite({size: {x: window.innerWidth, y: 1}, color: "black", shape: "rect"}, BottomWall))

BottomWall.transform.position = {x: 0, y: window.innerHeight-BottomWall.Sprite.size.y}

MiddleLine = new GameObject({name: "MiddleLine"})
MiddleLine.AddComponent(new Sprite ({size: {x: 6, y: window.innerHeight}, color: "rgb(255,60,60)", shape: "dashedLine"}, MiddleLine))

MiddleLine.transform.position = {x: window.innerWidth/2-MiddleLine.Sprite.size.x/2, y: 0}

CenterCircle = new GameObject({name: "CenterCircle"})
CenterCircle.AddComponent(new Sprite ({size: {x:150, y: 150}, color: "rgb(255,60,60)", shape: "emptyCircle"}, CenterCircle))

CenterCircle.transform.position = {x: window.innerWidth/2, y: window.innerHeight/2}

Dot = new GameObject({name: "Dot"})
Dot.AddComponent(new Sprite({size: {x: 25, y:25}, color: "rgb(255,60,60)", shape: "circle"}, Dot))

Dot.transform.position = {x: window.innerWidth/2, y: window.innerHeight/2}

P1Score = new GameObject({name: "P1Score"})
P1Score.AddComponent(new Text({size: 80, color: "black", font: "Courier New", text: "Score: ", value: 0}, P1Score))

P1Score.transform.position = {x: 50, y: P1Score.Text.size}

P2Score = new GameObject({name: "P2Score"})
P2Score.AddComponent(new Text({size: 80, color: "black", font: "Courier New", text: "Score: ", value: 0}, P2Score))

P2Score.transform.position = {x: window.innerWidth-P2Score.Text.size*1.1-350, y: P2Score.Text.size}

DragScore = new GameObject({name: "DragScore"})
DragScore.AddComponent(new Text({size: 30, color: "black", font: "Courier New", text: "Drag(%): ", value: 3}, DragScore))

DragScore.transform.position = {x:window.innerWidth-300, y: window.innerHeight-50}

MaxSpeed = new GameObject({name: "MaxSpeed"})
MaxSpeed.AddComponent(new Text({size: 30, color: "black", font: "Courier New", text: "Max Speed: ", value: 30}, MaxSpeed))

MaxSpeed.transform.position = {x:50, y: window.innerHeight-50}

P1ScoringCircle = new GameObject({name: "P1ScoringCircle"})
P1ScoringCircle.AddComponent(new Sprite ({size: {x: window.innerHeight/4, y: window.innerHeight/4}, color: "rgb(255,60,60)", shape: "emptyCircle"}, P1ScoringCircle))

P1ScoringCircle.transform.position = {x: 0, y: window.innerHeight/2}

P2ScoringCircle = new GameObject({name: "P2ScoringCircle"})
P2ScoringCircle.AddComponent(new Sprite ({size: {x: window.innerHeight/4, y: window.innerHeight/4}, color: "rgb(255,60,60)", shape: "emptyCircle"}, P2ScoringCircle))

P2ScoringCircle.transform.position = {x: window.innerWidth, y: window.innerHeight/2}

P1StartingLine = new GameObject({ name:"P1StartingLine"})
P1StartingLine.AddComponent(new Sprite({size: {x: 4, y: window.innerHeight}, color: "rgb(120,120,255)", shape: "rect"}, P1StartingLine))

P1StartingLine.transform.position = {x: window.innerWidth*1/5-2, y: 0}

P2StartingLine = new GameObject({ name:"P2StartingLine"})
P2StartingLine.AddComponent(new Sprite({size: {x: 4, y: window.innerHeight}, color: "rgb(120,120,255)", shape: "rect"}, P2StartingLine))

P2StartingLine.transform.position = {x: window.innerWidth*4/5-2, y: 0}

AirDots = new GameObject({name: "AirDots"})
AirDots.AddComponent(new Sprite({size: {x: 1, y:1}, color: "black", shape: "dots"}, AirDots))

GameObjects.push(Background);
GameObjects.push(MiddleLine)
GameObjects.push(P1StartingLine)
GameObjects.push(P2StartingLine)
GameObjects.push(CenterCircle)
GameObjects.push(Dot)
GameObjects.push(P1ScoringCircle)
GameObjects.push(P2ScoringCircle)
GameObjects.push(AirDots)
GameObjects.push(Player1);
GameObjects.push(Player2);
GameObjects.push(Puck)
GameObjects.push(TopWall)
GameObjects.push(BottomWall)
GameObjects.push(DragScore)
GameObjects.push(MaxSpeed)
GameObjects.push(P1Score)
GameObjects.push(P2Score)





Update();

window.addEventListener('keydown', (event) => {
    Inputs.push(event.key)
})
window.addEventListener('keyup', (event) => {
    KeyUp.push(event.key)
})
