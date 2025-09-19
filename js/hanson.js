// import { Application, Assets, Container, Sprite } from 'pixi.js';
import { addStars } from './addStars.js';

(async () => {
  // Create a new application
  const app = new PIXI.Application();

  // Intialize the application.
  await app.init({
    background: '#021f4b',
    width: 800,
    height: 600,
  });

  // Then adding the application's canvas to the DOM body.
  document.body.querySelector('.game-screen').appendChild(app.canvas);

  addStars(app);
})();