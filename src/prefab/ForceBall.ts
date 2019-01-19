import Tool from "../Tool/Tool";
import Candy from "./Candy";
    export default class ForceBall{
    /**推力球精灵 */
    public sp:Laya.Sprite;
    /**推力球推动区域 */
    public spRect:Laya.Sprite;
    /**推力球动画 */
    public anim:Laya.Animation;
    /**加入的层 */
    public view : Laya.Panel;
    /**是否可推力 */
    public isApplyForce:boolean;
    /**旋转的角度 */
    public Rotation:number;
    constructor(view){
        this.view=view;
    }

    //初始化推力球,根据当前关调整旋转得角度
    init(data):void{
        this.isApplyForce=false;
        this.forceball_CreateSprite(data.forceball_X,data.forceball_Y,data.rotation);
        this.forceball_ApplyForceAnim(data.forceball_X,data.forceball_Y,data.rotation);
        this.Rotation=data.rotation; 
    }

    //更新状态
    update(data):void{
        this.isApplyForce=false;
        this.sp.visible=true;
        this.sp.rotation=data.rotation;
        this.sp.pos(data.forceball_X,data.forceball_Y);
        this.anim.rotation=data.rotation;
        this.Rotation=data.rotation;
        this.anim.visible=true;
        this.anim.pos(data.forceball_X,data.forceball_Y);

    }

    //创建推力球精灵,作为点击模板
    forceball_CreateSprite(x,y,rotation):void{
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/forceballBg.png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.visible=true;
        this.view.addChild(this.sp);

        this.spRect = new Laya.Sprite();
        this.spRect.graphics.drawRect(0,-400,this.sp.width,400,"#a24");
        this.spRect.alpha = 0.2;
        this.sp.addChild(this.spRect);
        this.sp.rotation=rotation;
    }
    
    //创建推力球动画
    forceball_ApplyForceAnim(x,y,rotation):void{
        this.anim=new Laya.Animation();
        this.anim.pos(x,y);
        this.anim.loadAnimation("GameView/ani/ForceBall.ani");
        this.anim.rotation=rotation;
        this.anim.visible=true;
        this.view.addChild(this.anim);
        
    }

    //发动推力功能，给糖果施加一个力
    forceball_applyForce(candy:Candy):void{
        this.anim.play(0,false);
        if(this.isApplyForce){
            for(let i=0;i<candy.arr_Body.length;i++){
                //candy.arr_Body[0].applyForce({x:candy.arr_Sp[0].x,y:candy.arr_Sp[0].y},{x:1500*Math.sin(this.Rotation/180*Math.PI),y:-1500*Math.cos(this.Rotation/180*Math.PI)});
                candy.arr_Body[i].setVelocity({x:30*Math.sin(this.Rotation/180*Math.PI),y:-30*Math.cos(this.Rotation/180*Math.PI)});
                console.log(30*Math.sin(this.Rotation/180*Math.PI));
                console.log(30*Math.cos(this.Rotation/180*Math.PI));
            }
        }
        
    }
    
    //移除事件
    removeEvent():void{
        this.sp.off(Laya.Event.MOUSE_DOWN,this,this.forceball_applyForce);
    }

    /**假销毁 */
    public destroy() : void
    {
        this.sp.visible = false;
        this.sp.x = 100000;
        this.anim.visible=false;
        this.anim.x=100000;
    }

}