import Character from "./character";
import {Group, Physics, Sprite} from 'phaser-shim';

abstract class Enemy extends Character {
    assetName:string;
    group:Group;

    createSprite():Sprite {
        const sprite = this.group.create(0, 0, this.assetName);
        sprite.animations.add('idle');
        sprite.play('idle');
        return sprite;
    }

    draw(x: number, y: number): Phaser.Sprite {
        const sprite = this.sprite = this.createSprite();
        this.body = <Physics.Arcade.Body>this.sprite.body;
        sprite.position.setTo(x, y);
        return sprite;
    }
}

export default Enemy;