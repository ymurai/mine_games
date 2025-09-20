// import { Application, Assets, Container, Sprite } from 'pixi.js';
import { addGround } from './addGround.js';
import { addMoon } from './addMoon.js';
import { addMountains } from './addMountains.js';
import { addStars } from './addStars.js';
import { addTrain } from './addTrain.js';
import { addTrees } from './addTrees.js';

// Create a new application
const app = new PIXI.Application();

// Create a container to hold all the train parts.
const trainContainer = new PIXI.Container();

// Asynchronous IIFE
(async () => {
  // Intialize the application.
  await app.init({
    background: '#021f4b',
    width: 800,
    height: 600,
  });

  // Then adding the application's canvas to the DOM body.
  document.body.querySelector('.game-screen').appendChild(app.canvas);

  addStars(app);
  addMoon(app);
  addMountains(app);
  addTrees(app);
  addGround(app);
  addTrain(app, trainContainer);
})();