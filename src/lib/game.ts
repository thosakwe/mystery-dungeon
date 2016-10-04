import {AUTO, Game} from 'phaser-shim';
import LoadingState from './states/loading/index';
import States from './states/names';
import TitleState from './states/title/index';
import TinyWoods from "./states/dungeon/tiny-woods";

export default class MyGame {
    game: Game;

    constructor() {
        this.game = new Game(
            window.innerWidth * window.devicePixelRatio,
            window.innerHeight * window.devicePixelRatio,
            AUTO,
            'game');

        this.game.state.add(States.LOADING, LoadingState);
        this.game.state.add(States.TITLE, TitleState);

        // Dungeons
        this.game.state.add('Tiny Woods', TinyWoods);

        this.game.state.start('Tiny Woods' || States.LOADING);
    }
}