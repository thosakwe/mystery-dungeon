import Facing from './facing';
import FirstPerson from "./first-person";
import {Physics, Sprite} from 'phaser-shim';

export default class Protagonist extends FirstPerson {
    createSprite(): Sprite {
        const sprite = this.game.add.sprite(0, 0, 'torchic.walk');
        sprite.animations.add('up', [9, 10, 11], this.animationSpeed);
        sprite.animations.add('down', [0, 1, 2], this.animationSpeed);
        sprite.animations.add('left', [3, 4, 5], this.animationSpeed);
        sprite.animations.add('right', [6, 7, 8], this.animationSpeed);
        sprite.animations.add('idle.up', [10]);
        sprite.animations.add('idle.down', [1]);
        sprite.animations.add('idle.left', [4]);
        sprite.animations.add('idle.right', [7]);
        sprite.play('down');
        return sprite;
    }

    down(): void {
        super.down();
        this.sprite.play('down');
    }

    idle(): void {
        super.idle();

        switch (this.facing) {
            case Facing.UP:
                this.sprite.play('idle.up');
                break;
            case Facing.DOWN:
                this.sprite.play('idle.down');
                break;
            case Facing.LEFT:
                this.sprite.play('idle.left');
                break;
            case Facing.RIGHT:
                this.sprite.play('idle.right');
                break;
        }
    }

    left(): void {
        super.left();
        this.sprite.play('left');
    }

    right(): void {
        super.right();
        this.sprite.play('right');
    }

    up(): void {
        super.up();
        this.sprite.play('up');
    }

    preload(): void {
        super.preload();
        this.game.load.spritesheet('torchic.walk', '/assets/pokemon/torchic/walk.png', 31, 32);
    }
}