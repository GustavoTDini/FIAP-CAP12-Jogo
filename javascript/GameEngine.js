requestAnimationFrame(gameLoop)

// Função principal para renderizar os elementos do canvas
function render(ctx) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    createSpace();
    if (gameStart) {
        if (meteors.length > 0) {
            for (let meteor of meteors) {
                meteor.render(ctx)
            }
        }
        if (explosion) {
            explosion.render(ctx)
        }
        if (player) {
            player.render(ctx);
        }
    }
    if (gameStartScreen && texts.length === 0) {
        laserSound.play()
        texts.push(new CanvasText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "METEORS", FULL_TEXT))
    }
    if (texts.length > 0) {
        for (let text of texts) {
            text.render(ctx)
        }
    }
}

// função principal para atualizar os estados dos elementos do jogo
function update(currentTime) {
    updateSpace()
    if (gameOver) {
        if (gameOverTime === 1000) {
            gameOver = false;
            gameStartScreen = true;
            texts = [];
            meteors = [];
        }
        gameOverTime++;
    }
    if (texts.length > 0) {
        texts = texts.filter(text => text.time > 0)
        for (let text of texts) {
            text.update()
        }
    }
    if (!gameOver) {
        score = elapsedTime - (penalties * 10);
    }
    if (!gameStartScreen) {
        penaltyTime = Math.floor((currentTime - penaltyInitialTime) / 1000)
        elapsedTime = Math.floor((currentTime - initialTime) / 1000)
        setPenalty(penaltyTime)
        if (player) {
            player.update();
        }
        if (explosion) {
            explosion.update()
        }
        changeStage(elapsedTime)

        if (meteors.length > 0) {
            for (let meteor of meteors) {
                meteor.update()
                if (player && isColliding(meteor, player)) {
                    endGame()
                }
                for (let meteor2 of meteors) {
                    if (!(meteor === meteor2)) {
                        if (isColliding(meteor, meteor2)
                            && meteor.x > 0 && meteor2.x > 0
                            && meteor.x < (CANVAS_WIDTH - meteor.spriteSize)
                            && meteor2.x < (CANVAS_WIDTH - meteor2.spriteSize)
                            && meteor.y > 0 && meteor2.y > 0
                            && meteor.y < (CANVAS_HEIGHT - meteor.spriteSize)
                            && meteor2.y < (CANVAS_HEIGHT - meteor2.spriteSize)) {
                            hitSound.play();
                            let newAngle = pushMeteorsApart(meteor.x + (meteor.spriteSize / 2),
                                meteor.y + (meteor.spriteSize / 2),
                                meteor2.x + (meteor2.spriteSize / 2),
                                meteor2.y + (meteor2.spriteSize / 2));
                            if (meteor.x > meteor2.x) {
                                meteor.hasCollidedWithOther(newAngle)
                                meteor2.hasCollidedWithOther(invertAngle(newAngle))
                            } else {
                                meteor.hasCollidedWithOther(invertAngle(newAngle))
                                meteor2.hasCollidedWithOther(newAngle)
                            }
                        }
                    }
                }
            }
        }
        if (explosion && explosion.time === 0) {
            explosion = undefined;
        }
    }

}

function gameLoop() {
    if (gameRunning) {
        let now = Date.now()
        render(ctx)
        update(now)
    }
    requestAnimationFrame(gameLoop)
}

// Função para definir as penalidades por estar parado
function setPenalty(time) {
    if (time === 3 && !gameOver) {
        penaltyTime = 0;
        penaltyInitialTime = Date.now();
        penalties++;
        loseSound.play();
        texts.push(new CanvasText(player.x - SPRITE_SIZE / 3, player.y - SPRITE_SIZE / 3, "-10", PENALTY_TEXT))
    }
}

// Função para definir a troca de fases
function changeStage(time) {
    if (!changedStage && time % 30 === 0 && stage < 10 && !gameOver) {
        texts.push(new CanvasText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "Stage " + stage, STAGE_TEXT))
        changedStage = true;
        passStageSound.play();
        meteors.push(new Meteor(-50, (Math.random() * 400), (METEORS_SIZES[(Math.floor(Math.random() * (3)))])))
        meteors.push(new Meteor(-50, (Math.random() * 400), (METEORS_SIZES[(Math.floor(Math.random() * (3)))])))
        stage++
    } else if (changedStage && time % 30 !== 0) {
        changedStage = false;
    }
}

// Listenter para clique das teclas
document.addEventListener('keyup', function (e) {
    if (player) {
        player.handleInputUp(ALLOWED_KEYS[e.keyCode]);
    }
});

// Listenter para pressionar das teclas
document.addEventListener('keydown', function (e) {
    if (player) {
        penaltyTime = 0;
        player.handleInputDown(ALLOWED_KEYS[e.keyCode]);
    }
    penaltyInitialTime = Date.now();
});

// Listener para gerar o loop da musica de fundo
gameMusic.addEventListener('ended', function () {
    if (gameRunning && gameStart) {
        this.currentTime = 0;
        this.play();
    }
}, false);

