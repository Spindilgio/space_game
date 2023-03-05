import ImageSprite from './ImageSprite.js';

export default class Interactable extends ImageSprite{
    constructor(x,y,width,height,image, xSpeed = 1, yfactor = 1){
        super(x,y, width, height,image, xSpeed);
        this.ySpeed = (Math.random() * 2 - 1) * yfactor;
    }

    iMove(dt= 1/60){
        this.y += (this.ySpeed * dt * this.speed);
        if(this.y < 0 || this.y + this.height > 650)
        {
            this.ySpeed *=-1;
            this.y += (this.ySpeed * dt * this.speed);
        }
        this.move(dt);
    }

    delete(){
        delete this;
    }

    outOfBounds(){
        if(this.x + this.width < 0){
            return true;
        }
    }
}