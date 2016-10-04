import {Sprite, State} from 'phaser-shim';

export default class Title extends State {
    intro: Sprite;

    create(): void {
        this.intro = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'intro');
        this.intro.anchor.setTo(0.5, 0.7);

        const text = this.add.text(0, this.intro.bottom + 20, 'PRESS ENTER TO BEGIN', {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#e01058',
            font: '24px Arial'
        });

        text.anchor.y = 0.5;
        text.setTextBounds(0, 0, this.world.width, text.height);
    }

    preload(): void {
        this.load.image('intro', '/assets/title/intro.png');
    }
}