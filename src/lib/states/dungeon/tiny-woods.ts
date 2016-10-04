import DungeonState from "./dungeon";

export default class TinyWoods extends DungeonState {
    private scrollSpeed = 24;

    constructor() {
        super();
        this.backgroundAsset = 'Tiny Woods.bg';
        this.backgroundAssetLocation = '/assets/dungeons/tiny-woods/tile/bg.png';
    }

    preload(): void {
        super.preload();
    }

    createBackground(): void {
        super.createBackground();
    }
}