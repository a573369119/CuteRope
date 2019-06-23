import GameConfig from "../config/GameConfig";
import Rope from "./Rope";
import RopePoint from "./RopePoint";
import Tool from "../Tool/Tool";
import Dic from "../Tool/dic";
import Candy from "./Candy";

export default class Spider{
    /**精灵 */
    public sp:Laya.Sprite;
    private img : Laya.Image;
    /**所在层 */
    private view : Laya.Panel
    /**蜘蛛动画*/
    private ani : Laya.Animation;
    /**当前点*/
    private currentPoint : RopePoint;
    /**下一个点*/
    private nextPoint : RopePoint;
    /**绳子 */
    public rope : Rope;
    /**移动距离 */
    private mov : number;
    /**ropeIndex */
    private ropeIndex : number;
    /**candy */
    public candy : Candy;
    /**下降速度 */
    private speedX : number
    /**call */
    private call : any;
    /**callBack */
    private callBack : Function;
    
    
    constructor(view){
        this.view = view;
        this.speedX  = GameConfig.SPIDER_SPEEDX;
    }
    
    //初始化蜘蛛
    init(data,call,callBack):void{      
        this.ani = new Laya.Animation();     
        this.ropeIndex = 1;
        this.call = call;
        this.callBack = callBack;
        this.spider_CreateSprite(data.spider_X,data.spider_Y);        
    }
    
    //更新状态
    update(data):void{
        this.initStatus();  
        this.sp.pos(data.spider_X,data.spider_Y);
        this.sp.visible = true;
        Laya.timer.clear(this,this.followCandy);
    }
    
    //创建蜘蛛精灵
    spider_CreateSprite(x,y){
        this.sp=new Laya.Sprite();
        this.img = new Laya.Image();
        this.img.loadImage("gameView/spider/spider1.png");        
        this.sp.pos(x,y);
        this.sp.width = 65;
        this.sp.height = 62;
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.addChild(this.img);
        this.sp.addChild(this.ani);
        this.sp.zOrder = 100;
        this.view.addChild(this.sp);
    }
    
    //停止寻找
    public stopEatCandy() : void
    {
        this.img.visible = true;
        this.ani.visible = false;
        Laya.timer.clear(this,this.spider_FollowRope);
        Laya.timer.loop(16,this,this.down);
    }
    //**糖凋落 */
    public down() : void
    {
        this.sp.y += this.speedX;
        this.speedX += 0.098;
        if(this.sp.y > 1600)
        {
            this.sp.x = 10000;
            this.initStatus();

        }
    }
    
    private initStatus() {
        this.speedX = GameConfig.SPIDER_SPEEDX;
        this.ropeIndex = 0;
        this.ani.stop();
        this.ani.visible = false;
        this.img.visible = true;
        Laya.timer.clear(this, this.down);
    }
    
    /**发现糖果 isnow true*/
    public foundCandy(rope : Rope,candy : Candy,isNo?) : void
    {
        this.ropeIndex = 1;
        this.mov = 0;
        this.candy = candy;
        this.rope = rope;
        this.currentPoint = rope.ropePointsArray[this.ropeIndex];
        this.nextPoint = rope.ropePointsArray[this.ropeIndex+1];
        if(!isNo)
            this.starMove();
        // Laya.timer.loop(10,this,this.spider_FollowRope);
    }

    public starMove() : void
    {
        this.monsterAction(GameConfig.ANI_FOUND_CANDY,false);
        this.ani.on(Laya.Event.COMPLETE,this,this.moveStart);
    }
    
    moveStart(): any 
    {
        if(this.ropeIndex == 1)
        {
            this.monsterAction(GameConfig.ANI_TOWORD_CANDY,true);
            Laya.timer.loop(10,this,this.spider_FollowRope);
        }
    }
    
    //蜘蛛爬绳
    spider_FollowRope():void
    {
        this.countSpPos();
        this.mov += GameConfig.SPIDER_SPEED;
        if(this.mov >= 1)
        {
            this.mov = 0;
            ++this.ropeIndex;
            if(this.ropeIndex == this.rope.ropePointsArray.length)
            {
                Laya.timer.clear(this,this.spider_FollowRope);
                //偷取糖果
                    //绳子断裂
                if(this.rope.ropePointsArray[this.rope.ropePointsArray.length - 1].sp.getComponents(Laya.RopeJoint))
                    this.rope.ropePointsArray[this.rope.ropePointsArray.length - 1].sp.getComponents(Laya.RopeJoint)[0].destroy();
                this.rope.ropeCuted();
                let ropejoint = this.rope.ropePointsArray[0].sp.getComponents(Laya.RopeJoint);
                if(ropejoint) ropejoint[0].destroy();
                //
                this.candy.arr_Body[0].applyLinearImpulseToCenter({x:0,y:-8});
                this.monsterAction(GameConfig.ANI_GET_CANDY,false);
                Laya.timer.loop(16,this,this.followCandy);
                this.callBack.call(this.call);
                // this.ropeIndex = 1;
                return;
            }
            this.currentPoint = this.rope.ropePointsArray[this.ropeIndex];
            if(this.rope.ropePointsArray[this.ropeIndex + 1])   this.nextPoint = this.rope.ropePointsArray[this.ropeIndex + 1];
        }
    }

    /**计算当前位置 */
    private countSpPos() : void
    {
        let current : any ={};
        let next : any ={};
        current.x = this.currentPoint.sp.x;
        current.y = this.currentPoint.sp.y;
        if(this.currentPoint == this.nextPoint)
        {
            next.x = this.candy.arr_Sp[0].x;
            next.y = this.candy.arr_Sp[0].y;
        }
        else
        {
            next.x = this.nextPoint.sp.x;
            next.y = this.nextPoint.sp.y;
        }
        let sin = Tool.rotationDeal(current.x,current.y,next.x,next.y,"sin");
        let cos = Tool.rotationDeal(current.x,current.y,next.x,next.y,"cos");
        let rotation = Tool.rotateRopePoint_2(current.x,current.y,next.x,next.y);
        let dic = Dic.countDic_Object({x:current.x,y:current.y},{x:next.x,y:next.y});
        //复制
        dic = Math.floor(dic) * this.mov;
        this.sp.rotation = rotation ;
        this.sp.x = current.x + dic * cos;
        this.sp.y = current.y + dic * sin;
    }
    /**跟随糖果 */
    public followCandy() : void
    {
        this.sp.x = this.candy.arr_Sp[0].x;
        this.sp.y = this.candy.arr_Sp[0].y;
        if(this.candy.arr_Sp[0].y >1330) Laya.timer.clear(this,this.followCandy);
    }

    public hookDestroy() : void
    {
        this.sp.visible = false;
        this.sp.x = 10000;
    }


    /**清楚定时器  扫尾*/
    public clearTimer() : void
    {
        Laya.timer.clear(this,this.spider_FollowRope);
        Laya.timer.clear(this,this.down);
        Laya.timer.clear(this,this.followCandy);
        //数据初始化
        this.sp.visible = false;
        this.ropeIndex = 0;
        this.rope = null;
    }

    /***
     * 蜘蛛行为
     * 
     */
    public monsterAction(aName:string,isLoop?:boolean) : void
    {
        if(!isLoop) isLoop=false;
        this.ani.interval = 100;
        this.ani.loadImages(this.aniUrls(aName,this.getAniLength(aName)));
        this.ani.play(0,isLoop);
        this.img.visible = false;
        this.ani.visible = true;
        // this.sp.visible = false;
    } 
    /**njbg
     * 创建一组动画的url数组（美术资源地址数组）
     * @param aniName  动作的名称，用于生成url
     * @param length   动画最后一帧的索引值，
     */
    private aniUrls(aniName:string, length:number) : Array<any>
    {
        var urls: Array<any> = [];
        for (var i=1; i <= length; i++) 
        {
            //动画资源路径要和动画图集打包前的资源命名对应起来
            urls.push("gameView/spider/" + aniName + i + ".png");
        }
        return urls;
    }

    private getAniLength(aName) : number
    {
        switch(aName)
        {
            case GameConfig.ANI_FOUND_CANDY: return 7;
            case GameConfig.ANI_TOWORD_CANDY: return 4;
            case GameConfig.ANI_GET_CANDY: return 2;
        }
    }



    /** */

}