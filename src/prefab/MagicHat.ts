import Tool from "../Tool/Tool";
/**
 * 魔术帽
 */
export default class MagicHat {
    /**帽子1横坐标 */
    public magicHat_X1 : number;
    /**帽子2横坐标 */
    public magicHat_X2 : number;
    /**帽子1纵坐标 */
    public magicHat_Y1 : number;
    /**帽子2纵坐标 */
    public magicHat_Y2 : number;
    /**帽子精灵1*/
    public sp1 : Laya.Sprite;
    /**帽子精灵2 */
    public sp2 : Laya.Sprite;
    /** 帽子1的角度 */
    public rotation1 : number;
    /** 帽子2的角度 */
    public rotation2 : number;
    /**是否碰撞 */
    public isCollision : boolean;
    /**帽子1是否前进 */
    private isGoing1:boolean;
    /**帽子2是否前进 */
    private isGoing2:boolean;
    /**加入的层 */
    public view : Laya.Panel;
    /**旋转精灵1 */
    public point1:Laya.Sprite;
    /**旋转精灵2 */
    public point2:Laya.Sprite;
    /**帽子1绕某点旋转 */
    public rotate1:Array<number>;
    /**帽子2绕某点旋转 */
    public rotate2:Array<number>;
    constructor(view){
        this.view = view;
    }

    /***帽子初始化 */
    public init(data) : void
    {
        this.createSprite1(data.magicHat_X1,data.magicHat_Y1,data.color,data.rotation1,data.rotate1);
        this.createSprite2(data.magicHat_X2,data.magicHat_Y2,data.color,data.rotation2,data.rotate2);
        //判断移动是否为空
        if(data.move1[0]){
            this.magicHat_X1=this.sp1.x;
            this.magicHat_Y1=this.sp1.y;
            this.isGoing1=true;
            Laya.timer.frameLoop(1,this,this.magicHat1_MoveBySelf,[data.move1,this.magicHat_X1,this.magicHat_Y1,this.sp1]);
        }
        //判断移动是否为空
        if(data.move2[0]){
            this.magicHat_X2=this.sp2.x;
            this.magicHat_Y2=this.sp2.y;
            this.isGoing2=true;
            Laya.timer.frameLoop(1,this,this.magicHat2_MoveBySelf,[data.move2,this.magicHat_X2,this.magicHat_Y2,this.sp2]);
        }
        
        //判断旋转点是否为空
        if(data.rotate1[0]){            
            Laya.timer.frameLoop(1,this,this.magicHat_RotateFollowPoint,[this.sp1,data.v1]);
        }

        //判断旋转点是否为空
        if(data.rotate2[0]){            
            Laya.timer.frameLoop(1,this,this.magicHat_RotateFollowPoint,[this.sp2,data.v2]);
        }
    }
    
    /**帽子更新 */
    public update(data) : void
    {
       this.sp1.visible=true;
       this.sp1.loadImage("gameView/"+data.color+".png");      
       this.sp1.pos(data.magicHat_X1,data.magicHat_Y1);
       //判断旋转点是否存在
       if(data.rotate1[0]){
            this.sp1.pivot(data.rotate1[0],-data.rotate1[1]);
            this.sp1.scaleY=-1;
        }else{
            this.sp1.pivot(this.sp1.width/2,this.sp1.height/2);
        }
        if(data.rotate2[0]){
            this.sp2.pivot(data.rotate2[0],-data.rotate2[1]);
            this.sp2.scaleY=-1;
        }else{
            this.sp2.pivot(this.sp2.width/2,this.sp2.height/2);
        }
        //判断移动是否为空
        if(data.move1[0]){
            this.magicHat_X1=this.sp1.x;
            this.magicHat_Y1=this.sp1.y;
            this.isGoing1=true;
            Laya.timer.frameLoop(1,this,this.magicHat1_MoveBySelf,[data.move1,this.magicHat_X1,this.magicHat_Y1,this.sp1]);
        }
        //判断移动是否为空
        if(data.move2[0]){
            this.magicHat_X2=this.sp2.x;
            this.magicHat_Y2=this.sp2.y;
            this.isGoing2=true;
            Laya.timer.frameLoop(1,this,this.magicHat2_MoveBySelf,[data.move2,this.magicHat_X2,this.magicHat_Y2,this.sp2]);
        }
        
        //判断旋转点是否为空
        if(data.rotate1[0]){            
            Laya.timer.frameLoop(1,this,this.magicHat_RotateFollowPoint,[this.sp1]);
        }

        //判断旋转点是否为空
        if(data.rotate2[0]){            
            Laya.timer.frameLoop(1,this,this.magicHat_RotateFollowPoint,[this.sp2]);
        }
    }

    //创建帽子1
    private createSprite1(x,y,color,rotation,rotate) :  void
    {
        this.sp1=new Laya.Sprite();
        this.sp1.loadImage("gameView/"+color+".png");      
        this.sp1.pos(x,y);
        if(rotate[0]){
            this.sp1.pivot(rotate[0],-rotate[1]);
            this.sp1.scaleY=-1;
        }else{
            this.sp1.pivot(this.sp1.width/2,this.sp1.height/2);
        }
        this.view.addChild(this.sp1);
        
    }

    //创建帽子2
    private createSprite2(x,y,color,rotation,rotate) :  void
    {
        this.sp2=new Laya.Sprite();
        this.sp2.loadImage("gameView/"+color+".png");
        this.sp2.pos(x,y);
        this.sp2.pivot(this.sp2.width/2,this.sp2.height/2);
        if(rotate[0]){
            this.sp2.pivot(rotate[0],-rotate[1]);
            this.sp2.scaleY=-1;
        }else{
            this.sp2.pivot(this.sp2.width/2,this.sp2.height/2);
        }
        this.view.addChild(this.sp2);
    }
        
        
        

    //帽子1来回移动
    magicHat1_MoveBySelf(move,x,y,sp):void{        
        let x_Add=Tool.rotationDeal(x,y,move[0],move[1],"cos");
        let y_Add=Tool.rotationDeal(x,y,move[0],move[1],"sin");
            if(this.isGoing1){
                sp.x+=x_Add;
                sp.y+=y_Add;
                if(x_Add==0){
                    if(sp.y==move[1]){
                        this.isGoing1=false;
                    }
                }
                else if(y_Add==0){
                    if(sp.x==move[0]){
                        this.isGoing1=false;
                    }
                }
                else
                {
                    if(Math.abs(sp.x-move[0])<0.3){
                        sp.x=move[0];
                        sp.y=move[1];
                        this.isGoing1=false;
                        
                    }
                }
            }else{
                sp.x-=x_Add;
                sp.y-=y_Add;
                if(x_Add==0){
                    if(sp.y==y){
                        this.isGoing1=true;
                    }
                }
                else if(y_Add==0){
                    if(sp.x==x){
                        this.isGoing1=true;
                    }
                }else {
                    if(Math.abs(sp.x-x)<0.3){
                    sp.x=x;
                    sp.y=y;
                    this.isGoing1=true;
                }
            }
        }
    }

    //帽子2来回移动
    magicHat2_MoveBySelf(move,x,y,sp):void{        
        let x_Add=Tool.rotationDeal(x,y,move[0],move[1],"cos");
        let y_Add=Tool.rotationDeal(x,y,move[0],move[1],"sin");
            if(this.isGoing2){
                sp.x+=x_Add;
                sp.y+=y_Add;
                if(x_Add==0){
                    if(sp.y==move[1]){
                        this.isGoing2=false;
                    }
                }
                else if(y_Add==0){
                    if(sp.x==move[0]){
                        this.isGoing2=false;
                    }
                }
                else
                {
                    if(Math.abs(sp.x-move[0])<0.3){
                        sp.x=move[0];
                        sp.y=move[1];
                        this.isGoing2=false;
                        
                    }
                }
            }else{
                sp.x-=x_Add;
                sp.y-=y_Add;
                if(x_Add==0){
                    if(sp.y==y){
                        this.isGoing2=true;
                    }
                }
                else if(y_Add==0){
                    if(sp.x==x){
                        this.isGoing2=true;
                    }
                }else {
                    if(Math.abs(sp.x-x)<0.3){
                    sp.x=x;
                    sp.y=y;
                    this.isGoing2=true;
                }
            }
        }
    }

    //帽子旋转
    magicHat_RotateFollowPoint(sp,v):void{
        sp.rotation+=v;
    }
    
    /**清除定时器 */
    public clearTimer():void{
        Laya.timer.clearAll(this);
    }

    /**假销毁 */
    public destroy() : void
    {
        this.sp1.visible = false;
        this.sp1.x = 100000;
        this.sp2.visible=false;
        this.sp2.x=100000;
    }

}