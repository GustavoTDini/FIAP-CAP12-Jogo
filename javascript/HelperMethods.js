// define um novo angulo em radianos
function setAngle() {
    let degreeAngle = Math.random() * FULL_CIRCLE;
    return degreeAngle * (PI / SEMI_CIRCLE)
}

// com o angulo achado define o x e y com o seno e cosseno
function setAngleSpeed(angle) {
    return [Math.cos(angle), Math.sin(angle)]
}

// função para inverter um angulo
function invertAngle(currentAngle) {
    if (currentAngle >= PI) {
        return currentAngle - PI
    } else {
        return currentAngle + PI;
    }

}

// para rotacionar os sprites dos meteoros
function rotateSprite(ctx, angle, sprite, x, y) {
    ctx.save();
    ctx.translate(x + SPRITE_SIZE / 2, y + SPRITE_SIZE / 2);
    ctx.rotate(angle * (PI / SEMI_CIRCLE));
    ctx.drawImage(...sprite, (-SPRITE_SIZE / 2), (-SPRITE_SIZE / 2), SPRITE_SIZE, SPRITE_SIZE);
    ctx.restore();
}

// função para fazer as estrelas do fundo de movimentarem
function spaceCorrection(i, j, starCorrectionX, starCorrectionY) {
    let x = i * TILE_SIZE + starCorrectionX;
    if (x > (7 * TILE_SIZE)) {
        x = -2 * TILE_SIZE + starCorrectionX;
    } else if (x < (-2 * TILE_SIZE)) {
        x = (7 * TILE_SIZE) + starCorrectionX;
    }
    let y = j * TILE_SIZE + starCorrectionY;
    if (y > (5 * TILE_SIZE)) {
        y = -2 * TILE_SIZE + starCorrectionY;
    } else if (y < (-2 * TILE_SIZE)) {
        y = (5 * TILE_SIZE) + starCorrectionY;
    }
    return [x, y]
}

// função para definir uma colisão entre 2 entidades
function isColliding(entity1, entity2) {
    return (((entity1.maskX + entity1.xSpeed + entity1.spriteSize) > entity2.maskX
        && (entity1.maskX + entity1.xSpeed) < (entity2.maskX + entity2.spriteSize))
        && ((entity1.maskY + entity1.ySpeed + entity1.spriteSize) > entity2.maskY
            && (entity1.maskY + entity1.ySpeed) < (entity2.maskY + entity1.spriteSize)
        ))
}

// função que define os novos angulos e velocidades dos meteoros quando ocorre a colisão
function pushMeteorsApart(meteor1X, meteor1Y, meteor2X, meteor2Y) {
    let newAngle = 0
    if (meteor1X >= meteor2X) {
        if (meteor1Y >= meteor2Y) {
            newAngle = Math.atan((meteor1Y - meteor2Y) / (meteor1X - meteor2X))
        } else if (meteor2Y >= meteor1Y) {
            newAngle = Math.atan((meteor2Y - meteor1Y) / (meteor1X - meteor2X))
        }
    } else if (meteor2X >= meteor1X) {
        if (meteor1Y >= meteor2Y) {
            newAngle = Math.atan((meteor1Y - meteor2Y) / (meteor2X - meteor1X))
        } else if (meteor2Y >= meteor1Y) {
            newAngle = Math.atan((meteor2Y - meteor1Y) / (meteor2X - meteor1X))
        }
    }
    return newAngle;
}

// função para criar as estrelas do fundo
function createSpace() {
    for (let i = -2; i <= 6; i++) {
        for (let j = -2; j <= 4; j++) {
            ctx.drawImage(...space5Sprite, ...spaceCorrection(i, j, stars5X, stars5Y), TILE_SIZE, TILE_SIZE)
            ctx.drawImage(...space4Sprite, ...spaceCorrection(i, j, stars4X, stars4Y), TILE_SIZE, TILE_SIZE)
            ctx.drawImage(...space3Sprite, ...spaceCorrection(i, j, stars3X, stars3Y), TILE_SIZE, TILE_SIZE)
            ctx.drawImage(...space2Sprite, ...spaceCorrection(i, j, stars2X, stars2Y), TILE_SIZE, TILE_SIZE)
            ctx.drawImage(...space1Sprite, ...spaceCorrection(i, j, stars1X, stars1Y), TILE_SIZE, TILE_SIZE)
        }
    }
}

// função para atualizar a posição das estrelas
function updateSpace() {
    let speedCorrectionX = 0;
    let speedCorrectionY = 0;
    if (player) {
        speedCorrectionX = player.xSpeed
        speedCorrectionY = player.ySpeed
    }
    if (gameStartScreen) {
        speedCorrectionY = 0;
        speedCorrectionX = 5;
    }
    if (speedCorrectionX !== 0 || speedCorrectionY !== 0) {
        stars1Count++;
        stars2Count++;
        stars3Count++;
        stars4Count++;
        stars5Count++;
    }
    if (stars1Count > STARS_1_TICK) {
        if (speedCorrectionX > 0) stars1X--;
        if (speedCorrectionX < 0) stars1X++;
        if (speedCorrectionY > 0) stars1Y--;
        if (speedCorrectionY < 0) stars1Y++;
        stars1Count = 0;
    }
    if (stars2Count > STARS_2_TICK) {
        if (speedCorrectionX > 0) stars2X--;
        if (speedCorrectionX < 0) stars2X++;
        if (speedCorrectionY > 0) stars2Y--;
        if (speedCorrectionY < 0) stars2Y++;
        stars2Count = 0;
    }
    if (stars3Count > STARS_3_TICK) {
        if (speedCorrectionX > 0) stars3X--;
        if (speedCorrectionX < 0) stars3X++;
        if (speedCorrectionY > 0) stars3Y--;
        if (speedCorrectionY < 0) stars3Y++;
        stars3Count = 0;
    }
    if (stars4Count > STARS_4_TICK) {
        if (speedCorrectionX > 0) stars4X--;
        if (speedCorrectionX < 0) stars4X++;
        if (speedCorrectionY > 0) stars4Y--;
        if (speedCorrectionY < 0) stars4Y++;
        stars4Count = 0;
    }
    if (stars5Count > STARS_5_TICK) {
        if (speedCorrectionX > 0) stars5X--;
        if (speedCorrectionX < 0) stars5X++;
        if (speedCorrectionY > 0) stars5Y--;
        if (speedCorrectionY < 0) stars5Y++;
        stars5Count = 0;
    }
    if (stars1X === 2 * TILE_SIZE || stars1X === -2 * TILE_SIZE) stars1X = 0;
    if (stars1Y === 2 * TILE_SIZE || stars1Y === -2 * TILE_SIZE) stars1Y = 0;
    if (stars2X === 2 * TILE_SIZE || stars2X === -2 * TILE_SIZE) stars2X = 0;
    if (stars2Y === 2 * TILE_SIZE || stars2Y === -2 * TILE_SIZE) stars2Y = 0;
    if (stars3X === 2 * TILE_SIZE || stars3X === -2 * TILE_SIZE) stars3X = 0;
    if (stars3Y === 2 * TILE_SIZE || stars3Y === -2 * TILE_SIZE) stars3Y = 0;
    if (stars4X === 2 * TILE_SIZE || stars4X === -2 * TILE_SIZE) stars4X = 0;
    if (stars4Y === 2 * TILE_SIZE || stars4Y === -2 * TILE_SIZE) stars4Y = 0;
    if (stars5X === 2 * TILE_SIZE || stars5X === -2 * TILE_SIZE) stars5X = 0;
    if (stars5Y === 2 * TILE_SIZE || stars5Y === -2 * TILE_SIZE) stars5Y = 0;
}
