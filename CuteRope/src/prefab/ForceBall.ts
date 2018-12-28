import Tool from "../Tool/Tool";
    export default class ForceBall{
    /**横坐标 */
	public forceball_X:number;
	/**纵坐标 */
    public forceball_Y:number;
    /**推力球精灵 */
    public sp:Laya.Sprite;
    /**加入的层 */
    public view : Laya.Panel;
    constructor(view){
        this.view=view;
    }

    //初始化推力球,根据当前关调整旋转得角度
    init(data):void{
        this.forceball_X=data.forceball_X;
        this.forceball_Y=data.forceball_Y;
        this.forceball_CreateSprite(data.forceball_X,data.forceball_Y,data.rotation);
    }

    //更新状态
    update(data):void{
        this.forceball_X=data.forceball_X;
        this.forceball_Y=data.forceball_Y;
        this.sp.pos(data.forceball_X,data.forceball_Y);
        this.sp.rotation=data.rotation;
    }

    //创建推力球精灵
    forceball_CreateSprite(x,y,rotation):void{
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/forceball.png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.rotation=rotation;
        this.view.addChild(this.sp);
    }

    //发动推力功能，给糖果施加一个力

    


}