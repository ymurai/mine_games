// import { Graphics } from 'pixi.js';
// import moonSvg from './moon.svg?raw';
// console.log('moonSvg', moonSvg);

// const moonSvgUrl = './moon.svg';
// const moonSvg = document.createElement('moonSvg');
// moonSvg.src = moonSvgUrl;

const moonSvg = await loadSvgAsString('js/moon.svg');

export function addMoon(app) {
  // Create a moon graphics object from an SVG code.
  const graphics = new PIXI.Graphics().svg(moonSvg);
  // Position the moon.
  graphics.x = app.screen.width / 2 + 100;
  graphics.y = app.screen.height / 8;

  // Add the moon to the stage.
  app.stage.addChild(graphics);
}

// SVG ファイルを文字列として読み込む
async function loadSvgAsString(url) {
  const res = await fetch(url);
  return await res.text(); // SVG ファイルを文字列として取得
}
