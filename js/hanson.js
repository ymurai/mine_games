// import { Application, Assets, Container, Sprite } from 'pixi.js';
import { addBackground } from './addBackground.js';
import { addFishes, animateFishes } from './addFishes.js';
import { addWaterOverlay, animateWaterOverlay } from './addWaterOverlay.js';

(async () => {
  // Create a new application
  const app = new PIXI.Application();

  // Store an array of fish sprites for animation.
  const fishes = [];

  async function setup() {
    // Intialize the application.
    await app.init({
      background: '#1099bb',
      width: 800,
      height: 600,
    });

    // Then adding the application's canvas to the DOM body.
    document.body.querySelector('.game-screen').appendChild(app.canvas);
  }

  async function preload() {
    // Create an array of asset data to load.
    const assets = [
      { alias: 'background', src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
      { alias: 'fish1', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish1.png' },
      { alias: 'fish2', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish2.png' },
      { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png' },
      { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png' },
      { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png' },
      { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
      { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
    ];

    // Load the assets defined above.
    await PIXI.Assets.load(assets);
  }

  // Asynchronous IIFE
  (async () => {
    await setup();
    await preload();

    addBackground(app);
    addFishes(app, fishes);
    addWaterOverlay(app);

    // Add the fish animation callback to the application's ticker.
    app.ticker.add((time) => {
      animateFishes(app, fishes, time);
      animateWaterOverlay(app, time);
    })
  })();

})();