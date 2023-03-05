import Rect  from "./Rect.js";

export default class Sprite{
    constructor(x,y, width, height, speed){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    move(dt= 1/60){
        this.x -= this.speed * dt;
    }

    reset(xMax, yMax){
        this.x += xMax+100;
        this.y = Math.random() * (yMax);
    }


    getRect(){
        return new Rect(this.x, this.y, this.width, this.height);
    }
}