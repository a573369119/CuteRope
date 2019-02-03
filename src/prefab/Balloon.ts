import Tool from "../Tool/Tool";
import Candy from "../prefab/Candy";
import GameConfig from "../config/GameConfig";
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
    /**是否已减速 */
    public isSlow:boolean;
    /**加入的层 */
    public view : Laya.Panel;
    constructor(view){
        this.view=view;
    }

    //初始化泡泡
    init(data):void{
        this.isCollision=false;
        this.isSlow=false;
        this.balloon_CreateSprite(data.balloon_X,data.balloon_Y);
        this.balloon_FloatAnim(data.balloon_X,data.balloon_Y);
        this.balloon_BoomAnim(data.balloon_X,data.balloon_Y);
    }
    
    //更新状态
    update(data):void{
        this.isCollision=false;
        this.isSlow=false;
        let randNum=Math.ceil(Math.random()*3);
        this.spBg.loadImage("gameView/paopao/balloonBg"+randNum+".png");
        this.spBg.pos(data.balloon_X,data.balloon_Y);
        this.spBg.visible=true;
        this.sp.pos(data.balloon_X,data.balloon_Y);
        this.sp.alpha=1;
        this.sp.visible=true;
        this.sp.zOrder = GameConfig.ZORDER_BALLON;
        this.anim1.visible=false;
        this.anim1.stop();
        this.anim1.pos(data.balloon_X,data.balloon_Y);
        // this.anim1.x -= this.sp.width/2;
        // this.anim1.y -= this.sp.height/2; 
        this.anim2.visible=false;
        this.anim2.stop();
        this.anim2.pos(data.balloon_X,data.balloon_Y);
        // this.anim2.x -= this.sp.width/2;
        // this.anim2.y -= this.sp.height/2; 
    }

    //创建泡泡精灵
    balloon_CreateSprite(x,y){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/paopao/balloon.png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);        
        this.view.addChild(this.sp);

        this.spBg=new Laya.Sprite();
        let randNum=Math.ceil(Math.random()*3);
        this.spBg.loadImage("gameView/paopao/balloonBg"+randNum+".png");
        this.spBg.pivot(this.spBg.width/2,this.spBg.height/2);
        this.spBg.pos(x,y);        
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
        this.anim1.zOrder= GameConfig.ZORDER_BALLON;
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
        this.anim2.zOrder=4;
        this.view.addChild(this.anim2);
    }

    
    //漂浮功能
    balloon_Float(candySp:Laya.Sprite,arr_Body:Array<Laya.RigidBody>):void{
        //追踪糖果位置
        this.sp.pos(candySp.x,candySp.y);
        this.anim1.pos(candySp.x,candySp.y);
        this.anim1.x -= this.sp.width/2;
        this.anim1.y -= this.sp.height/2;        
        //设置速度
        for(let i=0;i<arr_Body.length;i++){
            if(!arr_Body[i].owner)
            {
                continue;
            }
        }
        if(!this.isSlow){
            for(let i=0;i<arr_Body.length;i++){               
                if(Math.abs(arr_Body[i].linearVelocity.y)<=1){
                    this.isSlow=true;
                    arr_Body[i].linearDamping=0.03;
                    // console.log("中立");
                }else if(Math.abs(arr_Body[i].linearVelocity.y)>1&&Math.abs(arr_Body[i].linearVelocity.y)<=4.5){
                    arr_Body[i].linearDamping=25;
                }else{
                    arr_Body[i].linearDamping=18;
                }
            }
        }
        else
        {
                for(let i=0;i<arr_Body.length;i++)
                {
                    if(arr_Body[i].owner) arr_Body[i].setVelocity({x:arr_Body[i].linearVelocity.x*0.9,y:-3});
                    // console.log("失败");
                }
            
        }    
           
        
    }

    //为泡泡添加点击事件，点击到则泡泡爆炸
    balloon_ClickBoom(candy:Candy):void{
        Laya.timer.clear(this,this.balloon_Float);
        this.sp.off(Laya.Event.MOUSE_DOWN,this,this.balloon_Boom);
        candy.arr_Body.forEach(body => {
            body.linearDamping=0;     
        });
        //播放戳破动画 
        this.anim1.stop();
        this.anim1.visible=false;
        this.anim2.visible = true;
        this.anim2.pos(candy.arr_Sp[0].x,candy.arr_Sp[0].y);
        this.anim2.x -= this.sp.width/2;
        this.anim2.y -= this.sp.height/2;
        this.anim2.play(0,false);
        this.anim2.on(Laya.Event.COMPLETE,this,this.completeBoom);
        candy.isExistBalloon=false;
        console.log("出现了几次泡泡爆炸")
    }

    //直接爆炸
    balloon_Boom():void{
        Laya.timer.clear(this,this.balloon_Float);
        this.anim2.visible=true;
        this.anim2.play(0,false);
        this.sp.visible=false;
        this.anim2.on(Laya.Event.COMPLETE,this,this.completeBoom);
    }
    //爆炸完成后设置为不可见
    completeBoom():void{
        this.anim2.visible=false;        
    }
    
    public removeEvent():void{
        this.sp.off(Laya.Event.MOUSE_DOWN,this,this.balloon_ClickBoom);
        this.anim2.off(Laya.Event.COMPLETE,this,this.completeBoom);
    }
    public clearTimer():void{
        this.anim1.visible = false;
        this.anim2.visible = false;
        this.spBg.visible = false;
        this.sp.visible = false;
        this.sp.x = 1000;
        Laya.timer.clearAll(this);
        this.removeEvent();
    }

    /**同步移动 x,y上自加*/
    public moveTogether() : void
    {
        this.sp.x +=0;
        this.sp.y +=0;
        this.anim1.x +=0;
        this.anim1.y +=0;
        this.anim2.x +=0;
        this.anim2.y +=0;
    }
}