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
  const groundTexture = await PIXI.Assets.load('../img/block.png');
  const ground = new PIXI.TilingSprite(
    groundTexture,
    app.screen.width,
    app.screen.height - groundLevel - cell.height,
  );
  ground.tileScale.set(24 / 500);
  ground.y = app.screen.height - ground.height * 1;
  app.stage.addChild(ground);

  // Key press event listener
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = -jumpHeight;
      }
    }
    return false; // Prevent default action
  });

  // Game loop
  function gameLoop() {
    ground.tilePosition.x -= 5;

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
    requestAnimationFrame(gameLoop);
  }

  gameLoop();

})();
