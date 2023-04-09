//canvas const
const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d')

canvas.width = (window.innerWidth/2);
canvas.height = (window.innerHeight*0.98);

const scaledCanvas = {
    width: canvas.width/0.087,
    height: canvas.height/0.087
}
//player gravity
const gravity = 0.2;

//background sprite object
class Sprite {
    constructor({position, imageSrc}) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
    }

    draw() {
        if (!this.image) return
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
    }
}

//platform
class Platform {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }

        this.width = 208
        this.height = 40

        this.image = image
    }

    draw() {
        if (!this.image) return
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

//player object
class Player {
    constructor() {
        this.position = {
            x: (canvas.width/7),
            y: 450,
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = (canvas.width/20);
        this.height = (canvas.width/20);
    }

    draw() {
        c.fillStyle = "#6fc525"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    //gravity effect
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        }
        else {
            //loose condition
            restart()
        }

    }
}

//player movement
const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    }    
}

let background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc : "background.png",
})

let image = new Image()
image.src = "level.png"
let player = new Player();

let platform = [
    //lv 1
    new Platform({x: 50, y: 650, image}),
    new Platform({x: 375, y: 555, image}),
    new Platform({x: 70, y: 375, image}),
    new Platform({x: 425, y: 200, image}),
    new Platform({x: 40, y: 100, image}),

    //lv 2
    new Platform({x: 400, y: -75, image}),
    new Platform({x: 250, y: -275, image}),
    new Platform({x: 50, y: -500, image}),
    new Platform({x: 450, y: -500, image}),
    new Platform({x: 250, y: -800, image}),

    //lv 3
    new Platform({x: 50, y: -1000, image}),
    new Platform({x: 450, y: -1100, image}),
    new Platform({x: 50, y: -1200, image}),

]

let scrollOffset = 0;

function restart() {
    background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imageSrc : "background.png",
    })

    player = new Player()
    image = new Image()
    image.src = "level.png"

    platform = [
        //lv 1
        new Platform({x: 50, y: 650, image}),
        new Platform({x: 375, y: 555, image}),
        new Platform({x: 70, y: 375, image}),
        new Platform({x: 425, y: 200, image}),
        new Platform({x: 40, y: 100, image}),
    
        //lv 2
        new Platform({x: 400, y: -75, image}),
        new Platform({x: 250, y: -275, image}),
        new Platform({x: 50, y: -500, image}),
        new Platform({x: 450, y: -500, image}),
        new Platform({x: 250, y: -800, image}),
        
        //lv 3
        new Platform({x: 50, y: -1000, image}),
        new Platform({x: 450, y: -1100, image}),
        new Platform({x: 50, y: -1200, image}),
  
    ]

    scrollOffset = 0;

}

//animation frame
function animate() {
    //canvas
    c.fillStyle = "#6e9fa8";
    c.fillRect(0, 0, canvas.width, canvas.height)
    window.requestAnimationFrame(animate)

    //bacgkround image
    c.save()
    c.scale(0.087, 0.087)
    c.translate(0, (-background.image.height + scaledCanvas.height))
    background.update()  
    c.restore()
    
    //platforms
    platform.forEach(platform => {
        platform.draw()
    })    

    player.update()

    player.velocity.x = 0

    if (keys.d.pressed && (player.position.x + (canvas.width/20)) < canvas.width) {
        player.velocity.x += 3
    }
    else if (keys.a.pressed && (player.position.x - (canvas.width/20)) > canvas.width - (canvas.width + (canvas.width/10 - 40))) {
        player.velocity.x -= 3

    }

    //platform collision detection
    platform.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y  && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0   
        }
    })

    //smooth upwards scrolling
    if (player.position.y + player.height <= 200) {
        scrollOffset += 2.5

        platform.forEach(platform => {
            background.position.y += 2.5
            platform.position.y += 2.5
        })
    }
}




animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //right
        case 'd':
            keys.d.pressed = true
            break;

        //left
        case 'a':
            keys.a.pressed = true
            break;

        //up
        case 'w':

            if (player.velocity.y == 0 && player.position.y > 0) {
                player.velocity.y -= 9
            }

            /*
            if (player.position.y + player.height <= 250) {
                scrollOffset += 9

                platform.forEach(platform => {
                    background.position.y += 9
                    platform.position.y += 9
                })
            }
            */
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //right
        case 'd':
            keys.d.pressed = false
            break;

        //left
        case 'a':
            keys.a.pressed = false
            break;
    }
})