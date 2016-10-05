import Facing from './facing';
import FirstPerson from "./first-person";
import {Physics, Sprite} from 'phaser-shim';

export default class Protagonist extends FirstPerson {
    constructor(game) {
        super(game);
        this.speed.setTo(200);
    }

    createSprite(): Sprite {
        const sprite = this.game.add.sprite(0, 0, this.assets.PROTAGONIST);

        sprite.anchor.set(0.5);

        sprite.animations.add('left', [3, 4, 5]);
        sprite.animations.add('right', [6, 7, 8]);
        sprite.animations.add('up', [9, 10, 11]);
        sprite.animations.add('down', [0, 1, 2]);
        sprite.animations.add('idle front', [1]);
        sprite.animations.add('idle back', [10]);
        sprite.animations.add('idle left', [4]);
        sprite.animations.add('idle right', [7]);
        sprite.play('idle front', this.animationSpeed);

        return sprite;
    }

    down(): void {
        this.facing = Facing.DOWN;
        this.body.velocity.setTo(0, this.speed.y);
        this.sprite.play('down', this.animationSpeed);
    }

    idle(): void {
        super.idle();

        if (this.facing === Facing.UP)
            this.sprite.play('idle back');
        else if (this.facing === Facing.DOWN)
            this.sprite.play('idle front');
        else if (this.facing === Facing.LEFT)
            this.sprite.play('idle left');
        else if (this.facing === Facing.RIGHT)
            this.sprite.play('idle right');
    }

    left(): void {
        this.facing = Facing.LEFT;
        this.body.velocity.setTo(this.speed.x * -1, 0);
        this.sprite.play('left', this.animationSpeed);
    }

    right(): void {
        this.facing = Facing.RIGHT;
        this.body.velocity.setTo(this.speed.x, 0);
        this.sprite.play('right', this.animationSpeed);
    }

    up(): void {
        this.facing = Facing.UP;
        this.body.velocity.setTo(0, this.speed.y * -1);
        this.sprite.play('up', this.animationSpeed);
    }
}