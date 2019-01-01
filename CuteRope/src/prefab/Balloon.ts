import Tool from "../Tool/Tool";
export default class Balloon{
    /**泡泡精灵 */
    public sp:Laya.Sprite;
    /**泡泡底图 */
    public spBg:Laya.Sprite;
    /**动画*/
    public anim1:Laya.Animation;
    public anim2 : Laya.Animation;
    /***是否碰撞 */
    public isCollision : boolean;
    /**加入的层 */
    public view : Laya.Panel;
    constructor(view){
        this.view=view;
    }

    //初始化泡泡
    init(data):void{
        this.isCollision=false;
        this.balloon_CreateSprite(data.balloon_X,data.balloon_Y);
        this.balloon_FloatAnim(data.balloon_X,data.balloon_Y);
        this.balloon_BoomAnim(data.balloon_X,data.balloon_Y);
    }
    
    //更新状态
    update(data):void{
        this.isCollision=false;
        let randNum=Math.ceil(Math.random()*3);
        this.spBg.loadImage("gameView/balloonBg"+randNum+".png");
        this.spBg.pos(data.balloon_X,data.balloon_Y);
        this.sp.pos(data.balloon_X,data.balloon_Y);
        this.sp.alpha=1;
        this.sp.visible=true;
        this.anim1.visible=false;
        this.anim1.stop();
        this.anim1.pos(data.balloon_X,data.balloon_Y);
        this.anim1.x -= this.sp.width/2;
        this.anim1.y -= this.sp.height/2; 
        this.anim2.visible=false;
        this.anim2.stop();
        this.anim2.pos(data.balloon_X,data.balloon_Y);
        this.anim2.x -= this.sp.width/2;
        this.anim2.y -= this.sp.height/2; 
    }

    //创建泡泡精灵
    balloon_CreateSprite(x,y){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/balloon.png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.zOrder=1;
        this.view.addChild(this.sp);

        this.spBg=new Laya.Sprite();
        let randNum=Math.ceil(Math.random()*3);
        this.spBg.loadImage("gameView/balloonBg"+randNum+".png");
        this.spBg.pivot(this.spBg.width/2,this.spBg.height/2);
        this.spBg.pos(x,y);
        this.spBg.zOrder=0;
        this.view.addChild(this.spBg);
    }

    //创建漂浮动画
    public balloon_FloatAnim(x,y):void{
        this.anim1=new Laya.Animation();
        this.anim1.loadAnimation("GameView/ani/Balloon.ani");
        this.anim1.pos(x,y);
        this.anim1.x -= this.sp.width/2;
        this.anim1.y -= this.sp.height/2; 
        this.anim1.visible = false;
        this.anim1.zOrder=2;
        this.view.addChild(this.anim1);
    }
    //创建爆炸动画
    public balloon_BoomAnim(x,y):void{
        this.anim2 = new Laya.Animation();
        this.anim2.loadAnimation("GameView/ani/BalloonBoom.ani");
        this.anim2.pos(x,y);
        this.anim2.x -= this.sp.width/2;
        this.anim2.y -= this.sp.height/2; 
        this.anim2.visible = false;
        this.anim2.zOrder=2;
        this.view.addChild(this.anim2);
    }

    
    //漂浮功能
    balloon_Float(candySp:Laya.Sprite,arr_Body:Array<Laya.RigidBody>):void{
        //追踪糖果位置
        this.sp.pos(candySp.x,candySp.y);
        this.anim1.pos(candySp.x,candySp.y);
        this.anim1.x -= this.sp.width/2;
        this.anim1.y -= this.sp.height/2;        
        console.log(this.anim1.x);
        //设置速度
        for(let i=0;i<arr_Body.length;i++){
            arr_Body[i].setVelocity({x:0,y:-10});
        }
        
        
    }

    //为泡泡添加点击事件，点击到则泡泡爆炸
    balloon_ClickBoom(candySp:Laya.Sprite,isExistBalloon:boolean):void{
        Laya.timer.clear(this,this.balloon_Float);
        this.sp.off(Laya.Event.MOUSE_DOWN,this,this.balloon_Boom);
        //播放戳破动画
        this.anim1.stop();
        this.anim1.visible=false;
        this.anim2.visible = true;
        this.anim2.pos(candySp.x,candySp.y);
        this.anim2.x -= this.sp.width/2;
        this.anim2.y -= this.sp.height/2;
        this.anim2.play(0,false);
        this.anim2.on(Laya.Event.COMPLETE,this,this.completeBoom);
        isExistBalloon=false;
    }

    //直接爆炸
    balloon_Boom():void{
        this.anim2.play(0,false);
        this.anim2.on(Laya.Event.COMPLETE,this,this.completeBoom);
    }
    //爆炸完成后设置为不可见
    completeBoom():void{
        this.anim2.visible=false;
        this.sp.visible=false;
    }
    
    public removeEvent():void{
        this.sp.off(Laya.Event.MOUSE_DOWN,this,this.balloon_ClickBoom);
        this.anim2.off(Laya.Event.COMPLETE,this,this.completeBoom);
    }
    public clearTimer():void{
        Laya.timer.clearAll(this);
        this.removeEvent();
    }
}