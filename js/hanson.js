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

  // Then adding the application's canvas to the DOM body.
  document.body.querySelector('.game-screen').appendChild(app.canvas);

  // Load the bunny texture.
  const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');

  // Create a new Sprite from an image path
  const bunny = new PIXI.Sprite(texture);

  // Add to stage
  app.stage.addChild(bunny);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;
})();