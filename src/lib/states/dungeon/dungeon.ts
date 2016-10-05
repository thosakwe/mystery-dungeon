import Assets from '../../assets';
import {CursorKeys, Group, Physics, Point, Sprite, State, Text, Timer} from 'phaser-shim';
import Facing from '../../game-object/facing';
import PlayerState from "../../player-state";
import Protagonist from "../../game-object/protagonist";
import {States} from "../index";

abstract class DungeonState extends State {
    _paused = false;
    assets = Assets;
    background: Group;
    backgroundAsset: string;
    backgroundAssetLocation: string;
    backgroundColliders: Group;
    backgroundFrameSize: Point = new Point(24, 24);
    beans:Group;
    blockPadding = 3;
    blocks: Group;
    cursor: CursorKeys;
    level: number;
    maxCols:number;
    maxRows:number;
    playerState:PlayerState;
    protagonist: Protagonist;
    protagonistStartPosition: Point = new Point(100, 100);
    stairs: Sprite;
    stairsLayer: Group;
    statusText: Text;
    timer:Timer;

    calculateStartPosition() {
        const factor = this.blockPadding - 1;
        const rnd = this.rnd.between(1, 4);

        if (rnd === 1) {
            this.protagonistStartPosition.setTo(this.backgroundFrameSize.x * factor, this.backgroundFrameSize.y * factor);
            this.protagonist.facing = Facing.DOWN;
        }
        else if (rnd === 2) {
            this.protagonistStartPosition.setTo(this.world.width - this.backgroundFrameSize.x * factor, this.backgroundFrameSize.y * factor);
            this.protagonist.facing = Facing.DOWN;
        }
        else if (rnd === 3) {
            this.protagonistStartPosition.setTo(this.backgroundFrameSize.x * factor, this.world.height - this.backgroundFrameSize.y * factor);
            this.protagonist.facing = Facing.UP;
        }
        else {
            this.protagonistStartPosition.setTo(this.world.width - this.backgroundFrameSize.x * factor, this.world.height - this.backgroundFrameSize.y * factor);
            this.protagonist.facing = Facing.UP;
        }
    }

    completeLevel(): void {
        this.camera.onFadeComplete.addOnce(() => {
            this.game.state.start(States.LEVEL_TRANSITION, true, false, ++this.level, this.playerState);
        });

        this._paused = true;
        this.camera.fade();

    }

    create(): void {
        this.resizeWorld();

        const maxCols = this.maxCols = Math.round(this.world.width / this.backgroundFrameSize.x),
            maxRows = this.maxRows = Math.round(this.world.height / this.backgroundFrameSize.y);

        this.createBackground(maxCols, maxRows);
        this.createBlocks(maxCols, maxRows);
        this.beans = this.add.physicsGroup(Physics.ARCADE);
        this.beans.enableBody = true;

        this.cursor = this.input.keyboard.createCursorKeys();

        this.calculateStartPosition();
        this.stairsLayer = this.add.physicsGroup(Physics.ARCADE);

        this.protagonist.create();
        this.protagonist.sprite.position.setTo(this.protagonistStartPosition.x, this.protagonistStartPosition.y);
        this.camera.follow(this.protagonist.sprite);

        this.createStairs(maxCols, maxRows);

        if (this.playerState === undefined)
            this.playerState = new PlayerState();

        this.statusText = this.add.text(10, 10, `Health: ${this.playerState.health}`, {
            fill: '#fff',
            font: '24px Arial'
        });

        this.statusText.fixedToCamera = true;

        this.time.events.loop(Timer.SECOND * 3000, this.spawnSomething.bind(this));

        for (let i = 0; i < this.rnd.between(1, 20); i++) {
            this.spawnSomething();
        }
    }

    createBackground(maxCols: number, maxRows: number): void {
        this.background = this.add.group();
        this.backgroundColliders = this.add.physicsGroup(Physics.ARCADE, this.background);
        this.backgroundColliders.enableBody = true;

        let currentRowInSpriteSheet = 0, framesInRow = 5;

        for (let row = 0; row < maxRows + 1; row++) {
            for (let col = 0; col < maxCols + 1; col++) {
                const x = col * this.backgroundFrameSize.x;
                const y = row * this.backgroundFrameSize.y;
                let frame: number, generic = -1;

                if (col == 0) {
                    frame = currentRowInSpriteSheet * framesInRow;
                } else if (col >= maxCols - 1) {
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

                const tile: Sprite = this.background.create(x, y, this.backgroundAsset, frame);

                if (row === 0 || col === 0 || row >= maxRows - 1 || col >= maxCols - 1) {
                    this.backgroundColliders.add(tile);
                    (<Physics.Arcade.Body>tile.body).immovable = true;
                }
            }

            if (currentRowInSpriteSheet === 0)
                currentRowInSpriteSheet = 1;
            else if (row >= maxRows - 2)
                currentRowInSpriteSheet = 3;
            else if (currentRowInSpriteSheet == 1)
                currentRowInSpriteSheet = 2;
            else if (currentRowInSpriteSheet == 2)
                currentRowInSpriteSheet = 1;
        }
    }

    createBlocks(maxCols: number, maxRows: number): void {
        this.blocks = this.add.physicsGroup(Physics.ARCADE);
        this.blocks.enableBody = true;

        const padding = this.blockPadding;

        for (let startRow = padding; startRow < maxRows - padding; startRow++) {
            if (this.rnd.between(1, 10) <= 3) {
                const startCol = this.rnd.between(padding, maxCols - padding);
                const remainingCols = 5; //maxCols - padding - startCol;
                const remainingRows = 5; //maxRows - padding - startRow;

                if (remainingCols <= 3 || remainingRows <= 3)
                    continue;
                else if (startRow + remainingRows >= maxRows - padding || startCol + remainingCols >= maxCols - padding)
                    continue;

                const startX = startCol * this.backgroundFrameSize.x;
                const startY = startRow * this.backgroundFrameSize.y;

                const nColumns = this.rnd.between(3, remainingCols);
                const nRows = this.rnd.between(3, remainingRows);

                let currentColInSpriteSheet = 0;

                for (let row = 0; row < nRows; row++) {
                    currentColInSpriteSheet = 0;

                    for (let col = 0; col < nColumns; col++) {
                        const x = (startX + col * this.backgroundFrameSize.x);
                        const y = (startY + row * this.backgroundFrameSize.y);

                        let frame: number;

                        if (row === 0) {
                            if (col === 0) {
                                frame = 20;
                            } else if (col === nColumns - 1) {
                                frame = 24;
                            } else {
                                frame = 21 + currentColInSpriteSheet;
                            }
                        } else if (row === nRows - 1) {
                            if (col === 0) {
                                frame = 30;
                            } else if (col === nColumns - 1) {
                                frame = 34;
                            } else {
                                frame = 31 + currentColInSpriteSheet;
                            }
                        } else {
                            if (col === 0) {
                                frame = 25;
                            } else if (col === nColumns - 1) {
                                frame = 29;
                            } else {
                                frame = 26 + currentColInSpriteSheet;
                            }
                        }

                        currentColInSpriteSheet = this.rnd.between(0, 2);

                        const tile: Sprite = this.blocks.create(x, y, this.backgroundAsset, frame);
                        (<Physics.Arcade.Body>tile.body).immovable = true;
                    }
                }

                startRow += nRows;
            }
        }
    }

    createStairs(maxCols: number, maxRows: number): Sprite {
        let x: number, y: number;

        do {
            x = this.rnd.between(this.blockPadding, maxCols - this.blockPadding) * this.backgroundFrameSize.x;
            y = this.rnd.between(this.blockPadding, maxRows - this.blockPadding) * this.backgroundFrameSize.y;
        } while (!this.positionIsEmpty(x, y));

        const sprite = this.stairsLayer.create(x, y, this.assets.STAIRS);
        (<Physics.Arcade.Body>sprite.body).immovable = true;
        return this.stairs = sprite;
    }

    emptyPosition():Point {
        const point = new Point().copyFrom(this.protagonist.sprite.position);

        while (!this.positionIsEmpty(point.x, point.y)) {
            const x = this.rnd.between(this.blockPadding, this.maxCols - this.blockPadding) * this.backgroundFrameSize.x;
            const y = this.rnd.between(this.blockPadding, this.maxRows - this.blockPadding) * this.backgroundFrameSize.y;
            point.setTo(x, y);
        }

        return point;
    }

    init(...args): void {
        document.title = `Floor ${this.level = args[0]}`;
        this.playerState = args[1];
        this._paused = false;
    }

    pickupBean(_, bean:Sprite):void {
        bean.kill();
        this.playerState.health += 10;
        this.updateScore();
    }

    positionIsEmpty(x: number, y: number) {
        if (x === this.protagonist.sprite.x && y === this.protagonist.sprite.y)
            return false;

        return true;
    }

    preload(): void {
        super.preload();
        this.load.spritesheet(this.backgroundAsset, this.backgroundAssetLocation, this.backgroundFrameSize.x, this.backgroundFrameSize.y);
        this.protagonist = new Protagonist(this.game);
        this.protagonist.preload();
    }

    resizeWorld(): void {
        let x: number, y: number;

        x = this.rnd.between(1, 2);
        y = this.rnd.between(1, 2);

        this.world.resize(window.innerWidth * x, window.innerHeight * y);
    }

    spawnBean(pos:Point):Sprite {
        return this.beans.create(pos.x, pos.y, this.assets.BEAN, this.rnd.between(0, 9));
    }

    spawnSomething():void {
        const pos = this.emptyPosition();
        console.log(`Spawned at: ${pos.toString()}`);

        this.spawnBean(pos);
    }

    update(): void {
        if (this._paused) {
            this.protagonist.idle();
            return;
        }

        super.update();

        this.physics.arcade.collide(this.protagonist.sprite, this.backgroundColliders);
        this.physics.arcade.collide(this.protagonist.sprite, this.blocks);
        this.physics.arcade.collide(this.protagonist.sprite, this.beans, this.pickupBean.bind(this));
        this.physics.arcade.overlap(this.protagonist.sprite, this.stairs, this.completeLevel.bind(this));

        this.protagonist.update();
    }

    updateScore():void {
        this.statusText.setText(`Health: ${this.playerState.health}`);
    }
}

export default DungeonState;
