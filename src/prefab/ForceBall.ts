import Tool from "../Tool/Tool";
import Candy from "./Candy";
import Balloon from "./Balloon";
    export default class ForceBall{
    /**推力球精灵 */
    public sp:Laya.Sprite;
    /**推力球推动区域 */
    public spRect:Laya.Sprite;
    /**推力球动画 */
    public anim1:Laya.Animation;
    /**吐泡动画1 */
    public anim2_1:Laya.Animation;
    /**吐泡动画2 */
    public anim2_2:Laya.Animation;
    /**加入的层 */
    public view : Laya.Panel;
    /**是否可推力 */
    public isApplyForce:boolean;
    /**是否可推力 */
    public isApplyForce_candy2:boolean;
    /**旋转的角度 */
    public Rotation:number;
    /**是否播放动画2_1 */
    public isPlayAnim2_1:boolean;
    constructor(view){
        this.view=view;
    }

    //初始化推力球,根据当前关调整旋转得角度
    init(data):void{
        this.isApplyForce_candy2 = false;
        this.isApplyForce=false;
        this.forceball_CreateSprite(data.forceball_X,data.forceball_Y,data.rotation);
        this.forceball_ApplyForceAnim(data.forceball_X,data.forceball_Y,data.rotation);
        this.Rotation=data.rotation; 
        this.isPlayAnim2_1=true;
    }

    //更新状态
    update(data):void{
        this.isApplyForce_candy2 = false;
        this.isApplyForce=false;
        this.sp.visible=true;
        this.sp.rotation=data.rotation;
        this.sp.pos(data.forceball_X,data.forceball_Y);
        this.anim1.rotation=data.rotation;
        this.Rotation=data.rotation;
        this.anim1.visible=true;
        this.anim1.pos(data.forceball_X,data.forceball_Y);
        this.isPlayAnim2_1=true;
    }

    //创建推力球精灵,作为点击模板
    forceball_CreateSprite(x,y,rotation):void{
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/forceballBg.png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.visible=true;
        this.view.addChild(this.sp);
        console.log(this.sp.pivotX+"牛逼"+this.sp.height);

        this.spRect = new Laya.Sprite();
        this.spRect.graphics.drawRect(0,-250,this.sp.width,250,"#a24");
        this.spRect.alpha = 0.2;
        this.sp.addChild(this.spRect);
        this.sp.rotation=rotation;
    }
    
    //创建推力球动画
    forceball_ApplyForceAnim(x,y,rotation):void{
        this.anim1=new Laya.Animation();
        this.anim1.pos(x,y);
        this.anim1.loadAnimation("GameView/ani/ForceBall.ani");
        this.anim1.rotation=rotation;
        this.anim1.visible=true;
        this.view.addChild(this.anim1);
        this.anim2_1=new Laya.Animation();
        this.anim2_1.loadAnimation("GameView/ani/ForceBalloon1.ani");
        this.anim2_1.visible=true;
        this.anim1.addChild(this.anim2_1);
        this.anim2_2=new Laya.Animation();
        this.anim2_2.loadAnimation("GameView/ani/ForceBalloon2.ani");
        this.anim2_2.visible=true;
        this.anim1.addChild(this.anim2_2);
    }

    //发动推力功能，给糖果施加一个力
    forceball_applyForce(candy:Candy,balloonArray:Array<Balloon>,candy2?):void{        
        this.anim1.play(0,false);
        if(this.isPlayAnim2_1){
            this.anim2_1.play(0,false);
            this.isPlayAnim2_1=false;
        }else{
            this.anim2_2.play(0,false);
            this.isPlayAnim2_1=true;
        }
        this.publicApplyForce(candy,balloonArray,1);
        if(candy2) this.publicApplyForce(candy2,balloonArray,2);
    }

    //**施加力 1 是主糖果 2是副糖果*/
    private publicApplyForce(candy:Candy,balloonArray,index) : void
    {

        let isApplyForce = this.isApplyForce;
        if(index == 2) isApplyForce = this.isApplyForce_candy2;
        if(isApplyForce){
            for(let i=0;i<candy.arr_Body.length;i++){
                let Vx=Math.sin(this.Rotation/180*Math.PI)/Math.abs(candy.arr_Sp[0].x-this.sp.x)*1200;
                let Vy=-Math.cos(this.Rotation/180*Math.PI)/Math.abs(candy.arr_Sp[0].y-this.sp.y)*1200;
                let currVx=candy.arr_Body[0].linearVelocity.x;
                let currVy=candy.arr_Body[0].linearVelocity.y;
                candy.arr_Body[i].setVelocity({x:Vx+currVx,y:Vy+currVy});
                if(candy.isExistBalloon){
                    for(let i=0;i<balloonArray.length;i++){
                        if(balloonArray[i].isCollision){
                            balloonArray[i].isSlow=false;
                        }
                    }
                    
                }
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
        this.anim1.visible=false;
        this.anim1.x=100000;
    }

}