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
        console.log(data.isAlwaysRotate);
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
    }

    //创建锥子精灵
    knife_CreateSprite(x,y,style,rotation):void{
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/"+style+".png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.rotation=rotation;
        this.view.addChild(this.sp);
    }

    //锥子一直自转
    knife_RotateBySelf():void{
        this.sp.rotation+=1;
    }
}