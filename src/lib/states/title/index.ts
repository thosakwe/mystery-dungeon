import registerState from "../register-state";
import {KeyCode, Sprite, State} from 'phaser-shim';
import PlayerState from "../../player-state";
import States from '../names';

@registerState(States.TITLE)
export default class Title extends State {
    intro: Sprite;

    create(): void {
        this.intro = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'intro');
        this.intro.anchor.setTo(0.5, 0.7);

        const text = this.add.text(0, this.intro.bottom + 20, 'PRESS ENTER TO BEGIN', {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#e01058',
            font: '24px Arial'
        });

        text.anchor.y = 0.5;
        text.setTextBounds(0, 0, this.world.width, text.height);

        this.input.keyboard.addKey(KeyCode.ENTER).onDown.add(this.startGame, this);
        this.input.onDown.add(this.startGame, this);
    }

    startGame() {
        this.game.state.start(States.LEVEL_TRANSITION, true, false, 1, new PlayerState());
        // this.game.state.start(States.TINY_WOODS);
    }
}