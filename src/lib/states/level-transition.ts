import PlayerState from "../player-state";
import registerState from './register-state';
import {State, Text} from 'phaser-shim';
import {States} from "./index";

@registerState(States.LEVEL_TRANSITION)
export default class LevelTransitionState extends State {
    dungeons:string[] = [
        States.TINY_WOODS
    ];

    level:number;
    playerState:PlayerState;
    text:Text;

    chooseDungeon():string {
        return this.rnd.pick(this.dungeons);
    }

    create(): void {
        this.world.resize(window.innerWidth, window.innerHeight);
        this.stage.backgroundColor = '#000';

        this.text = this.add.text(0, 0, `Floor ${this.level}`, {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#fff',
            font: '64px Arial'
        });

        this.text.setTextBounds(0, 20, this.world.width, this.world.height);

        setTimeout(() => {
            this.camera.onFadeComplete.addOnce(() => {
                this.game.state.start(this.chooseDungeon(), true, false, this.level, this.playerState);
            });

            this.camera.fade();
        }, 2000);
    }

    init(...args): void {
        this.level = args[0];
    }
}