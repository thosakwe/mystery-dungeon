import {CursorKeys, Group, Physics, Point, Sprite, State} from 'phaser-shim';
import Protagonist from "../../game-object/protagonist";

abstract class DungeonState extends State {
    background: Group;
    backgroundAsset: string;
    backgroundAssetLocation: string;
    backgroundColliders: Group;
    backgroundFrameSize: Point = new Point(24, 24);
    cursor:CursorKeys;
    protagonist:Protagonist;
    protagonistStartPosition: Point = new Point(100, 100);

    create(): void {
        this.createBackground();
        this.cursor = this.input.keyboard.createCursorKeys();
        this.protagonist.create();
        this.protagonist.sprite.position.setTo(this.protagonistStartPosition.x, this.protagonistStartPosition.y);
    }

    createBackground(): void {
        this.background = this.add.group();
        this.backgroundColliders = this.add.physicsGroup(Physics.ARCADE, this.background);
        this.backgroundColliders.enableBody = true;

        let currentRowInSpriteSheet = 0, framesInRow = 5;
        let maxCols = Math.round(this.world.width / this.backgroundFrameSize.x),
            maxRows = Math.round(this.world.height / this.backgroundFrameSize.y);

        for (let row = 0; row < maxRows; row++) {
            for (let col = 0; col < maxCols; col++) {
                const x = col * this.backgroundFrameSize.x;
                const y = row * this.backgroundFrameSize.y;
                let frame: number, generic = -1;

                if (col == 0) {
                    frame = currentRowInSpriteSheet * framesInRow;
                } else if (col == maxCols - 1) {
                    frame = framesInRow - 1 + (currentRowInSpriteSheet * framesInRow);
                } else {
                    generic++;

                    if (generic == 0) {
                        frame = 1 + (currentRowInSpriteSheet * framesInRow);
                    } else if (generic === 1) {
                        frame = 2 + (currentRowInSpriteSheet * framesInRow);
                    } else if (generic === 2) {
                        frame = 3 + (currentRowInSpriteSheet * framesInRow);
                        generic = -1;
                    }
                }

                const tile:Sprite = this.background.create(x, y, this.backgroundAsset, frame);

                if (row === 0 || col === 0 || row === maxRows - 1 || col === maxCols - 1) {
                    this.backgroundColliders.add(tile);
                    (<Physics.Arcade.Body>tile.body).immovable = true;
                }
            }

            if (currentRowInSpriteSheet === 0)
                currentRowInSpriteSheet = 1;
            else if (row === maxRows - 2)
                currentRowInSpriteSheet = 3;
            else if (currentRowInSpriteSheet == 1)
                currentRowInSpriteSheet = 2;
            else if (currentRowInSpriteSheet == 2)
                currentRowInSpriteSheet = 1;
        }
    }

    preload(): void {
        super.preload();
        this.load.spritesheet(this.backgroundAsset, this.backgroundAssetLocation, this.backgroundFrameSize.x, this.backgroundFrameSize.y);
        this.protagonist = new Protagonist(this.game);
        this.protagonist.preload();
    }

    update(): void {
        super.update();

        this.physics.arcade.collide(this.protagonist.sprite, this.backgroundColliders);
        this.protagonist.update();
    }
}

export default DungeonState;
