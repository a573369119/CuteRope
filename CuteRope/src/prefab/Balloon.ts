import Tool from "../Tool/Tool";
export default class Balloon{
    /**横坐标 */
	public balloon_X:number;
	/**纵坐标 */
    public balloon_Y:number;
    /**泡泡精灵 */
    public sp:Laya.Sprite;
    /**泡泡底图 */
    public spBg:Laya.Sprite;
    /**是否存在 */
    public isExist:boolean;
    
    constructor(){
    }

    //初始化泡泡
    init(data):void{
        this.balloon_X=data.balloon_X;
        this.balloon_Y=data.balloon_Y;
    }
    
    //更新状态
    update(data):void{
        this.balloon_X=data.balloon_X;
        this.balloon_Y=data.balloon_Y;
        let randNum=Math.ceil(Math.random()*3);
        this.spBg.loadImage("gameView/balloonBg"+randNum+".png");
    }

    //创建泡泡精灵
    balloon_CreateSprite(x,y,style){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/balloon.png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.zOrder=1;
        Laya.stage.addChild(this.sp);

        this.spBg=new Laya.Sprite();
        let randNum=Math.ceil(Math.random()*3);
        this.spBg.loadImage("gameView/balloonBg"+randNum+".png");
        this.spBg.pivot(this.spBg.width/2,this.spBg.height/2);
        this.spBg.pos(x,y);
        this.spBg.zOrder=0;
        Laya.stage.addChild(this.spBg);
    }

    //检测与糖果得距离，碰撞到则启动泡泡效果,在GamePage中开启此检测方法，obj1为糖果的sprite
    balloon_Check(obj1):void{
        if(Tool.collisionCheck(obj1,this.sp)){
            Laya.timer.clear(this,this.balloon_Check);
            this.sp.on(Laya.Event.MOUSE_DOWN,this,this.balloon_Pierce);
            Laya.timer.frameLoop(1,this,this.balloon_UseFloat);
            //播放泡泡漂浮动画

        }
    }
    //泡泡跟踪糖果的定位，并且设置泡泡的速度
    balloon_UseFloat(obj1):void{
        this.sp.x=obj1.x;
        this.sp.y=obj1.y;
        this.balloon_X=obj1.x;
        this.balloon_Y=obj1.y;
        obj1.body.setVelocity({x:0,y:-10});
    }

    //戳破泡泡
    balloon_Pierce():void{
        Laya.timer.clear(this,this.balloon_UseFloat);
        //播放泡泡破裂动画

    }
}