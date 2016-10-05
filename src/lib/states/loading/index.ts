import Assets from '../../assets';
import registerState from "../register-state";
import {ScaleManager, State, Text} from 'phaser-shim';
import States from '../names';

@registerState(States.LOADING)
export default class Loading extends State {
    _interval: any;
    _percent = 0;

    text: Text;

    create(): void {
        this.game.stage.backgroundColor = '#fff';

        // Resizing logic
        this.game.scale.scaleMode = ScaleManager.SHOW_ALL;
        window.addEventListener('resize', e => {
            this.game.scale.setGameSize(
                window.innerWidth * window.devicePixelRatio,
                window.innerHeight * window.devicePixelRatio);
        });

        this.text = this.game.add.text(0, 0, '0% loaded...', {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#000'
        }).setTextBounds(0, 0, this.game.width, this.game.height);

        this._interval = window.setInterval(() => {
            this.text.setText(`${this._percent++}% loaded...`);

            if (this._percent > 100) {
                window.clearInterval(this._interval);
                this.game.state.start(States.TITLE);
            }
        }, 1);

    }

    preload(): void {
        this.load.spritesheet(Assets.BEAN, '/assets/dungeons/beans.png', 13, 12);
        this.load.image(Assets.INTRO, '/assets/title/intro.png');
        this.game.load.spritesheet(Assets.PROTAGONIST, '/assets/trainer.png', 31, 32);
        this.load.image(Assets.STAIRS, '/assets/dungeons/stairs.png');
    }
}