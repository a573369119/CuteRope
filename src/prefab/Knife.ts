import Tool from "../Tool/Tool";
import GameConfig from "../config/GameConfig";
    export default class Knife{
    /**横坐标 */
    private knife_X:number;
    /**纵坐标 */
    private knife_Y:number;
    /**锥子类型 */
    public style : string;
    /**锥子精灵 */
    public sp:Laya.Sprite;
    /**锥子图片 */
    public knife:Laya.Image;
    /**加入的层 */
    public view : Laya.Panel;
    /***是否碰撞 */
    public isCollision : boolean;
    /**是否前进 */
    private isGoing:boolean;
    constructor(view){
        this.view=view;
    }

    //初始化锥子,根据当前关调整旋转得角度
    init(data):void{
        this.isCollision=false;
        this.knife_CreateSprite(data.knife_X,data.knife_Y,data.style,data.rotation);
        
        if(data.v!=0){
            Laya.timer.frameLoop(1,this,this.knife_RotateBySelf,[data.v]);
        }
        if(data.move[0]){
            this.knife_X=this.sp.x;
            this.knife_Y=this.sp.y;
            this.isGoing=true;
            Laya.timer.frameLoop(1,this,this.knife_MoveBySelf,[data.move]);
        }
        

    }

    //更新状态
    update(data):void{
        this.isCollision=false;
        this.knife.skin = "gameView/"+data.style+".png";
        this.knife.pivot(this.knife.width/2,this.knife.height/2);
        this.knife.pos(0,0);
        this.sp.pos(data.knife_X,data.knife_Y);
        this.sp.rotation=data.rotation;
        this.sp.visible=true;
        if(data.v!=0){
            Laya.timer.frameLoop(1,this,this.knife_RotateBySelf,[data.v]);
        }
        if(data.move.length !=0 ){
            this.knife_X=this.sp.x;
            this.knife_Y=this.sp.y;
            this.isGoing=true;
            Laya.timer.frameLoop(1,this,this.knife_MoveBySelf,[data.move]);
        }
    }

    //创建锥子精灵
    knife_CreateSprite(x,y,style,rotation):void{
        this.sp=new Laya.Sprite();
        this.knife = new Laya.Image();
        this.sp.width = this.knife.width;
        this.sp.height = this.sp.height; 
        this.sp.visible=true;
        this.sp.zOrder= GameConfig.ZORDER_KNIFE;
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.knife.skin = "gameView/"+style+".png";
        this.knife.pivot(this.knife.width/2,this.knife.height/2);
        this.knife.pos(0,0);
        this.sp.rotation=rotation;
        this.sp.addChild(this.knife);
        this.view.addChild(this.sp);
    }

    //锥子一直自转
    knife_RotateBySelf(v):void{
        this.sp.rotation+=v;
    }

    //锥子来回移动
    knife_MoveBySelf(move):void{        
        let x_Add=Tool.rotationDeal(this.knife_X,this.knife_Y,move[0],move[1],"cos");
        let y_Add=Tool.rotationDeal(this.knife_X,this.knife_Y,move[0],move[1],"sin");
        if(this.isGoing){
            this.sp.x+=x_Add;
            this.sp.y+=y_Add;
            if(x_Add==0){
                if(this.sp.y==move[1]){
                    this.isGoing=false;
                }
            }
            else if(y_Add==0){
                if(this.sp.x==move[0]){
                    this.isGoing=false;
                }
            }
            else
            {
                if(Math.abs(this.sp.x-move[0])<0.3){
                    this.sp.x=move[0];
                    this.sp.y=move[1];
                    this.isGoing=false;
                    
                }
            }
        }else{
            this.sp.x-=x_Add;
            this.sp.y-=y_Add;
            if(x_Add==0){
                if(this.sp.y==this.knife_Y){
                    this.isGoing=true;
                }
            }
            else if(y_Add==0){
                if(this.sp.x==this.knife_X){
                    this.isGoing=true;
                }
            }else {
                if(Math.abs(this.sp.x-this.knife_X)<0.3){
                this.sp.x=this.knife_X;
                this.sp.y=this.knife_Y;
                this.isGoing=true;
            }
        }
    }
    }
    public clearTimer():void{
        Laya.timer.clearAll(this);
    }

    /**假销毁 */
    public destroy() : void
    {
        this.sp.visible = false;
        this.sp.x = -1000;
    }

    /** 移动同步 */
    public moveTogether() : void
    {
        this.sp.x +=0;
        this.sp.y +=0;
    }
}