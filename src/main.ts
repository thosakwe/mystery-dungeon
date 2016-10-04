import MyGame from './lib/game';
new MyGame();

eval(`
if (module.hot) {
    module.hot.accept('./lib/game', function() {
        var MyGame = require('./lib/game').default;
        new MyGame();
    });
}`);
