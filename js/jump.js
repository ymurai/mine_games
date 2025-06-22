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
  character.y = app.screen.height / 2;

  // Add the character to the stage
  app.stage.addChild(character);

  // Key press event listener
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = -jumpHeight;
      }
    }
    return false; // Prevent default action
  });

  // Game loop
  function gameLoop() {
    if (isJumping) {
      character.y += jumpVelocity;
      jumpVelocity += gravity;

      // Check if the character has landed
      if (character.y >= app.screen.height / 2) {
        character.y = app.screen.height / 2;
        isJumping = false;
        jumpVelocity = 0;
      }
    }
    requestAnimationFrame(gameLoop);
  }

  gameLoop();

})();