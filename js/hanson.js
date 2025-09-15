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
})();