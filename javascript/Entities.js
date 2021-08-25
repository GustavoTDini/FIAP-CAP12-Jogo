// classe principal que tem os elementos basicos das entidades do jogo
class Entities {
    contructor(x, y, sprite, spriteSize) {
        this.x = x;
        this.y = y;
        this.sprite = sprite
        this.spriteSize = spriteSize
        this.maskX = x;
        this.maskY = y;
    }

    render(ctx) {
        ctx.drawImage(...this.sprite, this.x, this.y, 64, 64)
    }

    update() {
        this.setMask()
    }

    // função para definir a mascara no caso do objeto ser menor que o sprite padrão
    setMask() {
        this.maskX = this.x + ((SPRITE_SIZE - this.spriteSize) / 2);
        this.maskY = this.y + ((SPRITE_SIZE - this.spriteSize) / 2);
    }
}

// classe que contem os elementos do jogador
class Player extends Entities {

    moved = false;
    right = false;
    left = false;
    up = false;
    down = false;
    thrustRight = MAX_THRUST;
    thrustLeft = MAX_THRUST;
    thrustUp = MAX_THRUST;
    thrustDown = MAX_THRUST;
    fireFrame = 1;
    fireCount = 0;

    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.dir = UP_DIR;
        this.xSpeed = 0
        this.ySpeed = 0
        this.spriteSize = SPRITE_SIZE;
        this.maskX = x;
        this.maskY = y;
    }

    update() {
        $("#debug").html("x: " + this.xSpeed + " y: " + this.ySpeed)
        $("#debugThrustX").html("Left: " + this.thrustLeft + " Right: " + this.thrustRight)
        $("#debugThrustY").html("Up: " + this.thrustUp + " Down: " + this.thrustDown)
        this.setMask()
        this.moving()
    }

    render(ctx) {
        ctx.drawImage(...this.sprite, this.x, this.y, 64, 64)
        if (this.right && this.dir === RIGHT_DIR) {
            if (this.fireFrame === 1) {
                ctx.drawImage(...playerFireSpriteRight1, this.x - SPRITE_SIZE + 15, this.y, 64, 64)
            } else {
                ctx.drawImage(...playerFireSpriteRight2, this.x - SPRITE_SIZE + 15, this.y, 64, 64)
            }
        }
        if (this.left && this.dir === LEFT_DIR) {
            if (this.fireFrame === 1) {
                ctx.drawImage(...playerFireSpriteLeft1, this.x + SPRITE_SIZE - 15, this.y, 64, 64)
            } else {
                ctx.drawImage(...playerFireSpriteLeft2, this.x + SPRITE_SIZE - 15, this.y, 64, 64)
            }
        }
        if (this.up && this.dir === UP_DIR) {
            if (this.fireFrame === 1) {
                ctx.drawImage(...playerFireSpriteUp1, this.x, this.y + SPRITE_SIZE - 15, 64, 64)
            } else {
                ctx.drawImage(...playerFireSpriteUp2, this.x, this.y + SPRITE_SIZE - 15, 64, 64)
            }
        }
        if (this.down && this.dir === DOWN_DIR) {
            if (this.fireFrame === 1) {
                ctx.drawImage(...playerFireSpriteDown1, this.x, this.y - SPRITE_SIZE + 15, 64, 64)
            } else {
                ctx.drawImage(...playerFireSpriteDown2, this.x, this.y - SPRITE_SIZE + 15, 64, 64)
            }
        }
    }

    // função que define a aceleração do jogador
    speedUp() {
        if (this.right) {
            this.thrustRight++;
            if (this.thrustRight > MAX_THRUST) {
                if (this.xSpeed < MAX_SPEED) {
                    this.xSpeed++;
                } else {
                    this.xSpeed = MAX_SPEED;
                }
                this.thrustRight = 0;
            }
        }
        if (this.left) {
            this.thrustLeft++;
            if (this.thrustLeft > MAX_THRUST) {
                if (this.xSpeed > -MAX_SPEED) {
                    this.xSpeed--;
                } else {
                    this.xSpeed = -MAX_SPEED;
                }
                this.thrustLeft = 0;
            }
        }
        if (this.up) {
            this.thrustUp++;
            if (this.thrustUp > MAX_THRUST) {
                if (this.ySpeed > -MAX_SPEED) {
                    this.ySpeed--;
                } else {
                    this.ySpeed = -MAX_SPEED;
                }
                this.thrustUp = 0;
            }
        }
        if (this.down) {
            this.thrustDown++;
            if (this.thrustDown > MAX_THRUST) {
                if (this.ySpeed < MAX_SPEED) {
                    this.ySpeed++;
                } else {
                    this.ySpeed = MAX_SPEED;
                }
                this.thrustDown = 0;
            }
        }
    }

    //função para definir a posição do jogador no canvas
    moving() {
        this.moved = false;
        this.fireCount++
        if (this.right) {
            this.moved = true;
            this.sprite = playerSpriteRight;
            this.speedUp(RIGHT_DIR)
            this.thrustLeft = MAX_THRUST;
            this.thrustUp = MAX_THRUST;
            this.thrustDown = MAX_THRUST;
        }
        if (this.left) {
            this.moved = true;
            this.sprite = playerSpriteLeft;
            this.speedUp(LEFT_DIR)
            this.thrustRight = MAX_THRUST;
            this.thrustUp = MAX_THRUST;
            this.thrustDown = MAX_THRUST;
        }
        if (this.up) {
            this.moved = true;
            this.sprite = playerSpriteUp;
            this.speedUp(UP_DIR)
            this.thrustRight = MAX_THRUST;
            this.thrustLeft = MAX_THRUST;
            this.thrustDown = MAX_THRUST;
        }
        if (this.down) {
            this.moved = true;
            this.sprite = playerSpriteDown;
            this.speedUp(DOWN_DIR)
            this.thrustRight = MAX_THRUST;
            this.thrustLeft = MAX_THRUST;
            this.thrustUp = MAX_THRUST;
        }
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
        if (this.fireCount > MAX_THRUST) {
            this.fireCount = 0;
            this.fireFrame++
            if (this.fireFrame > 2) {
                this.fireFrame = 1
            }
        }
        if (this.x > CANVAS_WIDTH && this.xSpeed > 0) {
            this.x = -SPRITE_SIZE;
        }
        if (this.x < -SPRITE_SIZE && this.xSpeed < 0) {
            this.x = CANVAS_WIDTH;
        }
        if (this.y > CANVAS_HEIGHT && this.ySpeed > 0) {
            this.y = -SPRITE_SIZE;
        }
        if (this.y < -SPRITE_SIZE && this.ySpeed < 0) {
            this.y = CANVAS_HEIGHT;
        }
    }

    handleInputDown(keys) {
        fireSound.play();
        switch (keys) {
            case ('right'):
                this.dir = RIGHT_DIR;
                this.right = true;
                this.thrustRight++
                break;
            case ('left'):
                this.dir = LEFT_DIR;
                this.left = true;
                this.thrustLeft++
                break;
            case ('up'):
                this.dir = UP_DIR;
                this.up = true;
                this.thrustUp++
                break;
            case ('down'):
                this.dir = DOWN_DIR;
                this.down = true;
                this.thrustDown++
                break;
        }
    }

    handleInputUp(keys) {
        fireSound.volume = 0.2;
        fireSound.pause();
        switch (keys) {
            case ('right'):
                this.right = false;
                this.thrustRight--
                break;
            case ('left'):
                this.left = false;
                this.thrustLeft--
                break;
            case ('up'):
                this.up = false;
                this.thrustUp--
                break;
            case ('down'):
                this.down = false;
                this.thrustDown--
                break;
            default:
                this.right = false;
                this.left = false;
                this.up = false;
                this.down = false;
                this.thrustRight--
                this.thrustLeft--
                this.thrustUp--
                this.thrustDown--
        }
    }
}

// classe dos meteoros
class Meteor extends Entities {
    rotateTime = 0;

    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.angle = setAngle()
        this.angleSpeed = setAngleSpeed(this.angle);
        this.speed = (Math.random() * 3) + 1;
        this.rotateAngle = 0;
        switch (sprite) {
            case (meteor1Sprite):
                this.spriteSize = METEOR_1_SIZE;
                break;
            case (meteor2Sprite):
                this.spriteSize = METEOR_2_SIZE;
                break;
            case (meteor3Sprite):
                this.spriteSize = METEOR_3_SIZE;
                break;
            default:
                this.spriteSize = SPRITE_SIZE;
        }
        this.maskX = x;
        this.maskY = y;
        this.xSpeed = this.angleSpeed[0];
        this.ySpeed = this.angleSpeed[1];
    }

    update() {
        this.setMask();
        this.moving()
        this.rotate()
    }

    render(ctx) {
        rotateSprite(ctx, this.rotateAngle, this.sprite, this.x, this.y)
    }

    // definimos a rotação de acordo com a direção do meteoro
    rotate() {
        this.rotateTime++
        if (this.rotateTime > 5) {
            this.rotateTime = 0
            if (this.xSpeed > 0) {
                this.rotateAngle = this.rotateAngle + 2
            } else {
                this.rotateAngle = this.rotateAngle - 2;
            }
        }
    }

    // função que define a posição do meteoro no canvas
    moving() {
        this.x = this.x + (this.xSpeed * this.speed);
        this.y = this.y + (this.ySpeed * this.speed);
        if (this.x > CANVAS_WIDTH && this.xSpeed * this.speed > 0) {
            this.x = -SPRITE_SIZE;
        }
        if (this.x < -SPRITE_SIZE && this.xSpeed * this.speed < 0) {
            this.x = CANVAS_WIDTH;
        }
        if (this.y > CANVAS_HEIGHT && this.ySpeed * this.speed > 0) {
            this.y = -SPRITE_SIZE;
        }
        if (this.y < -SPRITE_SIZE && this.ySpeed * this.speed < 0) {
            this.y = CANVAS_HEIGHT;
        }
    }

    // função que é chamada quando 2 meteoros colidem, é definido novas direções
    hasCollidedWithOther(newAngle) {
        this.angleSpeed = setAngleSpeed(newAngle)
        this.xSpeed = this.angleSpeed[0]
        this.ySpeed = this.angleSpeed[1]
    }
}

class CanvasText {

    constructor(x, y, text, type) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.time = TEXT_TIME_START;
        this.type = type
        this.textChanger = 5
        this.xText = 0
        this.yText = 0;
        this.fontSize = 15;
        this.currentChar = 1;
    }

    // de acordo com o tipo de texto é definido uma renderização e um update
    render(ctx) {
        switch (this.type) {
            case(PLAIN_TEXT):
                ctx.font = "25px verdana";
                ctx.fillStyle = "red"
                ctx.strokeStyle = "white"
                this.x = 20;
                this.y = 40;
                ctx.fillText(this.text, this.x, this.y);
                ctx.strokeText(this.text, this.x, this.y);
                break;
            case (PENALTY_TEXT):
                ctx.font = "35px verdana";
                if (this.textChanger % 2 === 0) {
                    ctx.fillStyle = "black"
                } else {
                    ctx.fillStyle = "white"
                }
                ctx.strokeStyle = "red"
                ctx.lineWidth = 2;
                this.xText = this.x + (ctx.measureText(this.text).width / 3);
                this.yText = this.y + (SPRITE_SIZE * 1.2);
                ctx.fillText(this.text, this.xText, this.yText);
                ctx.strokeText(this.text, this.xText, this.yText);
                break;
            case (STAGE_TEXT):
                ctx.font = this.fontSize + "px verdana";
                ctx.lineWidth = 2;
                ctx.fillStyle = "white"
                ctx.strokeStyle = "white"
                ctx.textBaseline = "top"
                this.xText = this.x - (ctx.measureText(this.text).width / 2);
                this.yText = this.y - (ctx.measureText('M').width / 8);
                ctx.fillText(this.text, this.xText, this.yText);
                ctx.strokeText(this.text, this.xText, this.yText);
                break;
            case (FULL_TEXT):
                ctx.font = "70px verdana";
                ctx.lineWidth = 1;
                ctx.fillStyle = "black"
                ctx.strokeStyle = "white"
                ctx.textBaseline = "top"
                this.xText = this.x - (ctx.measureText(this.text).width / 2);
                this.yText = this.y - (ctx.measureText('M').width / 8);
                ctx.fillText(this.text.substring(0, this.currentChar), this.xText, this.yText);
                ctx.strokeText(this.text.substring(0, this.currentChar), this.xText, this.yText);
                break;
        }
    }

    update() {
        switch (this.type) {
            case(PLAIN_TEXT):
                this.text = "Score: " + score
                break;
            case (PENALTY_TEXT):
                this.y--;
                this.time -= 2;
                if (this.time % 10 === 0) {
                    this.textChanger--;
                }
                break;
            case (STAGE_TEXT):
                this.time--;
                if (this.time % 2 === 0) {
                    this.fontSize++;
                }
                break;
            case (FULL_TEXT):
                if (this.time > 1) {
                    this.time--
                    if (this.time % 10 === 0 && this.currentChar < this.text.length) {
                        this.currentChar++;
                    }
                }
                break;

        }
        if (this.time < 0) {
            this.time = 0
        }
    }
}

class Explosion extends Entities {

    constructor(x, y) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.sprite = explosion1Sprite;
        this.time = EXPLOSION_TIME;
    }

    render(ctx) {
        super.render(ctx);
    }

    update() {
        this.time = this.time - 1;

        if (this.time === 25) {
            this.sprite = explosion2Sprite
        }
        if (this.time === 20) {
            this.sprite = explosion3Sprite
        }
        if (this.time === 15) {
            this.sprite = explosion4Sprite
        }
        if (this.time === 10) {
            this.sprite = explosion5Sprite
        }
        if (this.time === 0) {
            console.log("End")
        }
    }
}




