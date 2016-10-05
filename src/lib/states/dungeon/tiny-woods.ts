import DungeonState from "./dungeon";
import registerState from "../register-state";
import {States} from "../index";

@registerState(States.TINY_WOODS)
export default class TinyWoods extends DungeonState {
    constructor() {
        super();
        this.backgroundAsset = 'Tiny Woods.bg';
        this.backgroundAssetLocation = '/assets/dungeons/tiny-woods/tile/bg.png';
    }

    preload(): void {
        super.preload();
    }

    createBackground(maxCols: number, maxRows: number): void {
        super.createBackground(maxCols, maxRows);
    }
}