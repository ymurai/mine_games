// import { Application, Assets, Container, Sprite } from 'pixi.js';

(async () => {
  // Create a new application
  const app = new PIXI.Application();

  // Initialize the application
  await app.init({
    background: '#1099bb',
    width: 800,
    height: 600,
  });

  const GAME_CONFIG = {
    CELL_SIZE: 24,
    GRAVITY: 0.5,
    JUMP_HEIGHT: 15,
    GAME_SPEED: 5,
    HOLE_MIN_DISTANCE: 200,
    HOLE_MAX_DISTANCE: 500,
    HOLE_WIDTH: 120,
    GROUND_DEPTH: 3
  };
  
  const groundLevel = app.screen.height - GAME_CONFIG.CELL_SIZE * GAME_CONFIG.GROUND_DEPTH;

  document.body.querySelector('.game-screen').appendChild(app.canvas);

  const container = new PIXI.Container();
  app.stage.addChild(container);

  const gameState = {
    current: 'start',
    isJumping: false,
    jumpVelocity: 0,
    holes: [],
    gameOver: false,
    nextHoleDistance: 0
  };

  const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
  const character = new PIXI.Sprite(texture);
  character.anchor.set(0.5);
  character.x = app.screen.width / 2;
  character.y = groundLevel;
  app.stage.addChild(character);

  const groundTexture = await PIXI.Assets.load('/mine_games/img/block.png');
  const ground = new PIXI.TilingSprite(
    groundTexture,
    app.screen.width,
    app.screen.height - groundLevel - GAME_CONFIG.CELL_SIZE,
  );
  ground.tileScale.set(GAME_CONFIG.CELL_SIZE / 500);
  ground.y = app.screen.height - ground.height;
  app.stage.addChild(ground);

  const holeGraphics = new PIXI.Graphics();
  app.stage.addChild(holeGraphics);

  function createHole() {
    const hole = {
      x: app.screen.width,
      width: GAME_CONFIG.HOLE_WIDTH,
      height: GAME_CONFIG.CELL_SIZE
    };
    gameState.holes.push(hole);
  }

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      handleSpacePress();
    }
    return false;
  });

  function handleSpacePress() {
    if (gameState.current === 'start') {
      startGame();
    } else if (gameState.current === 'playing' && !gameState.isJumping) {
      jump();
    } else if (gameState.current === 'gameOver') {
      restartGame();
    }
  }

  function jump() {
    gameState.isJumping = true;
    gameState.jumpVelocity = -GAME_CONFIG.JUMP_HEIGHT;
  }

  function startGame() {
    resetGameState();
    gameState.current = 'playing';
    removeAllText();
  }

  function restartGame() {
    resetGameState();
    gameState.current = 'playing';
    removeAllText();
  }

  function resetGameState() {
    gameState.gameOver = false;
    gameState.isJumping = false;
    gameState.jumpVelocity = 0;
    gameState.holes = [];
    gameState.nextHoleDistance = GAME_CONFIG.HOLE_MIN_DISTANCE;
    character.y = groundLevel;
  }

  function removeAllText() {
    const textsToRemove = app.stage.children.filter(child => child instanceof PIXI.Text);
    textsToRemove.forEach(text => app.stage.removeChild(text));
  }

  function gameLoop() {
    if (gameState.current === 'playing') {
      updateGround();
      updateHoles();
      drawHoles();
      checkCollisions();
      updateCharacter();
    }
    requestAnimationFrame(gameLoop);
  }

  function updateGround() {
    ground.tilePosition.x -= GAME_CONFIG.GAME_SPEED;
  }

  function updateHoles() {
    gameState.nextHoleDistance -= GAME_CONFIG.GAME_SPEED;
    if (gameState.nextHoleDistance <= 0) {
      createHole();
      gameState.nextHoleDistance = GAME_CONFIG.HOLE_MIN_DISTANCE + Math.random() * (GAME_CONFIG.HOLE_MAX_DISTANCE - GAME_CONFIG.HOLE_MIN_DISTANCE);
    }

    gameState.holes.forEach((hole, index) => {
      hole.x -= GAME_CONFIG.GAME_SPEED;
      if (hole.x + hole.width < 0) {
        gameState.holes.splice(index, 1);
      }
    });
  }

  function drawHoles() {
    holeGraphics.clear();
    gameState.holes.forEach((hole) => {
      holeGraphics.rect(hole.x, groundLevel + hole.height, hole.width, hole.height);
      holeGraphics.fill(0x000000);
    });
  }

  function checkCollisions() {
    gameState.holes.forEach((hole) => {
      if (isCharacterInHole(hole)) {
        gameState.current = 'gameOver';
        showGameOver();
      }
    });
  }

  function isCharacterInHole(hole) {
    return character.x + character.width/2 > hole.x && 
           character.x - character.width/2 < hole.x + hole.width &&
           character.y + character.height/2 >= groundLevel;
  }

  function updateCharacter() {
    if (gameState.isJumping) {
      character.y += gameState.jumpVelocity;
      gameState.jumpVelocity += GAME_CONFIG.GRAVITY;

      if (character.y >= groundLevel) {
        character.y = groundLevel;
        gameState.isJumping = false;
        gameState.jumpVelocity = 0;
      }
    }
  }

  function showStartScreen() {
    const titleText = createCenteredText('JUMP GAME', 48, 0xffffff, -60);
    const startText = createCenteredText('Press SPACE to start', 24, 0xffffff, 20);
    app.stage.addChild(titleText);
    app.stage.addChild(startText);
  }

  function showGameOver() {
    const gameOverText = createCenteredText('GAME OVER', 48, 0xff0000, 0);
    const restartText = createCenteredText('Press SPACE to restart', 24, 0xffffff, 60);
    app.stage.addChild(gameOverText);
    app.stage.addChild(restartText);
  }

  function createCenteredText(text, fontSize, color, offsetY) {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: fontSize,
      fill: color,
      align: 'center',
    });
    const textElement = new PIXI.Text(text, style);
    textElement.x = app.screen.width / 2;
    textElement.y = app.screen.height / 2 + offsetY;
    textElement.anchor.set(0.5);
    return textElement;
  }

  showStartScreen();
  gameLoop();

})();
