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
let Zombie;
let TextBox;
let mouseX;
let mouseY;
let Inputs = []
let KeyUp = []
let P1MoveRight = false
let P1MoveLeft = false
let zombiesKilled = 0
let gameOver = false;



ctx.font = "100px serif";
ctx.fillStyle = "orange";

var zombiePic = new Image()
zombiePic.src = "./zombie.jpg"

var playerPic = new Image()
playerPic.src = "./player.jpeg"

const wordsArray = [
    "Esto", "Usted", "Que", "Era", "Para",
    "Con", "Como", "Yo", "Su", "Ellos", "Ser", "En", "Uno", "Haber", "Este", "De",
    "O", "Habia", "Por", "No", "Palabra", "Pero", "Que", "Algunos", "Nosotros", "Puede", "Fuera", "Otro", "Eran",
    "Todo", "Alli", "Cuando", "Arriba", "Uso", "Su", "Como", "Dicho", "Un", "Cada", "Ella", "Cual", "Hacer",
    "Su", "Tiempo", "Si", "Va", "Sobre", "Muchos", "Entonces", "Ellos", "Escribir", "Haria", "Gustar", "Entonces",
    "Estas", "Su", "Largo", "Hacer", "Cosa", "Ver", "el", "Dos", "Tiene", "Buscar", "Mas", "Dia",
    "Podria", "Ir", "Venir", "Hizo", "Numero", "Sonido", "No", "Mas", "Gente", "Mi", "Mas", "Conocer",
    "Agua", "Que", "Primero", "Quien", "Puede", "Abajo", "Lado", "Sido", "Ahora", "Encontrar", "Cualquier",
    "Nuevo", "Trabajo", "Parte", "Tomar", "Conseguir", "Lugar", "Hecho", "Vivir", "Donde", "Despues", "Volver", "Poco",
    "Solo", "Redondo", "Hombre", "Ano", "Vino", "Mostrar", "Cada", "Bueno", "Yo", "Dar", "Nuestra", "Bajo",
    "Nombre", "Muy", "Solo", "Forma", "Oracion", "Gran", "Pensar", "Decir", "Ayuda", "Bajo",
    "Linea", "Diferir", "Girar", "Causa", "Mucho", "Medio", "Antes", "Mover", "Derecho", "Chico", "Viejo", "Demasiado",
    "Mismo", "Decir", "Hace", "Establecer", "Tres", "Querer", "Aire", "Bien", "Tambien", "Jugar", "Pequeno", "Fin",
    "Poner", "Hogar", "Leer", "Mano", "Puerto", "Grande", "Deletrear", "Anadir", "Incluso", "Tierra", "Aqui", "Debe",
    "Grande", "Alta", "Tal", "Seguir", "Actuar", "Por Que", "Preguntar", "Hombres", "Cambio", "Fue", "Ligero", "Tipo",
    "De", "Mejor", "Hora", "Mejor", "Cierto", "Durante", "Cien", "Cinco", "Recordar", "Paso", "Temprano", "Sostener",
    "Oeste", "Suelo", "Interes", "Alcanzar", "Rapido", "Verbo", "Cantar", "Escuchar", "Seis", "Tabla", "Viajar", "Menos",
    "Manana", "Diez", "Simple", "Varios", "Vocal", "Hacia", "Guerra", "Lecho", "Contra", "Patron", "Lento", "Centro",
    "Amor", "Persona", "Dinero", "Servir", "Aparecer", "Carretera", "Mapa", "Lluvia", "Regla", "Gobernar", "Tirar", "Frio",
    "Noticia", "Voz", "Unidad", "Poder", "Ciudad", "Fina", "Cierto", "Volar", "Caer", "Principal", "Tiempo", "Hueso",
    "Rail", "Imaginar", "Proporcionar", "De Acuerdo", "Asi", "Capital", "Silla", "Peligro", "Fruta", "Rico", "Grosor",
    "Soldado", "Proceso", "Operar", "Adivinar", "Necesario", "Afilar", "Ala", "Crear", "Vecino", "Lavar", "Murcielago",
    "Corriente", "Ascensor", "Rosa", "Continuar", "Bloque", "Tabla", "Sombrero", "Vender", "Exito", "Compania"]

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
        this.RigidBody2D.OnCircleCollisionEnter(Collider);

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
    constructor({ size, color, shape, text, textColor, fontSize, globalAlpha, base, img}, gameObject) {
        super(gameObject)
        this.size = size;
        this.color = color;
        this.shape = shape;
        this.text = text || null
        this.textColor = textColor || "black"
        this.fontSize = fontSize || 30
        this.globalAlpha = globalAlpha || 1
        this.base = base || 0
        this.img = img || null
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
            if (this.text) {
                ctx.fillStyle = this.textColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = this.fontSize + "px Impact";          
                ctx.fillText(this.text, this.gameObject.transform.position.x + this.gameObject.Sprite.size.x/2, this.gameObject.transform.position.y-this.gameObject.Sprite.size.y/4);
            }
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
        if (this.shape == "img") {
            ctx.drawImage(this.img, this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.size.x, this.size.y)
            if (this.text) {
                ctx.fillStyle = this.textColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = this.fontSize + "px Courier";    
                let textLength = 0;
                for (let i = 0; i < this.text.length; i++) {
                    textLength += ctx.measureText(this.text[i][0]).width
                }
                for (let i = 0; i < this.text.length; i++) {
                    if (this.text[i][1] == true) {
                        ctx.fillStyle = "green"
                        ctx.fillText(this.text[i][0], this.gameObject.transform.position.x+this.gameObject.Sprite.size.x/1.6+14*i-(textLength/2.66), this.gameObject.transform.position.y-25)
                    }
                    else {
                        ctx.fillStyle = "black"
                        ctx.fillText(this.text[i][0], this.gameObject.transform.position.x+this.gameObject.Sprite.size.x/1.6+14*i-(textLength/2.66), this.gameObject.transform.position.y-25)
                    }
                }
            }
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
        this.gravity = gravity || 0
        this.drag = drag
        this.bounce = bounce || 0
        this.direction = direction || -1
        this.momentum = momentum || 0
        this.variety = variety || 0
        this.gameObject.RigidBody2D = this;
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
        if (Collider.gameObject.name == "Player1") {
            if (zombiesKilled == 0) {
                TextBox.Sprite.text = "GAME OVER!"
            }
            else {
                TextBox.Sprite.text = "GAME OVER! " + "Zombies Killed: " + (zombiesKilled) 
            }
            setTimeout(function() {
                gameOver = true;
            }, 100);
        }
    }
    OnCircleCollisionEnter(Collider) {
        this.otherCollider = Collider;

        this.dx = Math.abs(this.otherCollider.gameObject.transform.position.x - this.gameObject.transform.position.x)
        this.dy = Math.abs(this.otherCollider.gameObject.transform.position.y - this.gameObject.transform.position.y)
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    }
}

class SquareCollider extends Component {
    constructor({ size, offset }, gameObject) {
        super(gameObject)
        this.size = size
        this.offset = offset || 0
        Colliders.push(this)
    }
    Update() {
        for (let index = 0; index < Colliders.length; index++) {
            var Collider = Colliders[index];
            if (Collider != this) {
                if (this.gameObject.transform.position.x + this.size.x >= Collider.gameObject.transform.position.x + this.offset && this.gameObject.transform.position.x <= Collider.gameObject.transform.position.x + Collider.size.x-this.offset) {
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
                if (gameObject.RigidBody2D) {
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

class ZombieKiller extends Component {
    constructor({zombieNumber}, gameObject) {
        super(gameObject)
        this.zombieNumber = zombieNumber
        this.charNum = 0
        let randomWord = wordsArray[Math.floor(Math.random()*wordsArray.length)]
        let wordArray = []
        console.log(randomWord)
        for (let i = 0; i < randomWord.length; i++) {
            // Create a subarray with the character and false
            wordArray.push([randomWord[i], false]);
        }
        console.log(wordArray)
        setTimeout(() => CreateNewZombie(wordArray, this.zombieNumber+1), 3000/((zombiesKilled/8)+1))
    }
    Update() {
        if (Inputs.length == 1) {
            if (this.zombieNumber == zombiesKilled) {
                if (Inputs[0] == this.gameObject.Sprite.text[this.charNum][0]) {
                    if (this.charNum+1 >= this.gameObject.Sprite.text.length){
                        let index = GameObjects.indexOf(this.gameObject)
                        GameObjects.splice(index, 1)
                        index = Colliders.indexOf(this.gameObject.SquareCollider)
                        Colliders.splice(index, 1)
                        zombiesKilled += 1
                        TextBox.Sprite.text = "Zombies Killed: " + (zombiesKilled)
                    }
                    this.gameObject.Sprite.text[this.charNum][1] = true
                    this.charNum += 1;
                }
            }
        }
    }
}

function CreateNewZombie(word, index) {

    Zombie = new GameObject({ name: "Zombie" })
    Zombie.AddComponent(new RigidBody2D({ 
        velocity: { x: (-zombiesKilled/8-2.5), y: 0 }, 
        drag: 1 }, 
        Zombie))

    Zombie.AddComponent(new Sprite({ 
        size: { x: 250, y: 360 }, 
        color: "green", 
        shape: "img", 
        text: word,
        img: zombiePic},
        Zombie))
    // Zombie.AddComponent(new KeyboardMovement({ up: 's', down: 'w', left: 'd', right: 'a', speed: 4 }, Zombie))
    Zombie.AddComponent(new SquareCollider({ size: { x: Zombie.Sprite.size.x, y: Zombie.Sprite.size.y }, offset:30 }, Zombie))

    Zombie.AddComponent(new ZombieKiller({zombieNumber: index}, Zombie))

    // Zombie.AddComponent(new KeyboardMovement({up: "w", down: "s", left: "a", right: "d", speed: 2}, Zombie))

    Zombie.transform.position = {
        x: window.innerWidth,
        y: window.innerHeight/2-Zombie.Sprite.size.y/2
    };
    // this.dx = Math.abs(Zombie.transform.position.x - Player1.transform.position.x)
    // this.dy = Math.abs(Zombie.transform.position.y - Player1.transform.position.y)
    // this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    // while (this.distance < (Player1.Collider.size.x + Zombie.Sprite.size.x)) {
    //     Zombie.transform.position = { x: window.innerHeight * Math.random(), y: window.innerWidth * Math.random() };
    //     this.dx = Math.abs(Zombie.transform.position.x - Player1.transform.position.x)
    //     this.dy = Math.abs(Zombie.transform.position.y - Player1.transform.position.y)
    //     this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    // }
    GameObjects.push(Zombie)
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
    color: "rgb(255,255,255)", 
    shape: "rect" }, 
    Background))
Background.transform.position = { x: 0, y: 0 }


TextBox = new GameObject({ name: "TextBox" })
TextBox.AddComponent(new Sprite({ 
    size: { x: 0, y: 0 }, 
    color: "white", 
    shape: "circle", 
    text: "Type Words to Kill Zombies!", 
    textColor: "black", 
    fontSize: 50, 
    globalAlpha: 0.75 }, TextBox))
TextBox.transform.position = { x: canvas.width / 2, y: canvas.height / 10 }

Player1 = new GameObject({name: "Player1"})
Player1.AddComponent(
    new Sprite({ 
    size: { x: 250, y: 360 }, 
    color: "green", 
    shape: "img", 
    img: playerPic},
    Player1))
Player1.AddComponent(new RigidBody2D({ 
    velocity: { x: 0, y: 0 }, 
    drag: 1 }, 
    Player1))

Player1.AddComponent(new SquareCollider({ size: { x: Player1.Sprite.size.x, y: Player1.Sprite.size.y }, offset:30}, Player1))
Player1.transform.position = {x: window.innerWidth/10, y: window.innerHeight/2 - Player1.Sprite.size.y/2}



GameObjects.push(Background);
GameObjects.push(Player1)

CreateNewZombie([["E", false], ["M", false], ["P", false], ["I", false], ["E", false], ["Z", false], ["A", false]], 0)

GameObjects.push(TextBox)



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