import { createRenderer } from '../../dist/roger-mini-vue.esm.js'
import { App } from './App.js'

// 借用 h5 框架pixiJS 引擎 例子
const game = new PIXI.Application({
  width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
})

document.body.append(game.view)
 
// 创建我们自己的render
const renderer = createRenderer({
  createElement(type) {
    if (type === 'container') {
      const container = new PIXI.Container();
      const texture = PIXI.Texture.from('./assets/bunny.png');

      // Create a 5x5 grid of bunnies
      for (let i = 0; i < 25; i++) {
          const bunny = new PIXI.Sprite(texture);
          bunny.anchor.set(0.5);
          bunny.x = (i % 5) * 40;
          bunny.y = Math.floor(i / 5) * 40;
          container.addChild(bunny);
      }

      // Move container to the center
      container.x = game.screen.width / 2;
      container.y = game.screen.height / 2;

      // Center bunny sprite in local container coordinates
      container.pivot.x = container.width / 2;
      container.pivot.y = container.height / 2;

      // Listen for animate update
      game.ticker.add((delta) => {
          // rotate the container!
          // use delta to create frame-independent transform
          container.rotation -= 0.01 * delta;
      });

      return container

    } else if (type === 'rect') {
      const rect = new PIXI.Graphics()
      rect.beginFill(0xff0000)
      rect.drawRect(0, 0, 100, 100)
      rect.endFill()

      return rect
    }
  },
  patchProp(el, key, val) {
    // el[key] = val
  },
  insert(el, parent) {
    parent.addChild(el)
  }
})

renderer.createApp(App).mount(game.stage)