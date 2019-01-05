import Tool from "../Tool/Tool";
    export default class Knife{
    /**锥子类型 */
    public style : string;
    /**锥子精灵 */
    public sp:Laya.Sprite;
    /**加入的层 */
    public view : Laya.Panel;
    /***是否碰撞 */
    public isCollision : boolean;
    constructor(view){
        this.view=view;
    }

    //初始化锥子,根据当前关调整旋转得角度
    init(data):void{
        this.isCollision=false;
        this.knife_CreateSprite(data.knife_X,data.knife_Y,data.style,data.rotation);
        if(data.isAlwaysRotate){
            Laya.timer.frameLoop(1,this,this.knife_RotateBySelf);
        }
    }

    //更新状态
    update(data):void{
        this.isCollision=false;
        this.sp.loadImage("gameView/"+data.style+".png");
        this.sp.pos(data.knife_X,data.knife_Y);
        this.sp.rotation=data.rotation;
        this.sp.visible=true;
        if(data.isAlwaysRotate){
            Laya.timer.frameLoop(1,this,this.knife_RotateBySelf);
        }
    }

    //创建锥子精灵
    knife_CreateSprite(x,y,style,rotation):void{
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/"+style+".png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.visible=true;
        this.sp.rotation=rotation;
        this.view.addChild(this.sp);
    }

    //锥子一直自转
    knife_RotateBySelf():void{
        this.sp.rotation+=1;
    }

    public clearTimer():void{
        Laya.timer.clearAll(this);
    }

    /**假销毁 */
    public destroy() : void
    {
        this.sp.visible = false;
        this.sp.x = 100000;
    }
}