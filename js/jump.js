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

  const cell = {
    width: 24,
    height: 24,
  };
  const groundLevel = app.screen.height - cell.height * (2 + 1);

  // Append the application canvas to the document body
  // document.body.appendChild(app.canvas);
  document.body.querySelector('.game-screen').appendChild(app.canvas);

  // Create and add a container to the stage
  const container = new PIXI.Container();

  app.stage.addChild(container);

  // Set up jump variables
  let isJumping = false;
  let jumpVelocity = 0;
  const gravity = 0.5;
  const jumpHeight = 15;

  // Set up hole variables
  let holes = [];
  let gameSpeed = 5;
  let gameOver = false;
  let nextHoleDistance = 0;
  
  // Game state management
  let gameState = 'start'; // 'start', 'playing', 'gameOver'

  // Load the bunny texture
  const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
  const character = new PIXI.Sprite(texture);

  // Set the character's anchor point to the center
  character.anchor.set(0.5);

  // Position the character in the center of the screen
  character.x = app.screen.width / 2;
  character.y = groundLevel;

  // Add the character to the stage
  app.stage.addChild(character);

  // Load the ground texture
  const groundTexture = await PIXI.Assets.load('/mine_games/img/block.png');
  const ground = new PIXI.TilingSprite(
    groundTexture,
    app.screen.width,
    app.screen.height - groundLevel - cell.height,
  );
  ground.tileScale.set(24 / 500);
  ground.y = app.screen.height - ground.height * 1;
  app.stage.addChild(ground);

  // Create a graphics object for drawing holes
  const holeGraphics = new PIXI.Graphics();
  app.stage.addChild(holeGraphics);

  // Function to create a hole
  function createHole() {
    const hole = {
      x: app.screen.width,
      width: 120,
      height: cell.height
    };
    holes.push(hole);
  }

  // Key press event listener
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      if (gameState === 'start') {
        startGame();
      } else if (gameState === 'playing' && !isJumping) {
        isJumping = true;
        jumpVelocity = -jumpHeight;
      } else if (gameState === 'gameOver') {
        restartGame();
      }
    }
    return false; // Prevent default action
  });

  // Function to start the game
  function startGame() {
    gameState = 'playing';
    gameOver = false;
    isJumping = false;
    jumpVelocity = 0;
    character.y = groundLevel;
    holes = [];
    nextHoleDistance = 200;
    
    // Remove all text elements (start screen text)
    const textsToRemove = app.stage.children.filter(child => child instanceof PIXI.Text);
    textsToRemove.forEach(text => app.stage.removeChild(text));
  }

  // Function to restart the game
  function restartGame() {
    gameState = 'playing';
    gameOver = false;
    isJumping = false;
    jumpVelocity = 0;
    character.y = groundLevel;
    holes = [];
    nextHoleDistance = 200;
    
    // Remove all text elements (game over and restart text)
    const textsToRemove = app.stage.children.filter(child => child instanceof PIXI.Text);
    textsToRemove.forEach(text => app.stage.removeChild(text));
  }

  // Game loop
  function gameLoop() {
    if (gameState === 'playing') {
      ground.tilePosition.x -= gameSpeed;

      // Generate holes
      nextHoleDistance -= gameSpeed;
      if (nextHoleDistance <= 0) {
        createHole();
        nextHoleDistance = 200 + Math.random() * 300;
      }

      // Update holes
      holes.forEach((hole, index) => {
        hole.x -= gameSpeed;
        if (hole.x + hole.width < 0) {
          holes.splice(index, 1);
        }
      });

      // Draw holes
      holeGraphics.clear();
      holes.forEach((hole) => {
        holeGraphics.rect(hole.x, groundLevel + hole.height, hole.width, hole.height);
        holeGraphics.fill(0x000000);
      });

      // Check collision with holes
      holes.forEach((hole) => {
        if (character.x + character.width/2 > hole.x && 
            character.x - character.width/2 < hole.x + hole.width &&
            character.y + character.height/2 >= groundLevel) {
          gameState = 'gameOver';
          showGameOver();
        }
      });

      if (isJumping) {
        character.y += jumpVelocity;
        jumpVelocity += gravity;

        // Check if the character has landed
        if (character.y >= groundLevel) {
          character.y = groundLevel;
          isJumping = false;
          jumpVelocity = 0;
        }
      }
    }
    requestAnimationFrame(gameLoop);
  }

  // Function to show start screen
  function showStartScreen() {
    const titleStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0xffffff,
      align: 'center',
    });
    const titleText = new PIXI.Text('JUMP GAME', titleStyle);
    titleText.x = app.screen.width / 2;
    titleText.y = app.screen.height / 2 - 60;
    titleText.anchor.set(0.5);
    app.stage.addChild(titleText);

    const startStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    const startText = new PIXI.Text('Press SPACE to start', startStyle);
    startText.x = app.screen.width / 2;
    startText.y = app.screen.height / 2 + 20;
    startText.anchor.set(0.5);
    app.stage.addChild(startText);
  }

  // Function to show game over
  function showGameOver() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0xff0000,
      align: 'center',
    });
    const gameOverText = new PIXI.Text('GAME OVER', style);
    gameOverText.x = app.screen.width / 2;
    gameOverText.y = app.screen.height / 2;
    gameOverText.anchor.set(0.5);
    app.stage.addChild(gameOverText);

    const restartStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    const restartText = new PIXI.Text('Press SPACE to restart', restartStyle);
    restartText.x = app.screen.width / 2;
    restartText.y = app.screen.height / 2 + 60;
    restartText.anchor.set(0.5);
    app.stage.addChild(restartText);
  }

  // Show start screen initially
  showStartScreen();
  
  gameLoop();

})();
