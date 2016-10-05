import Facing from './facing';
import GameObject from "./game-object";
import {Point, Sprite} from 'phaser-shim';

abstract class Character extends GameObject {
    animationSpeed = 15;
    facing = 0;
    jumpVelocity:number = 250;
    speed: Point;

    constructor(game) {
        super(game);
        this.speed = new Point(20, 20);
    }

    attack(target:Character):void {

    }

    create(): void {
        super.create();
    }

    down(): void {
        this.facing = Facing.UP;
        this.body.velocity.y = this.speed.y;
    }

    draw(x: number, y: number): Sprite {
        const sprite = super.draw(x, y);
        this.body.collideWorldBounds = true;
        return sprite;
    }

    enemyInRange(enemy:Character):boolean {
        return this.facing === -1;
    }

    idle(): void {
        this.body.velocity.setTo(0);
    }

    jump():void {
        if (this.body.touching.down) {
            this.body.velocity.y = -1 * this.jumpVelocity;
        }
    }

    left(): void {
        this.facing = Facing.LEFT;
        this.sprite.scale.x = 1;
        this.body.velocity.x = this.speed.x * -1;
    }

    right(): void {
        this.facing = Facing.RIGHT;
        this.sprite.scale.x = -1;
        this.body.velocity.x = this.speed.x;
    }

    up(): void {
        this.facing = Facing.UP;
        this.body.velocity.y = this.speed.y * -1;
    }
}

export default Character;