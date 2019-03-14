import Candy from "./Candy";

/**
 * bouceDrum 弹力鼓
 */
export class BouceDrum{
    /**初始x */
    public x : number;
    /**初始y */
    public y : number;
    /**缩放倍数*/
    public size : number;
    /**角度 */
    public rotation : number;
    /**精灵 */
    public sp : Laya.Sprite;
    /**鼓图片 */
    public img : Laya.Image;
    /** 上 */
    private up : Laya.Sprite;
    private down : Laya.Sprite;
    /**ani */
    private ani : Laya.Animation;
    /**游戏界面 */
    public view : any;
    // /**candy */
    private vector : any;
    // public candy : Candy;
    /**是否弹过 */
    private isBounce : boolean;
    /**弹力系数 */
    private power : number;
    /**旋转速度 */
    private rotationV : number;
    /**移动到 */
    private moveTo : Array<any>;
    /**转折变量 */
    private change : number;

    constructor(view){
        this.view = view;
    }

    /**初始化 */
    public init(data) : void
    {
        this.setData(data);
        this.setSprite();
    }
    
    /**更新 */
    public updata(data) : void
    {
        this.setData(data);   
        this.setSprite();     
    }
    
    /**设置数据 */
    private setData(data: any) : void 
    {
        this.x = data.bounceDrum_X;
        this.y = data.bounceDrum_Y;
        this.size = data.size;
        this.rotation = data.rotation;
        if(data.power) this.power = data.power;
        else this.power = 1;
        if(data.rotationV) this.rotationV = data.rotationV;;
        if(data.moveTo) 
        {
            this.moveTo = data.moveTo;
            this.change = 1;
            if(this.moveTo[0] < this.x && this.moveTo[1] == this.y)
                this.change = -1;

            if(this.moveTo[1] < this.y && this.moveTo[0] == this.x)
                this.change = -1;
        }
    }

    /**创建刚体 和碰撞 */
    private createBodyColider() : void
    {
        let body = new Laya.RigidBody();
        body.allowRotation = false;
        body.type = "kinematic";
        this.sp.addComponentIntance(body);

        let colider = new Laya.BoxCollider();
        colider.restitution = 1;
        this.sp.addComponentIntance(colider);
    }

    /**创建精灵 */
    private setSprite() : void
    {
        if(!this.sp)
        {
            this.sp = new Laya.Sprite();
            this.img = new Laya.Image();
            this.img.skin = "gameView/bounceDrum/bounceDrum.png";
            this.img.width = 110;
            this.img.height = 75;
            this.up = new Laya.Sprite();
            this.down = new Laya.Sprite();
            this.sp.addChild(this.img);
            this.sp.addChild(this.up);
            this.sp.addChild(this.down);
            this.view.addChild(this.sp);
        }
        this.isBounce = false;
        this.sp.visible = true;
        //设置up down
        this.up.width = this.img.width;
        this.up.height = this.img.height/2;
        this.down.height = this.img.height/2;
        this.down.width = this.img.width;
        this.down.y = this.img.height/2;
        
        this.sp.rotation = this.rotation;
        this.sp.width = this.img.width;
        this.sp.height = this.img.height;
        // this.img.pivot(this.img.width/2,this.img.height/2);
        this.sp.scale(this.size,1);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.img.pos(0,0);
        this.sp.pos(this.x,this.y);
    }

    /**设置向量 */
    private setVector() : void
    {
        let half_h = this.sp.height/2;
        let centerPoint:any = {};
        centerPoint.y = this.sp.y - half_h ;
        centerPoint.x = this.sp.x ; 
        let Ca_X = half_h * Math.sin(this.rotation/180*Math.PI);
        let Ca_Y = half_h - half_h * Math.cos(this.rotation/180*Math.PI);
        centerPoint.y = centerPoint.y + Ca_Y;
        centerPoint.x = centerPoint.x + Ca_X;
        this.vector = {};
        this.vector.x = centerPoint.x - this.sp.x;
        this.vector.y = centerPoint.y - this.sp.y;
    }


    /**检测糖果 */
    public testBounceDrum(candy,candy2,x,y) : void
    {
        this.testCount(candy,x,y);
        if(candy2) this.testCount(candy2,x,y);
    }

    /**检测方法 */
    private testCount(candy,xC,yC) : void
    {
        let candySp = (candy as Candy).getCandySprite(0);
        let line;
        if((this.up.hitTestPoint(candySp.x + xC,candySp.y + yC)))
        {
            let body = candySp.getComponents(Laya.RigidBody)[0];
            if(this.isBounce) return;
            console.log("up");
            this.isBounce = true;
            line = Math.abs(Math.cos(this.rotation/180*3.14)*body.linearVelocity.y) +  Math.abs(Math.sin(this.rotation/180*3.14)*body.linearVelocity.x) ;
            // console.log("y[" + Math.floor(Math.cos(this.rotation/180*3.14)*body.linearVelocity.y) + "]    x:[" + Math.floor(Math.sin(this.rotation/180*3.14)*body.linearVelocity.x) + "]");            
            console.log("速度[" + line + "]");
            //减掉速度
            if(line < 10)
            {
                candy.setApplyV({x:-Math.floor(Math.abs(Math.cos(this.rotation/180*3.14)*body.linearVelocity.x)*Math.cos(this.rotation/180*3.14) + Math.abs(Math.cos(this.rotation/180*3.14)*body.linearVelocity.x)*Math.sin(this.rotation/180*3.14)),y:-Math.floor(Math.abs(Math.cos(this.rotation/180*3.14)*body.linearVelocity.y)*Math.cos(this.rotation/180*3.14) + Math.abs(Math.cos(this.rotation/180*3.14)*body.linearVelocity.y)*Math.sin(this.rotation/180*3.14))});
                line = 7*this.power;
                console.log("速度[" + Math.abs(Math.cos(this.rotation/180*3.14)*body.linearVelocity.y) +  Math.abs(Math.sin(this.rotation/180*3.14)*body.linearVelocity.x) + "]");            
            }
            candy.setApplyForce({x:candySp.width/2,y:candySp.height/2},{x:110*line*Math.sin(this.rotation/180*Math.PI),y:-110*line*Math.cos(this.rotation/180*Math.PI)});
            this.playAni();
        }
        else if((this.down.hitTestPoint(candySp.x + xC,candySp.y + yC)))
        {
            let body = candySp.getComponents(Laya.RigidBody)[0];  
            let rotation = this.rotation + 180;        
            if(this.isBounce) return;
            console.log("down");
            this.isBounce = true;
            line = Math.abs(Math.cos(rotation/180*3.14)*body.linearVelocity.y) +  Math.abs(Math.sin(rotation/180*3.14)*body.linearVelocity.x) ;
            // console.log("y[" + Math.floor(Math.cos(rotation/180*3.14)*body.linearVelocity.y) + "]    x:[" + Math.floor(Math.sin(rotation/180*3.14)*body.linearVelocity.x) + "]");            
            console.log("速度[" + line + "]");
            //减掉速度
            if(line < 10)
            {
                candy.setApplyV({x:-Math.floor(Math.abs(Math.cos(rotation/180*3.14)*body.linearVelocity.x)*Math.cos(rotation/180*3.14) + Math.abs(Math.cos(rotation/180*3.14)*body.linearVelocity.x)*Math.sin(rotation/180*3.14)),y:-Math.floor(Math.abs(Math.cos(rotation/180*3.14)*body.linearVelocity.y)*Math.cos(rotation/180*3.14) + Math.abs(Math.cos(rotation/180*3.14)*body.linearVelocity.y)*Math.sin(rotation/180*3.14))});
                line = 7*this.power;
                console.log("速度[" + Math.abs(Math.cos(rotation/180*3.14)*body.linearVelocity.y) +  Math.abs(Math.sin(rotation/180*3.14)*body.linearVelocity.x) + "]");            
            }
            candy.setApplyForce({x:candySp.width/2,y:candySp.height/2},{x:110*line*Math.sin(rotation/180*Math.PI),y:-110*line*Math.cos(rotation/180*Math.PI)});
            this.playAni();
            
        }
        else
        {
            this.isBounce = false;
        }
        //自转
        if(this.rotationV !== undefined)
        {
            this.sp.rotation += this.rotationV; 
        }
        //移动
        if(!this.moveTo) return;
        if(this.moveTo.length>0)
        {
            if(this.sp.x == this.moveTo[0]) 
            {
                this.sp.y += 1.5*this.change;
                if(this.moveTo[1]+1 >= this.sp.y && this.moveTo[1]-1 < this.sp.y)
                {
                    this.change = this.change*-1;
                }
                if(this.sp.y >= this.y - 1 && this.sp.y < this.y + 1)
                {
                    this.change = this.change*-1;
                }
            }
            if(this.sp.y == this.moveTo[1]) 
            {
                this.sp.x += 1.5*this.change;
                if(this.moveTo[0]+1 >= this.sp.x && this.moveTo[0]-1 < this.sp.x)
                {
                    this.change = this.change*-1;
                }
                if(this.sp.x >= this.x - 1 && this.sp.x < this.x + 1)
                {
                    this.change = this.change*-1;
                }
            }
            
        }
   }

   /**向量点乘 */
   private vectorX(vector) : number
   {
        let num = vector.x * this.vector.x + vector.y * this.vector.y;
        return num;
   }

   /**动画 */
   private playAni() : void
   {
       this.sp.visible = false;
       let bounceDrumAni = Laya.Pool.getItem("bounceDrum");
       if(bounceDrumAni)
       {
           this.ani = bounceDrumAni;
           this.ani.on(Laya.Event.COMPLETE,this,this.onOk)           
           this.ani.play(0,false);
           this.ani.visible = true;        
           this.ani.scale(this.size,1);           
           this.ani.pivot(this.sp.width/2,this.sp.height/2);                            
           this.ani.rotation = this.rotation;
           this.ani.x = this.sp.x;
           this.ani.y = this.sp.y;
           Laya.Pool.recover("bounceDrum",this.ani);           
       }
       else
       {
           this.ani = new Laya.Animation();
           this.ani.width = this.sp.width;
           this.ani.height = this.sp.height;
           this.ani.visible = true;
           this.ani.scale(this.size,1);
           this.ani.pivot(this.sp.width/2,this.sp.height/2);                                
           this.ani.on(Laya.Event.COMPLETE,this,this.onOk)
           this.view.addChild(this.ani);
           this.ani.interval = 30;
           let arr = [];
           for(let i=0;i<5;i++)
           {
               arr.push("gameView/bounceDrum/" + (i+1) + ".png");
           }

           this.ani.loadImages(arr);

           this.ani.play(0,false);
           this.ani.rotation = this.rotation;
           this.ani.x = this.sp.x;
           this.ani.y = this.sp.y;
           Laya.Pool.recover("bounceDrum",this.ani);
       }
   }

   /***播放完成 */
   private onOk() : void
   {
       this.ani.visible = false;
       this.sp.visible = true;
       this.ani.off(Laya.Event.COMPLETE,this,this.onOk)
   }


    /**销毁 */
    public clearTimer() : void
    {
        if(this.sp) this.sp.visible = false;
        this.sp.y = -500;
        this.sp.y = -500;
        this.rotationV = undefined;
        this.moveTo = undefined;
        this.change = 1;
        this.isBounce = false;        
        Laya.timer.clear(this,this.testBounceDrum);
    }
}