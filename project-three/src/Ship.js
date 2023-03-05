import ImageSprite from "./ImageSprite.js";
import Rect from "./Rect.js";

class position{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}


export default class Ship extends ImageSprite{
    constructor(x,y,width,height,image, img2){
        super(x,y,width,height,image);//this constructor aready has a "speed" field in it.
        this.posList = [];//an array of positions
        this.afters = [];//an array of imageSprites
        this.warp = 10;
        this.image = image;
        this.img2 = img2;
        //initilize poslist and afters

        for(let i=0; i< 100; i++)
	    {
            if(i%10==0) this.afters.push(new ImageSprite(x,y,width,height,img2));

            this.posList.unshift(new position(0,0));
        }
    }

    drawShip(mX,mY, ctx)
    {
        this.x = mX-(this.width/2);
        this.y = mY-(this.height/2);
       

        for(let i=99; i >= 0; i--)
        {

            if(i%10 == 0 && i!= 0)
            {
                ctx.globalAlpha = (Math.sqrt(100-i) * 4)/100;
                this.afters[i/10].x = this.posList[i].x-(this.afters[i/10].width/3);
                this.afters[i/10].y = this.posList[i].y-(this.afters[i/10].height/2);
                this.afters[i/10].draw(ctx);
            }

            if(i!=0){
                this.posList[i].y = (this.posList[i].y+this.posList[i-1].y)/2;
                this.posList[i].x = (this.posList[i].x+(this.posList[i-1].x-1.75))/2;
                // this.posList[i].y = (this.posList[i].y+this.posList[i-1].y)/2;
                //this.posList[i].x = (this.posList[i].x+(this.posList[i-1].x-1.75))/2;
            }
        }
        ctx.globalAlpha = 1.0;
        this.draw(ctx);
    }

    shipMove(x,y)
    {
        this.posList.unshift(new position(x,y));
        if(this.posList.length>100) {
            let q = this.posList.length%100;
            for(let i=0;i<q;i++)
            {
                this.posList.pop();
            }
        }
        this.posList = this.posList.map(p => new position(p.x-=1, p.y));
    }

    checkCollision(r){//r is the box of the other object
        let fakeY = this.y;
        let fakeHeight = this.height;

        if(r.x-this.x>0 && r.x-this.x < 50)
        {
            fakeHeight = (-(r.x-this.x))+this.height;
            fakeY += (r.x-this.x)/2;
        }
        
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection; 
        //with my own modifications as well
        if(this.x < r.x + r.width &&
           this.x + this.width > r.x &&
           fakeY < r.y + r.height &&
           fakeY + fakeHeight > r.y)
           {
               return true;
           }

           return false;
    }

    addWarp(){
        this.warp+=1;
        this.afters.push(new ImageSprite(
            this.posList[this.warp*10].x,
            this.posList[this.warp*10].y,
            this.width,
            this.height,
            this.image))
    }

    shipFinder(ctx){
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.x, this.y,this.width, this.height);
        ctx.restore();
    }
}

