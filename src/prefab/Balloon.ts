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
    /**合并第一次 */
    public isFirst : Boolean;
    /**是否合并 */
    public isToOne : Boolean;
    /**是否有糖果 */
    public isCandy : Boolean;
    /**是否爆炸 */
    public isBoom : boolean;
    /**call */
    public caller : any ;
    public fun : any; 
    public isFirstCaller : Boolean;
    public isEat : boolean;

    constructor(view){
        this.view=view;
    }

    //初始化泡泡
    init(data):void{
        this.isBoom = false;
        this.isToOne = false;
        this.isFirst = false;
        this.isCollision=false;
        this.isFirstCaller = true;
        this.isSlow=false;
        this.balloon_CreateSprite(data.balloon_X,data.balloon_Y);
        this.balloon_FloatAnim(data.balloon_X,data.balloon_Y);
        this.balloon_BoomAnim(data.balloon_X,data.balloon_Y);
    }
    
    //更新状态
    update(data):void{
        this.isBoom = false;
        this.isToOne = false;        
        this.isFirst = false;
        this.isCollision=false;
        this.isSlow=false;
        let randNum=Math.ceil(Math.random()*3);
        this.spBg.loadImage("gameView/paopao/balloonBg"+randNum+".png");
        this.spBg.pos(data.balloon_X,data.balloon_Y);
        this.spBg.visible=true;
        this.sp.pos(data.balloon_X,data.balloon_Y);
        this.sp.alpha=1;
        this.sp.visible=true;
        this.sp.zOrder = GameConfig.ZORDER_BALLOON;
        this.anim1.visible=false;
        this.anim1.stop();
        this.anim1.pos(data.balloon_X,data.balloon_Y);
        this.anim2.visible=false;
        this.anim2.stop();
        this.anim2.pos(data.balloon_X,data.balloon_Y);
    }

    //创建泡泡精灵
    balloon_CreateSprite(x,y){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/paopao/balloon.png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.visible=true;
        this.sp.zOrder = GameConfig.ZORDER_BALLOON;
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
        this.anim1.zOrder= GameConfig.ZORDER_BALLOON;
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
    balloon_Float(candySp:Laya.Sprite,arr_Body:Array<Laya.RigidBody>,candy2,isToOne):void{///@TO DO 优化
        if(this.isEat) {Laya.timer.clear(this,this.balloon_Float);return;}
        //追踪糖果位置
        this.sp.pos(candySp.x,candySp.y);
        this.anim1.pos(candySp.x,candySp.y);
        this.anim1.x -= this.sp.width/2;
        this.anim1.y -= this.sp.height/2; 
        this.isCandy = true;           
        this.callBackCandy();    
        //设置速度
        for(let i=0;i<arr_Body.length;i++){
            if(!arr_Body[i].owner)
            {
                continue;
            }
        }
        //如果碎糖果2
        if(candy2)
        {
            if(this.isFirst == true)
            {
                this.isFirst = false;
                this.isSlow = false;
            }
        }
        // for(let i=0;i<arr_Body.length;i++)
        // {
            // console.log(candy2);
            if(arr_Body[0].owner) 
            {
                arr_Body[0].applyForce({x:this.sp.width/2,y:this.sp.height/2},{x:0,y:-(22)*300});
                let change = Math.sqrt(Math.pow(arr_Body[0].linearVelocity.x,2)+Math.pow(arr_Body[0].linearVelocity.y,2));
                // console.log(change);
                if(change > 10) arr_Body[0].linearDamping = GameConfig.BALLOON_F*Math.pow((change),2); 
                else  arr_Body[0].linearDamping = 3.5;              
            } 
            // console.log("失败");
            if(candy2 && this.isToOne == true)
            {
                let arr_Body = candy2.arr_Body;
                let change = Math.sqrt(Math.pow(arr_Body[0].linearVelocity.x,2)+Math.pow(arr_Body[0].linearVelocity.y,2));                
                if(change > 10) arr_Body[0].linearDamping = GameConfig.BALLOON_F*Math.pow((change),2);                
                else  arr_Body[0].linearDamping = 3.5;              
                // for(let i =0 ;i<arr_Body.length;i++)
                // {
                if(arr_Body[0])  
                {
                    arr_Body[0].applyForce({x:this.sp.width/2,y:this.sp.height/2},{x:0,y:-(22)*300});
                }
                // }
            }
    }

    /**判断是否是融合之后的candy 进入气泡 */
    private candy2NeedGo(candy2,isToOne,num) : void
    {
        if(candy2 && this.isToOne == true)
        {
            let arr_Body = candy2.arr_Body;
            for(let i =0 ;i<arr_Body.length;i++)
            {
                arr_Body[i].linearDamping=num;
            }
        }
    }

    //为泡泡添加点击事件，点击到则泡泡爆炸
    balloon_ClickBoom(candy:Candy):void{
        this.isEat = true;
        this.isBoom = true;
        Laya.timer.clear(this,this.balloon_Float);
        this.sp.off(Laya.Event.MOUSE_DOWN,this,this.balloon_Boom);
        candy.arr_Body.forEach(body => {
            body.linearDamping=0;     
        });
        this.callBack();        
        //播放戳破动画 
        this.anim1.stop();
        this.anim1.visible=false;
        this.anim2.visible = true;
        this.anim2.pos(candy.arr_Sp[0].x,candy.arr_Sp[0].y);
        this.anim2.x -= this.sp.width/2;
        this.anim2.y -= this.sp.height/2;
        this.anim2.play(0,false);
        this.anim2.on(Laya.Event.COMPLETE,this,this.completeBoom);
        this.sp.x=-10;
        this.sp.y=-10;
        this.isSlow = false;
        this.isToOne = false;
        candy.isExistBalloon=false;
        this.isCandy = false;
        console.log("出现了几次泡泡爆炸")
    }

    //直接爆炸
    balloon_Boom():void{
        this.isBoom = true;
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
        this.isBoom = false;
        this.anim1.visible = false;
        this.anim2.visible = false;
        this.spBg.visible = false;
        this.sp.visible = false;
        this.isEat = false;
        this.sp.x = 1000;
        Laya.timer.clearAll(this);
        this.removeEvent();
        this.isCandy = false;
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


    /**************泡泡旋转*************** */
    public followBee(nextPos,rotation) : void
    {
        if(this.isCandy) return;
        this.sp.x = nextPos.x;
        this.sp.y = nextPos.y;
    }

    //*******************云朵使用******************* */
    public setCall(caller,fun) : void
    {
        this.caller = caller;
        this.fun = fun;
    }
    /**泡泡爆炸回调 */
    private callBack() : void
    {
        if(this.caller && this.fun && !this.isFirstCaller)
        {
            this.fun.call(this.caller);
        }
        this.caller = undefined;
        this.fun = undefined;
    }
    /**泡泡接触糖果回调 */
    private callBackCandy() : void
    {
        if(this.caller && this.fun && this.isFirstCaller)
        {
            this.fun.call(this.caller);
        }
    }
}