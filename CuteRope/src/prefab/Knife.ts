import Tool from "../Tool/Tool";
    export default class Knife{
    /**横坐标 */
	public knife_X:number;
	/**纵坐标 */
    public knife_Y:number;
    /**锥子类型 */
    public style : string;
    /**锥子精灵 */
    public sp:Laya.Sprite;
    /**加入的层 */
    public view : Laya.Panel;
    constructor(view){
        this.view=view;
    }

    //初始化锥子,根据当前关调整旋转得角度
    init(data):void{
        this.knife_X=data.knife_X;
        this.knife_Y=data.knife_Y;
        this.knife_CreateSprite(data.knife_X,data.knife_Y,data.style,data.rotation);
    }

    //更新状态
    update(data):void{
        this.knife_X=data.knife_X;
        this.knife_Y=data.knife_Y;
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

    //检测与糖果得距离，碰撞到则使糖果破裂
    knife_Check(obj1):void{
        if(Tool.collisionCheck(obj1,this.sp)){
            Laya.timer.clear(this,this.knife_Check);
            //糖果破裂调用
        }
    }
}