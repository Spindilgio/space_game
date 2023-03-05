import Sprite from './Sprite.js';

export default class ImageSprite extends Sprite{
    constructor(x,y,width,height,image, speed = 1){
        super(x,y, width, height, speed);
        this.width = width;
        this.height = height;
        this.image = image;
    }

    draw(ctx){
        ctx.save();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}