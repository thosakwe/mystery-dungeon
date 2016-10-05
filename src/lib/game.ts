import {AUTO, Game} from 'phaser-shim';
import LevelTransitionState from "./states/level-transition";
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

        this.registerState(LevelTransitionState);
        this.registerState(LoadingState);
        this.registerState(TitleState);
        this.registerDungeons();

        this.game.state.start(States.LOADING);
    }

    registerDungeons() {
        this.registerState(TinyWoods);
    }

    registerState(state) {
        this.game.state.add(state.prototype.stateName, state);
    }
}